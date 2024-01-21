let moves = 0;
let winner = 0;
let x = 1;
let o = 3;
let player = x;
let computer = o;
let whoseTurn = x;
let gameOver = false;
let score = {
  ties: 0,
  player: 0,
  computer: 0,
};
let xText = '<span class="x">&times;</class>';
let oText = '<span class="o">o</class>';
let playerText = xText;
let computerText = oText;
let difficulty = 1;
let myGrid = null;
const gamesound = new Audio("../media/sounds/tictactoe.mp3");
const playsound = new Audio("../media/sounds/move.mp3");
const winsound = new Audio("../media/sounds/win.mp3");
const losssound = new Audio("../media/sounds/lose.mp3");
gamesound.loop = true;

function sumArray(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}
function IsInArray(element, array) {
  if (array.indexOf(element) > -1) {
    return true;
  }
  return false;
}
function shuffleArray(array) {
  var counter = array.length;
  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);
    counter--;
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function IntRandom(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}
function Grid() {
  this.cells = new Array(9);
}
Grid.prototype.getFreeCellIndices = function () {
  var resultArray = [];
  for (var i = 0; i < this.cells.length; i++) {
    if (this.cells[i] === 0) {
      resultArray.push(i);
    }
  }
  return resultArray;
};
Grid.prototype.getRowValues = function (index) {
  var i = index * 3;
  return this.cells.slice(i, i + 3);
};
Grid.prototype.getRowIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowIndices!");
    return undefined;
  }
  var row = [];
  index = index * 3;
  row.push(index);
  row.push(index + 1);
  row.push(index + 2);
  return row;
};
Grid.prototype.getColumnValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnValues!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(this.cells[i]);
  }
  return column;
};
Grid.prototype.getColumnIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnIndices!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(i);
  }
  return column;
};
Grid.prototype.getDiagValues = function (arg) {
  var cells = [];
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagValues!");
    return undefined;
  } else if (arg === 0) {
    cells.push(this.cells[0]);
    cells.push(this.cells[4]);
    cells.push(this.cells[8]);
  } else {
    cells.push(this.cells[2]);
    cells.push(this.cells[4]);
    cells.push(this.cells[6]);
  }
  return cells;
};
Grid.prototype.getDiagIndices = function (arg) {
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagIndices!");
    return undefined;
  } else if (arg === 0) {
    return [0, 4, 8];
  } else {
    return [2, 4, 6];
  }
};
Grid.prototype.getFirstWithTwoInARow = function (agent) {
  var sum = agent * 2,
    freeCells = shuffleArray(this.getFreeCellIndices());
  for (var i = 0; i < freeCells.length; i++) {
    for (var j = 0; j < 3; j++) {
      var rowV = this.getRowValues(j);
      var rowI = this.getRowIndices(j);
      var colV = this.getColumnValues(j);
      var colI = this.getColumnIndices(j);
      if (sumArray(rowV) == sum && IsInArray(freeCells[i], rowI)) {
        return freeCells[i];
      } else if (sumArray(colV) == sum && IsInArray(freeCells[i], colI)) {
        return freeCells[i];
      }
    }
    for (j = 0; j < 2; j++) {
      var diagV = this.getDiagValues(j);
      var diagI = this.getDiagIndices(j);
      if (sumArray(diagV) == sum && IsInArray(freeCells[i], diagI)) {
        return freeCells[i];
      }
    }
  }
  return false;
};
Grid.prototype.reset = function () {
  for (var i = 0; i < this.cells.length; i++) {
    this.cells[i] = 0;
  }
  return true;
};
function initialize() {
  myGrid = new Grid();
  moves = 0;
  winner = 0;
  gameOver = false;
  whoseTurn = player;
  gamesound.play();
  for (var i = 0; i <= myGrid.cells.length - 1; i++) {
    myGrid.cells[i] = 0;
  }
  setTimeout(showOptions, 300);
}
function cellClicked(id) {
  var idName = id.toString();
  var cell = parseInt(idName[idName.length - 1]);
  if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
    return false;
  }
  moves += 1;
  document.getElementById(id).innerHTML = playerText;
  document.getElementById(id).style.cursor = "default";
  playsound.play();
  myGrid.cells[cell] = player;
  if (moves >= 5) {
    winner = checkWin();
  }
  if (winner === 0) {
    whoseTurn = computer;
    setTimeout(makeComputerMove, 500);
  }
  return true;
}
function restartGame(ask) {
  if (moves > 0) {
    var response = confirm(
      "It will result in restarting the game. Are you sure you want to start over?"
    );
    if (response === false) {
      return;
    }
  }
  gameOver = false;
  moves = 0;
  winner = 0;
  whoseTurn = x;
  myGrid.reset();
  gamesound.play();
  for (var i = 0; i <= 8; i++) {
    var id = "cell" + i.toString();
    document.getElementById(id).innerHTML = "";
    document.getElementById(id).style.cursor = "pointer";
    document.getElementById(id).classList.remove("win-color");
  }
  if (ask === true) {
    setTimeout(showOptions, 200);
  }
  choiceDecider();
}
function makeComputerMove() {
  if (gameOver) {
    return false;
  }
  var cell = -1,
    myArr = [],
    corners = [0, 2, 6, 8];
  if (moves >= 3) {
    cell = myGrid.getFirstWithTwoInARow(computer);
    if (cell === false) {
      cell = myGrid.getFirstWithTwoInARow(player);
    }
    if (cell === false) {
      if (myGrid.cells[4] === 0 && difficulty == 1) {
        cell = 4;
      } else {
        myArr = myGrid.getFreeCellIndices();
        cell = myArr[IntRandom(0, myArr.length - 1)];
      }
    }
    if (
      moves == 3 &&
      myGrid.cells[4] == computer &&
      player == x &&
      difficulty == 1
    ) {
      if (
        myGrid.cells[7] == player &&
        (myGrid.cells[0] == player || myGrid.cells[2] == player)
      ) {
        myArr = [6, 8];
        cell = myArr[IntRandom(0, 1)];
      } else if (
        myGrid.cells[5] == player &&
        (myGrid.cells[0] == player || myGrid.cells[6] == player)
      ) {
        myArr = [2, 8];
        cell = myArr[IntRandom(0, 1)];
      } else if (
        myGrid.cells[3] == player &&
        (myGrid.cells[2] == player || myGrid.cells[8] == player)
      ) {
        myArr = [0, 6];
        cell = myArr[IntRandom(0, 1)];
      } else if (
        myGrid.cells[1] == player &&
        (myGrid.cells[6] == player || myGrid.cells[8] == player)
      ) {
        myArr = [0, 2];
        cell = myArr[IntRandom(0, 1)];
      }
    } else if (
      moves == 3 &&
      myGrid.cells[4] == player &&
      player == x &&
      difficulty == 1
    ) {
      if (myGrid.cells[2] == player && myGrid.cells[6] == computer) {
        cell = 8;
      } else if (myGrid.cells[0] == player && myGrid.cells[8] == computer) {
        cell = 6;
      } else if (myGrid.cells[8] == player && myGrid.cells[0] == computer) {
        cell = 2;
      } else if (myGrid.cells[6] == player && myGrid.cells[2] == computer) {
        cell = 0;
      }
    }
  } else if (moves === 1 && myGrid.cells[4] == player && difficulty == 1) {
    cell = corners[IntRandom(0, 3)];
  } else if (
    moves === 2 &&
    myGrid.cells[4] == player &&
    computer == x &&
    difficulty == 1
  ) {
    if (myGrid.cells[0] == computer) {
      cell = 8;
    } else if (myGrid.cells[2] == computer) {
      cell = 6;
    } else if (myGrid.cells[6] == computer) {
      cell = 2;
    } else if (myGrid.cells[8] == computer) {
      cell = 0;
    }
  } else if (moves === 0 && IntRandom(1, 10) < 8) {
    cell = corners[IntRandom(0, 3)];
  } else {
    if (myGrid.cells[4] === 0 && difficulty == 1) {
      cell = 4;
    } else {
      myArr = myGrid.getFreeCellIndices();
      cell = myArr[IntRandom(0, myArr.length - 1)];
    }
  }
  var id = "cell" + cell.toString();
  document.getElementById(id).innerHTML = computerText;
  document.getElementById(id).style.cursor = "default";
  myGrid.cells[cell] = computer;
  moves += 1;
  if (moves >= 5) {
    winner = checkWin();
  }
  if (winner === 0 && !gameOver) {
    whoseTurn = player;
  }
}
function checkWin() {
  winner = 0;
  for (var i = 0; i <= 2; i++) {
    var row = myGrid.getRowValues(i);
    if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
      if (row[0] == computer) {
        score.computer++;
        winner = computer;
      } else {
        score.player++;
        winner = player;
      }
      var tmpAr = myGrid.getRowIndices(i);
      for (var j = 0; j < tmpAr.length; j++) {
        var str = "cell" + tmpAr[j];
        document.getElementById(str).classList.add("win-color");
      }
      setTimeout(endGame, 350);
      return winner;
    }
  }
  for (i = 0; i <= 2; i++) {
    var col = myGrid.getColumnValues(i);
    if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
      if (col[0] == computer) {
        score.computer++;
        winner = computer;
      } else {
        score.player++;
        winner = player;
      }
      var tmpAr = myGrid.getColumnIndices(i);
      for (var j = 0; j < tmpAr.length; j++) {
        var str = "cell" + tmpAr[j];
        document.getElementById(str).classList.add("win-color");
      }
      setTimeout(endGame, 350);
      return winner;
    }
  }
  for (i = 0; i <= 1; i++) {
    var diagonal = myGrid.getDiagValues(i);
    if (
      diagonal[0] > 0 &&
      diagonal[0] == diagonal[1] &&
      diagonal[0] == diagonal[2]
    ) {
      if (diagonal[0] == computer) {
        score.computer++;
        winner = computer;
      } else {
        score.player++;
        winner = player;
      }
      var tmpAr = myGrid.getDiagIndices(i);
      for (var j = 0; j < tmpAr.length; j++) {
        var str = "cell" + tmpAr[j];
        document.getElementById(str).classList.add("win-color");
      }
      setTimeout(endGame, 350);
      return winner;
    }
  }
  var myArr = myGrid.getFreeCellIndices();
  if (myArr.length === 0) {
    winner = 10;
    score.ties++;
    endGame();
  }
  return winner;
}
function showOptions() {
  if (player == o) {
    document.getElementById("rx").checked = false;
    document.getElementById("ro").checked = true;
  } else if (player == x) {
    document.getElementById("rx").checked = true;
    document.getElementById("ro").checked = false;
  }
  if (difficulty === 0) {
    document.getElementById("r0").checked = true;
    document.getElementById("r1").checked = false;
  } else {
    document.getElementById("r0").checked = false;
    document.getElementById("r1").checked = true;
  }
  document.getElementById("optionsDlg").style.display = "block";
}
function choiceDecider() {
  var diffs = document.getElementsByName("difficulty");
  for (var i = 0; i < diffs.length; i++) {
    if (diffs[i].checked) {
      difficulty = parseInt(diffs[i].value);
      break;
    }
  }
  if (document.getElementById("rx").checked === true) {
    player = x;
    computer = o;
    whoseTurn = player;
    playerText = xText;
    computerText = oText;
  } else {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerText = oText;
    computerText = xText;
    setTimeout(makeComputerMove, 500);
  }
  document.getElementById("optionsDlg").style.display = "none";
}
function endGame() {
  gameOver = true;
  gamesound.pause();
  if (winner === 1) winsound.play();
  else if (winner === 3) losssound.play();
  whoseTurn = 0;
  moves = 0;
  winner = 0;
  document.querySelector("#computer_score").textContent = `${score.computer}`;
  document.querySelector("#tie_score").textContent = `${score.ties}`;
  document.querySelector("#player_score").textContent = `${score.player}`;
  for (var i = 0; i <= 8; i++) {
    var id = "cell" + i.toString();
    document.getElementById(id).style.cursor = "default";
  }
  setTimeout(restartGame, 1000);
}
