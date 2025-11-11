const express = require('express');
const connectDB = require('./config/db');
const app = express();
const port = 8000;

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
