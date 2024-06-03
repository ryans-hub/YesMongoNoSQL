const connection = require('../config/connection');
const User = require('../models/User'); // Adjust the path to your User model
const { username, emails } = require('./data'); // Adjust the path to your data file

connection.on('error', (err) => console.error(err));

connection.once('open', async () => {
  console.log('connected');

  // Delete the collections if they exist
  const userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  // Create user objects
  const users = username.map((username, index) => ({
    username,
    email: emails[index],
    thoughts: [],
    friends: []
  }));

  // Insert users into the database
  try {
    await User.insertMany(users);
    console.log('Data seeded successfully');
    console.table(users);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
});
