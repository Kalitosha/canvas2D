class Player {
  constructor(WIDTH, HEIGHT) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    this.reductionRatio = NaN; // коэффициент уменьшения
    (WIDTH < HEIGHT) ? this.reductionRatio = WIDTH : this.reductionRatio = HEIGHT;
    this.w = this.reductionRatio / 10; // ширина
    this.h = this.reductionRatio / 9; // высота
    this.x = WIDTH / 2 - HEIGHT / 10 / 2; // координата х
    this.y = HEIGHT - this.h * 4 / 3; // координата у

    this.speed = 8; // скорость перемещения
    this.score = 0; // счет 

    this.health = 3; // количество жизней
    this.healthW = 50; // ширина сердечка

    this.explMusic = new Audio('assets\\audio\\explosion1.mp3');
    this.playerIm = new Image();
    this.shipExpIm = new Image();
    this.healthIm = new Image();

    this.shipExpIm_sprite = new Image();
    this.explLife = 14; // для отрисовки спрайта из 14ти картинок
    this.currentExplLife = this.explLife;
    this.explWidth = 112;
    this.explX;

    this.lazerReloadDistance = this.y - 120; // расстояние между снарядами
    this.lazerLoaded = true; // перезарядка оружия
    this.lazers = []; // магазин пушки

    this.init();
  }

  init() {
    this.playerIm.src = 'assets\\images\\ship1.webp';
    this.shipExpIm.src = 'assets\\images\\explShip.webp';
    this.healthIm.src = 'assets\\images\\life.webp';

    this.shipExpIm_sprite.src = 'assets\\images\\spriteMap_2.webp';
  }

  resize() {
    (WIDTH < HEIGHT) ? this.reductionRatio = WIDTH : this.reductionRatio = HEIGHT;
    this.w = this.reductionRatio / 10; // ширина
    this.h = this.reductionRatio / 9; // высота
    this.x = WIDTH / 2 - HEIGHT / 5; // координата х
    this.y = HEIGHT - this.h * 4 / 3; // координата у
  }

  reset() {
    this.x = WIDTH / 2 - HEIGHT / 10 / 2; // координата х
    this.y = HEIGHT - HEIGHT / 9 - 15; // координата у
    this.w = HEIGHT / 10; // ширина
    this.h = HEIGHT / 9; // высота

    this.currentExplLife = 14;
    this.score = 0; // счет 
    this.health = 3; // количество жизней
    this.lazers = [];
  }

  drawSprite(ctx) {
    if (this.currentExplLife === this.explLife) {
      ctx.drawImage(this.playerIm, this.x, this.y, this.w, this.h);
    }
    else { // если игрок взорвался, надо отрисовать взрыв
      let life = this.explLife - this.currentExplLife; // 14 - 13

      if (life <= 4) {
        ctx.drawImage(this.shipExpIm, this.x, this.y, this.w, this.h);
      }
      ctx.drawImage(this.shipExpIm_sprite, this.explWidth * life, 0, this.explWidth, this.shipExpIm_sprite.height, this.x - this.w / 2, this.y - this.h * 4 / 3, this.w * 2, this.h * 2);

      this.currentExplLife--;
      if (this.currentExplLife === 0) {
        this.currentExplLife = this.explLife;
      }
    }
  }

  drawScore(ctx) {
    ctx.fillStyle = "#3b95d4";
    ctx.shadowColor = "#3b95d4";
    ctx.shadowBlur = 15;
    ctx.font = 'bold 28px Comic Sans MS';
    ctx.textAlign = "right";
    ctx.fillText(this.score, WIDTH - 50, 35);
    ctx.shadowBlur = 0;
  }

  drawHealth(ctx) {
    const ww = 10 + this.healthW;
    for (let i = 0; i < this.health; i++) {
      ctx.drawImage(this.healthIm, 10 + ww * i, 10, this.healthW, 40);
    }
  }

  drawLasers(ctx) {
    //проверяем расстояние м/д лазерами, достаточно ли оно для выстрела следующего
    if (this.lazers.length !== 0) { // если в массиве есть лазеры
      if (this.lazers[this.lazers.length - 1].y >= this.lazerReloadDistance)
        this.lazerLoaded = true;
    } else {
      this.lazerLoaded = true;
    }
    for (var i = 0; i < this.lazers.length; i++) {
      let currentL = this.lazers[i];

      if (currentL.y > -20) // если все еще на экране
        currentL.drawOneLazer(ctx);
      else {
        this.lazers.splice(i, 1); // начиная с i удалили один эл-т
      }
    }
  }
}


