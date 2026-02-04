require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Notebook = require('../models/Notebook');
const Note = require('../models/Note');
const Task = require('../models/Task');
const AuditLog = require('../models/AuditLog'); // Added AuditLog model

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collab-notes-aut');

const seedData = async () => {
    try {
        await User.deleteMany();
        await Notebook.deleteMany();
        await Note.deleteMany();
        await Task.deleteMany();
        await AuditLog.deleteMany(); // Delete existing AuditLogs

        // Create Users
        const admin = await User.create({
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN'
        });

        const user1 = await User.create({
            email: 'user1@example.com',
            password: 'password123',
            role: 'USER'
        });

        const user2 = await User.create({
            email: 'user2@example.com',
            password: 'password123',
            role: 'USER'
        });

        // Create Notebooks
        const nb1 = await Notebook.create({
            name: 'Project Alpha',
            owner: user1._id
        });

        const nb2 = await Notebook.create({
            name: 'Personal Notes',
            owner: user1._id,
            isArchived: true
        });

        const nb3 = await Notebook.create({
            name: 'Admin Tasks',
            owner: admin._id
        });

        // Create Notes
        const note1 = await Note.create({
            title: 'Meeting Notes',
            content: 'Discussed project roadmap.',
            notebookId: nb1._id,
            tags: ['meeting', 'work']
        });

        const note2 = await Note.create({
            title: 'Idea Brainstorm',
            content: 'Ideas for new feature set.',
            notebookId: nb1._id,
            tags: ['idea', 'feature']
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
            notebookId: nb3._id
        });

        // Create Audit Logs
        await AuditLog.create({
            entity: 'User',
            action: 'CREATE',
            userId: admin._id,
            details: { email: admin.email, role: admin.role }
        });

        await AuditLog.create({
            entity: 'Notebook',
            action: 'CREATE',
            userId: user1._id,
            details: { name: nb1.name, owner: user1.email }
        });

        await AuditLog.create({
            entity: 'Note',
            action: 'CREATE',
            userId: user1._id,
            details: { title: note1.title, notebook: nb1.name }
        });

        await AuditLog.create({
            entity: 'Task',
            action: 'UPDATE',
            userId: user1._id,
            details: { taskId: task2._id, oldStatus: 'OPEN', newStatus: 'DONE' }
        });

        await AuditLog.create({
            entity: 'User',
            action: 'LOGIN',
            userId: user1._id,
            details: { email: user1.email }
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
        await Note.deleteMany();
        await Task.deleteMany();
        await AuditLog.deleteMany(); // Delete existing AuditLogs

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