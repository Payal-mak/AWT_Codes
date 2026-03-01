-- Lost and Found Database Schema
-- Run this file to create the required tables

CREATE DATABASE IF NOT EXISTS lost_and_found;

USE lost_and_found;

-- Items Table
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_found VARCHAR(255),
    date_found DATE,
    status ENUM('lost', 'found', 'resolved') NOT NULL DEFAULT 'found',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims Table (linked to Items via foreign key)
CREATE TABLE IF NOT EXISTS claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    claimant_name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    claim_status ENUM(
        'pending',
        'approved',
        'rejected'
    ) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
);