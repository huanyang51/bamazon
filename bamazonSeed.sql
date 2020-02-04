DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100),
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("floral wrap dress", "clothing", 29.99, 200),
    ("strip T-shirt", "clothing", 29.99, 100),
    ("Levis jeans", "clothing", 59.99, 200),
    ("cashmere scarf", "clothing", 59.99, 2),
    ("Nike sneakers", "shoes", 49.99, 100),
    ("Pride and Prejudice", "book", 24.00, 3),
    ("iPhone XR", "electronics", 599.00, 2),
    ("energy bars", "food", 9.99, 200),
    ("chips", "food", 3.49, 900),
    ("chocolate kisses", "food", 5.69, 1000);