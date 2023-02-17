//math

const clamp = (n, mi, ma) => Math.max(mi, Math.min(n, ma));

export function convertColor (color) {
  if (Array.isArray(color)) return color;
  else if (color.startsWith("rgb(")) return color.replace(/rgb\(|\)/gm, "").split(", ").map(x => parseInt(x));
  else if (color.startsWith("#")) return [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
}

export function toHex (color) {
  return `#${convertColor(color).map(x => x.toString(16).padStart(2, "0")).join("")}`;
}

export function toRGB (color) {
  return `rgb(${convertColor(color).join(", ")})`;
}

//adjustment

export function lightness(col, amt, lighter) {
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

export function negate(col) {
  var colorArray = convertColor(col);
  return "rgb(" + colorArray.map(x => 255 - x).join(", ") + ")";
}

//theming

export function themeColor(col, label) {
  for (let i = 0; i <= 10; i++) {
    document.documentElement.style.setProperty(`--${label}${i * 10}`, lightness(col, Math.abs((i - 5) * 20), i > 5));
  }
}