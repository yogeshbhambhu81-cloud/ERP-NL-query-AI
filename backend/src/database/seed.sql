-- ==========================================================
-- WFX ERP Seed Data Script (Matches Live DB Constraints)
-- ==========================================================

-- Clean existing data first to prevent duplicate/conflict issues
TRUNCATE TABLE sales_invoices, sales_order_items, sales_orders, finished_goods, buyers, suppliers CASCADE;

-- 1. Insert Suppliers
INSERT INTO suppliers (id, company_name, name, country, email, phone, address, supplier_score, on_time_rate, lead_time) VALUES
('6fa85f64-5717-4562-b3fc-2c963f66afa1', 'Textile Horizon Ltd', 'Textile Horizon Ltd', 'India', 'contact@textilehorizon.com', '+91 98765 43210', 'Plot 45, Sector 5, IMT Manesar, Gurugram, India', 94.00, 96.00, '12 days'),
('6fa85f64-5717-4562-b3fc-2c963f66afa2', 'Apex Apparel Source', 'Apex Apparel Source', 'Bangladesh', 'sales@apexapparel.com', '+880 2 9876543', 'House 12, Road 4, Sector 3, Uttara, Dhaka, Bangladesh', 88.00, 89.00, '18 days'),
('6fa85f64-5717-4562-b3fc-2c963f66afa3', 'Nippon Denim Mills', 'Nippon Denim Mills', 'Japan', 'info@nippondenim.co.jp', '+81 3 5555 0199', '3-1-2 Kurashiki, Okayama, Japan', 97.00, 95.00, '22 days'),
('6fa85f64-5717-4562-b3fc-2c963f66afa4', 'EuroKnit Fabrics', 'EuroKnit Fabrics', 'Italy', 'ops@euroknit.it', '+39 0574 123456', 'Via delle Pleiadi 15, Prato, Italy', 91.00, 92.00, '15 days'),
('6fa85f64-5717-4562-b3fc-2c963f66afa5', 'Guangdong Silk Co.', 'Guangdong Silk Co.', 'China', 'trade@gd-silk.cn', '+86 20 8333 4455', '88 Middle Yanjiang Road, Guangzhou, China', 79.00, 82.00, '25 days'),
('6fa85f64-5717-4562-b3fc-2c963f66afa6', 'Pacific Sportswear', 'Pacific Sportswear', 'USA', 'supply@pacificsport.com', '+1 503 555 0122', '450 Broadway Ave, Portland, OR, USA', 92.00, 94.00, '10 days'),
('6fa85f64-5717-4562-b3fc-2c963f66afa7', 'Andean Alpaca Weaves', 'Andean Alpaca Weaves', 'Peru', 'info@andeanalpaca.pe', '+51 1 444 5566', 'Av. Larco 789, Miraflores, Lima, Peru', 96.00, 98.00, '20 days');

-- 2. Insert Buyers
INSERT INTO buyers (id, company_name, name, country, email, phone, address) VALUES
('8da85f64-5717-4562-b3fc-2c963f66afa1', 'Inditex (Zara)', 'Inditex (Zara)', 'Spain', 'buying@inditex.com', '+34 981 185 400', 'Edificio Inditex, Arteixo, A Coruña, Spain'),
('8da85f64-5717-4562-b3fc-2c963f66afa2', 'H&M Group', 'H&M Group', 'Sweden', 'sourcing@hm.com', '+46 8 796 55 00', 'Mäster Samuelsgatan 46A, Stockholm, Sweden'),
('8da85f64-5717-4562-b3fc-2c963f66afa3', 'Nordstrom Inc.', 'Nordstrom Inc.', 'USA', 'merch@nordstrom.com', '+1 206 628 2111', '1617 6th Ave, Seattle, WA, USA'),
('8da85f64-5717-4562-b3fc-2c963f66afa4', 'Uniqlo (Fast Retailing)', 'Uniqlo (Fast Retailing)', 'Japan', 'design@uniqlo.co.jp', '+81 3 6865 0050', 'Midtown Tower, Akasaka, Minato-ku, Tokyo, Japan'),
('8da85f64-5717-4562-b3fc-2c963f66afa5', 'ASOS Plc', 'ASOS Plc', 'UK', 'brands@asos.com', '+44 20 7756 1000', 'Greater London House, Hampstead Road, London, UK'),
('8da85f64-5717-4562-b3fc-2c963f66afa6', 'Lululemon Athletica', 'Lululemon Athletica', 'Canada', 'sourcing@lululemon.com', '+1 604 732 6124', '1818 Cornwall Ave, Vancouver, BC, Canada'),
('8da85f64-5717-4562-b3fc-2c963f66afa7', 'Patagonia Inc.', 'Patagonia Inc.', 'USA', 'impact@patagonia.com', '+1 805 643 8616', '259 W Santa Clara St, Ventura, CA, USA');

