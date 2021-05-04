console.log('start')

/*const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");*/

/* window.addEventListener('resize', resize);
document.addEventListener("keydown", KeyDown, true);
document.addEventListener("keyup", KeyUp, true); */

/*let gameStatus = 'start'; // start, play, end
let keys = [false, false, false];
let isTouch = false;*/

/*let explIm = new Image();
explIm.src = 'assets\\images\\spriteMapExpl.png';*/

/* bgIm = new Image();
bgIm.src = 'assets\\images\\background.png'; */

/*let healthIm = new Image();
healthIm.src = 'assets\\images\\life.png';*/

/*let playerIm = new Image();
playerIm.src = 'assets\\images\\ship1.png';*/

/*let shipExpIm = new Image();
shipExpIm.src = 'assets\\images\\explShip.png';*/

/*let asteroidIm = new Image();
asteroidIm.src = 'assets\\images\\asteroid.png';*/

/*let WIDTH = document.documentElement.clientWidth;
let HEIGHT = document.documentElement.clientHeight;*/

/*let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;*/

window.onload = function () {
  /*canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;*/

  /*canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;*/


  const bgAudio = new Audio('assets\\audio\\BackgroundMusic.mp3');

  bgAudio.volume = 0.1;
  //bgAudio.play();

  /*explMusic = new Audio('assets\\audio\\explosion1.mp3');*/ 
  //explMusic_2 = new Audio('assets\\audio\\explosion2.mp3');

  reDraw();
};


var player = {
  /*x: WIDTH / 2 - HEIGHT / 10 / 2, // координата х
  y: HEIGHT - HEIGHT / 9 - 15, // координата у
  w: HEIGHT / 10, // ширина
  h: HEIGHT / 9, // высота
  vx: 10,
  score: 0,

  health: 3,
  healthW: 50,*/

  /*drawSprite: function () {
    ctx.drawImage(playerIm, this.x, this.y, this.w, this.h);
  },
  drawExpSprite: function () {
    explMusic.pause();
    explMusic.currentTime = 0.0;
    ctx.drawImage(shipExpIm, this.x - this.w / 2, this.y - this.h * 3 / 2, this.w * 2, this.h * 2);
    explMusic.play();
  },*/

  /*drawScore: function () {
    ctx.fillStyle = "#3b95d4";
    ctx.shadowColor = "#3b95d4";
    ctx.shadowBlur = 15;
    ctx.font = 'bold 28px Comic Sans MS';
    ctx.textAlign = "right"; // выравнивание
    ctx.fillText(this.score, WIDTH - 50, 35);
    ctx.shadowBlur = 0;
  },*/

  /*drawHealth: function () {
    if (this.health >= 3)
      ctx.drawImage(healthIm, 10 + this.healthW + 10 + this.healthW + 10, 10, this.healthW, 40);
    if (this.health >= 2)
      ctx.drawImage(healthIm, 10 + this.healthW + 10, 10, this.healthW, 40);
    if (this.health >= 1)
      ctx.drawImage(healthIm, 10, 10, this.healthW, 40);
  }*/
};
/*
var lazerReloadDistance = player.y - 120;
var lazerLoaded = true;*/

/*function Lazer() {
  this.x = player.x + player.w / 2;
  this.y = player.y;
  this.lazerSpeed = 16;
  this.drawL = function () {
    ctx.fillStyle = "#ff9500";
    ctx.shadowColor = "#ff9500";
    // ctx.shadowBlur = 15;
    this.y -= this.lazerSpeed;
    ctx.fillRect(this.x, this.y, 2, 18);
    ctx.shadowBlur = 0;
  }
}*/
/*
var lazers = [];

function DrawLasers() {
  //проверяем расстояние м/д лазерами, достаточно ли оно для выстрела следующего
  if (lazers.length !== 0) { // если в массиве есть лазеры
    if (lazers[lazers.length - 1].y >= lazerReloadDistance)
      lazerLoaded = true;
  } else {
    lazerLoaded = true;
  }
  for (var i = 0; i < lazers.length; i++) {
    var currentL = lazers[i];

    if (currentL.y > -20) // если все еще на экране
      currentL.drawL();
    else {
      lazers.splice(i, 1); // начиная с i удалили один эл-т
    }
  }
}*/

//var maxAsteroids = 20;

function Asteroid() {
  /*this.alive = true;
  this.speed = 5;
  this.x = Math.floor(Math.random() * WIDTH - HEIGHT / 10);
  this.y = 0 - HEIGHT / 10;
  this.h = HEIGHT / 10;
  this.w = HEIGHT / 10;

  this.explLife = 6;*/
  /*this.drawSprite = function () {
    ctx.drawImage(asteroidIm, this.x, this.y, this.w, this.h);
    this.y += this.speed;
  };*/

  /*this.explX = 0;
  this.explWidth = 194;*/

  /*this.drawExplosion = function () {
    ctx.drawImage(explIm, this.explX, 0, this.explWidth, explIm.height, this.x, this.y, this.w, this.h);
    this.explX += 194; // this.explHeight;
    this.explHeight += 194;

  }*/
}

