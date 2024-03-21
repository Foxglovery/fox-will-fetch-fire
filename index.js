/**@type {HTMLCanvasElement}*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const appSettings = {
  databaseURL: "https://fox-will-get-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDb = ref(database, "shoppingList");

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

//line
// ctx.beginPath();
// ctx.moveTo(50, 300);
// //each line to makes another stroke
// ctx.lineTo(300, 100);
// ctx.lineTo(300, 400);
// ctx.stroke();

//create arc

// for (var i = 0; i < 3; i++) {
//   let x = Math.random() * window.innerWidth;
//   let y = Math.random() * window.innerHeight;
//   let radius = 50; // Arc radius
//   let startAngle = 0; // Starting point on circle
let endAngle = Math.PI * 2; // End point on circle

//   let r = Math.floor(Math.random() * 256);
//   let g = Math.floor(Math.random() * 256);
//   let b = Math.floor(Math.random() * 256);
//   let strokeColor = "rgb(" + r + "," + g + "," + b + ")";

//   ctx.beginPath();
//   ctx.strokeStyle = strokeColor;
//   ctx.arc(x, y, radius, startAngle, endAngle, false);
//   ctx.stroke();
// }

let x = 200;
let dx = 1 // x velocity
let y = 300;
let dy = 1 //y velocity
let radius = 30;
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.arc(x, y, radius, 0, endAngle, false);
  ctx.stroke();

  if (x + radius > innerWidth || x - radius < 0) {
    dx = -dx;
  }

  if (y + radius > innerHeight || y - radius < 0) {
    dy = -dy
  }
 
  x += dx
  y +=dy
  
}
animate();

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

onValue(shoppingListInDb, function (snapshot) {
  if (snapshot.exists()) {
    let itemArray = Object.entries(snapshot.val());
    console.log(snapshot.val());
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
