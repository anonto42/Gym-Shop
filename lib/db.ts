import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'ecommerce.db');
export const db = new Database(dbPath);

// Initialize database tables
export function initializeDatabase() {
  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (name, description, price, image, category, stock) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const sampleProducts = [
      ['Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, '/images/headphones.jpg', 'Electronics', 50],
      ['Smart Watch', 'Feature-rich smartwatch with health monitoring', 299.99, '/images/smartwatch.jpg', 'Electronics', 30],
      ['Coffee Maker', 'Automatic coffee maker with programmable settings', 89.99, '/images/coffee-maker.jpg', 'Home', 25],
      ['Running Shoes', 'Comfortable running shoes for all terrains', 129.99, '/images/shoes.jpg', 'Fashion', 40],
    ];

    sampleProducts.forEach(product => insertProduct.run(product));
  }
}