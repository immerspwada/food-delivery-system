// Vercel Serverless Function - Restaurant Search API
// This function handles /api/restaurant/search endpoint

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      q: searchQuery,
      latitude, 
      longitude, 
      radius = 10, 
      cuisine_types, 
      min_rating = 0,
      sort_by = 'rating',
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true);

    // Search by name or description
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    // Filter by cuisine types
    if (cuisine_types) {
      const cuisineArray = cuisine_types.split(',');
      query = query.in('cuisine_type', cuisineArray);
    }

    // Filter by minimum rating
    if (min_rating > 0) {
      query = query.gte('rating', parseFloat(min_rating));
    }

    // Sorting
    switch (sort_by) {
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      case 'delivery_time':
        query = query.order('delivery_time', { ascending: true });
        break;
      case 'delivery_fee':
        query = query.order('delivery_fee', { ascending: true });
        break;
      default:
        query = query.order('rating', { ascending: false });
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: restaurants, error } = await query;

    if (error) {
      console.error('Restaurant search error:', error);
      return res.status(500).json({ error: 'Failed to search restaurants' });
    }

    // Calculate distance if coordinates provided
    let restaurantsWithDistance = restaurants || [];
    if (latitude && longitude) {
      restaurantsWithDistance = restaurants.map(restaurant => {
        if (restaurant.latitude && restaurant.longitude) {
          const distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            restaurant.latitude,
            restaurant.longitude
          );
          return { ...restaurant, distance };
        }
        return restaurant;
      });

      // Filter by radius if specified
      if (radius) {
        restaurantsWithDistance = restaurantsWithDistance.filter(
          restaurant => !restaurant.distance || restaurant.distance <= parseFloat(radius)
        );
      }

      // Sort by distance if no other sorting specified
      if (sort_by === 'distance') {
        restaurantsWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      }
    }

    res.status(200).json({
      success: true,
      data: restaurantsWithDistance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: restaurantsWithDistance.length
      }
    });

  } catch (error) {
    console.error('Restaurant search API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}