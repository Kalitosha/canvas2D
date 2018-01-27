var canvas = document.getElementById('myCanvas'); // подключаем canvas
var ctx = canvas.getContext('2d'); // задаем контекст

window.addEventListener('resize', resizeCanvas, false);

Width = document.documentElement.clientWidth;
Height = document.documentElement.clientHeight;

var gall = 0;
var imgBall = new Image();  // Создание нового объекта изображения
var imgPlatform = new Image();

window.onload = function () {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    var fonMus = document.getElementById('fonMusic'); // фоновая музыка
    //fonMus.play();
    fonMus.volume = 0.1;

    imgBall.src ='assets\\images\\ball.png';  // Путь к изображению которое необходимо нанести на холст
    imgPlatform.src = 'assets\\images\\pl.png';

    init();
}

var mouseMove = function(e) {
    platform1.y = e.clientY - platform1.h/2;
    platform2.y = e.clientY - platform2.h/2;
}

document.addEventListener(
    'touchmove',
    function(e) {
        e.preventDefault(); // Предотвращение скролла
        e.stopPropagation(); //останавливает "всплытие" вызова события к родительским элементам
        /* далее код обработки события*/
        if (e.targetTouches.length == 1) {
            var touch = e.targetTouches[0];

            platform1.y = touch.pageY - platform1.h / 2;
            platform2.y = touch.pageY - platform2.h / 2;
        }
    }
);

var ball = {
    color : 'black',
    r : 0,
    vx : 0,
    vy : 0,
    x : 0,
    y : 0,
    drawBall : function () {
    },
    drawSprite : function () {}
}

function Rect(color, x, y) {
    this.color = color; // цвет прямоугольника
    this.x = x; // координата х
    this.y = y; // координата у
    this.h = Height / 6; // высота
    this.w = Height / 6 / 10; // ширина
    this.score = 0;
    this.drawRect = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    this.drawSprite = function (){
        ctx.drawImage(imgPlatform, this.x, this.y, this.w, this.h);
    };
}

function init() {

    platform1 = new Rect('rgb(255, 100, 0)', 1, Height/2 - Height/6/2);
    platform2 = new Rect('rgb(255, 100, 0)', Width - Height/6/10 - 1, Height/2 - Height/6/2);


    ball = {
        color : 'RGB(255, 180, 0)',
        r :  Height/30,
        vx : -6,
        vy : -6,
        x : Width/2,
        y : Height/2,
        drawBall : function () {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
            ctx.fill();
            ctx.closePath();
         },

        drawSprite : function () {
                ctx.drawImage(imgBall, this.x, this.y, this.r, this.r);
        }
    };
    draw();
}
function resizeCanvas() {
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
        /*************************************************************************************/
        //platform1.x = platform1.x * document.documentElement.clientWidth/Width;
        platform1.y = platform1.y * document.documentElement.clientHeight/Height;
        platform1.w = document.documentElement.clientHeight / 6 / 10;
        platform1.h = document.documentElement.clientHeight / 6;

        platform2.x = document.documentElement.clientWidth - document.documentElement.clientHeight / 6 / 10 - 1;
        platform2.y = platform2.y * document.documentElement.clientHeight/Height;
        platform2.w = document.documentElement.clientHeight / 6 / 10;
        platform2.h = document.documentElement.clientHeight / 6;

        ball.r = document.documentElement.clientHeight/30;
        if (gall == 1){

            ball.x = platform2.x - ball.r;
        }
        else if (gall == 2){

            ball.x = platform1.x + platform1.w;
        }
        else{
            ball.x = ball.x * document.documentElement.clientWidth/Width;
        }
        ball.y = ball.y * document.documentElement.clientHeight/Height;
        /*************************************************************************************/
        Width = document.documentElement.clientWidth;
        Height = document.documentElement.clientHeight;
        /*************************************************************************************/
}

function draw() {
    ctx.clearRect(0, 0, Width, Height); // стираем

    ctx.strokeStyle = 'rgb(67, 100, 100)';
    ctx.beginPath();
    ctx.moveTo(Width/2, 0);
    ctx.lineTo(Width/2, Height);
    //
    // ctx.moveTo(0, Height/2);
    // ctx.lineTo( Width,Height/2);
    ctx.stroke();

    // ctx.fillStyle = 'rgb(80, 110, 110)';
    // ctx.font = "15px Comic Sans MS";
    // ctx.fillText(Height, 20, 20);
    // ctx.fillText(Width, 70, 20);

    //счет
    ctx.fillStyle = 'rgb(80, 110, 110)';
    ctx.font = "100px Comic Sans MS";
    ctx.fillText(":", Width/2 - 14, Height/2 + 31);
    ctx.textAlign = "right";
    ctx.fillText(platform1.score, Width/2 - 10, Height/2 + 34);
    ctx.textAlign = "left";
    ctx.fillText(platform2.score, Width/2 + 10, Height/2 + 34);


    ball.drawSprite();
    // ball.drawBall();
    platform1.drawSprite();
    platform2.drawSprite();
    // platform1.drawRect();
    // platform2.drawRect();

    collision();

    canvas.onmousemove = mouseMove;
    canvas.onmousedown = onMouseDown;
    // canvas.touchmove = touchMove; // TODO проверить
    canvas.touchstart = onMouseDown; // Tap (Косание)

    window.requestAnimationFrame(draw);
}

// function anim() {
//     setTimeout(function() {
//         window.requestAnimationFrame(anim)
//     }, 1000 / 60) //Setting the FPS by dividing the one second by <frames>
//     draw();
//     /*...*/
// }
// anim();

function collision() {
    if (gall == 0) {
        if ((ball.y < 0) || (ball.y + ball.r > Height)) { // стена: верх, низ
            ball.vy = -ball.vy;
        }

        else if (ball.x < platform1.x + platform1.w) { // столкновение с ракеткой №1
            if ((ball.y + ball.r > platform1.y) && (ball.y < platform1.y + platform1.h )) // на промежутке
                ball.vx = -ball.vx;
            else { // стена: лево // вне промежутка нахождения ракетки
                platform2.score++;
                ball.x = platform2.x - ball.r;
                ball.y = platform2.y + platform2.h / 2 - ball.r/2;
                gall = 1;
                return;//ГОЛЛ!
            }
        }

        else if (ball.x + ball.r > platform2.x) { // столкновение с ракеткой №2
            if ((ball.y + ball.r > platform2.y) && (ball.y - ball.r < platform2.y + platform2.h )) { // на промежутке
                ball.vx = -ball.vx;
            }
            else {  // стена: право
                platform1.score++;
                ball.x = platform1.x + platform1.w; // + ball.r;
                ball.y = platform2.y + platform2.h / 2 - ball.r/2;
                gall = 2;
                return;//ГОЛЛ!
            }
        }

        ball.x += ball.vx;
        ball.y += ball.vy;
    }
    else
        // if (gall == 1){
            ball.y = platform2.y + platform2.h / 2 - ball.r/2; // одно и тоже
    // }
    // else
    //     if (gall == 2){
    //         ball.y = platform1.y + platform1.h / 2 - ball.r/2; // одно и тоже
    // }
}

function onMouseDown(e) {

    if (gall != 0) {
        ball.vx = -ball.vx;
        ball.x += ball.vx;
        gall = 0;
    }
}
