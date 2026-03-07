const db = require('../config/db');

const Claim = {
    async getAll() {
        const [rows] = await db.query(
            `SELECT claims.*, items.name AS item_name
       FROM claims
       JOIN items ON claims.item_id = items.id
       ORDER BY claims.created_at DESC`
        );
        return rows;
    },

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

    async create(data) {
        const { item_id, claimant_name, contact_info } = data;
        const [result] = await db.query(
            'INSERT INTO claims (item_id, claimant_name, contact_info) VALUES (?, ?, ?)',
            [item_id, claimant_name, contact_info || null]
        );
        return result.insertId;
    },

    async update(id, data) {
        const { item_id, claimant_name, contact_info, claim_status } = data;
        const [result] = await db.query(
            'UPDATE claims SET item_id = ?, claimant_name = ?, contact_info = ?, claim_status = ? WHERE id = ?',
            [item_id, claimant_name, contact_info || null, claim_status, id]
        );
        return result.affectedRows;
    },

    async delete(id) {
        const [result] = await db.query('DELETE FROM claims WHERE id = ?', [id]);
        return result.affectedRows;
    },

    // Transaction: approve claim + mark item as resolved
    async approve(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                'UPDATE claims SET claim_status = ? WHERE id = ?',
                ['approved', id]
            );

            const [claimRows] = await connection.query(
                'SELECT item_id FROM claims WHERE id = ?',
                [id]
            );

            if (claimRows.length === 0) {
                throw new Error('Claim not found');
            }

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
