let inputDir = { x: 0, y: 0 };
const foodsound = new Audio("../media/sounds/food.mp3");
const gameoversound = new Audio("../media/sounds/gameover.mp3");
const movesound = new Audio("../media/sounds/move.mp3");
const musicsound = new Audio("../media/sounds/snakexenzia.mp3");
let speed = 8;
let lasttime = 0;
let snakeArr = [{ x: 10, y: 10 }];
let food = { x: 13, y: 15 };
let score = 0;
let hiscoreval = 0;
var lastDirection = "";
let mazedecide = "maze";
var opposite = [];
opposite["ArrowUp"] = "ArrowDown";
opposite["ArrowDown"] = "ArrowUp";
opposite["ArrowRight"] = "ArrowLeft";
opposite["ArrowLeft"] = "ArrowRight";

function mazecollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  if (
    snake[0].x >= 40 ||
    snake[0].x <= 0 ||
    snake[0].y >= 40 ||
    snake[0].y <= 0
  ) {
    return true;
  }
  return false;
}
function main(ctime) {
  musicsound.play();
  window.requestAnimationFrame(main);
  if ((ctime - lasttime) / 1000 < 1 / speed) {
    return;
  }
  if (mazedecide === "nomaze") {
    coordinateupdation();
  }
  lasttime = ctime;
  gameEngine();
  let hiscore = localStorage.getItem("hiscore");
  if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
  } else {
    hiscoreval = JSON.parse(hiscore);
    hiscorebox.innerHTML = "High Score : " + hiscoreval;
  }
  keyDownFunc();
}
function keyDownFunc() {
  window.addEventListener("keydown", (e) => {
    movesound.play();
    if (lastDirection === "" || opposite[lastDirection] !== e.key) {
      switch (e.key) {
        case "ArrowUp":
          inputDir.x = 0;
          inputDir.y = -1;
          break;
        case "ArrowDown":
          inputDir.x = 0;
          inputDir.y = 1;
          break;
        case "ArrowLeft":
          inputDir.x = -1;
          inputDir.y = 0;
          break;
        case "ArrowRight":
          inputDir.x = 1;
          inputDir.y = 0;
          break;
      }
      lastDirection = e.key;
    }
  });
}
function coordinateupdation() {
  for (let i = 0; i < snakeArr.length; i++) {
    if (snakeArr[i].x > 40) snakeArr[i].x = snakeArr[i].x - 41;
    else if (snakeArr[i].x < 0) snakeArr[i].x = snakeArr[i].x + 41;
    if (snakeArr[i].y > 40) snakeArr[i].y = snakeArr[i].y - 41;
    else if (snakeArr[i].y < 0) snakeArr[i].y = snakeArr[i].y + 41;
  }
}
function gameEngine() {
  if (
    (mazedecide === "maze" && mazecollide(snakeArr)) ||
    (mazedecide === "nomaze" && nomazecollide(snakeArr))
  ) {
    gameoversound.play();
    musicsound.pause();
    inputDir = { x: 0, y: 0 };
    alert("Game Over");
    lastDirection = "";
    snakeArr = [{ x: 10, y: 10 }];
    musicsound.play();
    score = 0;
    scorebox.innerHTML = "Score : " + score;
  }
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodsound.play();
    score++;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscorebox.innerHTML = "High Score : " + hiscoreval;
    }
    scorebox.innerHTML = "Score : " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 1;
    let b = 39;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snakebody");
    }
    board.appendChild(snakeElement);
  });
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}
function choiceDecider() {
  if (document.getElementById("eas").checked == true) {
    speed = 8;
  } else if (document.getElementById("med").checked == true) {
    speed = 14;
  } else if (document.getElementById("har").checked == true) {
    speed = 20;
  }
  if (document.getElementById("maze").checked == true) {
    mazedecide = "maze";
  }
  document.querySelector(".innerbox").style.display = "none";
}
function showOptions() {
  if (speed == 8) {
    document.getElementById("eas").checked = true;
    document.getElementById("med").checked = false;
    document.getElementById("har").checked = false;
  } else if (speed == 14) {
    document.getElementById("eas").checked = false;
    document.getElementById("med").checked = true;
    document.getElementById("har").checked = false;
  } else if (speed == 20) {
    document.getElementById("eas").checked = false;
    document.getElementById("med").checked = false;
    document.getElementById("har").checked = true;
  }
  if (mazedecide == "maze") {
    document.getElementById("maze").checked = true;
  }
}
function initialize() {
  document.querySelector(".innerbox").style.display = "block";
  showOptions();
}
function restartGame(ask) {
  initialize();
  inputDir = { x: 0, y: 0 };
  snakeArr = [{ x: 10, y: 10 }];
  score = 0;
  scorebox.innerHTML = "Score : " + score;
  document.querySelector(".innerbox").style.display = "block";
}
window.requestAnimationFrame(main);
