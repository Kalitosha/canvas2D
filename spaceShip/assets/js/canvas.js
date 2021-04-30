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

    this.explMusic = new Audio('assets\\audio\\explosion1.mp3');
    this.playerIm = new Image();
    this.shipExpIm = new Image();
    this.healthIm = new Image();

    this.lazerReloadDistance = this.y - 120; // расстояние между снарядами
    this.lazerLoaded = true; // перезарядка оружия
    this.lazers = []; // магазин пушки

    init();
  }

  init() {
    this.playerIm.src = 'assets\\images\\ship1.png';
    this.shipExpIm.src = 'assets\\images\\explShip.png';
    this.healthIm.src = 'assets\\images\\life.png';
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

  expresetExplMusiclMusic() {
    this.explMusic.pause();
    this.explMusic.currentTime = 0.0;
  }

  drawExpSprite() {
    resetExplMusic();
    ctx.drawImage(this.shipExpIm, this.x - this.w / 2, this.y - this.h * 3 / 2, this.w * 2, this.h * 2);
    this.explMusic.play();
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

  DrawLasers() {
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
        currentL.drawL();
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
    this.speed = Math.random() * (7 - 3) + 3; // [3;7)
    this.x = Math.floor(Math.random() * WIDTH - HEIGHT / 10); //TODO возможно надо сделать их реже
    this.y = 0 - HEIGHT / 10;
    this.h = HEIGHT / 10;
    this.w = HEIGHT / 10;

    this.explLife = 6; // для отрисовки спрайта из 6ти картинок

    this.explX = 0;
    this.explWidth = 194;    
  }

  drawSprite(ctx, asteroidIm) {
    ctx.drawImage(asteroidIm, this.x, this.y, this.w, this.h);
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






//TODO надкласс для астероидов и отрисовки фона "космос" // может паттерн фабрика?

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

    init();
  }

  init() {
    this.asteroidIm.src = 'assets\\images\\asteroid.png';
    this.explIm.src = 'assets\\images\\spriteMapExpl.png';
  }

  DrawAsteroids(ctx) {
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

  }

  CheckCollision(WIDTH, HEIGHT) {
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

          this.explMusic.pause();
          this.explMusic.currentTime = 0.0;
          this.explMusic.play();

          player.score++;
          this.player.lazers.splice(this.player.lazers.indexOf(currentL), 1);
        }
      }
    }
  }


}


space = new Space(WIDTH, HEIGHT);

