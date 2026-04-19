-- PostgreSQL Database Setup For AURA Restaurant

-- 1. Create the database (Run this first, then connect to this database)
-- CREATE DATABASE restaurant_db;

-- 2. Drop existing tables if you are doing a fresh reset (Optional)
-- DROP TABLE IF EXISTS reservations;
-- DROP TABLE IF EXISTS menu;

-- 3. Create the 'menu' table
CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT
);

-- 4. Create the 'reservations' table
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    guests INTEGER NOT NULL,
    time VARCHAR(50) NOT NULL,
    table_zone VARCHAR(255) NOT NULL,
    specific_table VARCHAR(50),
    customer_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insert starter demo data into the 'menu' table
INSERT INTO menu (category, name, price, description) VALUES 
('Punjabi', 'Shahi Paneer Royale', 450, 'Fresh cottage cheese in a rich, cashew-nut tomato gravy with aromatic spices.'),
('Rajasthani', 'Dal Baati Churma', 550, 'The quintessential Rajasthani trio: spicy dal, wood-fired baatis, and sweet churma.'),
('South Indian', 'Ghee Roast Masala Dosa', 320, 'Crispy golden dosa roasted in pure A2 ghee, served with 3 types of chutneys and sambar.'),
('Chinese', 'Truffle Chilli Paneer', 480, 'Wok-tossed paneer cubes with bell peppers, finished with a hint of truffle oil.'),
('Punjabi', 'Dal Makhani', 420, 'Slow-cooked black lentils simmered overnight with cream and butter.'),
('Rajasthani', 'Gatte Ki Sabzi', 380, 'Gram flour dumplings simmered in a tangy, spiced yogurt-based gravy.')
ON CONFLICT DO NOTHING;
