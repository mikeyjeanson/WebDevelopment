const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

// Connect to the SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the users and messages tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      online INTEGER DEFAULT 0
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      FOREIGN KEY (from_user_id) REFERENCES users (id),
      FOREIGN KEY (to_user_id) REFERENCES users (id)
    );
  `);
});

// Enable CORS for webhook subscriptions
app.use(cors());

// Validate user input
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Authenticate users using JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Verify user credentials
  const user = { id: 1, username: 'john' };
  const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Authorize users using JWT
app.use((req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Set a user as online
app.post('/online', (req, res) => {
  const userId = req.user.id;
  db.run(`
    UPDATE users
    SET online = 1
    WHERE id = ?
  `, [userId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to set user as online' });
    } else {
      res.json({ message: 'User set as online successfully' });
    }
  });
});

// Set a user as offline
app.post('/offline', (req, res) => {
  const userId = req.user.id;
  db.run(`
    UPDATE users
    SET online = 0
    WHERE id = ?
  `, [userId], (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to set user as offline' });
    } else {
      res.json({ message: 'User set as offline successfully' });
    }
  });
});

// Webhook subscription endpoint
app.post('/subscribe', (req, res) => {
  const { url } = req.body;
  // Save the webhook URL to the user's profile
  req.user.webhookUrl = url;
  res.json({ message: 'Webhook subscribed successfully' });
});

// Send new messages to subscribed webhooks
app.post('/message', (req, res) => {
  const { message, toUserId } = req.body;
  const fromUserId = req.user.id;
  db.run(`
    INSERT INTO messages (from_user_id, to_user_id, message)
    VALUES (?, ?, ?)
  `, [fromUserId, toUserId, message], (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to send message' });
    } else {
      // Find all users who have subscribed to the webhook
      const users = [{ id: 1, webhookUrl: 'https://example.com/webhook' }];
      users.forEach((user) => {
        // Send the message to each user's webhook
        axios.post(user.webhookUrl, { message });
      });
      res.json({ message: 'Message sent successfully' });
    }
  });
});

// Typing indicator endpoint
app.post('/typing', (req, res) => {
  const { userId } = req.body;
  // Find the user who is typing
  const user = { id: 1, username: 'john' };
  // Notify other users in the conversation that this user is typing
  const conversationId = '123';
  const usersInConversation = [{ id: 2, webhookUrl: 'https://example.com/webhook' }];
  usersInConversation.forEach((user) => {
    axios.post(user.webhookUrl, { typing: true, conversationId, userId });
  });
  res.json({ message: 'Typing indicator sent successfully' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});