const authService = require('../services/auth');

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email and password are required' });
        }

        const result = await authService.register({ name, email, password });
        res.status(201).json(result);

    } catch (error) {
        if (error.message === 'Email already registered') {
            return res.status(400).json({ error: error.message });
        }
        console.error('register error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        const result = await authService.login({ email, password });
        res.json(result);

    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ error: error.message });
        }
        console.error('login error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = { register, login };