class Lazer {
  constructor(player) {
    this.x = player.x + player.w / 2;
    this.y = player.y;
    this.lazerSpeed = 16;
  }

  drawOneLazer(ctx) {
    ctx.fillStyle = "#ff9500";
    ctx.shadowColor = "#ff9500";
    this.y -= this.lazerSpeed;
    ctx.fillRect(this.x, this.y, 2, 18);
    ctx.shadowBlur = 0;
  }
}


class Asteroid {
  constructor() {
    this.reductionRatio = 0;
    (WIDTH < HEIGHT) ? this.reductionRatio = WIDTH : this.reductionRatio = HEIGHT// коэффициент уменьшения
    this.alive = true;
    this.speed = Math.random() * (8 - 3) + 3; // скорость = [3;8) 
    this.x = Math.floor(Math.random() * WIDTH - HEIGHT / 10);
    this.y = 0 - HEIGHT / 10;
    this.h = this.reductionRatio / 10;
    this.w = this.reductionRatio / 10;
    this.explLife = 6; // для отрисовки спрайта из 6ти картинок
    this.explX = 0;
    this.explWidth = 194; // ширина спрайта
  }

  drawSprite(ctx, asteroidIm) {
    ctx.drawImage(asteroidIm, this.x, this.y, this.w, this.h);
  }

  move() {
    this.y += this.speed;
  }


  drawExplosion(ctx, explIm) {
    ctx.drawImage(explIm, this.explX, 0, this.explWidth, explIm.height, this.x, this.y, this.w, this.h);
    this.explX += this.explWidth;
  }

  resize() {
    (WIDTH < HEIGHT) ? this.reductionRatio = WIDTH : this.reductionRatio = HEIGHT;
    this.h = this.reductionRatio / 10;
    this.w = this.reductionRatio / 10;
  }
}


class Space {
  constructor(WIDTH, HEIGHT) {
    this.asteroids = []; // живые астероиды
    this.explAsteroids = []; // взорванные астероиды
    this.asteroidIm = new Image();
    this.explIm = new Image();

    this.maxAsteroids = 20;
    this.collidedAIndex = -1; // индекс столкновений

    this.player = new Player(WIDTH, HEIGHT);
    this.explMusic = new Audio('assets\\audio\\explosion2.mp3');

    this.init();
  }

  init() {
    this.asteroidIm.src = 'assets\\images\\asteroid.webp';
    this.explIm.src = 'assets\\images\\spriteMapExpl.webp';
  }

  reset() {
    this.asteroids = [];
    this.player.reset();
  }

  drawAsteroids(ctx) {
    if (
      Math.random() <= 0.099 &&  // создаем новые астероиды
      this.asteroids.length < this.maxAsteroids) {
      this.asteroids.push(new Asteroid());
    }

    for (let i = 0; i < this.asteroids.length; i++) {
      let currentA = this.asteroids[i]; // делаем удобочитаемую ссылку для удобства
      if (currentA.alive === false) { // астероид уничтожен
        this.explAsteroids.push(currentA);
        this.asteroids.splice(i, 1);
        continue;
      }
      if (currentA.y > HEIGHT + currentA.h) { // астероид улетел за конец экрана
        this.asteroids.splice(i, 1);
        continue;
      }
      currentA.drawSprite(ctx, this.asteroidIm);
      currentA.move();
    }

    for (let i = 0; i < this.explAsteroids.length; i++) {
      let currentEx = this.explAsteroids[i]; // делаем удобочитаемую ссылку для удобства
      if (currentEx.explLife <= 0) {
        this.explAsteroids.splice(i, 1);
        continue;
      }
      if (currentEx.explLife > 0) {
        currentEx.drawExplosion(ctx, this.explIm);
        currentEx.explLife--;
      }
    }
  }

