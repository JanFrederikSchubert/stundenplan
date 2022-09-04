var root = document.documentElement;

var timetableContent = {
  twoSubjects: {},
  contentOne: {},
  contentTwo: {},
};

var colorPicker = document.getElementById("colorPicker");
var borderRadiusPicker = document.getElementById("borderRadiusPicker");
var opacityPicker = document.getElementById("opacityPicker");
var blurPicker = document.getElementById("blurPicker");
var amountOfRows = document.getElementById("amountOfRows");
var clear = document.getElementById("clear");
var printButton = document.getElementById("print");

var backgroundChooser = document.getElementById("background");
var backgroundImage = document.getElementById("backgroundImage");

var editableBoxes = document.querySelectorAll("[contenteditable='true']");

root.style.setProperty(
  "--height",
  (window.innerHeight > window.document.documentElement.clientHeight
    ? window.document.documentElement.clientHeight
    : window.innerHeight) + "px"
);

window.onresize = function () {
  root.style.setProperty(
    "--height",
    (window.innerHeight > window.document.documentElement.clientHeight
      ? window.document.documentElement.clientHeight
      : window.innerHeight) + "px"
  );
};

var color = DOMPurify.isSupported
  ? localStorage.getItem("color") !== null &&
    localStorage.getItem("color") !== "" &&
    localStorage.getItem("color").length === 7
    ? DOMPurify.sanitize(localStorage.getItem("color"))
    : "#000000"
  : "#000000";
var borderRadius = DOMPurify.isSupported
  ? localStorage.getItem("border-radius") !== null &&
    localStorage.getItem("border-radius") !== "" &&
    localStorage.getItem("border-radius") >= 0 &&
    localStorage.getItem("border-radius") <= 33
    ? Number(DOMPurify.sanitize(localStorage.getItem("border-radius")))
    : 10
  : 10;
var opacity = DOMPurify.isSupported
  ? localStorage.getItem("opacity") !== null &&
    localStorage.getItem("opacity") !== "" &&
    localStorage.getItem("opacity") >= 0 &&
    localStorage.getItem("opacity") <= 100
    ? Number(DOMPurify.sanitize(localStorage.getItem("opacity")))
    : 90
  : 90;
var blurring = DOMPurify.isSupported
  ? localStorage.getItem("blur") !== null &&
    localStorage.getItem("blur") !== "" &&
    localStorage.getItem("blur") >= 0 &&
    localStorage.getItem("blur") <= 30
    ? Number(DOMPurify.sanitize(localStorage.getItem("blur")))
    : 0
  : 0;
var rows = DOMPurify.isSupported
  ? localStorage.getItem("rows") !== null &&
    localStorage.getItem("rows") !== "" &&
    (localStorage.getItem("rows") == 3 ||
      localStorage.getItem("rows") == 4 ||
      localStorage.getItem("rows") == 5)
    ? Number(DOMPurify.sanitize(localStorage.getItem("rows")))
    : 4
  : 4;
if (
  localStorage.getItem("rows") == 3 ||
  localStorage.getItem("rows") == 4 ||
  localStorage.getItem("rows") == 5
) {
  amountOfRows.value = rows;
}
var backgroundImageData = DOMPurify.isSupported
  ? localStorage.getItem("background") !== null &&
    localStorage.getItem("background") !== ""
    ? DOMPurify.sanitize(localStorage.getItem("background"))
    : "images/background.png"
  : "images/background.png";

backgroundChooser.addEventListener("change", (event) => {
  let file = event.target.files[0];
  if (file.type && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      backgroundImage.src = event.target.result;
      try {
        localStorage.setItem("background", event.target.result);
        document.getElementById("imageError").style =
          "display: none; margin-inline: 20px; margin-block: 5px; color: rgb(255, 116, 116);";
      } catch (error) {
        localStorage.removeItem("background");
        let containerWidth = document.querySelector(".settings").clientWidth;
        document.getElementById("imageError").style =
          "max-width:" +
          (containerWidth - 40) +
          "px; margin-inline: 20px; margin-block: 5px; color: rgb(255, 116, 116);";
      }
    });
    reader.readAsDataURL(file);
  }
});

editableBoxes.forEach((element) => {
  element.oninput = function () {
    if (element.innerHTML === "") {
      element.innerHTML = "<br>";
    }
  };
});

if (DOMPurify.isSupported) {
  if (localStorage.getItem("content") !== null) {
    timetableContent = JSON.parse(
      DOMPurify.sanitize(localStorage.getItem("content"))
    );
    editableBoxes.forEach((element) => {
      let parentId = element.parentNode.id;
      let parent = document.getElementById(parentId);
      if (
        timetableContent.twoSubjects[parentId] == "true" ||
        timetableContent.twoSubjects[parentId] == "false"
      ) {
        parent.setAttribute(
          "two-subjects",
          timetableContent.twoSubjects[parentId]
        );
        if (timetableContent.twoSubjects[parentId] == "true") {
          document
            .querySelector("#" + parentId + " > input")
            .setAttribute("checked", timetableContent.twoSubjects[parentId]);
        }
      }

      if (
        timetableContent.contentOne[parentId] !== null &&
        timetableContent.contentOne[parentId] !== "" &&
        timetableContent.contentOne[parentId] !== undefined
      ) {
        document.querySelector(
          "#" + parentId + " > div:nth-child(2)"
        ).innerHTML = timetableContent.contentOne[parentId];
      }
      if (
        timetableContent.contentTwo[parentId] !== null &&
        timetableContent.contentTwo[parentId] !== "" &&
        timetableContent.contentOne[parentId] !== undefined
      ) {
        document.querySelector(
          "#" + parentId + " > div:nth-child(3)"
        ).innerHTML = timetableContent.contentTwo[parentId];
      }
    });
  }
}

