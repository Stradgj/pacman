const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostsFrames = document.getElementById("ghosts");

const createRect = (x, y, width, heigth, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, heigth);
};

let pacman;
let ghosts;
let score = 0;
let lives = 3;
let foodCount = 0;
const fps = 30;
const oneBlockSize = 20;
const wallColor = "#342DCa";
const wallSpaceWidth = oneBlockSize / 1.5;
const wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
const innerColor = "black";
const foodColor = "#FEB897";
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
const ghostCount = 4;

const ghostLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[0].length; j++) {
    if (map[i][j] === 2) {
      foodCount++;
    }
  }
}
const randomTargets = [
  { x: oneBlockSize, y: oneBlockSize },
  { x: oneBlockSize, y: (map.length - 2) * oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize },
];

const gameLoop = () => {
  draw();
  update();
};

const update = () => {
  // todo
  pacman.moveProcess();
  pacman.eat();
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }

  if (pacman.checkGhostCollision()) {
    restartGame();
  }
  if (score >= foodCount) {
    drawGameWin();
    clearInterval(gameInterval);
  }
};

const restartGame = () => {
  createNewPacman();
  createGhosts();
  lives--;
  if (lives === 0) {
    gameOver();
  }
};

const gameOver = () => {
  clearInterval(gameInterval);
  drawGameOver();
};

const drawGameOver = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Game over!", 150, 200);
};
const drawGameWin = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("You win!", 150, 200);
};

const drawLives = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(`Lives: `, 220, oneBlockSize * (map.length + 1));

  for (let i = 0; i < lives; i++) {
    canvasContext.drawImage(
      pacmanFrames,
      2 * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      350 + i * oneBlockSize,
      oneBlockSize * map.length + 1,
      oneBlockSize,
      oneBlockSize
    );
  }
};
const drawScore = function () {
  canvasContext.font = "20px emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(`Score: ${score}`, 0, oneBlockSize * (map.length + 1));
};

const drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
};

const draw = () => {
  createRect(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  drawFoods();
  pacman.draw();
  drawScore();
  drawGhosts();
  drawLives();
};

const drawFoods = function () {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === 2) {
        createRect(
          j * oneBlockSize + oneBlockSize / 3,
          i * oneBlockSize + oneBlockSize / 3,
          oneBlockSize / 3,
          oneBlockSize / 3,
          foodColor
        );
      }
    }
  }
};
let gameInterval = setInterval(gameLoop, 1000 / fps);

const drawWalls = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === 1) {
        // is the wall
        createRect(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        );
      }
      if (j > 0 && map[i][j - 1] === 1) {
        createRect(
          j * oneBlockSize,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          innerColor
        );
      }
      if (j < map[0].length - 1 && map[i][j + 1] === 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth + wallOffset,
          wallSpaceWidth,
          innerColor
        );
      }
      if (i > 0 && map[i - 1][j] === 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          innerColor
        );
      }
      if (i < map.length - 1 && map[i + 1][j] === 1) {
        createRect(
          j * oneBlockSize + wallOffset,
          i * oneBlockSize + wallOffset,
          wallSpaceWidth,
          wallSpaceWidth + wallOffset,
          innerColor
        );
      }
    }
  }
};

const createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5
  );
};

const createGhosts = () => {
  ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let newGhost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostLocations[i % 4].x,
      ghostLocations[i % 4].y,
      124,
      116,
      6 + i
    );
    ghosts.push(newGhost);
  }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", function (e) {
  let key = e.keyCode;

  setTimeout(() => {
    if (key === 37 || key === 65) {
      // Left
      pacman.nextDirection = DIRECTION_LEFT;
    }
    if (key === 38 || key === 87) {
      // Up
      pacman.nextDirection = DIRECTION_UP;
    }
    if (key === 39 || key === 68) {
      // Right
      pacman.nextDirection = DIRECTION_RIGHT;
    }
    if (key === 40 || key === 83) {
      // Bottom
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});
