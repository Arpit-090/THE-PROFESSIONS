// // const mongoose = require('mongoose');
// import { configDotenv } from "dotenv";
import 'dotenv/config'; 

import mongoose from "mongoose";
// async function testQuery() {
//   await mongoose.connect('mongodb+srv://ARPIT:aRPIT_09@cluster0.enjcp.mongodb.net');
//   const User = mongoose.model('User', new mongoose.Schema({ username: String, email: String, password: String }));
//   try {
//     const user = await User.findOne({
//       $or: [{ username: 'arpit_09' }, { email: '232010@kit.ac.in' }]
//     });
//     console.log('User:', user);
//   } catch (err) {
//     console.error('Query error:', err);
//   } finally {
//     await mongoose.connection.close();
//   }
// }
// testQuery();

// const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGOBD_URI);
    // await mongoose.connect('mongodb+srv://ARPIT:aRPIT_09@cluster0.enjcp.mongodb.net/VideoTube?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections);
    const user = await mongoose.connection.db.collection('users').findOne({
      $or: [{ username: 'arpit_09' }, { email: '232010@kit.ac.in' }]
    });
    console.log('Direct query user:', user);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await mongoose.connection.close();
  }
}
testConnection();