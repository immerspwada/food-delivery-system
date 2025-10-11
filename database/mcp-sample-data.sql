-- MCP Sample Data
-- Sample data for Material Control Plan system

-- Insert Material Categories
INSERT INTO material_categories (id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Vegetables', 'Fresh vegetables and produce'),
('550e8400-e29b-41d4-a716-446655440002', 'Meat & Poultry', 'Fresh meat, chicken, and seafood'),
('550e8400-e29b-41d4-a716-446655440003', 'Dairy Products', 'Milk, cheese, yogurt, and dairy items'),
('550e8400-e29b-41d4-a716-446655440004', 'Grains & Cereals', 'Rice, flour, pasta, and grain products'),
('550e8400-e29b-41d4-a716-446655440005', 'Spices & Seasonings', 'Herbs, spices, and flavor enhancers'),
('550e8400-e29b-41d4-a716-446655440006', 'Oils & Fats', 'Cooking oils, butter, and fats'),
('550e8400-e29b-41d4-a716-446655440007', 'Packaging', 'Food containers, bags, and packaging materials'),
('550e8400-e29b-41d4-a716-446655440008', 'Beverages', 'Drinks, juices, and beverage ingredients');

-- Insert Suppliers
INSERT INTO suppliers (id, name, contact_person, email, phone, address, rating, payment_terms, delivery_time_days, minimum_order_amount) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Fresh Farm Supplies', 'John Smith', 'john@freshfarm.com', '+66-2-123-4567', '123 Farm Road, Bangkok', 4.5, 'Net 30', 2, 1000.00),
('660e8400-e29b-41d4-a716-446655440002', 'Premium Meat Co.', 'Sarah Johnson', 'sarah@premiummeat.com', '+66-2-234-5678', '456 Meat Street, Bangkok', 4.8, 'Net 15', 1, 2000.00),
('660e8400-e29b-41d4-a716-446655440003', 'Dairy Excellence', 'Mike Wilson', 'mike@dairyexcel.com', '+66-2-345-6789', '789 Dairy Lane, Bangkok', 4.3, 'Net 30', 3, 800.00),
('660e8400-e29b-41d4-a716-446655440004', 'Spice World', 'Lisa Chen', 'lisa@spiceworld.com', '+66-2-456-7890', '321 Spice Avenue, Bangkok', 4.6, 'Net 45', 5, 500.00),
('660e8400-e29b-41d4-a716-446655440005', 'Packaging Pro', 'David Brown', 'david@packagingpro.com', '+66-2-567-8901', '654 Package Road, Bangkok', 4.2, 'Net 30', 7, 1500.00);

-- Insert Materials
INSERT INTO materials (id, name, sku, category_id, supplier_id, unit_of_measure, unit_cost, current_stock, minimum_stock, maximum_stock, reorder_point, reorder_quantity, shelf_life_days) VALUES
-- Vegetables
('770e8400-e29b-41d4-a716-446655440001', 'Tomatoes', 'VEG-TOM-001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'kg', 45.00, 25.5, 10.0, 100.0, 15.0, 50.0, 7),
('770e8400-e29b-41d4-a716-446655440002', 'Onions', 'VEG-ONI-001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'kg', 35.00, 45.2, 20.0, 150.0, 30.0, 75.0, 14),
('770e8400-e29b-41d4-a716-446655440003', 'Bell Peppers', 'VEG-PEP-001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'kg', 85.00, 15.8, 8.0, 60.0, 12.0, 30.0, 5),
('770e8400-e29b-41d4-a716-446655440004', 'Lettuce', 'VEG-LET-001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'kg', 55.00, 8.5, 5.0, 40.0, 8.0, 25.0, 3),

-- Meat & Poultry
('770e8400-e29b-41d4-a716-446655440005', 'Chicken Breast', 'MEAT-CHI-001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'kg', 180.00, 35.0, 15.0, 80.0, 20.0, 40.0, 3),
('770e8400-e29b-41d4-a716-446655440006', 'Ground Beef', 'MEAT-BEF-001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'kg', 220.00, 22.5, 10.0, 60.0, 15.0, 30.0, 2),
('770e8400-e29b-41d4-a716-446655440007', 'Salmon Fillet', 'MEAT-SAL-001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'kg', 450.00, 12.0, 5.0, 30.0, 8.0, 15.0, 2),

-- Dairy Products
('770e8400-e29b-41d4-a716-446655440008', 'Mozzarella Cheese', 'DAIRY-MOZ-001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'kg', 320.00, 18.5, 8.0, 50.0, 12.0, 25.0, 21),
('770e8400-e29b-41d4-a716-446655440009', 'Heavy Cream', 'DAIRY-CRE-001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'liter', 95.00, 25.0, 10.0, 60.0, 15.0, 30.0, 14),

-- Grains & Cereals
('770e8400-e29b-41d4-a716-446655440010', 'Jasmine Rice', 'GRAIN-RIC-001', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'kg', 42.00, 85.0, 30.0, 200.0, 50.0, 100.0, 365),
('770e8400-e29b-41d4-a716-446655440011', 'All-Purpose Flour', 'GRAIN-FLO-001', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'kg', 28.00, 65.5, 25.0, 150.0, 40.0, 75.0, 180),

-- Spices & Seasonings
('770e8400-e29b-41d4-a716-446655440012', 'Black Pepper', 'SPICE-PEP-001', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'kg', 850.00, 5.2, 2.0, 15.0, 3.0, 8.0, 730),
('770e8400-e29b-41d4-a716-446655440013', 'Sea Salt', 'SPICE-SAL-001', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'kg', 45.00, 12.8, 5.0, 30.0, 8.0, 15.0, 1095),

-- Oils & Fats
('770e8400-e29b-41d4-a716-446655440014', 'Olive Oil', 'OIL-OLI-001', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 'liter', 280.00, 15.5, 8.0, 40.0, 12.0, 20.0, 540),
('770e8400-e29b-41d4-a716-446655440015', 'Vegetable Oil', 'OIL-VEG-001', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 'liter', 85.00, 28.0, 15.0, 60.0, 20.0, 35.0, 365),

-- Packaging
('770e8400-e29b-41d4-a716-446655440016', 'Food Containers 500ml', 'PACK-CON-001', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440005', 'piece', 8.50, 450, 200, 1000, 300, 500, 1095),
('770e8400-e29b-41d4-a716-446655440017', 'Delivery Bags', 'PACK-BAG-001', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440005', 'piece', 12.00, 180, 100, 500, 150, 250, 1095);

-- Insert Sample Purchase Orders
INSERT INTO purchase_orders (id, po_number, supplier_id, order_date, expected_delivery_date, status, total_amount, tax_amount, final_amount) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'PO-2024-001', '660e8400-e29b-41d4-a716-446655440001', '2024-01-15 10:00:00', '2024-01-17', 'received', 5250.00, 367.50, 5617.50),
('880e8400-e29b-41d4-a716-446655440002', 'PO-2024-002', '660e8400-e29b-41d4-a716-446655440002', '2024-01-16 14:30:00', '2024-01-17', 'received', 8800.00, 616.00, 9416.00),
('880e8400-e29b-41d4-a716-446655440003', 'PO-2024-003', '660e8400-e29b-41d4-a716-446655440004', '2024-01-18 09:15:00', '2024-01-23', 'sent', 3420.00, 239.40, 3659.40);

-- Insert Purchase Order Items
INSERT INTO purchase_order_items (purchase_order_id, material_id, quantity, unit_price, received_quantity, quality_status, batch_number) VALUES
-- PO-2024-001 items
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 50.0, 45.00, 50.0, 'approved', 'BATCH-TOM-240115'),
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 75.0, 35.00, 75.0, 'approved', 'BATCH-ONI-240115'),
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 30.0, 85.00, 30.0, 'approved', 'BATCH-PEP-240115'),

-- PO-2024-002 items
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', 40.0, 180.00, 40.0, 'approved', 'BATCH-CHI-240116'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440006', 20.0, 220.00, 20.0, 'approved', 'BATCH-BEF-240116'),

-- PO-2024-003 items
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440012', 8.0, 850.00, 0.0, 'pending', NULL),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440014', 20.0, 280.00, 0.0, 'pending', NULL);

-- Insert Stock Movements (based on received purchase orders)
INSERT INTO stock_movements (material_id, movement_type, quantity, unit_cost, reference_type, reference_id, batch_number, performed_by) VALUES
-- Receiving from PO-2024-001
('770e8400-e29b-41d4-a716-446655440001', 'in', 50.0, 45.00, 'purchase_order', '880e8400-e29b-41d4-a716-446655440001', 'BATCH-TOM-240115', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'in', 75.0, 35.00, 'purchase_order', '880e8400-e29b-41d4-a716-446655440001', 'BATCH-ONI-240115', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440003', 'in', 30.0, 85.00, 'purchase_order', '880e8400-e29b-41d4-a716-446655440001', 'BATCH-PEP-240115', '550e8400-e29b-41d4-a716-446655440001'),

-- Receiving from PO-2024-002
('770e8400-e29b-41d4-a716-446655440005', 'in', 40.0, 180.00, 'purchase_order', '880e8400-e29b-41d4-a716-446655440002', 'BATCH-CHI-240116', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440006', 'in', 20.0, 220.00, 'purchase_order', '880e8400-e29b-41d4-a716-446655440002', 'BATCH-BEF-240116', '550e8400-e29b-41d4-a716-446655440001'),

-- Usage for menu items
('770e8400-e29b-41d4-a716-446655440001', 'out', 24.5, 45.00, 'menu_item_production', '550e8400-e29b-41d4-a716-446655440001', 'BATCH-TOM-240115', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'out', 29.8, 35.00, 'menu_item_production', '550e8400-e29b-41d4-a716-446655440001', 'BATCH-ONI-240115', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440005', 'out', 5.0, 180.00, 'menu_item_production', '550e8400-e29b-41d4-a716-446655440002', 'BATCH-CHI-240116', '550e8400-e29b-41d4-a716-446655440001');

-- Insert Menu Item Materials (Bill of Materials)
-- Assuming we have menu items with these IDs
INSERT INTO menu_item_materials (menu_item_id, material_id, quantity_required, unit_of_measure, cost_per_unit, waste_percentage) VALUES
-- Pizza Margherita
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 0.15, 'kg', 45.00, 5.0), -- Tomatoes
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440008', 0.12, 'kg', 320.00, 2.0), -- Mozzarella
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440011', 0.25, 'kg', 28.00, 3.0), -- Flour
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440014', 0.02, 'liter', 280.00, 1.0), -- Olive Oil

-- Chicken Burger
('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', 0.18, 'kg', 180.00, 3.0), -- Chicken Breast
('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 0.05, 'kg', 55.00, 10.0), -- Lettuce
('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 0.08, 'kg', 45.00, 5.0), -- Tomatoes
('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440011', 0.12, 'kg', 28.00, 2.0); -- Flour (for bun)

-- Insert Cost Analysis
INSERT INTO cost_analysis (menu_item_id, material_cost, labor_cost, overhead_cost, selling_price) VALUES
('550e8400-e29b-41d4-a716-446655440001', 52.85, 25.00, 15.00, 149.00), -- Pizza Margherita
('550e8400-e29b-41d4-a716-446655440002', 38.95, 20.00, 12.00, 119.00), -- Chicken Burger
('550e8400-e29b-41d4-a716-446655440003', 45.20, 18.00, 10.00, 99.00),  -- Pad Thai
('550e8400-e29b-41d4-a716-446655440004', 62.30, 30.00, 18.00, 189.00); -- Salmon Teriyaki

-- Insert MCP Alerts (some sample alerts)
INSERT INTO mcp_alerts (alert_type, material_id, title, message, severity, threshold_value, current_value) VALUES
('low_stock', '770e8400-e29b-41d4-a716-446655440004', 'Low Stock Alert: Lettuce', 'Lettuce stock is below reorder point. Current: 8.5kg, Reorder point: 8.0kg', 'medium', 8.0, 8.5),
('low_stock', '770e8400-e29b-41d4-a716-446655440007', 'Critical Stock Alert: Salmon Fillet', 'Salmon Fillet stock is critically low. Current: 12.0kg, Minimum: 5.0kg', 'high', 8.0, 12.0),
('high_cost', '770e8400-e29b-41d4-a716-446655440012', 'High Cost Alert: Black Pepper', 'Black Pepper cost has increased significantly. Current: ฿850/kg', 'medium', 800.0, 850.0);

-- Update timestamps
UPDATE materials SET updated_at = NOW();
UPDATE suppliers SET updated_at = NOW();
UPDATE purchase_orders SET updated_at = NOW();
UPDATE purchase_order_items SET updated_at = NOW();