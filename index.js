const express = require(`express`);
const path = require(`path`);
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const players = [];

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, `client/index.html`));
});

app.get(`/script.js`, (req, res) => {
  res.sendFile(path.join(__dirname, `client/script.js`));
});

app.get(`/style.css`, (req, res) => {
  res.sendFile(path.join(__dirname, `client/style.css`));
});

app.get(`/favicon.ico`, (req, res) => {
  res.sendFile(path.join(__dirname, `client/favicon.ico`));
});

app.post(`/post`, (req, res) => {
  let data = req.body;
  console.log(data.message);
  console.log(req.socket.remoteAddress)
  res.status(200).json({ message: `Data Received: ` + JSON.stringify(data) });
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});