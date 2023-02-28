const express = require('express');
const expressLess = require('express-less');
const path = require('path');
const fs = require('fs');
const colors = require("./string.js");
const app = express();
app.set('view engine', 'ejs');
app.use('/TrollCall/assets', express.static(path.join(__dirname, 'assets')))
app.use('/TrollCall/assets/styles', expressLess(path.join(__dirname, 'assets', 'less')));
var zodiacShit = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "ZODIAC_SHIT.json"), 'utf8'));

app.get('/TrollCall/submit/', (req, res) => {
  res.render('submissions', {
    zodiac: JSON.stringify(zodiacShit)
  });
});

app.listen(5500);