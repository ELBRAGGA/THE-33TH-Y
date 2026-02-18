// server.js - Vinyl Vault API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== DATABASE ==========
const users = [];
const vinylRecords = [
    { id: 1, albumName: "King of the Delta Blues", artist: "Robert Johnson", genre: "delta", year: 1961, condition: "Very Good", rarity: "grail", price: 4500, quantity: 2 },
    { id: 2, albumName: "Complete Recordings", artist: "Charley Patton", genre: "delta", year: 1990, condition: "Near Mint", rarity: "rare", price: 3200, quantity: 4 },
    { id: 3, albumName: "Born Under a Bad Sign", artist: "Albert King", genre: "chicago", year: 1967, condition: "Good", rarity: "rare", price: 2800, quantity: 2 },
    { id: 4, albumName: "Hard Again", artist: "Muddy Waters", genre: "chicago", year: 1977, condition: "Near Mint", rarity: "limited", price: 2200, quantity: 4 },
    { id: 5, albumName: "Live at the Regal", artist: "B.B. King", genre: "chicago", year: 1965, condition: "Mint", rarity: "grail", price: 6800, quantity: 3 },
    { id: 6, albumName: "Texas Flood", artist: "Stevie Ray Vaughan", genre: "texas", year: 1983, condition: "Near Mint", rarity: "limited", price: 1800, quantity: 4 },
    { id: 7, albumName: "From the Cradle", artist: "Eric Clapton", genre: "chicago", year: 1994, condition: "Near Mint", rarity: "common", price: 1200, quantity: 6 },
    { id: 8, albumName: "Blues Breakers", artist: "John Mayall & Eric Clapton", genre: "chicago", year: 1966, condition: "Good", rarity: "grail", price: 5200, quantity: 4 }
];

// ========== AUTH ENDPOINTS ==========
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date()
        };
        
        users.push(user);
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: { id: user.id, username, email }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ========== RECORDS API ==========
app.get('/api/records', (req, res) => {
    res.json(vinylRecords);
});

app.get('/api/records/:id', (req, res) => {
    const record = vinylRecords.find(r => r.id === parseInt(req.params.id));
    if (!record) {
        return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║      THE 33RD Y - Vinyl Vault         ║
    ║     Secure API - Version 2.0          ║
    ╚═══════════════════════════════════════╝
    `);
    console.log('🚀 Server Status:');
    console.log(`   📡 Port: ${PORT}`);
    console.log(`   ⏰ Started: ${new Date().toLocaleTimeString()}`);
    console.log('\n📚 Available Endpoints:');
    console.log('   POST   /api/auth/register');
    console.log('   POST   /api/auth/login');
    console.log('   GET    /api/records');
    console.log('   GET    /api/records/:id');
});