/*var asteroids = [];
var explAsteroids = [];*/

/* function DrawAsteroids() {
  if (
    Math.random() <= 0.09 &&  // создаем новые астероиды
    asteroids.length < maxAsteroids) {
    asteroids.push(new Asteroid());
  }

  for (var i = 0; i < asteroids.length; i++) {
    var currentA = asteroids[i];
    if (currentA.alive === false) {
      // currentA.drawSprite();
      explAsteroids.push(currentA);
      asteroids.splice(i, 1);
      continue; // Останавливает текущую итерацию цикла и начинает новую итерацию
    }
    if (currentA.y > HEIGHT + currentA.h) { // возвращаем пропущенных врагов наверх
      currentA.y = -currentA.w;
      currentA.x = Math.floor(Math.random() * WIDTH - currentA.w);
      //Math.floor(Math.random() * 10) + 1;  // returns a number between 1 and 10

      continue; //  Останавливает текущую итерацию цикла и начинает новую итерацию
    }
    currentA.drawSprite();
  }
  for (var i = 0; i < explAsteroids.length; i++) {
    var currentEx = explAsteroids[i];
    if (currentEx.explLife <= 0) {
      explAsteroids.splice(i, 1);
      continue;
    }

    if ((currentEx.alive === false) && (currentEx.explLife > 0)) {
      currentEx.drawExplosion();
      currentEx.explLife--;
    }
  }
} */

//var collidedAIndex = -1; // индекс столкновений
/* function CheckCollision() {
  for (var i = 0; i < asteroids.length; i++) {
    var currentA = asteroids[i];

    // проверяем столкновение игрока с астероидом
    if ((currentA.x - currentA.w / 4 * 3 <= player.x) &&
      (currentA.x + currentA.w / 4 * 3 >= player.x) &&
      (currentA.y + currentA.h / 3 >= player.y) &&
      (collidedAIndex !== asteroids.indexOf(currentA))) {
      collidedAIndex = asteroids.indexOf(currentA);
      player.health--;
      player.drawExpSprite();
    }

    // Сброс индекса столкновения астероида с игроком
    if (collidedAIndex === asteroids.indexOf(currentA) &&
      currentA.y < HEIGHT / 2) {
      collidedAIndex = -1;
    }
    // столкновение лазера с астероидами
    for (var j = 0; j < lazers.length; j++) {
      var currentL = lazers[j];
      if ((currentL.x <= currentA.x + currentA.w) &&
        (currentL.x >= currentA.x) &&
        (currentL.y <= currentA.y)) {
        currentA.alive = false;

        explMusic_2.pause();
        explMusic_2.currentTime = 0.0;
        explMusic_2.play();

        player.score++;
        lazers.splice(lazers.indexOf(currentL), 1);
      }
    }
  }
} */

/*function clickToStart() { // надпись начала игры
  var playText = 'Click to start';
  ctx.fillStyle = "#cb6e06";
  ctx.shadowColor = "#6446ea";
  ctx.shadowBlur = 20;
  ctx.font = 'bold 150px Comic Sans MS';
  ctx.textBaseline = "middle";
  ctx.fillText(playText, WIDTH / 2 - ctx.measureText(playText).width / 2, HEIGHT / 2);
  ctx.shadowBlur = 0;
}*/

/*function gameOver() { //TODO!!!! не выводит посередине до resize!!!
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  var playText = 'GAME OVER';
  ctx.fillStyle = "#cb6e06";
  ctx.shadowColor = "#6446ea";
  ctx.shadowBlur = 25;
  ctx.font = 'bold 150px Comic Sans MS';
  // ctx.textAlign = "right"; // выравнивание
  ctx.textBaseline = "middle";

  ctx.fillText(playText, WIDTH / 2 - ctx.measureText(playText).width / 2, HEIGHT / 2);
  ctx.shadowBlur = 0;

  ctx.font = '100px Comic Sans MS';
  ctx.fillText('your score: ' + player.score, WIDTH / 2 - ctx.measureText(playText).width / 2, HEIGHT / 2 + 150);
}*/

/*function gamePlay() {
  CheckCollision();
  DrawAsteroids();
  DrawLasers();
  player.drawSprite();
  player.drawScore();
  player.drawHealth();
  if (player.health <= 0) {
    gameStatus = 'end';
  }
}*/

