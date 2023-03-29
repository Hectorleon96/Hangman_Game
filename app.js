import {
  USER_CHOOSE,
  MAIN_GAME_CHOOSE,
  SHOW_WORDS,
  GO_BUTTON,
  GAME_BUTTONS,
  ALERT_TEXT,
  WRONG_CHARACTER,
  WIN,
} from "./getElement.js";
addEventListener("DOMContentLoaded", () => {
  let word = [];
  let found;
  let lifes = 6;
  async function getWord() {
    let response = await fetch(
      "https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=6"
    );

    if (response.status !== 200) {
      gameStatus("error", "Sorry! Something was wrong, try again...");
      return;
    }
    document.querySelector(".span-start").classList.add("hide");
    let data = await response.json();
    found = data;
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
  }

  function checkWord() {
    if (USER_CHOOSE.value === "") {
      gameStatus("error", "Please type any character for continue...");
      return;
    }

    if (!word.includes(USER_CHOOSE.value)) {
      lifes = lifes - 1;
      if (lifes === 0) {
        gameStatus("gameOver", `¡You lost! The word is: ' ${found}' `);
        USER_CHOOSE.value = "";
        return;
      }
      gameStatus("wrongWord", `Wrong character, you have ${lifes} intents...`);
      USER_CHOOSE.value = "";
      return;
    }
    showCharacter(USER_CHOOSE.value);
  }

  function showCharacter(character) {
    let position = word.indexOf(character);
    word.splice(position, 1, "_");
    USER_CHOOSE.value = "";
    let render = document.querySelectorAll(".listItems");
    render[position].textContent = character;

    let checkWin = word.every(function (element) {
      return element === "_";
    });
    if (checkWin) {
      gameStatus("youWin", "Press restart and play again c:");
    }
  }

  function restartGame() {
    lifes = 6;
    USER_CHOOSE.value = "";
    SHOW_WORDS.textContent = "";
    WRONG_CHARACTER.textContent = "";
    WIN.classList.add("hide");
    getWord();
  }

  function gameStatus(type, message) {
    switch (type) {
      case "error":
        ALERT_TEXT.textContent = message;
        setTimeout(() => {
          ALERT_TEXT.textContent = "";
        }, 2000);
        break;

      case "wrongWord":
        WRONG_CHARACTER.textContent = message;
        break;

      case "gameOver":
        WRONG_CHARACTER.textContent = "";
        SHOW_WORDS.innerHTML = message;
        GAME_BUTTONS[1].classList.add("hide");
        MAIN_GAME_CHOOSE.classList.add("hide");
        break;

      case "youWin":
        WIN.classList.remove("hide");
        WRONG_CHARACTER.textContent = message;
        MAIN_GAME_CHOOSE.classList.add("hide");
        GAME_BUTTONS[1].classList.add("hide");
        break;
    }
  }

  GAME_BUTTONS[0].addEventListener("click", restartGame);
  GAME_BUTTONS[1].addEventListener("click", checkWord);
  GO_BUTTON.addEventListener("click", getWord);
});
