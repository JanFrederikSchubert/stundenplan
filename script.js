var root = document.documentElement;

var colorPicker = document.getElementById("colorPicker");
var borderRadiusPicker = document.getElementById("borderRadiusPicker");
var amountOfRows = document.getElementById("amountOfRows");
var clear = document.getElementById("clear");
var printButton = document.getElementById("print");

var backgroundChooser = document.getElementById("background");
var backgroundImage = document.getElementById("backgroundImage");

var editableBoxes = document.querySelectorAll("[contenteditable='true']");

var color = DOMPurify.isSupported
  ? DOMPurify.sanitize(localStorage.getItem("color")) !== null &&
    DOMPurify.sanitize(localStorage.getItem("color")) !== "" &&
    DOMPurify.sanitize(localStorage.getItem("color")).length === 7
    ? DOMPurify.sanitize(localStorage.getItem("color"))
    : "#000000"
  : "#000000";
var borderRadius = DOMPurify.isSupported
  ? DOMPurify.sanitize(localStorage.getItem("border-radius")) !== null &&
    DOMPurify.sanitize(localStorage.getItem("border-radius")) !== "" &&
    DOMPurify.sanitize(localStorage.getItem("border-radius")) >= 0 &&
    DOMPurify.sanitize(localStorage.getItem("border-radius")) <= 33
    ? Number(DOMPurify.sanitize(localStorage.getItem("border-radius")))
    : 10
  : 10;
var rows = DOMPurify.isSupported
  ? DOMPurify.sanitize(localStorage.getItem("rows")) !== null &&
    DOMPurify.sanitize(localStorage.getItem("rows")) !== "" &&
    (DOMPurify.sanitize(localStorage.getItem("rows")) == 3 ||
      DOMPurify.sanitize(localStorage.getItem("rows")) == 4 ||
      DOMPurify.sanitize(localStorage.getItem("rows")) == 5)
    ? Number(DOMPurify.sanitize(localStorage.getItem("rows")))
    : 4
  : 4;

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

editableBoxes.forEach((element) => {
  element.oninput = function () {
    if (DOMPurify.isSupported) {
      if (DOMPurify.sanitize(element.innerHTML) === "") {
        element.innerHTML = "<br>";
      }
    }
  };
});

colorPicker.oninput = function () {
  if (DOMPurify.isSupported) {
    color = DOMPurify.sanitize(colorPicker.value);
    root.style.setProperty("--background-color", DOMPurify.sanitize(color));
    if (hexToHSL(DOMPurify.sanitize(color))[2] > 65) {
      root.style.setProperty("--accent-text-color", "#000000");
    } else {
      root.style.setProperty("--accent-text-color", "#ffffff");
    }
    localStorage.setItem("color", DOMPurify.sanitize(color));
  }
};

borderRadiusPicker.oninput = function () {
  if (DOMPurify.isSupported) {
    borderRadius = Number(DOMPurify.sanitize(borderRadiusPicker.value));
    root.style.setProperty(
      "--border-radius",
      DOMPurify.sanitize(borderRadius + "px")
    );
    root.style.setProperty(
      "--border-radius-print",
      DOMPurify.sanitize(borderRadius / 10 + "vw")
    );
    localStorage.setItem("border-radius", borderRadius);
  }
};

amountOfRows.onchange = function () {
  if (DOMPurify.isSupported) {
    rows = Number(DOMPurify.sanitize(amountOfRows.value));
    localStorage.setItem("rows", Number(DOMPurify.sanitize(rows)));
    if (Number(DOMPurify.sanitize(rows)) === 3) {
      document.getElementById("row4").setAttribute("show", false);
      document.getElementById("row5").setAttribute("show", false);
    } else if (Number(DOMPurify.sanitize(rows)) === 4) {
      document.getElementById("row4").setAttribute("show", true);
      document.getElementById("row5").setAttribute("show", false);
    } else {
      document.getElementById("row4").setAttribute("show", true);
      document.getElementById("row5").setAttribute("show", true);
    }
  }
};

if (DOMPurify.isSupported) {
  colorPicker.value = DOMPurify.sanitize(color);
  root.style.setProperty("--background-color", DOMPurify.sanitize(color));
  if (hexToHSL(DOMPurify.sanitize(color))[2] > 65) {
    root.style.setProperty("--accent-text-color", "#000000");
  } else {
    root.style.setProperty("--accent-text-color", "#ffffff");
  }

  backgroundImage.src = "images/background.png";

  borderRadiusPicker.value = Number(DOMPurify.sanitize(borderRadius));
  root.style.setProperty(
    "--border-radius",
    DOMPurify.sanitize(borderRadius + "px")
  );
  root.style.setProperty(
    "--border-radius-print",
    DOMPurify.sanitize(borderRadius / 10 + "vw")
  );

  if (Number(DOMPurify.sanitize(rows)) === 3) {
    document.getElementById("row4").setAttribute("show", false);
    document.getElementById("row5").setAttribute("show", false);
  } else if (Number(DOMPurify.sanitize(rows)) === 4) {
    document.getElementById("row4").setAttribute("show", true);
    document.getElementById("row5").setAttribute("show", false);
  } else if (Number(DOMPurify.sanitize(rows)) === 5) {
    document.getElementById("row4").setAttribute("show", true);
    document.getElementById("row5").setAttribute("show", true);
  }
}

function setTwoSubjects(value, id) {
  document.getElementById(id).setAttribute("two-subjects", value);
}

clear.onclick = function () {
  localStorage.clear();
  location.reload();
};

printButton.onclick = function () {
  window.print();
};

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
