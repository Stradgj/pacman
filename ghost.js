class Ghost {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    range
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_RIGHT;
    this.nextDirection = this.direction;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.range = range;
    this.randomTargetIndex = parseInt(Math.random() * randomTargets.length);

    setInterval(() => {
      this.changeRandomDirection();
    }, 10000);
  }

  changeRandomDirection() {
    this.randomTargetIndex += 1;
    this.randomTargetIndex = this.randomTargetIndex % 4;
  }

  calcNewDirection(map, destX, destY) {
    const mp = [];
    for (let i = 0; i < map.length; i++) {
      mp[i] = map[i].slice;
    }
    const queue = [
      {
        x: this.getMapX(),
        y: this.getMapY(),
        moves: [],
      },
    ];
    while (queue.length > 0) {
      const poped = queue.shift();
      if (poped.x === destX && poped.y === destY) {
        return poped.moves[0];
      } else {
        mp[poped.y][poped.x] = 1;
        const neighborList = this.addNeighbors(poped, mp);
      }
    }
  }

  moveProcess() {
    if (this.isInRangeOfPacman()) {
      target = pacman;
    } else {
      target = randomTargets[randomTargetIndex];
    }
    this.changeDirection();
    this.moveForvards();
    if (this.checkCollision()) {
      this.moveBackwards();
      return;
    }
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT: // Right
        this.x -= this.speed;
        break;
      case DIRECTION_UP: // Up
        this.y += this.speed;
        break;
      case DIRECTION_LEFT: // Left
        this.x += this.speed;
        break;
      case DIRECTION_BOTTOM: // Bottom
        this.y -= this.speed;
        break;
    }
  }
  moveForvards() {
    switch (this.direction) {
      case DIRECTION_RIGHT: // Right
        this.x += this.speed;
        break;
      case DIRECTION_UP: // Up
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT: // Left
        this.x -= this.speed;
        break;
      case DIRECTION_BOTTOM: // Bottom
        this.y += this.speed;
        break;
    }
  }
  checkCollision() {
    let isCollisded = false;
    if (
      map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] ===
        1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
        parseInt(this.x / oneBlockSize)
      ] === 1 ||
      map[parseInt(this.y / oneBlockSize)][
        parseInt(this.x / oneBlockSize + 0.9999)
      ] === 1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
        parseInt(this.x / oneBlockSize + 0.9999)
      ] === 1
    ) {
      isCollisded = true;
    }
    return isCollisded;
  }
  getMapX() {
    let mapX = parseInt(this.x / oneBlockSize);
    return mapX;
  }

  getMapY() {
    let mapY = parseInt(this.y / oneBlockSize);

    return mapY;
  }

  getMapXRightSide() {
    let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
    return mapX;
  }

  getMapYRightSide() {
    let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
    return mapY;
  }
  checkGhostCollision() {}

  isInRangeOfPacman() {
    const xDistance = Math.abs(pacman.getMapX() - this.getMapX());
    const yDistance = Math.abs(pacman.getMapY() - this.getMapY());
    if (
      Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range
    ) {
      return true;
    }
    return false;
  }

  changeDirection() {
    this.tempDirection = this.direction;
    this.direction = this.calcNewDirection(
      map,
      parseInt(this.target.x / oneBlockSize),
      map,
      parseInt(this.target.y / oneBlockSize)
    );

    this.moveForvards;
    if (this.checkCollision()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  changeAnimation() {
    this.currentFrame =
      this.currentFrame === this.frameCount ? 1 : this.currentFrame + 1;
  }
  draw() {
    canvasContext.save();

    canvasContext.drawImage(
      ghostsFrames,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    canvasContext.restore();
  }

  eat() {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] === 2 && this.getMapX() === j && this.getMapY() === i) {
          map[i][j] = 3;
          score++;
        }
      }
    }
  }
}
