const connectToSocket = (io) => {
  // ✅ FIXED: Moved OUTSIDE io.on("connection") so it persists across all sockets
  // ✅ FIXED: Use {} (object) instead of [] (array) for string-keyed maps
  const userSocketMap = {};

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User joins with their userId → map userId to socketId
    socket.on("join", (userId) => {
      userSocketMap[userId] = socket.id;
      socket.userId = userId;
      socket.join(userId);
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // Caller notifies callee of incoming call
    socket.on("call-user", ({ to, from, roomID }) => {
      io.to(to).emit("incoming-call", { from, roomID });
      console.log(`Call from ${from} to ${to}, room: ${roomID}`);
    });

    // Message relay
    socket.on("send-message", ({ to, from, message }) => {
      io.to(to).emit("receive-message", { from, message });
    });

    // ✅ Relay WebRTC offer to target user
    socket.on("offer", ({ to, offer }) => {
      const targetSocket = userSocketMap[to];
      if (targetSocket) {
        io.to(targetSocket).emit("offer", { from: socket.userId, offer });
        console.log(`Offer relayed from ${socket.userId} to ${to}`);
      } else {
        console.warn(`offer: Target user ${to} not found in map`);
      }
    });

    // ✅ Relay WebRTC answer back to caller
    socket.on("answer", ({ answer, to }) => {
      const targetSocket = userSocketMap[to];
      if (targetSocket) {
        io.to(targetSocket).emit("answer", { from: socket.userId, answer });
        console.log(`Answer relayed from ${socket.userId} to ${to}`);
      } else {
        console.warn(`answer: Target user ${to} not found in map`);
      }
    });

    // ✅ Relay ICE candidates between peers
    socket.on("ice-condidate", ({ to, candidate }) => {
      const targetSocket = userSocketMap[to];
      if (targetSocket) {
        io.to(targetSocket).emit("ice-condidate", {
          candidate,
          from: socket.userId,
        });
      } else {
        console.warn(`ICE: Target user ${to} not found in map`);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // ✅ Clean up on disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        delete userSocketMap[socket.userId];
        console.log(`User ${socket.userId} disconnected and removed from map`);
      }
    });
  });
};

export { connectToSocket };