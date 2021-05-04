class Player {
  constructor(WIDTH, HEIGHT) {
    this.x = WIDTH / 2 - HEIGHT / 10 / 2; // координата х
    this.y = HEIGHT - HEIGHT / 9 - 15; // координата у
    this.w = HEIGHT / 10; // ширина
    this.h = HEIGHT / 9; // высота

    this.speed = 10; // скорость перемещения
    this.score = 0; // счет 

    this.health = 3; // количество жизней
    this.healthW = 50; // ширина сердечка

    //this.explMusic = new Audio('assets\\audio\\explosion1.mp3');
    this.playerIm = new Image();
    this.shipExpIm = new Image();
    this.healthIm = new Image();

    this.lazerReloadDistance = this.y - 120; // расстояние между снарядами
    this.lazerLoaded = true; // перезарядка оружия
    this.lazers = []; // магазин пушки

    this.init();
  }

  init() {
    this.playerIm.src = 'assets\\images\\ship1.webp';
    this.shipExpIm.src = 'assets\\images\\explShip.webp';
    this.healthIm.src = 'assets\\images\\life.webp';
  }

  resize(WIDTH, HEIGHT) {
    this.x = WIDTH / 2 - HEIGHT / 10 / 2; // координата х
    this.y = HEIGHT - HEIGHT / 9 - 15; // координата у
    this.w = HEIGHT / 10; // ширина
    this.h = HEIGHT / 9; // высота
  }

  drawSprite(ctx) {
    ctx.drawImage(this.playerIm, this.x, this.y, this.w, this.h);
  }

  /*resetExplMusic() {
    this.explMusic.pause(); // !!! TODO https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.explMusic.currentTime = 0.0;
  }*/

  drawExpSprite() {
    //this.resetExplMusic();
    ctx.drawImage(this.shipExpIm, this.x - this.w / 2, this.y - this.h * 3 / 2, this.w * 2, this.h * 2);
    /*this.explMusic.play();*/
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
    if (this.health >= 3)
      ctx.drawImage(this.healthIm, 10 + this.healthW + 10 + this.healthW + 10, 10, this.healthW, 40);
    if (this.health >= 2)
      ctx.drawImage(this.healthIm, 10 + this.healthW + 10, 10, this.healthW, 40);
    if (this.health >= 1)
      ctx.drawImage(this.healthIm, 10, 10, this.healthW, 40);
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
    this.alive = true;
    this.speed = 4; //Math.random() * (7 - 3) + 3; // [3;7)
    this.x = Math.floor(Math.random() * WIDTH - HEIGHT / 10); //TODO возможно надо сделать их реже
    this.y = 0 - HEIGHT / 10;
    this.h = HEIGHT / 10;
    this.w = HEIGHT / 10;

    this.explLife = 6; // для отрисовки спрайта из 6ти картинок

    this.explX = 0;
    this.explWidth = 194;
  }

  drawSprite(ctx, asteroidIm) {
    //console.log('drawSprite', this);
    ctx.drawImage(asteroidIm, this.x, this.y, this.w, this.h);
    
  }

  move(){
    this.y += this.speed;
  }


  drawExplosion(ctx, explIm) {
    ctx.drawImage(explIm, this.explX, 0, this.explWidth, explIm.height, this.x, this.y, this.w, this.h);
    this.explX += this.explWidth;
    this.explHeight += this.explWidth;
  }

  resize(WIDTH, HEIGHT) {
    this.x = WIDTH / 2 - HEIGHT / 10 / 2; // координата х
    this.y = 0 - HEIGHT / 10;
    this.h = HEIGHT / 10;
    this.w = HEIGHT / 10;
  }
}


//надкласс для астероидов
class Space {
  constructor(WIDTH, HEIGHT) {
    this.asteroids = []; // живые астероиды
    this.explAsteroids = []; // взорванные астероиды
    this.asteroidIm = new Image();
    this.explIm = new Image();

    this.maxAsteroids = 20;
    this.collidedAIndex = -1; // индекс столкновений

    this.player = new Player(WIDTH, HEIGHT);
    //this.explMusic = new Audio('assets\\audio\\explosion2.mp3');

    this.init();
  }

  init() {
    this.asteroidIm.src = 'assets\\images\\asteroid.webp';
    this.explIm.src = 'assets\\images\\spriteMapExpl.webp';
  }

