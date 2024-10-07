const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = require('./src/app');
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('new-task', async (data) => {
        console.log('New Task:', data);
        try {
            // Generate sub-tasks using AI/ML logic
            const subTasks = await require('./src/services/aiService').generateSubTasks(data);
            socket.emit('sub-tasks', subTasks);
        } catch (error) {
            console.error('Error generating sub-tasks:', error);
            socket.emit('error', { message: 'Error generating sub-tasks' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});