import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://grocery-store-fab17-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const groceriesInDB = ref(database, "groceries");

const add = document.getElementById("add-button");
const input = document.getElementById("input-field");
const list = document.getElementById("shopping-list");
const container = document.querySelector(".container");

let deleteButton;

add.addEventListener("click", () => {
  let inputValue = input.value.trim();
  if (inputValue) {
    push(groceriesInDB, inputValue);
    clearInput();
  }
});

onValue(groceriesInDB, (snapshot) => {
  let selectedItems = document.querySelectorAll(".selected-item");
  let selectedIDs = new Set();

  // Store selected item IDs before clearing the list
  selectedItems.forEach((item) => {
    selectedIDs.add(item.getAttribute("data-id"));
  });

  clearShoppingList();

  if (snapshot.exists()) {
    let listItemsArray = Object.entries(snapshot.val());

    listItemsArray.forEach((item) => {
      renderToList(item, selectedIDs);
    });

    appendButton();
  } else {
    removeButton();
  }
});


function clearShoppingList() {
  list.innerHTML = "";
}

function renderToList(item, selectedIDs) {
  let itemID = item[0];
  let itemValue = item[1];

  let newElement = document.createElement("li");
  newElement.textContent = itemValue;
  newElement.setAttribute("data-id", itemID);

  if (selectedIDs.has(itemID)) {
    newElement.classList.add("selected-item");
  }

  list.append(newElement);

  newElement.addEventListener("click", () => {
    newElement.classList.toggle("selected-item");

    let selectedItems = document.querySelectorAll(".selected-item");
    deleteButton.disabled = selectedItems.length === 0;
  });
}


function clearInput() {
  input.value = "";
}

function appendButton() {
  if (!container.querySelector(".confirm-delete-button")) {
    deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete From List";
    deleteButton.classList.add("confirm-delete-button");
    deleteButton.disabled = true;

    deleteButton.addEventListener("dblclick", deleteSelectedItems);
    container.appendChild(deleteButton);
  }
}

function removeButton() {
  let existingButton = container.querySelector(".confirm-delete-button");
  if (existingButton) {
    existingButton.remove();
  }
}

function deleteSelectedItems() {
  let selectedItems = document.querySelectorAll(".selected-item");

  selectedItems.forEach((item) => {
    let itemID = item.getAttribute("data-id");
    let itemRef = ref(database, `groceries/${itemID}`);
    remove(itemRef); 
  });

  deleteButton.disabled = true;
}
