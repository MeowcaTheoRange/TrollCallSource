var username = document.querySelector("#username");
var usernameShort = document.querySelector("#username2");
usernameShort.onclick = () => {
  username.focus();
};

username.onkeyup = () => {
  usernameShort.value = `[${username.value.split(/(?=[A-Z])/).map(x => x[0]).join("").toUpperCase().slice(0, 2).padEnd(2, " ")}]`;
  username.style.width = username.value.length + "ch";
}; username.onkeyup();

var years = document.querySelector("#years");
var sweeps = document.querySelector("#sweeps");
years.onkeyup = () => {
  sweeps.value = (years.value / 2.166666666).toFixed(2).toString();
};
sweeps.onkeyup = () => {
  years.value = (sweeps.value * 2.166666666).toFixed(2).toString();
};

var temps = {
  "#LovesThing": `<select name="artare">
  <option value="loves">Loves</option>
  <option value="likes">Likes</option>
  <option selected value="neutral">Neutral</option>
  <option value="dislikes">Dislikes</option>
  <option value="hates">Hates</option>
</select> <input span type="text" name="ldpos" bg placeholder="Item..." />`,
  "#OwnerThing": `<input span type="text" name="ownername" bg placeholder="Name..." /> <input span type="text" name="ownerurl" bg placeholder="URL..." />`
}

function newElemetnThing(elemmm) {
  var ele = document.createElement("text");
  ele.setAttribute('span', "");
  ele.innerHTML = temps[elemmm];
  document.querySelector(elemmm).appendChild(ele);
}
function lessElemetnThing(elemmm) {
  var parent = document.querySelector(elemmm)
  parent.removeChild(parent.lastChild);
}