const db = require('../config/db');

const Claim = {
    // Get all claims with item info (JOIN)
    async getAll() {
        const [rows] = await db.query(
            `SELECT claims.*, items.name AS item_name
       FROM claims
       JOIN items ON claims.item_id = items.id
       ORDER BY claims.created_at DESC`
        );
        return rows;
    },

    // Get single claim by ID with item info (JOIN)
    async getById(id) {
        const [rows] = await db.query(
            `SELECT claims.*, items.name AS item_name
       FROM claims
       JOIN items ON claims.item_id = items.id
       WHERE claims.id = ?`,
            [id]
        );
        return rows[0];
    },

    // Get all claims for a specific item
    async getByItemId(itemId) {
        const [rows] = await db.query(
            `SELECT claims.*, items.name AS item_name
       FROM claims
       JOIN items ON claims.item_id = items.id
       WHERE claims.item_id = ?
       ORDER BY claims.created_at DESC`,
            [itemId]
        );
        return rows;
    },

    // Create a new claim
    async create(data) {
        const { item_id, claimant_name, contact_info } = data;
        const [result] = await db.query(
            'INSERT INTO claims (item_id, claimant_name, contact_info) VALUES (?, ?, ?)',
            [item_id, claimant_name, contact_info || null]
        );
        return result.insertId;
    },

    // Update a claim
    async update(id, data) {
        const { item_id, claimant_name, contact_info, claim_status } = data;
        const [result] = await db.query(
            'UPDATE claims SET item_id = ?, claimant_name = ?, contact_info = ?, claim_status = ? WHERE id = ?',
            [item_id, claimant_name, contact_info || null, claim_status, id]
        );
        return result.affectedRows;
    },

    // Delete a claim
    async delete(id) {
        const [result] = await db.query('DELETE FROM claims WHERE id = ?', [id]);
        return result.affectedRows;
    },

    // Approve a claim using a TRANSACTION
    // Sets claim_status to 'approved' AND item status to 'resolved'
    async approve(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Update claim status to approved
            await connection.query(
                'UPDATE claims SET claim_status = ? WHERE id = ?',
                ['approved', id]
            );

            // Get the item_id for this claim
            const [claimRows] = await connection.query(
                'SELECT item_id FROM claims WHERE id = ?',
                [id]
            );

            if (claimRows.length === 0) {
                throw new Error('Claim not found');
            }

            // Update the linked item status to resolved
            await connection.query(
                'UPDATE items SET status = ? WHERE id = ?',
                ['resolved', claimRows[0].item_id]
            );

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
};

module.exports = Claim;
