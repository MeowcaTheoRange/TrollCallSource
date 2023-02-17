import * as color from "/TrollCall/assets/scripts/color.js";

var tag = document.createElement("div");
tag.innerHTML = `<div class="label"></div>
<div class="name">minecraft:</div><canvas id="processingCanvas" hidden></canvas>`;
tag.classList.add("hoverlabel");
document.body.appendChild(tag);
var tagElements = {
  label: tag.querySelector("div.label"),
  name: tag.querySelector("div.name")
};
document.querySelector("#colorStuff").innerHTML = `<text>HEX: <text frame code id="HexColor">#000000</text></text>
<text>RGB: <text frame code id="RgbColor">rgb(0, 0, 0)</text></text>`;

document.addEventListener('mousemove', event => {
  tag.style.visibility = "hidden";
  var element = [...document.querySelectorAll(':hover')].slice(-1)[0];
  if (element.tagName.toLowerCase() != "slotobject") return;

  var colors = element.style.backgroundColor.replace(/rgb\(|\)/gm, "").split(", ").map(x => (+x).toString(16).padStart(2, '0')).join("");
  tagElements.label.innerHTML = "#" + colors;
  tagElements.name.innerHTML = element.style.backgroundColor + (element.dataset.specialText ? "<br />" + element.dataset.specialText : "");
  

  if ((event.clientX + tag.offsetWidth) + 16 >= window.innerWidth)
    tag.style.left = ((event.clientX - tag.offsetWidth) - 16) + "px";
  else
    tag.style.left = (event.clientX + 16) + "px";

  if ((event.clientY + tag.offsetHeight) + 16 >= window.innerHeight)
    tag.style.top = ((event.clientY - tag.offsetHeight) - 16) + "px";
  else
    tag.style.top = (event.clientY + 16) + "px";

  tag.style.visibility = "visible";
});
document.body.addEventListener('click', event => {
  var element = [...document.querySelectorAll(':hover')].slice(-1)[0];
  if (element.tagName.toLowerCase() != "slotobject") return;

  var col = element.style.backgroundColor;
  document.querySelector("#HexColor").innerHTML = color.toHex(col);
  document.querySelector("#RgbColor").innerHTML = color.toRGB(col);
  navigator.clipboard.writeText(color.toHex(col));
}, true);
document.body.addEventListener('dblclick', event => {
  var element = [...document.querySelectorAll(':hover')].slice(-1)[0];
  if (element.tagName.toLowerCase() != "slotobject") return;

  var col = element.style.backgroundColor;
  color.themeColor(col, "pri");
  color.themeColor(color.negate(col), "sec");
}, true);