/*function  drawBackground(heightBg) {
  if (gameStatus === 'play') {

    bgW = 0;
    bgH = heightBg - HEIGHT - bgIm.height / 3.2;
    while (bgW < WIDTH) {
      while (bgH < heightBg) {
        ctx.drawImage(bgIm, bgW, bgH);
        bgH += bgIm.height;
      }
      bgW += bgIm.width;
      bgH = heightBg - HEIGHT - bgIm.height / 3.2;
    }

    var bgW = 0;
    var bgH = heightBg;
    while (bgW < WIDTH) {
      while (bgH < HEIGHT) {
        ctx.drawImage(bgIm, bgW, bgH);
        bgH += bgIm.height;
      }
      bgW += bgIm.width;
      bgH = heightBg;
    }
  }
  else {
    bgW = 0;
    bgH = 0;
    while (bgW < WIDTH) {
      while (bgH < HEIGHT) {
        ctx.drawImage(bgIm, bgW, bgH);
        bgH += bgIm.height;
      }
      bgW += bgIm.width;
      bgH = 0;
    }
  }
} */

//let backgroundHeight = 0;

/*function reDraw() {
  canvas.onmousemove = mouseMove;
  canvas.onmousedown = onMouseDown;

  canvas.touchstart = touchStart; // Tap (Косание)
  if (isTouch) { 
    lazers.push(new Lazer());
    lazerLoaded = false;
  }

  if ((backgroundHeight > HEIGHT) && (backgroundHeight % bgIm.height) === 0) // % чтобы не дергался
    backgroundHeight = 0;
  else
    backgroundHeight += 2;

  drawBackground(backgroundHeight);

  switch (gameStatus) {
    case 'start':
      clickToStart();
      break;
    case 'play':
      gamePlay();
      break;
    case 'end':
      gameOver();
      break;
  }
  window.requestAnimationFrame(reDraw);
}*/
 
/*function onMouseDown() {
  console.log('onMouseDown')
  switch (gameStatus) {
    case 'start':
      gameStatus = 'play';
      player.health = 3;
      player.score = 0;
      break;
    case 'play':
      if (lazerLoaded) {
        lazers.push(new Lazer());
        lazerLoaded = false;
      }
      break;
    case 'end':
      gameStatus = 'start';
      lazers = [];
      asteroids = [];
      break;
  }
} */

/* var mouseMove = function (e) {
  player.x = e.clientX - player.w / 2;
}; */

/* function pressingButton() {
  console.log('pressingButton')
  switch (gameStatus) {
    case 'start':
      gameStatus = 'play';
      player.health = 3;
      player.score = 0;
      break;
    case 'play':
      if (keys[0] == true && keys[1] == false && player.x <= WIDTH - player.w) {
        player.x += player.vx;
      }
      if (keys[1] == true && keys[0] == false && player.x > 0) {
        player.x -= player.vx;
      }
      if (keys[2] == true) {
        if (lazerLoaded) {
          lazers.push(new Lazer());
          lazerLoaded == false;
        }
      }
      break;
    case 'end':
      gameStatus = 'start';
      lazers = [];
      asteroids = [];
      break;
  }
} */

/* function KeyDown(e) {
  console.log('KeyDown')
  if (e.keyCode == 39) {
    keys[0] = true;
  }
  else if (e.keyCode == 37) {
    keys[1] = true;
  }
  pressingButton();
} */

/* function KeyUp(e) {
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
} */



/* document.addEventListener(
  'touchmove',
  function (e) {
    console.log('touchmove')
    e.stopImmediatePropagation()
    e.preventDefault(); // Предотвращение скролла
    e.stopPropagation(); //останавливает "всплытие" вызова события к родительским элементам
    /* далее код обработки события*//*
    if (e.targetTouches.length === 1) {
      var touch = e.targetTouches[0];
      isTouch === true;
      player.x = touch.pageX - player.w / 2;
    }
  }
); */

/* function touchStart() {
  console.log('touchStart')
  isTouch === true;
  switch (gameStatus) {
    case 'start':
      gameStatus = 'play';
      player.health = 3;
      player.score = 0;
      break;
    case 'play':
      if (lazerLoaded) {
        lazers.push(new Lazer());
        lazerLoaded = false;
      }
      break;
    case 'end':
      gameStatus = 'start';
      lazers = [];
      asteroids = [];
      break;
  }
} */


/* function resize(e) {
  console.log('resize')
  //console.log(e.target)

  canvas.width = e.target.innerWidth;
  canvas.height = e.target.innerHeight;

  WIDTH = e.target.innerWidth;
  HEIGHT = e.target.innerHeight;
} */

/*
document.addEventListener('dblclick', function (e) {
  e.preventDefault()
});*/