const db = require('../config/db');

const Item = {
    // Get all items
    async getAll() {
        const [rows] = await db.query('SELECT * FROM items ORDER BY created_at DESC');
        return rows;
    },

    // Get single item by ID
    async getById(id) {
        const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
        return rows[0];
    },

    // Create a new item
    async create(data) {
        const { name, description, location_found, date_found, status } = data;
        const [result] = await db.query(
            'INSERT INTO items (name, description, location_found, date_found, status) VALUES (?, ?, ?, ?, ?)',
            [name, description || null, location_found || null, date_found || null, status || 'found']
        );
        return result.insertId;
    },

    // Update an item
    async update(id, data) {
        const { name, description, location_found, date_found, status } = data;
        const [result] = await db.query(
            'UPDATE items SET name = ?, description = ?, location_found = ?, date_found = ?, status = ? WHERE id = ?',
            [name, description || null, location_found || null, date_found || null, status, id]
        );
        return result.affectedRows;
    },

    // Delete an item
    async delete(id) {
        const [result] = await db.query('DELETE FROM items WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Item;
