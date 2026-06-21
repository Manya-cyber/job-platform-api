const pool   = require('../db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

async function register({ name, email, password }) {

    // Check if email already exists
    const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1', [email]  // email = $1 means check email with the first parameter i passed i.e.,[email]
    );
    if (existing.rows.length > 0) {
        throw new Error('Email already registered');
    }

    // Hash the password — never store plain text
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user + profile in one transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, password_hash]
        );
        const user = userResult.rows[0];

        await client.query(
            `INSERT INTO user_profile (user_id) VALUES ($1)`,
            [user.id]
        );

        await client.query('COMMIT');

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return { user, token };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function login({ email, password }) {

    // Find user by email
    const result = await pool.query(
        'SELECT id, name, email, password_hash FROM users WHERE email = $1',
        [email]
    );
    const user = result.rows[0];

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare password with stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        throw new Error('Invalid email or password');
    }

    // Generate token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        user: { id: user.id, name: user.name, email: user.email },
        token
    };
}

module.exports = { register, login };