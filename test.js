const express = require('express');
const expressLess = require('express-less');
const path = require('path');
const fs = require('fs');
const colors = require("./string.js");
const app = express();
app.set('view engine', 'ejs');
app.use('/TrollCall/assets', express.static(path.join(__dirname, 'assets')))
app.use('/TrollCall/characters', express.static(path.join(__dirname, 'characters')))
app.use('/TrollCall/assets/styles', expressLess(path.join(__dirname, 'assets', 'less')));
var zodiacShit = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "ZODIAC_SHIT.json"), 'utf8'));
var getCharacter = (character) => {
  var main = JSON.parse(fs.readFileSync(path.join(__dirname, "characters", character, "desc.json"), 'utf8'));
  main.identity.usernameShort = main.identity.username.split(/(?=[A-Z])/).map(x => x[0]).join("").toUpperCase();
  return {
    "char": character,
    "main": main,
    "about": fs.readFileSync(path.join(__dirname, "characters", character, "about.txt"), 'utf8').split("\n"),
    "zodiac": zodiacShit[main.identity.sign.caste],
    "policies": {"yes": "done", "ask": "question_mark", "no": "close"},
    "quirkify": (x, quiet) => {
      var text = x;
      main[quiet ? "quirksQuiet": "quirks"]?.regexes?.forEach(regex => {
        text = text.replace(new RegExp(regex[0], "gm"), regex[1]);
      });
      main[quiet ? "quirksQuiet": "quirks"]?.functions?.forEach(func => {
        text = String.prototype[func[0]].apply(text, func[1]);
      });
      return text;
    }
  };
}
var getPester = (pester) => {
  var log = fs.readFileSync(path.join(__dirname, "pesterlogs", pester + ".txt"), 'utf8');
  var logJSON = [];
  var charsQuirks = {};
  var logSpl = log.split("\n----\n"); // Split between char def and rest of log.
  var chars = logSpl[0].split(" > ");

  chars.forEach(character => {
    var them = JSON.parse(fs.readFileSync(path.join(__dirname, "characters", character, "desc.json"), 'utf8'));
    charsQuirks[character] = {
      "quirks": them.quirks, 
      "quirksQuiet": them.quirksQuiet,
      "name": them.identity.username,
      "nameshort": them.identity.username.split(/(?=[A-Z])/).map(x => x[0]).join("").toUpperCase(),
      "caste": them.identity.sign.caste
    };
  })

  logSpl[1].split("\n").forEach(xlog => {
    var thing = xlog.split(": ");

    logJSON.push({
      "character": thing[0].replace(/~/g, ""),
      "whispering": thing[0].includes("~"),
      "text": thing[1]
    });
  });

  return {
    "name": pester,
    "zodiac": zodiacShit,
    "chars": charsQuirks,
    "charsList": chars,
    "list": logJSON,
    "quirkify": (char, x, quiet) => {
      var text = x;
      charsQuirks[char][quiet ? "quirksQuiet": "quirks"]?.regexes?.forEach(regex => {
        text = text.replace(new RegExp(regex[0], "gm"), regex[1]);
      });
      charsQuirks[char][quiet ? "quirksQuiet": "quirks"]?.functions?.forEach(func => {
        text = String.prototype[func[0]].apply(text, func[1]);
      });
      return text;
    }
  };
}

app.get('/TrollCall/', (req, res) => {
  var array = fs.readFileSync(path.join(__dirname, "assets", "list.txt"), "utf-8");
  var logs = fs.readFileSync(path.join(__dirname, "assets", "logs.txt"), "utf-8").split("\n").map(x => x.split(" | "));
  var map = {};
  array.split("\n").map(x => x.split(" | ")).forEach(x => {
    if (!map[x[2]]) map[x[2]] = [];
    map[x[2]].push(x);
  });
  res.render('index', { 
    array: Object.entries(map), 
    logs,
    zodiac: zodiacShit,
    colors,
    query: {
      sort: false
    }
  }); // TODO: get list of folders, then put it in page
});
app.get('/TrollCall/blood/', (req, res) => {
  var array = fs.readFileSync(path.join(__dirname, "assets", "list.txt"), "utf-8");
  var logs = fs.readFileSync(path.join(__dirname, "assets", "logs.txt"), "utf-8").split("\n").map(x => x.split(" | "));
  var map = {};
  array.split("\n").map(x => x.split(" | ")).forEach(x => {
    if (!map[x[3]]) map[x[3]] = [];
    map[x[3]].push(x);
  });
  res.render('index', { 
    array: Object.entries(map).sort((a, b) => zodiacShit[a[0]].sort - zodiacShit[b[0]].sort), 
    logs,
    zodiac: zodiacShit,
    colors,
    query: {
      sort: true
    }
  }); // TODO: get list of folders, then put it in page
});
app.get('/TrollCall/char/:char', (req, res) => {
   res.render('character', getCharacter(req.params.char));
   // TODO: draggy waggy thing (tooltip on hover (just take it from the old website (it's super easy (requires JS though (oh well)))))
});
app.get('/TrollCall/pester/:pester', (req, res) => {
   res.render('pester', getPester(req.params.pester));
});

app.listen(5500);