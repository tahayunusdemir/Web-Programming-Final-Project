const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    {
        username: 'client',
        email: 'client@example.com',
        password: 'password123',
        role: 'Client',
    },
    {
        username: 'technician',
        email: 'tech@example.com',
        password: 'password123',
        role: 'Technician',
    },
    {
        username: 'manager',
        email: 'manager@example.com',
        password: 'password123',
        role: 'Operations Manager',
    },
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/web-project';

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected for seeding');

        await User.deleteMany({});
        console.log('Existing users removed');

        // Loop through users and save them individually to trigger the 'pre-save' hook
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
        }
        
        console.log('Users have been added with hashed passwords');

        mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

seedDB(); 