-- 3. Insert Finished Goods (linked to suppliers)
INSERT INTO finished_goods (id, style_number, style_name, category, fabric, gsm, color, print, supplier_id, cost, cost_price, selling_price, stock_quantity, image_url, season) VALUES
('ad085f64-5717-4562-b3fc-2c963f66af01', 'WFX-2026-JK01', 'High-Altitude Expedition Parka', 'Outerwear', 'Nylon Taslan Ripstop', 280, 'Amber Orange', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa2', 42.50, 42.50, 110.00, 1250, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80', 'Winter 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af02', 'WFX-2026-SH03', 'Heritage Heavyweight Flannel', 'Shirts', 'Brushed Cotton Flannel', 220, 'Rustic Crimson Plaid', 'Plaid Check', '6fa85f64-5717-4562-b3fc-2c963f66afa1', 12.80, 12.80, 34.50, 4800, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', 'Autumn 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af03', 'WFX-2026-DM05', 'Raw Selvedge Denim Jacket', 'Outerwear', '14oz Kurashiki Cotton Denim', 400, 'Indigo Raw', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa3', 38.00, 38.00, 95.00, 950, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80', 'Year-Round'),
('ad085f64-5717-4562-b3fc-2c963f66af04', 'WFX-2026-PT08', 'Tailored Linen Cargo Trouser', 'Trousers', 'Flax Linen Blend', 180, 'Sand Drift', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa5', 15.50, 15.50, 42.00, 3100, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80', 'Summer 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af05', 'WFX-2026-KN12', 'Merino Wool Mockneck Sweater', 'Knitwear', '100% Merino Wool', 320, 'Heather Charcoal', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa4', 24.00, 24.00, 68.00, 1600, 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80', 'Winter 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af06', 'WFX-2026-TS02', 'Organic Slub Tee Pack', 'Activewear', 'Supima Cotton Slub', 145, 'Optical White / Black', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa1', 6.50, 6.50, 18.00, 7200, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80', 'Spring 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af07', 'WFX-2026-DR11', 'Floral Print Silk Midi Dress', 'Dresses', 'Mulberry Silk Chiffon', 85, 'Midnight Rose Print', 'Floral', '6fa85f64-5717-4562-b3fc-2c963f66afa5', 32.00, 32.00, 89.00, 1400, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80', 'Summer 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af08', 'WFX-2026-SH15', 'Chambray Utility Workshirt', 'Shirts', 'Indigo Chambray Cotton', 160, 'Vintage Wash Indigo', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa1', 11.20, 11.20, 28.00, 3400, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80', 'Spring 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af09', 'WFX-2026-PT20', 'Everyday Comfort Jogger', 'Trousers', 'French Terry Cotton-Poly', 290, 'Slate Grey', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa2', 10.50, 10.50, 26.00, 5200, 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&auto=format&fit=crop&q=80', 'Autumn 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af10', 'WFX-2026-KN05', 'Cable Knit Wool Cardigan', 'Knitwear', 'Shetland Wool Blend', 450, 'Oatmeal Melange', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa4', 26.50, 26.50, 75.00, 1100, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80', 'Autumn 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af11', 'WFX-2026-JK04', 'Waterproof Commuter Shell', 'Outerwear', '3-Layer Gore-Tex', 150, 'Obsidian Black', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa2', 55.00, 55.00, 145.00, 800, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80', 'Spring 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af12', 'WFX-2026-DR04', 'Crepe Blazer Dress', 'Dresses', 'Structured Crepe Polyester', 240, 'Pristine Ivory', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa5', 19.80, 19.80, 54.00, 1500, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&auto=format&fit=crop&q=80', 'Summer 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af13', 'WFX-2026-JK08', 'Urban Tech-Wear Bomber', 'Outerwear', 'DWR Coated Recycled Polyester', 210, 'Matte Olive', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa6', 28.50, 28.50, 78.00, 2100, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', 'Autumn 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af14', 'WFX-2026-KN15', 'Andean Alpaca Crewneck', 'Knitwear', '80% Baby Alpaca, 20% Silk', 350, 'Camel Melange', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa7', 35.00, 35.00, 98.00, 850, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80', 'Winter 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af15', 'WFX-2026-PT12', 'Performance Commuter Chino', 'Trousers', '4-Way Stretch Twill', 240, 'Deep Navy', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa6', 18.00, 18.00, 48.00, 3400, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format&fit=crop&q=80', 'Year-Round'),
('ad085f64-5717-4562-b3fc-2c963f66af16', 'WFX-2026-TS05', 'Zero-Chafe Running Tee', 'Activewear', 'Moisture-Wicking Recycled Poly', 130, 'Volt Green', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa6', 8.50, 8.50, 24.00, 4500, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80', 'Summer 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af17', 'WFX-2026-DR15', 'Tiered Linen Summer Sundress', 'Dresses', 'Organic Belgian Linen', 160, 'Sage Green', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa4', 22.00, 22.00, 65.00, 1800, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80', 'Summer 2026'),
('ad085f64-5717-4562-b3fc-2c963f66af18', 'WFX-2026-SH18', 'Luxe Tencel Resort Shirt', 'Shirts', '100% Tencel Lyocell', 150, 'Terracotta', 'Solid Color', '6fa85f64-5717-4562-b3fc-2c963f66afa2', 14.50, 14.50, 38.00, 2600, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', 'Spring 2026');

-- 4. Insert Sales Orders
INSERT INTO sales_orders (id, order_number, buyer_id, finished_good_id, quantity, status, total_amount, order_date, delivery_date, shipment_date) VALUES
('b2a85f64-5717-4562-b3fc-2c963f66af01', 'SO-002341', '8da85f64-5717-4562-b3fc-2c963f66afa1', 'ad085f64-5717-4562-b3fc-2c963f66af04', 1000, 'processing', 42000.00, '2026-06-15 10:00:00+00', '2026-08-01 18:00:00+00', '2026-08-01 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af02', 'SO-002342', '8da85f64-5717-4562-b3fc-2c963f66afa2', 'ad085f64-5717-4562-b3fc-2c963f66af02', 2275, 'shipped', 78500.00, '2026-06-20 12:00:00+00', '2026-07-28 18:00:00+00', '2026-07-28 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af03', 'SO-002343', '8da85f64-5717-4562-b3fc-2c963f66afa3', 'ad085f64-5717-4562-b3fc-2c963f66af01', 1018, 'delivered', 112000.00, '2026-05-10 09:00:00+00', '2026-06-30 18:00:00+00', '2026-06-30 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af04', 'SO-002344', '8da85f64-5717-4562-b3fc-2c963f66afa5', 'ad085f64-5717-4562-b3fc-2c963f66af06', 1411, 'pending', 25400.00, '2026-07-01 14:00:00+00', '2026-08-15 18:00:00+00', '2026-08-15 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af05', 'SO-002345', '8da85f64-5717-4562-b3fc-2c963f66afa4', 'ad085f64-5717-4562-b3fc-2c963f66af03', 1000, 'processing', 95000.00, '2026-06-28 11:00:00+00', '2026-08-10 18:00:00+00', '2026-08-10 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af06', 'SO-002346', '8da85f64-5717-4562-b3fc-2c963f66afa6', 'ad085f64-5717-4562-b3fc-2c963f66af16', 1500, 'processing', 36000.00, '2026-07-02 10:00:00+00', '2026-08-20 18:00:00+00', '2026-08-20 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af07', 'SO-002347', '8da85f64-5717-4562-b3fc-2c963f66afa7', 'ad085f64-5717-4562-b3fc-2c963f66af13', 1200, 'pending', 93600.00, '2026-07-05 11:30:00+00', '2026-09-01 18:00:00+00', '2026-09-01 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af08', 'SO-002348', '8da85f64-5717-4562-b3fc-2c963f66afa3', 'ad085f64-5717-4562-b3fc-2c963f66af14', 500, 'delivered', 49000.00, '2026-06-10 09:00:00+00', '2026-07-08 18:00:00+00', '2026-07-08 18:00:00+00'),
('b2a85f64-5717-4562-b3fc-2c963f66af09', 'SO-002349', '8da85f64-5717-4562-b3fc-2c963f66afa2', 'ad085f64-5717-4562-b3fc-2c963f66af18', 2000, 'shipped', 76000.00, '2026-06-25 14:00:00+00', '2026-07-30 18:00:00+00', '2026-07-30 18:00:00+00');

-- 5. Insert Sales Order Items (Link Orders to Products)
INSERT INTO sales_order_items (id, order_id, product_id, quantity, unit_price) VALUES
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af01', 'ad085f64-5717-4562-b3fc-2c963f66af04', 1000, 42.00),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af02', 'ad085f64-5717-4562-b3fc-2c963f66af02', 2275, 34.50),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af03', 'ad085f64-5717-4562-b3fc-2c963f66af01', 1018, 110.00),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af04', 'ad085f64-5717-4562-b3fc-2c963f66af06', 1411, 18.00),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af05', 'ad085f64-5717-4562-b3fc-2c963f66af03', 1000, 95.00),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af06', 'ad085f64-5717-4562-b3fc-2c963f66af16', 1500, 24.00),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af07', 'ad085f64-5717-4562-b3fc-2c963f66af13', 1200, 78.00),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af08', 'ad085f64-5717-4562-b3fc-2c963f66af14', 500, 98.00),
(gen_random_uuid(), 'b2a85f64-5717-4562-b3fc-2c963f66af09', 'ad085f64-5717-4562-b3fc-2c963f66af18', 2000, 38.00);