  resize() {
    this.player.resize()
    for (let value of this.asteroids) {
      value.resize();
    }
  }

  checkCollision(ctx) {
    for (let i = 0; i < this.asteroids.length; i++) {
      let currentA = this.asteroids[i];

      if (this.player.currentExplLife === this.player.explLife) { // если сейчас не отрисовывается взрыв
        // проверяем столкновение игрока с астероидом
        if ((currentA.x - currentA.w / 4 * 3 <= this.player.x) &&
          (currentA.x + currentA.w / 4 * 3 >= this.player.x) &&
          (currentA.y + currentA.h / 3 >= this.player.y) &&
          (this.collidedAIndex !== this.asteroids.indexOf(currentA))) {
          this.collidedAIndex = this.asteroids.indexOf(currentA);
          this.player.health--;
          this.player.currentExplLife--;
        }

        // Сброс индекса столкновения астероида с игроком
        if (this.collidedAIndex === this.asteroids.indexOf(currentA) &&
          currentA.y < HEIGHT / 2) {
          this.collidedAIndex = -1;
        }
      } else {
        this.player.explMusic.play();
      }

      // столкновение лазера с астероидами
      for (let j = 0; j < this.player.lazers.length; j++) {
        let currentL = this.player.lazers[j];
        if ((currentL.x <= currentA.x + currentA.w) &&
          (currentL.x >= currentA.x) &&
          (currentL.y <= currentA.y)) {
          currentA.alive = false;

          this.explMusic.stop();
          this.explMusic.play();

          this.player.score++;
          this.player.lazers.splice(this.player.lazers.indexOf(currentL), 1);
        }
      }
    }
  }
}


class GameLoop {
  constructor(WIDTH, HEIGHT) {
    this.playText = '';
    this.bgIm = new Image();
    this.gameStatus = 'start'; // start, play, finish
    this.backgroundHeight = 0;
    this.bgSpeed = 2;

    this.init();
  }

  init() {
    this.bgIm.src = 'assets\\images\\space.webp';
  }

  showText(ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#cb6e06";
    ctx.shadowColor = "#392388";
    ctx.shadowBlur = 25;
    ctx.textBaseline = "middle";

    if (this.gameStatus === 'start') {
      this.playText = 'Click to start';
    }
    else if (this.gameStatus === 'finish') {
      ctx.font = '90px Comic Sans MS';
      ctx.fillText('your score: ' + space.player.score, WIDTH / 2 - ctx.measureText(this.playText).width / 2, HEIGHT / 2 + 120);

      this.playText = 'GAME OVER';
    }

    ctx.font = 'bold 120px Comic Sans MS';
    ctx.fillText(this.playText, WIDTH / 2 - ctx.measureText(this.playText).width / 2, HEIGHT / 2);
    ctx.shadowBlur = 0;
  }

  drawBackground(ctx) { //TODO иногда текструра не состыкуется (возможно надо поискать другую картинку или еще подумать над алгоритмом)
        if (this.backgroundHeight + this.bgSpeed < HEIGHT) {
      this.backgroundHeight += this.bgSpeed;
    }
    else {
      this.backgroundHeight = 0;
    }
    
    let bgW = 0;
    let bgH = this.backgroundHeight;

    while (bgW < WIDTH) { // возврат фона наверх
      while (bgH < HEIGHT) {
        ctx.drawImage(this.bgIm, bgW, bgH);
        bgH += this.bgIm.height;
      }
      bgW += this.bgIm.width;
      bgH = this.backgroundHeight;
    }

    bgW = 0;
    bgH = this.backgroundHeight  - HEIGHT - this.bgIm.height;

    while (bgW < WIDTH) { //движемся по горизонтали
      while (bgH < this.backgroundHeight) { // движемся по вертикали
        ctx.drawImage(this.bgIm, bgW, bgH);
        bgH += this.bgIm.height;
      }
      bgW += this.bgIm.width;
      bgH = this.backgroundHeight - HEIGHT - this.bgIm.height;
    }

  }

