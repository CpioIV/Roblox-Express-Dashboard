const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.use(express.static('public'));

let logs = [];

app.post('/v1/api/joinlogs', (req, res) => {
  const { player, userid, action, timestamp } = req.body;
  if (!player || !userid || !action || !timestamp) {
    return res.status(400).send('Invalid log data');
  }

  logs.push({ player, userid, action, timestamp });
  console.log(`Player: ${player}, UserID: ${userid}, Action: ${action}, Timestamp: ${timestamp}`);
  
  res.status(200).send('Log received');
});

app.get('/v1/api/joinlogs', (req, res) => {
  res.json(logs);
});

app.get('/v1/api/getprofile', async (req, res) => {
  const { userid } = req.query;
  if (!userid) {
    return res.status(400).send('User ID is required');
  }

  try {
    const response = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userid}&size=720x720&format=Png&isCircular=true`);
    const imageUrl = response.data.data && response.data.data[0] && response.data.data[0].imageUrl
      ? response.data.data[0].imageUrl
      : "https://via.placeholder.com/100";

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).send('Error fetching profile image');
  }
});

// go to http://localhost:3000/join_leaveslogs to see it work
app.get('/join_leaveslogs', (req, res) => {
  res.sendFile(__dirname + '/public/joinleavelogs.html');
});

// go to http://localhost:3000/ to also see it work
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/joinleavelogs.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
