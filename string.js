String.prototype.toFirstUpperCase = function () {
  var arr = this.toLowerCase().split("");
  arr.unshift(arr.shift().toUpperCase());
  return arr.join("");
}

String.prototype.toAllUpperCase = function () {
  return this.split(" ").map(x => x.toFirstUpperCase()).join(" ");
}

String.prototype.toFirstLastUpperCase = function () {
  var x = this.split(" ")
  x[0] = x[0].toFirstUpperCase();
  x[x.length - 1] = x[x.length - 1].toFirstUpperCase();
  return x.join(" ");
}

String.prototype.toFirstLowerCase = function () {
  var arr = this.toUpperCase().split("");
  arr.unshift(arr.shift().toLowerCase());
  return arr.join("");
}

String.prototype.toAllLowerCase = function () {
  return this.split(" ").map(x => x.toFirstLowerCase()).join(" ");
}

String.prototype.toStupidCase = function (mindSpaces) {
  if (mindSpaces)
  return this.split(" ").map(x => x.split("").map((x, i) => i % 2 === 0 ? x.toLowerCase() : x.toUpperCase()).join("")).join(" ");
  return this.split("").map((x, i) => i % 2 === 0 ? x.toLowerCase() : x.toUpperCase()).join("");
}

String.prototype.randomReplace = function (weight, regex, replacement) {
  if (Math.random() < weight) return this.replace(new RegExp(regex, "gm"), replacement);
  else return this;
}

//math

const clamp = (n, mi, ma) => Math.max(mi, Math.min(n, ma));
function convertColor (color) {
  if (Array.isArray(color)) return color;
  else if (color.startsWith("rgb(")) return color.replace(/rgb\(|\)/gm, "").split(", ").map(x => parseInt(x));
  else if (color.startsWith("#")) return [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
}
function toHex (color) {
  return `#${convertColor(color).map(x => x.toString(16).padStart(2, "0")).join("")}`;
}
function toRGB (color) {
  return `rgb(${convertColor(color).join(", ")})`;
}

//adjustment

function lightness(col, amt, lighter) {
  var colorArray = convertColor(col);
  var newColor;
  if (lighter)
    newColor = [
      clamp(Math.round(+colorArray[0] + ((amt / 100) * (255 - +colorArray[0]))), 0, 255),
      clamp(Math.round(+colorArray[1] + ((amt / 100) * (255 - +colorArray[1]))), 0, 255),
      clamp(Math.round(+colorArray[2] + ((amt / 100) * (255 - +colorArray[2]))), 0, 255)
    ];
  else
    newColor = [
      clamp(Math.round(+colorArray[0] - ((amt / 100) * +colorArray[0])), 0, 255),
      clamp(Math.round(+colorArray[1] - ((amt / 100) * +colorArray[1])), 0, 255),
      clamp(Math.round(+colorArray[2] - ((amt / 100) * +colorArray[2])), 0, 255)
    ];
  return "rgb(" + newColor.join(", ") + ")";
}
function negate(col) {
  var colorArray = convertColor(col);
  return "rgb(" + colorArray.map(x => 255 - x).join(", ") + ")";
}
function themeColor(col, label) {
  var string = "";
  for (let i = 0; i <= 10; i++) {
    string += `--${label}${i * 10}: ${lightness(col, Math.abs((i - 5) * 20), i > 5)};`;
  }
  return string;
}

module.exports = {
  convertColor, toHex, toRGB, lightness, negate, themeColor
}