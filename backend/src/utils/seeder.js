const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // Optional but helpful
const path = require('path');
const User = require('../models/User');
const Property = require('../models/Property');
const Review = require('../models/Review');
const MatchRequest = require('../models/MatchRequest');
const Report = require('../models/Report');

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connection moved to functions

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: '123456',
        role: 'admin',
        isVerified: true
    },
    {
        name: 'Owner ImVerified',
        email: 'owner1@example.com',
        passwordHash: '123456',
        role: 'owner',
        isVerified: true,
        phone: '1234567890'
    },
    {
        name: 'Owner Pending',
        email: 'owner2@example.com',
        passwordHash: '123456',
        role: 'owner',
        isVerified: false,
        phone: '0987654321'
    },
    {
        name: 'Student One',
        email: 'student1@example.com',
        passwordHash: '123456',
        role: 'student',
        isVerified: true,
        collegeName: 'College A',
        preferences: {
            budget: { min: 5000, max: 10000 },
            cleanliness: 5,
            sleepSchedule: 'early',
            smoking: false,
            drinking: false,
            introvertExtrovert: 4,
            studyHours: 4,
            foodPreference: 'veg',
            genderPreference: 'any'
        }
    },
    {
        name: 'Student Two',
        email: 'student2@example.com',
        passwordHash: '123456',
        role: 'student',
        isVerified: true,
        collegeName: 'College B',
        preferences: {
            budget: { min: 6000, max: 12000 },
            cleanliness: 4,
            sleepSchedule: 'early',
            smoking: false,
            drinking: true,
            introvertExtrovert: 2,
            studyHours: 6,
            foodPreference: 'non-veg',
            genderPreference: 'any'
        }
    },
    {
        name: 'Student Three',
        email: 'student3@example.com',
        passwordHash: '123456',
        role: 'student',
        isVerified: true,
        collegeName: 'College A',
        preferences: {
            budget: { min: 4000, max: 8000 },
            cleanliness: 3,
            sleepSchedule: 'night',
            smoking: true,
            drinking: true,
            introvertExtrovert: 5,
            studyHours: 2,
            foodPreference: 'any',
            genderPreference: 'any'
        }
    }
];

const properties = [
    {
        title: 'Sunny Student Apartment',
        rent: 12000,
        deposit: 24000,
        address: '123 University Ave',
        city: 'Mumbai',
        genderAllowed: 'any',
        amenities: ['WiFi', 'AC', 'Security', 'Power Backup'],
        rules: ['No loud music after 10PM', 'No pets'],
        images: ['/listings/house1.png'],
        verified: true,
        ratingAvg: 4.5,
        ratingCount: 5
    },
    {
        title: 'Cozy PG for Boys',
        rent: 6500,
        deposit: 13000,
        address: '45 Green Park',
        city: 'Pune',
        genderAllowed: 'male',
        amenities: ['WiFi', 'Food', 'Laundry', 'Cleaning'],
        rules: ['No smoking', 'Guests allowed until 8PM'],
        images: ['/listings/house2.png'],
        verified: true,
        ratingAvg: 4.8,
        ratingCount: 12
    },
    {
        title: 'Modern Girls Dormitory',
        rent: 8000,
        deposit: 16000,
        address: '789 Knowledge Park',
        city: 'Delhi',
        genderAllowed: 'female',
        amenities: ['Gym', 'Library', 'Common Area', 'WiFi'],
        rules: ['Curfew 11PM', 'No male guests in rooms'],
        images: ['/listings/house3.png'],
        verified: true,
        ratingAvg: 4.2,
        ratingCount: 8
    }
];

const importData = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected for Seeding');
        }
        await User.deleteMany();
        await Property.deleteMany();
        await Review.deleteMany();
        await MatchRequest.deleteMany();
        await Report.deleteMany();

        const createdUsers = await User.create(users);

        // Assign owners to properties
        const owner1 = createdUsers[1]._id; // Owner ImVerified
        const owner2 = createdUsers[2]._id; // Owner Pending

        const sampleProperties = properties.map((prop, index) => {
            return { ...prop, ownerId: index === 2 ? owner2 : owner1 };
        });

        const createdProperties = await Property.create(sampleProperties);

        // Reviews
        const student1 = createdUsers[3]._id;
        const student2 = createdUsers[4]._id;

        await Review.create([
            {
                propertyId: createdProperties[0]._id,
                userId: student1,
                rating: 4,
                comment: 'Nice place'
            },
            {
                propertyId: createdProperties[1]._id,
                userId: student2,
                rating: 5,
                comment: 'Awesome food'
            }
        ]);

        console.log('Data Imported!');
        // process.exit(); // Only exit if run as script
        if (require.main === module) process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }
        await User.deleteMany();
        await Property.deleteMany();
        await Review.deleteMany();
        await MatchRequest.deleteMany();
        await Report.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

// Export importData for programmatic use
module.exports = { importData, destroyData };

// Only run immediately if called directly
if (require.main === module) {
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
}