  drawAsteroids(ctx) {
    //console.log('drawAsteroids')
    if (
      Math.random() <= 0.09 &&  // создаем новые астероиды
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

  resize(WIDTH, HEIGHT) { //TODO !!!
    this.player.resize(WIDTH, HEIGHT)
    //this.asteroids.forEach(el => {
    for (let value of this.asteroids) {
      value.resize(WIDTH, HEIGHT);
      //console.log(value);
    }

  }

  checkCollision(WIDTH, HEIGHT) {
    for (let i = 0; i < this.asteroids.length; i++) {
      let currentA = this.asteroids[i];

      // проверяем столкновение игрока с астероидом
      if ((currentA.x - currentA.w / 4 * 3 <= this.player.x) &&
        (currentA.x + currentA.w / 4 * 3 >= this.player.x) &&
        (currentA.y + currentA.h / 3 >= this.player.y) &&
        (this.collidedAIndex !== this.asteroids.indexOf(currentA))) { // TODO this.asteroids.indexOf(currentA) это же по сути поиск i-го астероида
        this.collidedAIndex = this.asteroids.indexOf(currentA);
        this.player.health--;
        this.player.drawExpSprite();
      }

      // Сброс индекса столкновения астероида с игроком
      if (this.collidedAIndex === this.asteroids.indexOf(currentA) && // TODO this.asteroids.indexOf(currentA) это же по сути поиск i-го астероида
        currentA.y < HEIGHT / 2) {
        this.collidedAIndex = -1;
      }

      // столкновение лазера с астероидами
      for (let j = 0; j < this.player.lazers.length; j++) {
        let currentL = this.player.lazers[j];
        if ((currentL.x <= currentA.x + currentA.w) &&
          (currentL.x >= currentA.x) &&
          (currentL.y <= currentA.y)) {
          currentA.alive = false;

          /*this.explMusic.pause();
          this.explMusic.currentTime = 0.0;
          this.explMusic.play();*/

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

    this.init();
  }

  init() {
    this.bgIm.src = 'assets\\images\\background.webp';
  }

  showText(ctx) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#cb6e06";
    ctx.shadowColor = "#392388";
    ctx.shadowBlur = 25;
    ctx.textBaseline = "middle";

    if (this.gameStatus === 'start') {
      this.playText = 'Click to start';
    }
    else if (this.gameStatus === 'finish') {
      ctx.font = '100px Comic Sans MS';
      ctx.fillText('your score: ' + space.player.score, WIDTH / 2 - ctx.measureText(this.playText).width / 2, HEIGHT / 2 + 150);

      this.playText = 'GAME OVER';
    }

    ctx.font = 'bold 150px Comic Sans MS';
    ctx.fillText(this.playText, WIDTH / 2 - ctx.measureText(this.playText).width / 2, HEIGHT / 2);
    ctx.shadowBlur = 0;
  }

  drawBackground(ctx, heightBg) { //TODO надо оптимизировать (3 раза почти один и тот же код)
    let bgW = 0;
    let bgH = heightBg - HEIGHT - this.bgIm.height / 3.2;
    if (this.gameStatus === 'play') {
      while (bgW < WIDTH) {
        while (bgH < heightBg) {
          ctx.drawImage(this.bgIm, bgW, bgH);
          bgH += this.bgIm.height;
        }
        bgW += this.bgIm.width;
        bgH = heightBg - HEIGHT - this.bgIm.height / 3.2;
      }

      bgW = 0;
      bgH = heightBg;

      while (bgW < WIDTH) {
        while (bgH < HEIGHT) {
          ctx.drawImage(this.bgIm, bgW, bgH);
          bgH += this.bgIm.height;
        }
        bgW += this.bgIm.width;
        bgH = heightBg;
      }
    }
    else {
      bgW = 0;
      bgH = 0;
      while (bgW < WIDTH) {
        while (bgH < HEIGHT) {
          
          ctx.drawImage(this.bgIm, bgW, bgH);
          bgH += this.bgIm.height;
        }
        bgW += this.bgIm.width;
        bgH = 0;
      }
    }
  }

  gamePlay(ctx, WIDTH, HEIGHT, space) { //!!! TODO мб тут лучше сделать колбек
    //console.log('gamePlay')
    space.checkCollision(WIDTH, HEIGHT);
    space.drawAsteroids(ctx);
    space.player.drawLasers(ctx);
    space.player.drawSprite(ctx);
    space.player.drawScore(ctx);
    space.player.drawHealth(ctx);
    if (space.player.health <= 0) {
      this.gameStatus = 'finish';
    }
  }

  

  /* resize(ctx, WIDTH, HEIGHT){
    showText(ctx);

  }*/

}



console.log('it`s work')
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;


let keys = [false, false, false];
let isTouch = false;
/* ---------------------------------------------------------- */

space = new Space(WIDTH, HEIGHT);
gameLoop = new GameLoop(WIDTH, HEIGHT)




window.onload = function () {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  console.log('onload')
  //setTimeout(reDraw(), 2000);
  reDraw()

}


function reDraw() { //! TODO ??? 

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  /************************************* */
  /*********можно убрать отсюда***********/
  canvas.onmousemove = mouseMove;
  canvas.onmousedown = onMouseDown;

  canvas.touchstart = touchStart; // Tap (Косание)
  if (isTouch) { 
    space.player.lazers.push(new Lazer(space.player));
    space.player.lazerLoaded = false;
  }
  /************************************* */

  if ((gameLoop.backgroundHeight > HEIGHT) && (gameLoop.backgroundHeight % gameLoop.bgIm.height) === 0) // % чтобы не дергался
    gameLoop.backgroundHeight = 0;
  else
    gameLoop.backgroundHeight += 2;
  gameLoop.drawBackground(ctx, gameLoop.backgroundHeight);


  switch (gameLoop.gameStatus) {
    case 'start':
      gameLoop.showText(ctx);
      break;
    case 'play':
      gameLoop.gamePlay(ctx, WIDTH, HEIGHT, space);
      //console.log('gameLoop.gameStatus = ', gameLoop.gameStatus)
      break;
    case 'finish':
      gameLoop.showText(ctx);
      break;
  }  
  
  //console.log('gameLoop.gameStatus = ', gameLoop.gameStatus)
  //setTimeout(window.requestAnimationFrame(reDraw()), 1500);
  window.requestAnimationFrame(reDraw); //! TODO ??? 
}

/*****************обработчики***********************/
window.addEventListener('resize', resize);
document.addEventListener("keydown", KeyDown, true);
document.addEventListener("keyup", KeyUp, true);


function KeyDown() {}
function KeyUp() {}
function touchStart() {}


function onMouseDown() {
  console.log('onMouseDown')  
  
  switch (gameLoop.gameStatus) {
    case 'start':
      gameLoop.gameStatus = 'play';
      space.player.health = 3;
      space.player.score = 0;
      break;
    case 'play':
      if (space.player.lazerLoaded) {
        space.player.lazers.push(new Lazer(space.player));
        space.player.lazerLoaded = false;
      }
      break;
    case 'finish': 
      gameLoop.gameStatus = 'start';
      space.player.lazers = [];
      space.asteroids = [];
      break;
  }  
}


var mouseMove = function (e) {
  space.player.x = e.clientX - space.player.w / 2;
};


function pressingButton() {
  console.log('pressingButton: KeyDown/KeyUp')
  switch (gameLoop.gameStatus) {
    case 'start':
      gameLoop.gameStatus = 'play';
      space.player.health = 3;
      space.player.score = 0;
      break;
    case 'play':
      if (keys[0] == true && keys[1] == false && space.player.x <= WIDTH - space.player.w) {
        space.player.x += space.player.vx;
      }
      if (keys[1] == true && keys[0] == false && space.player.x > 0) {
        space.player.x -= space.player.vx;
      }
      if (keys[2] == true) {
        if (space.player.lazerLoaded) {
          space.player.lazers.push(new Lazer(space.player)); 
          space.player.lazerLoaded == false;
        }
      }
      break;
    case 'finish':
      gameLoop.gameStatus = 'start';
      space.player.lazers = [];
      space.asteroids = [];
      break;
  }
}


/*
function KeyDown(e) {
  console.log('KeyDown')
  if (e.keyCode == 39) {
    keys[0] = true;
  }
  else if (e.keyCode == 37) {
    keys[1] = true;
  }
  pressingButton();
}
*/

/*
function KeyUp(e) {
  console.log('KeyUp')
  if (e.keyCode == 39) { // Right
    keys[0] = false;
  }
  else if (e.keyCode == 37) { // Left
    keys[1] = false;
  }
  if (e.keyCode == 32) {// Space
    keys[2] = true;
    pressingButton();
    keys[2] = false;
  }
}
*/

/*
canvas.addEventListener(
  'touchmove',
  function (e) {
    console.log('touchmove')
    e.stopImmediatePropagation()
    e.preventDefault(); // Предотвращение скролла ???
    //e.stopPropagation(); //останавливает "всплытие" вызова события к родительским элементам
    /* далее код обработки события*/
    /*if (e.targetTouches.length === 1) {
      let touch = e.targetTouches[0];
      isTouch === true;
      space.player.x = touch.pageX - space.player.w / 2;
    }
  }
);
*/

/*
function touchStart() {
  console.log('touchStart')
  isTouch === true;
  switch (gameLoop.gameStatus) {
    case 'start':
      gameLoop.gameStatus = 'play';
      space.player.health = 3;
      space.player.score = 0;
      break;
    case 'play':
      if (space.player.lazerLoaded) {
        space.player.llazers.push(new Lazer(space.player));
        space.player.llazerLoaded = false;
      }
      break;
    case 'end':
      gameLoop.gameStatus = 'start';
      space.player.llazers = [];
      space.asteroids = [];
      break;
  }
}
*/

function resize(e) {
  console.log('resize')
  //console.log(e.target)

  canvas.width = e.target.innerWidth;
  canvas.height = e.target.innerHeight;

  WIDTH = e.target.innerWidth;
  HEIGHT = e.target.innerHeight;

  //space.resize(WIDTH, HEIGHT);
}