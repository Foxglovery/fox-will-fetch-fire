/**@type {HTMLCanvasElement}*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// const appSettings = {
//   databaseURL: "https://fox-will-get-default-rtdb.firebaseio.com/",
// };
// var firebase = require("firebase");
// var firebaseui = require("firebaseui");
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start("#firebaseui-auth-container", {
//   signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
//   // Other config options...
// });
//find a way not to use this
const firebaseConfig = {
  apiKey: "AIzaSyBoTZEf7LmpDA3KOAok8ZPcPHkQDADRNU0",
  authDomain: "fox-will-get.firebaseapp.com",
  databaseURL: "https://fox-will-get-default-rtdb.firebaseio.com",
  projectId: "fox-will-get",
  storageBucket: "fox-will-get.appspot.com",
  messagingSenderId: "45651837070",
  appId: "1:45651837070:web:d13e8d9df67322f0f149df",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const shoppingListInDb = ref(database, "shoppingList");
const frequentItemsInDb = ref(database, "frequentItems");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
//canvas code
const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

// ctx.fillStyle = "red";
// ctx.fillRect(100, 110, 20, 20);
// ctx.fillStyle = "blue";
// ctx.fillRect(200, 410, 20, 20);

// line
// ctx.beginPath();
// ctx.moveTo(50, 300);
// //each line to makes another stroke
// ctx.lineTo(300, 100);
// ctx.lineTo(300, 400);
// ctx.stroke();

// create arc

// for (var i = 0; i < 3; i++) {
//   let x = Math.random() * window.innerWidth;
//   let y = Math.random() * window.innerHeight;
//   let radius = 50; // Arc radius
//   let startAngle = 0; // Starting point on circle
// let endAngle = Math.PI * 2; // End point on circle

//   let r = Math.floor(Math.random() * 256);
//   let g = Math.floor(Math.random() * 256);
//   let b = Math.floor(Math.random() * 256);
//   let strokeColor = "rgb(" + r + "," + g + "," + b + ")";

//   ctx.beginPath();
//   ctx.strokeStyle = strokeColor;
//   ctx.arc(x, y, radius, startAngle, endAngle, false);
//   ctx.stroke();
// }

var mouse = {
  x: undefined,
  y: undefined,
};

var maxRadius = 40;
// var minRadius = 2;

var colorArray = ["#1A4F63", "#068587", "#6FB07F", "#FCB03C", "#FC5B3F"];
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  //if distance between mouse and circle is less than 50
});

//added to account for touch screen
window.addEventListener("touchmove", function (event) {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});
function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  //object action logic goes here
  this.update = function () {
    //these change the velocity of the circles when they hit the bounds of the screen
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    //interactivity

    // if (
    //   mouse.x - this.x < 50 &&
    //   mouse.x - this.x > -50 &&
    //   mouse.y - this.y < 50 &&
    //   mouse.y - this.y > -50
    // ) {
    //   //second if statement to limit the size the circles increase
    //   if (this.radius < maxRadius) {
    //     this.radius += 1;
    //   }
    // } else if (this.radius > this.minRadius) {
    //   this.radius -= 1;
    // }

    this.draw();
  };
}

let circleArray = [];
function init() {
  circleArray = [];
  //make several items
  for (let i = 0; i < 200; i++) {
    let radius = Math.random() * 3 + 1;
    let x = Math.random() * (innerWidth - radius * 2) + radius;
    let y = Math.random() * (innerHeight - radius * 2) + radius;
    let dx = (Math.random() - 0.5) * 1; // x velocity
    let dy = (Math.random() - 0.5) * 1; //y velocity
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}
init();
// animate();

//MAIN LOGIC

function toggleSidePanel() {
  // Get the side panel element
  var sidePanel = document.getElementById("side-panel");

  // Check if the side panel is currently visible or hidden
  var isVisible = sidePanel.style.left === "0px";

  // If the side panel is visible, hide it; otherwise, show it
  if (isVisible) {
    sidePanel.style.left = "-300px"; // Move off-screen to the left
  } else {
    sidePanel.style.left = "0"; // Move to the left edge of the screen
  }
}
//for adding an item to the list
addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
  if (inputValue !== "") {
    push(shoppingListInDb, inputValue);
    console.log(`${inputValue} was pushed to the db`);
    clearInputFieldEl();
  } else {
    console.log("nothing was entered");
  }
});

//for sending the item to the db
onValue(shoppingListInDb, function (snapshot) {
  if (snapshot.exists()) {
    let itemArray = Object.entries(snapshot.val());
    // console.log(snapshot.val());
    clearShoppingListEl();

    for (let i = 0; i < itemArray.length; i++) {
      let currentItem = itemArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}
function clearInputFieldEl() {
  inputFieldEl.value = "";
}

//for adding the new item to the UI list
function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  shoppingListEl.append(newEl);
}
