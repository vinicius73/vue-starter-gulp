const path = require('path');
const express = require('express');
const app = express();

const distPath = (value) => path.join(__dirname, 'dist', value || '');

app.use(express.static(distPath()));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: distPath() });
});

app.listen(3000, () => {
  console.log('dev server started in http://localhost:3000');
});