editableBoxes.forEach((element) => {
  element.addEventListener("blur", () => {
    let parentId = element.parentNode.id;
    let parent = document.getElementById(parentId);
    let elementTwoSubjects = parent.getAttribute("two-subjects");
    let contentOne = DOMPurify.sanitize(
      document.querySelector("#" + parentId + " > div:nth-child(2)").innerHTML
    );
    let contentTwo = DOMPurify.sanitize(
      document.querySelector("#" + parentId + " > div:nth-child(3)").innerHTML
    );
    timetableContent.twoSubjects[parentId] = elementTwoSubjects;
    timetableContent.contentOne[parentId] = contentOne;
    timetableContent.contentTwo[parentId] = contentTwo;
    localStorage.setItem("content", JSON.stringify(timetableContent));
  });
});

colorPicker.oninput = function () {
  if (DOMPurify.isSupported) {
    color = DOMPurify.sanitize(colorPicker.value);
    root.style.setProperty("--background-color", color);
    if (hexToHSL(color)[2] > 65) {
      root.style.setProperty("--accent-text-color", "#000000");
    } else {
      root.style.setProperty("--accent-text-color", "#ffffff");
    }
    localStorage.setItem("color", color);
  }
};

borderRadiusPicker.oninput = function () {
  if (DOMPurify.isSupported) {
    borderRadius = Number(DOMPurify.sanitize(borderRadiusPicker.value));
    root.style.setProperty("--border-radius", borderRadius + "px");
    root.style.setProperty("--border-radius-print", borderRadius / 10 + "vw");
    localStorage.setItem("border-radius", borderRadius);
  }
};

opacityPicker.oninput = function () {
  if (DOMPurify.isSupported) {
    opacity = Number(DOMPurify.sanitize(opacityPicker.value));
    root.style.setProperty("--opacity", opacity / 100);
    localStorage.setItem("opacity", opacity);
  }
};

blurPicker.oninput = function () {
  if (DOMPurify.isSupported) {
    blurring = Number(DOMPurify.sanitize(blurPicker.value));
    root.style.setProperty("--blur", blurring + "px");
    root.style.setProperty("--blur-print", blurring / 10 + "vw");
    localStorage.setItem("blur", blurring);
  }
};

amountOfRows.onchange = function () {
  if (DOMPurify.isSupported) {
    rows = Number(DOMPurify.sanitize(amountOfRows.value));
    if (Number(rows) >= 3 && Number(rows) <= 5) {
      localStorage.setItem("rows", Number(rows));
    }
    if (Number(rows) === 3) {
      document.getElementById("row4").setAttribute("show", false);
      document.getElementById("row5").setAttribute("show", false);
    } else if (Number(rows) === 4) {
      document.getElementById("row4").setAttribute("show", true);
      document.getElementById("row5").setAttribute("show", false);
    } else if (Number(rows) === 5) {
      document.getElementById("row4").setAttribute("show", true);
      document.getElementById("row5").setAttribute("show", true);
    }
  }
};

function resetImage() {
  backgroundImage.src = "images/background.png";
}

if (DOMPurify.isSupported) {
  colorPicker.value = color;
  root.style.setProperty("--background-color", color);
  if (hexToHSL(color)[2] > 65) {
    root.style.setProperty("--accent-text-color", "#000000");
  } else {
    root.style.setProperty("--accent-text-color", "#ffffff");
  }

  backgroundImage.src = backgroundImageData;

  borderRadiusPicker.value = Number(borderRadius);
  root.style.setProperty("--border-radius", borderRadius + "px");
  root.style.setProperty("--border-radius-print", borderRadius / 10 + "vw");

  blurPicker.value = Number(blurring);
  root.style.setProperty("--blur", blurring + "px");
  root.style.setProperty("--blur-print", blurring / 10 + "vw");

  opacityPicker.value = Number(opacity);
  root.style.setProperty("--opacity", opacity / 100);

  if (Number(rows) === 3) {
    document.getElementById("row4").setAttribute("show", false);
    document.getElementById("row5").setAttribute("show", false);
  } else if (Number(rows) === 4) {
    document.getElementById("row4").setAttribute("show", true);
    document.getElementById("row5").setAttribute("show", false);
  } else if (Number(rows) === 5) {
    document.getElementById("row4").setAttribute("show", true);
    document.getElementById("row5").setAttribute("show", true);
  }
}

function setTwoSubjects(value, id) {
  document.getElementById(id).setAttribute("two-subjects", value);
}

function resetBorderRadius() {
  borderRadius = 10;
  localStorage.removeItem("border-radius");
  borderRadiusPicker.value = borderRadius;
  root.style.setProperty("--border-radius", borderRadius + "px");
  root.style.setProperty("--border-radius-print", borderRadius / 10 + "vw");
}

function resetOpacity() {
  opacity = 90;
  localStorage.removeItem("opacity");
  opacityPicker.value = opacity;
  root.style.setProperty("--opacity", opacity / 100);
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
