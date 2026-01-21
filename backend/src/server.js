const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { importData } = require('./utils/seeder');

// Load env vars from root of backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(require('./middleware/errorHandler').errorHandler);

const startServer = async () => {
    try {
        // Start In-Memory MongoDB
        console.log('Starting In-Memory MongoDB...');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log(`In-Memory MongoDB started at ${uri}`);

        // Connect to MongoDB
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Seed Data
        try {
            console.log('Seeding initial data...');
            await importData();
            console.log('Seeding complete.');
        } catch (seedError) {
            console.error('Seeding Failed:', seedError.message);
        }

        // Start Server
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Server Startup Error:', err);
    }
};

startServer();
