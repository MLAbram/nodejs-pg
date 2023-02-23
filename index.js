const express = require('express');
const app = express();
const v1_contacts = require('./routes/v1_contacts');

app.use(express.json());
app.use('/api/v1', v1_contacts);

// redirect
app.get('*', (req, res) => {
  res.redirect('https://dynamismconsulting.com/');
});

app.listen(3000, () => {
  console.log('Server listening on port: 3000.');
});