let socket = io("http://localhost:3000");

console.log(socket);

var rand = Math.random() * 109;

socket.on("connect", () => {
    socket.emit("join", rand); // instead of random pass user_id here
    console.log("socket connected");
});