-- 6. Insert Invoices
INSERT INTO sales_invoices (id, invoice_number, order_id, sales_order_id, amount, invoice_amount, status, payment_status, invoice_date) VALUES
('c3a85f64-5717-4562-b3fc-2c963f66af01', 'INV-2026-010', 'b2a85f64-5717-4562-b3fc-2c963f66af03', 'b2a85f64-5717-4562-b3fc-2c963f66af03', 112000.00, 112000.00, 'paid', 'paid', '2026-07-02 10:00:00+00'),
('c3a85f64-5717-4562-b3fc-2c963f66af02', 'INV-2026-011', 'b2a85f64-5717-4562-b3fc-2c963f66af02', 'b2a85f64-5717-4562-b3fc-2c963f66af02', 78500.00, 78500.00, 'pending', 'pending', '2026-07-05 12:00:00+00'),
('c3a85f64-5717-4562-b3fc-2c963f66af03', 'INV-2026-012', 'b2a85f64-5717-4562-b3fc-2c963f66af08', 'b2a85f64-5717-4562-b3fc-2c963f66af08', 49000.00, 49000.00, 'paid', 'paid', '2026-07-09 10:00:00+00'),
('c3a85f64-5717-4562-b3fc-2c963f66af04', 'INV-2026-013', 'b2a85f64-5717-4562-b3fc-2c963f66af09', 'b2a85f64-5717-4562-b3fc-2c963f66af09', 76000.00, 76000.00, 'pending', 'pending', '2026-07-01 12:00:00+00');
