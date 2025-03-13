import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://grocery-store-fab17-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const groceriesInDB = ref(database, 'groceries');

const add = document.getElementById('add-button');
const input = document.getElementById('input-field');
const list = document.getElementById('shopping-list');
const container = document.querySelector('.container');

add.addEventListener('click', () => {
  let inputValue = input.value.trim();
  if (inputValue) {
    push(groceriesInDB, inputValue);
    clearInput();
  }
});

onValue(groceriesInDB, (snapshot) => {
  clearShoppingList();

  if (snapshot.exists()) {
    let listItemsArray = Object.entries(snapshot.val());

    listItemsArray.forEach((item) => {
      renderToList(item);
    });

    appendButton(); // Ensure button appears if items exist
  } else {
    removeButton(); // Remove the button if no items are present
  }
});

function clearShoppingList(){
  list.innerHTML = '';
}

function renderToList(item){
  let itemID = item[0];
  let itemValue = item[1];

  let newElement = document.createElement("li");
  newElement.textContent = itemValue;
  list.append(newElement);

  newElement.addEventListener("click", () => {
    newElement.classList.add("selected-item");

    let confirmDeleteBtn = document.querySelector('.confirm-delete-button');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.addEventListener('dblclick', () => {
        let locationOfItem = ref(database, `groceries/${itemID}`);
        remove(locationOfItem);
      });
    }
  });
}

function clearInput(){
  input.value = '';
}

function appendButton(){
  if (!container.querySelector('.confirm-delete-button')) {
    let newButton = document.createElement('button');

    newButton.textContent = "Delete From List";
    newButton.classList.add('confirm-delete-button');
    newButton.disabled = true;

    container.appendChild(newButton);
  }
}

function removeButton(){
  let existingButton = container.querySelector('.confirm-delete-button');
  if (existingButton) {
    existingButton.remove();
  }
}
