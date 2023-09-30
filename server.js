import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }, // pass here the base_url of your app
});

//global vars
global.io;
global.onlineUsers = [];


const addUser = async (user, socket) => {
    const index = global.onlineUsers.findIndex((exUser) => {
        return exUser.user.id == user.id;
    });

    if (index == -1) {
        global.onlineUsers.push({
            user,
            socket,
        });
    } else {
        global.onlineUsers[index].socket = socket;
    }
    console.log(global.onlineUsers);
};

const removeUser = async (socket) => {
    const removedUser = global.onlineUsers.find((exUser) => {
        return exUser.socket == socket;
    });
    global.onlineUsers = global.onlineUsers.filter((exUser) => {
        return exUser.socket !== socket;
    });
    console.log("removed user", removedUser);
};

io.on("connection", (socket) => {
    console.log("connected to socket", socket.id);
    // console.log("connected to socket");
    io.to(socket.id).emit("reconnect", socket.id);
    socket.on("join", (data) => {
        console.log("join was called");
        addUser(data, socket.id);
    });
    socket.on("logout", () => {
        removeUser(socket.id);
    });

    socket.on("disconnect", (socket) => {
        removeUser(socket.id);
        console.log("user disconnected", socket.id);
    });
});

const port = 3000;

server.listen(port, () => {
    console.log("Server is running. Port: " + port);
});
