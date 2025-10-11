-- Material Control Plan (MCP) Database Schema
-- Enhanced inventory and material management for Food Delivery System

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-key-here-change-in-production';

-- Create MCP-specific tables

-- 1. Suppliers Management
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    payment_terms VARCHAR(100),
    delivery_time_days INTEGER DEFAULT 7,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Material Categories
CREATE TABLE IF NOT EXISTS material_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES material_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Materials/Ingredients Inventory
CREATE TABLE IF NOT EXISTS materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    category_id UUID REFERENCES material_categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    unit_of_measure VARCHAR(50) NOT NULL, -- kg, liter, piece, etc.
    unit_cost DECIMAL(10,2) NOT NULL,
    current_stock DECIMAL(10,2) DEFAULT 0.00,
    minimum_stock DECIMAL(10,2) DEFAULT 0.00,
    maximum_stock DECIMAL(10,2) DEFAULT 0.00,
    reorder_point DECIMAL(10,2) DEFAULT 0.00,
    reorder_quantity DECIMAL(10,2) DEFAULT 0.00,
    shelf_life_days INTEGER,
    storage_requirements TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    po_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sent', 'received', 'cancelled')),
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_by UUID,
    approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    received_quantity DECIMAL(10,2) DEFAULT 0.00,
    quality_status VARCHAR(20) DEFAULT 'pending' CHECK (quality_status IN ('pending', 'approved', 'rejected', 'partial')),
    expiry_date DATE,
    batch_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Stock Movements/Transactions
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    material_id UUID REFERENCES materials(id),
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'transfer', 'waste')),
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity * COALESCE(unit_cost, 0)) STORED,
    reference_type VARCHAR(50), -- 'purchase_order', 'menu_item_production', 'adjustment', etc.
    reference_id UUID,
    batch_number VARCHAR(100),
    expiry_date DATE,
    reason TEXT,
    performed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Recipe/Menu Item Materials (Bill of Materials)
CREATE TABLE IF NOT EXISTS menu_item_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_item_id UUID, -- References menu_items table
    material_id UUID REFERENCES materials(id),
    quantity_required DECIMAL(10,2) NOT NULL,
    unit_of_measure VARCHAR(50),
    cost_per_unit DECIMAL(10,2),
    waste_percentage DECIMAL(5,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Cost Analysis
CREATE TABLE IF NOT EXISTS cost_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_date DATE DEFAULT CURRENT_DATE,
    menu_item_id UUID,
    material_cost DECIMAL(12,2) DEFAULT 0.00,
    labor_cost DECIMAL(12,2) DEFAULT 0.00,
    overhead_cost DECIMAL(12,2) DEFAULT 0.00,
    total_cost DECIMAL(12,2) GENERATED ALWAYS AS (material_cost + labor_cost + overhead_cost) STORED,
    selling_price DECIMAL(12,2),
    profit_margin DECIMAL(12,2) GENERATED ALWAYS AS (selling_price - (material_cost + labor_cost + overhead_cost)) STORED,
    profit_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN selling_price > 0 THEN ((selling_price - (material_cost + labor_cost + overhead_cost)) / selling_price * 100)
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. MCP Alerts
CREATE TABLE IF NOT EXISTS mcp_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('low_stock', 'high_cost', 'expiry_warning', 'quality_issue', 'supplier_issue')),
    material_id UUID REFERENCES materials(id),
    supplier_id UUID REFERENCES suppliers(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    threshold_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    assigned_to UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_materials_supplier ON materials(supplier_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_sku ON materials(sku);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_stock_movements_material ON stock_movements(material_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_mcp_alerts_type ON mcp_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_mcp_alerts_status ON mcp_alerts(status);
CREATE INDEX IF NOT EXISTS idx_mcp_alerts_material ON mcp_alerts(material_id);

-- Create functions for automatic stock updates
CREATE OR REPLACE FUNCTION update_material_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.movement_type = 'in' THEN
        UPDATE materials 
        SET current_stock = current_stock + NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.material_id;
    ELSIF NEW.movement_type IN ('out', 'waste') THEN
        UPDATE materials 
        SET current_stock = current_stock - NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.material_id;
    ELSIF NEW.movement_type = 'adjustment' THEN
        UPDATE materials 
        SET current_stock = NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.material_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stock updates
DROP TRIGGER IF EXISTS trigger_update_material_stock ON stock_movements;
CREATE TRIGGER trigger_update_material_stock
    AFTER INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_material_stock();

-- Create function to check low stock and create alerts
CREATE OR REPLACE FUNCTION check_low_stock_alerts()
RETURNS VOID AS $$
DECLARE
    material_record RECORD;
BEGIN
    FOR material_record IN 
        SELECT id, name, current_stock, minimum_stock, reorder_point
        FROM materials 
        WHERE status = 'active' 
        AND current_stock <= reorder_point
    LOOP
        INSERT INTO mcp_alerts (
            alert_type, 
            material_id, 
            title, 
            message, 
            severity,
            threshold_value,
            current_value
        ) VALUES (
            'low_stock',
            material_record.id,
            'Low Stock Alert: ' || material_record.name,
            'Material "' || material_record.name || '" is running low. Current stock: ' || material_record.current_stock || ', Reorder point: ' || material_record.reorder_point,
            CASE 
                WHEN material_record.current_stock <= material_record.minimum_stock THEN 'critical'
                WHEN material_record.current_stock <= material_record.reorder_point * 0.5 THEN 'high'
                ELSE 'medium'
            END,
            material_record.reorder_point,
            material_record.current_stock
        )
        ON CONFLICT DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_alerts ENABLE ROW LEVEL SECURITY;