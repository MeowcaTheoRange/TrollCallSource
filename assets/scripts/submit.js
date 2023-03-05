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