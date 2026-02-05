require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Notebook = require('../models/Notebook');
const Blog = require('../models/Blog');
const Task = require('../models/Task');
const Counter = require('../models/Counter');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collab-notes-aut');

const seedData = async () => {
    try {
        await User.deleteMany();
        await Notebook.deleteMany();
        await Blog.deleteMany();
        await Task.deleteMany();
        await Counter.deleteMany();

        // Create Users
        const user1 = await User.create({
            email: 'user1@example.com',
            password: 'password123'
        });

        const user2 = await User.create({
            email: 'user2@example.com',
            password: 'password123'
        });

        // Create Notebooks
        const nb1 = await Notebook.create({
            name: 'User 1 - Notebook 1',
            owner: user1._id
        });

        const nb2 = await Notebook.create({
            name: 'User 2 - Notebook 1',
            owner: user2._id,
            isArchived: true
        });

        // Create Blogs
        const blog1 = await Blog.create({
            title: 'Meeting Blogs',
            content: 'Discussed project roadmap.',
            notebookId: nb1._id
        });

        const blog2 = await Blog.create({
            title: 'Idea Brainstorm',
            content: 'Ideas for new feature set.',
            notebookId: nb1._id
        });

        // Create Tasks
        const task1 = await Task.create({
            description: 'Finish documentation for API endpoints',
            status: 'OPEN',
            notebookId: nb1._id
        });

        const task2 = await Task.create({
            description: 'Email client about new proposal',
            status: 'DONE',
            notebookId: nb1._id
        });

        const task3 = await Task.create({
            description: 'Review security patch',
            status: 'OPEN',
            notebookId: nb2._id
        });

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Notebook.deleteMany();
        await Blog.deleteMany();
        await Task.deleteMany();
        await Counter.deleteMany();

        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    seedData();
}