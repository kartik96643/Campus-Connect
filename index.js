const express = require('express');
const connectToMongo = require('./connection');
const path = require('path')
require('dotenv').config()

const http = require('http')
const {Server} = require('socket.io')
const Chat = require('./models/chat')

const userRoute = require('./routes/user')
const homeRoute = require('./routes/homeRoute');
const adminRoute = require('./routes/adminRoute')
const complaintRoute = require('./routes/complaintRoute')
const chatRoute = require('./routes/chatRoute')
const lafRoute = require('./routes/lostAndFound')

const { checkCookieToken } = require('./middleware/auth');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server)


const PORT = process.env.PORT || 3000

connectToMongo(process.env.MONGO_URI)

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(checkCookieToken('token'))
app.use('/uploads', express.static('uploads'))


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use('/user', userRoute)
app.use('/', homeRoute)
app.use('/admin',adminRoute)
app.use('/complaint', complaintRoute)
app.use('/chat', chatRoute)
app.use('/lostandfound', lafRoute)


let onlineUsers = {}
io.on("connection", (socket)=>{
    console.log("User Connected: ", socket.id);

    socket.on('registered', (userId)=>{
        onlineUsers[userId] = socket.id
        console.log(" Registered: user id " + userId + "and socket id is " + socket.id)
    })

    console.log(onlineUsers)
    socket.on("privateMessage", async({ senderId, receiverId, message }) => {
    const receiverSocketId = onlineUsers[receiverId];
    console.log(onlineUsers,"online")

     await Chat.create({ senderId, receiverId, message ,isRead:false});
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("privateMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });


});


server.listen(PORT, ()=> console.log("Server started at port:3000",PORT))