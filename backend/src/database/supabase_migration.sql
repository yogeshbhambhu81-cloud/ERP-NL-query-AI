-- ==========================================================
-- WFX AI-Native ERP Database Schema Setup (Production-Ready)
-- Platform: Supabase PostgreSQL
-- ==========================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop Existing Tables to prevent schema conflicts
DROP TABLE IF EXISTS image_embeddings CASCADE;
DROP TABLE IF EXISTS ai_query_history CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS sales_invoices CASCADE;
DROP TABLE IF EXISTS sales_order_items CASCADE;
DROP TABLE IF EXISTS sales_orders CASCADE;
DROP TABLE IF EXISTS tech_packs CASCADE;
DROP TABLE IF EXISTS finished_goods CASCADE;
DROP TABLE IF EXISTS buyers CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- ==========================================================
-- 1. Helper Functions & Triggers (Automatic updated_at)
-- ==========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 2. Lookup Tables (Optional but highly recommended for 3NF)
-- ==========================================================

-- Categories Lookup
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Brands Lookup
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 3. Core Business Entity Tables (Dual-Compatible Schema)
-- ==========================================================

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL, -- Compatible with Express Controller
    country VARCHAR(100) NOT NULL,
    contact VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    lead_time VARCHAR(50) DEFAULT '14 days',
    rating DECIMAL(3,2) DEFAULT 5.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    supplier_score DECIMAL(5,2) DEFAULT 100.00 CHECK (supplier_score >= 0.00 AND supplier_score <= 100.00), -- Compatible with Express Controller
    on_time_rate DECIMAL(5,2) DEFAULT 100.00 CHECK (on_time_rate >= 0.00 AND on_time_rate <= 100.00), -- Compatible with Express Controller
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trigger_update_suppliers_updated_at ON suppliers;
CREATE TRIGGER trigger_update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Buyers Table
CREATE TABLE IF NOT EXISTS buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL, -- Compatible with Express Controller
    country VARCHAR(100) NOT NULL,
    buyer_category VARCHAR(100) DEFAULT 'Standard',
    contact_person VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT, -- Compatible with Express Controller
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE buyers DISABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trigger_update_buyers_updated_at ON buyers;
CREATE TRIGGER trigger_update_buyers_updated_at
    BEFORE UPDATE ON buyers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Finished Goods (Products) Table
CREATE TABLE IF NOT EXISTS finished_goods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_number VARCHAR(100) UNIQUE NOT NULL,
    style_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    fabric VARCHAR(255) NOT NULL,
    gsm INTEGER NOT NULL CHECK (gsm > 0),
    color VARCHAR(100) NOT NULL,
    print VARCHAR(100) NOT NULL,
    season VARCHAR(100),
    brand VARCHAR(100),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (cost >= 0.00),
    cost_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (cost_price >= 0.00), -- Compatible with Express Controller
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (selling_price >= 0.00),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0), -- Compatible with Express Controller
    image_url TEXT,
    description TEXT,
    similarity_score DECIMAL(5,2) DEFAULT 0.00, -- Compatible with Express Controller
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE finished_goods DISABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trigger_update_finished_goods_updated_at ON finished_goods;
CREATE TRIGGER trigger_update_finished_goods_updated_at
    BEFORE UPDATE ON finished_goods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tech Packs Table
CREATE TABLE IF NOT EXISTS tech_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finished_good_id UUID REFERENCES finished_goods(id) ON DELETE CASCADE UNIQUE,
    product_id UUID REFERENCES finished_goods(id) ON DELETE CASCADE UNIQUE, -- Compatible with Express Controller
    fabric_details TEXT,
    construction TEXT,
    wash_instructions TEXT,
    stitching_details TEXT,
    notes TEXT,
    spec_details TEXT, -- Compatible with Express Controller
    measurement_chart TEXT, -- Compatible with Express Controller
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tech_packs DISABLE ROW LEVEL SECURITY;

-- Sales Orders Table
CREATE TABLE IF NOT EXISTS sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    buyer_id UUID REFERENCES buyers(id) ON DELETE SET NULL,
    finished_good_id UUID REFERENCES finished_goods(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    shipment_date TIMESTAMP WITH TIME ZONE,
    delivery_date TIMESTAMP WITH TIME ZONE, -- Compatible with Express Controller
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sales_orders DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON sales_orders;
CREATE POLICY "Allow all" ON sales_orders FOR ALL TO public USING (true) WITH CHECK (true);

-- Sales Order Items (Bridge Table)
CREATE TABLE IF NOT EXISTS sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES finished_goods(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Invoices Table
CREATE TABLE IF NOT EXISTS sales_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    sales_order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE,
    order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE, -- Compatible with Express Controller
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0.00),
    invoice_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (invoice_amount >= 0.00), -- Compatible with Express Controller
    currency VARCHAR(10) DEFAULT 'USD',
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')), -- Compatible with Express Controller
    invoice_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sales_invoices DISABLE ROW LEVEL SECURITY;

-- ==========================================================
-- 4. Optional / Advanced AI Support Tables
-- ==========================================================

-- Image Embeddings for visual similarity / vector search (using standard array)
CREATE TABLE IF NOT EXISTS image_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finished_good_id UUID REFERENCES finished_goods(id) ON DELETE CASCADE UNIQUE,
    embedding real[], -- Compatible with all Postgres servers without vector extension
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Query Search Logs
CREATE TABLE IF NOT EXISTS ai_query_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_query TEXT NOT NULL,
    generated_sql TEXT,
    execution_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 5. Indexes (Query & Search Optimization)
-- ==========================================================

-- Indexes on Finished Goods
CREATE INDEX IF NOT EXISTS idx_fg_style_number ON finished_goods(style_number);
CREATE INDEX IF NOT EXISTS idx_fg_style_name ON finished_goods(style_name);
CREATE INDEX IF NOT EXISTS idx_fg_category ON finished_goods(category);
CREATE INDEX IF NOT EXISTS idx_fg_fabric ON finished_goods(fabric);
CREATE INDEX IF NOT EXISTS idx_fg_color ON finished_goods(color);
CREATE INDEX IF NOT EXISTS idx_fg_supplier_id ON finished_goods(supplier_id);

-- Indexes on Core Tables
CREATE INDEX IF NOT EXISTS idx_so_order_number ON sales_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_so_buyer_id ON sales_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_si_invoice_number ON sales_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_si_sales_order_id ON sales_invoices(sales_order_id);
CREATE INDEX IF NOT EXISTS idx_si_order_id ON sales_invoices(order_id);

-- GIN Index for fast JSONB metadata search on embeddings
CREATE INDEX IF NOT EXISTS idx_embeddings_metadata ON image_embeddings USING gin (metadata);
