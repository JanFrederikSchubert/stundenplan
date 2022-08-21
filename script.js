var root = document.querySelector(":root");

var colorPicker = document.getElementById("colorPicker");
var colorDisplay = document.getElementById("colorDisplay");

var backgroundChooser = document.getElementById("background");
var backgroundImage = document.getElementById("backgroundImage");

var accentBoxes = document.querySelectorAll(".box[accent='true']");

var color = DOMPurify.isSupported
  ? DOMPurify.sanitize(localStorage.getItem("color")) !== null &&
    DOMPurify.sanitize(localStorage.getItem("color")) !== "" &&
    DOMPurify.sanitize(localStorage.getItem("color")).length === 7
    ? DOMPurify.sanitize(localStorage.getItem("color"))
    : "#273a13"
  : "#000000";
console.log(DOMPurify.sanitize(localStorage.getItem("color")));

backgroundChooser.addEventListener("change", (event) => {
  let file = event.target.files[0];
  if (file.type && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      backgroundImage.src = event.target.result;
    });
    reader.readAsDataURL(file);
  }
});

colorPicker.oninput = function () {
  if (DOMPurify.isSupported) {
    color = DOMPurify.sanitize(colorPicker.value);
    colorDisplay.style.backgroundColor = DOMPurify.sanitize(color);
    accentBoxes.forEach((element) => {
      element.style.backgroundColor = DOMPurify.sanitize(color);
    });
    if (hexToHSL(DOMPurify.sanitize(color))[2] > 65) {
      accentBoxes.forEach((element) => {
        element.style.color = "#000000";
      });
      root.style.setProperty("--accent-text-color", "#000000");
    } else {
      accentBoxes.forEach((element) => {
        element.style.color = "#ffffff";
      });
      root.style.setProperty("--accent-text-color", "#ffffff");
    }
    localStorage.setItem("color", DOMPurify.sanitize(color));
  }
};

if (DOMPurify.isSupported) {
  colorPicker.value = DOMPurify.sanitize(color);
  colorDisplay.style.backgroundColor = DOMPurify.sanitize(color);
  accentBoxes.forEach((element) => {
    element.style.backgroundColor = DOMPurify.sanitize(color);
  });
  if (hexToHSL(DOMPurify.sanitize(color))[2] > 65) {
    accentBoxes.forEach((element) => {
      element.style.color = "#000000";
    });
    root.style.setProperty("--accent-text-color", "#000000");
  } else {
    accentBoxes.forEach((element) => {
      element.style.color = "#ffffff";
    });
    root.style.setProperty("--accent-text-color", "#ffffff");
  }

  backgroundImage.src = "images/background.png";
}

function hexToHSL(H) {
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}
