const connection = require('../config/connection');
const User = require('../models/User');
const Thought = require('../models/Thought');
const { username, emails, thoughts } = require('./data');

connection.on('error', (err) => console.error(err));

connection.once('open', async () => {
  console.log('connected');

  // Delete the collections if they exist
  const userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }

  const thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection('thoughts');
  }

  // Insert thoughts into the database
  const thoughtDocs = await Thought.insertMany(thoughts.map(text => ({ thoughtText: text, username: 'anonymous' })));
  const thoughtIds = thoughtDocs.map(doc => doc._id);

  // Get the thought text for each thought ObjectId
  const thoughtTexts = {};
  thoughtDocs.forEach(doc => {
    thoughtTexts[doc._id.toString()] = doc.thoughtText;
  });

  // Create user objects
  const users = username.map((username, index) => ({
    username,
    email: emails[index],
    thoughts: [thoughtTexts[thoughtIds[index % thoughtIds.length]]], // Assigning actual thought text
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