  gamePlay(ctx, space) {
    this.drawBackground(ctx);
    space.checkCollision(ctx);
    space.drawAsteroids(ctx);
    space.player.drawLasers(ctx);
    space.player.drawSprite(ctx);
    space.player.drawScore(ctx);
    space.player.drawHealth(ctx);
    if ((space.player.health <= 0) && (space.player.explLife === space.player.currentExplLife)) {
      this.gameStatus = 'finish';
    }
  }
}

/* ---------------------------------------------------------- */
const canvas = document.querySelector(".canvas");
canvas.style.touchAction = 'manipulation'; /*отключение двойного клика (увеличения) на сенсорных устройствах*/
canvas.style.backgroundImage = "url('assets/images/space.webp')";
const ctx = canvas.getContext("2d");

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const space = new Space(WIDTH, HEIGHT);
const gameLoop = new GameLoop(WIDTH, HEIGHT)

// Функция stop для Audio:
HTMLAudioElement.prototype.stop = function () {
  this.pause();
  this.currentTime = 0.0;
}



window.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  reDraw()
}

function reDraw() {
  switch (gameLoop.gameStatus) {
    case 'start':
      gameLoop.showText(ctx);
      space.reset();
      space.resize();
      break;
    case 'play':
      gameLoop.gamePlay(ctx, space);
      break;
    case 'finish':
      gameLoop.showText(ctx);
      break;
  }
  window.requestAnimationFrame(reDraw);
}

/*****************обработчики***********************/
window.addEventListener('resize', resize);
document.addEventListener('keydown', KeyDown, true);
document.addEventListener('keyup', KeyUp, true);
canvas.onmousemove = mouseMove;
canvas.onmousedown = onMouseDown;
//canvas.touchstart = touchStart; // при таком объявлении кораблик прыгает
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('touchmove', touchMove);


function onMouseDown(e) {
  pressingButton('click');
}

function mouseMove(e) {
  space.player.x = e.clientX - space.player.w / 2;
};

function pressingButton(flag) {
  switch (gameLoop.gameStatus) {
    case 'start':
      gameLoop.gameStatus = 'play';
      break;
    case 'play':
      if (flag === 'right' && space.player.x <= WIDTH - space.player.w) {
        space.player.x += space.player.speed;
      }
      else if (flag === 'left' && space.player.x > 0) {
        space.player.x -= space.player.speed;
      }
      else { //пробел, клик или тач
        if ((space.player.lazerLoaded) && (flag === 'click' || flag === 'space')) {
          space.player.lazers.push(new Lazer(space.player));
          space.player.lazerLoaded == false;
        }
      }
      break;
    case 'finish':
      gameLoop.gameStatus = 'start';
      break;
  }
}

function KeyDown(e) {
  if (e.key === 'ArrowRight') {
    pressingButton('right');
  }
  else if (e.key === 'ArrowLeft') {
    pressingButton('left');
  }
}

function KeyUp(e) {
  if (e.key === ' ') {
    pressingButton('space');
  }
}

function touchMove(e) {
  e.stopPropagation();
  e.preventDefault();
  if (e.targetTouches.length === 1) {
    let touch = e.targetTouches[0];
    space.player.x = touch.pageX - space.player.w / 2;
  }
}

function touchStart(e) {
  e.stopPropagation();
  e.preventDefault();
  pressingButton('click');
}

function resize(e) {
  canvas.width = e.target.innerWidth;
  canvas.height = e.target.innerHeight;
  WIDTH = e.target.innerWidth;
  HEIGHT = e.target.innerHeight;

  space.resize();
}