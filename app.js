import {
  USER_CHOOSE,
  MAIN_GAME_CONTENT,
  MAIN_GAME_CHOOSE,
  SHOW_WORDS,
  GO_BUTTON,
  GAME_BUTTONS,
  ALERT_TEXT,
  WRONG_CHARACTER,
} from "./getElement.js";
addEventListener("DOMContentLoaded", () => {
  let word = [];
  let found = {};
  async function getWord() {
    let response = await fetch(
      "https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=8"
    );

    if (response.status !== 200) {
      errorHandle("error", "Sorry! Something was wrong, try again...");
      return;
    }
    let data = await response.json();
    word = data[0].split("");
    MAIN_GAME_CHOOSE.classList.remove("hide");
    GO_BUTTON.classList.add("hide");
    for (let element of GAME_BUTTONS) {
      element.classList.remove("hide");
    }

    word.forEach(() => {
      let listItems = document.createElement("li");
      listItems.classList.add("listItems");
      listItems.textContent = "_";
      SHOW_WORDS.appendChild(listItems);
    });

    console.log(word);
  }

  function checkWord() {
    if (USER_CHOOSE.value === "") {
      errorHandle("error", "Please type any character for continue...");
      return;
    }

    word.forEach((element) => {
      if (element !== USER_CHOOSE.value) {
        return;
      }

      let position = word.indexOf(element);
      found = { character: element, position: position };
      word.splice(position, 1, "_");
      renderWord(found.character, found.position);
    });
    USER_CHOOSE.value = "";
    console.log(found);
    console.log(word);
  }

  function renderWord(character, position) {
    let render = document.querySelectorAll(".listItems");
    render[position].textContent = character;
  }

  function errorHandle(type, message) {
    switch (type) {
      case "error":
        ALERT_TEXT.textContent = message;
        errorDelay(ALERT_TEXT);
        break;

      case "wrongWord":
        WRONG_CHARACTER.textContent = message;
        errorDelay(WRONG_CHARACTER);
        break;
    }
  }

  function errorDelay(element) {
    setTimeout(() => {
      element.textContent = "";
    }, 2000);
  }

  GAME_BUTTONS[1].addEventListener("click", checkWord);
  GO_BUTTON.addEventListener("click", getWord);
});
