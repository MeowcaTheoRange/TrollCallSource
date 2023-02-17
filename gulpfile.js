const { src, dest, parallel, series } = require('gulp');
var ejs = require("gulp-ejs");
var less = require("gulp-less");
var rename = require("gulp-rename");
const colors = require("./string.js");
var fs = require("fs");

var zodiacShit = JSON.parse(fs.readFileSync("assets/ZODIAC_SHIT.json", 'utf8'));
var getPester = (pester) => {
  
}


async function EJS(cb) {
  var dirs = fs.readdirSync(__dirname + "/characters/");
  dirs.forEach((character) => {
    var main = JSON.parse(fs.readFileSync("characters/" + character + "/desc.json", 'utf8'));
    main.identity.usernameShort = main.identity.username.split(/(?=[A-Z])/).map(x => x[0]).join("").toUpperCase();
    return src("views/character.ejs")
      .pipe(ejs({
        "char": character,
        "main": main,
        "about": fs.readFileSync("characters/" + character + "/about.txt", 'utf8').split("\n"),
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
      }, {async: true}))
      .pipe(rename({
        dirname: character,
        basename: "index",
        extname: ".html"
      }))
      .pipe(dest("../TrollCall/char"));
  });
  cb();
}

async function EJSPester(cb) {
  var dirs = fs.readdirSync(__dirname + "/pesterlogs/");
  dirs.forEach((pester) => {
    pester = pester.replace(/\..*$/g, "");
    var log = fs.readFileSync("pesterlogs/" + pester + ".txt", 'utf8');
    var logJSON = [];
    var charsQuirks = {};
    var logSpl = log.split("\n----\n"); // Split between char def and rest of log.
    var chars = logSpl[0].split(" > ");

    chars.forEach(character => {
      var them = JSON.parse(fs.readFileSync("characters/" + character + "/desc.json", 'utf8'));
      charsQuirks[character] = {
        "quirks": them.quirks, 
        "quirksQuiet": them.quirksQuiet,
        "name": them.identity.username,
        "nameshort": them.identity.username.split(/(?=[A-Z])/).map(x => x[0]).join("").toUpperCase(),
        "caste": them.identity.sign.caste
      };
    })

    logSpl[2].split("\n").forEach(xlog => {
      var thing = xlog.split(": ");

      logJSON.push({
        "character": thing[0].replace(/~/g, ""),
        "whispering": thing[0].includes("~"),
        "text": thing[1]
      });
    });

    return src("views/pester.ejs")
      .pipe(ejs({
        "name": pester,
        "before": logSpl[1],
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
      }, {async: true}))
      .pipe(rename({
        dirname: pester,
        basename: "index",
        extname: ".html"
      }))
      .pipe(dest("../TrollCall/pester"));
  });
  cb();
}

function LESS(cb) {
  return src('assets/less/*.less')
    .pipe(less({
      paths: [ "assets/styles" ]
    }))
    .pipe(dest('../TrollCall/assets/styles'));
}

function images(cb) {
  return src('assets/images/*')
    .pipe(dest('../TrollCall/assets/images'));
}

function scripts(cb) {
  return src('assets/scripts/*')
    .pipe(dest('../TrollCall/assets/scripts'));
}

function styles(cb) {
  return src('assets/styles/*')
    .pipe(dest('../TrollCall/assets/styles'));
}

function pics(cb) {
  return src('characters/*/*.png')
    .pipe(dest('../TrollCall/characters/'));
}

async function index(cb) {
  var array = fs.readFileSync("assets/list.txt", "utf-8");
  var logs = fs.readFileSync(__dirname + "/assets/logs.txt", "utf-8").split("\n").map(x => x.split(" | "));
  var map = {};
  array.split("\n").map(x => x.split(" | ")).forEach(x => {
    if (!map[x[2]]) map[x[2]] = [];
    map[x[2]].push(x);
  });
  return src('views/index.ejs')
    .pipe(ejs({ 
      array: Object.entries(map), 
      logs,
      zodiac: zodiacShit,
      colors,
      query: {
        sort: false
      }
    }, {async: true}))
    .pipe(rename({
      dirname: "",
      basename: "index",
      extname: ".html"
    }))
    .pipe(dest("../TrollCall/"));
}

async function blood(cb) {
  var array = fs.readFileSync("assets/list.txt", "utf-8");
  var logs = fs.readFileSync("assets/logs.txt", "utf-8").split("\n").map(x => x.split(" | "));
  var map = {};
  array.split("\n").map(x => x.split(" | ")).forEach(x => {
    if (!map[x[3]]) map[x[3]] = [];
    map[x[3]].push(x);
  });
  return src('views/index.ejs')
    .pipe(ejs({ 
      array: Object.entries(map).sort((a, b) => zodiacShit[a[0]].sort - zodiacShit[b[0]].sort), 
      logs,
      zodiac: zodiacShit,
      colors,
      query: {
        sort: true
      }
    }, {async: true}))
    .pipe(rename({
      dirname: "",
      basename: "index",
      extname: ".html"
    }))
    .pipe(dest("../TrollCall/blood/"));
}

exports.default = parallel(EJS, EJSPester, styles, LESS, images, scripts, pics, index, blood);
