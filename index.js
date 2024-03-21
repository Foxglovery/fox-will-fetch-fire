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
const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');
// ctx.fillStyle = 'red';
// ctx.fillRect(0,0,10,10);

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
  if(inputValue !== "") {
    push(shoppingListInDb, inputValue);
  console.log(`${inputValue} was pushed to the db`);
  clearInputFieldEl();
  } else {
    console.log("nothing was entered")
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
    shoppingListEl.innerHTML = ""
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
    let exactLocationOfItemInDB = ref(
      database,
      `shoppingList/${itemID}`
    );
    remove(exactLocationOfItemInDB);
  });
  shoppingListEl.append(newEl);
}
