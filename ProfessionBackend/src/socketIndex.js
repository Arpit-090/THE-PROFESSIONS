import { app } from "./app.js";
import { connectDB } from "./DB/Index.js";
import { Server } from "socket.io";
import {createServer} from "node:http";
import { connectToSocket } from "./sockets/socket.js";

// import dotenv from "dotenv";
import 'dotenv/config';
import cors from 'cors';

const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin: "*",
  },
});
connectToSocket(io);

// Load environment variables
// dotenv.config();

// app.use(cors({
//   origin: 'http://localhost:5173', // your frontend
//   credentials:true
// }));

connectDB()
  .then(() => { 
    const PORT =  3000;
    server.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ MONGO db connection failed !!!", error);
  });



  /*for testing sockets */

//   app.get('/socket', (req, res) => {
//   res.send(`
//     <html>
//       <body>
//         <h1>Socket Test</h1>

//         <script src="/socket.io/socket.io.js"></script>
//         <script>
//           const socket = io();

//           socket.on("connect", () => {
//             console.log("Connected:", socket.id);
//           });
//         </script>
//       </body>
//     </html>
//   `);
// });
 