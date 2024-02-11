const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;

//캔버스의 넓이를 조절하는 방법
// 1. css로 조절하기
// 2. 캔버스 자체의 width , height를 조절해주기
// 작업을 할때는 기본적으로 1,2 둘다 동일한 크기로 맞추고 작업을 진행

// dpr(devicePixelRatio) = 하나의 css픽셀을 그릴때 사용되는 장치의 픽셀수
// 1픽셀을 그릴때 몇픽셀을 사용하는지 알수있음 (윈도우 전역 변수로)
// 1dpr = 1픽셀
// 2dpr = 4픽셀
// dpr이 높을수록 선명
let canvasWidth;
let canvasHeight;
let particles;

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);

  particles = [];
  const TOTAL = canvasWidth / 10;

  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, canvasWidth);
    const y = randomNumBetween(0, canvasHeight);
    const radius = randomNumBetween(50, 100);
    const vy = randomNumBetween(1, 5);
    const particle = new Particle(x, y, radius, vy);

    particles.push(particle);
  }
}

//사각형 그리기
// ctx.fillRect(10, 10, 50, 50);

//원그리기
// ctx.beginPath();
// ctx.arc(100, 100, 50, 0, (Math.PI / 180) * 360);
// ctx.fillStyle = "red";
// ctx.fill();
// ctx.closePath();
const feGaussianBlur = document.querySelector("feGaussianBlur");
const feColorMatrix = document.querySelector("feColorMatrix");

const controls = new (function () {
  this.blurValue = 40;
  this.alphaChannel = 100;
  this.alphaOffset = -23;
  this.acc = 1.03;
})();

let gui = new dat.GUI();
const f1 = gui.addFolder("Gooey Effect");
f1.open();

f1.add(controls, "blurValue", 0, 100).onChange((value) => {
  feGaussianBlur.setAttribute("stdDeviation", value);
});

f1.add(controls, "alphaChannel", 0, 200).onChange((value) => {
  feColorMatrix.setAttribute(
    "values",
    `1 0 0 0 0   0 1 0 0 0  0 0 1 0 0   0 0 0 ${value} ${controls.alphaOffset}`
  );
});

f1.add(controls, "alphaOffset", -100, 0).onChange((value) => {
  feColorMatrix.setAttribute(
    "values",
    `1 0 0 0 0   0 1 0 0 0  0 0 1 0 0   0 0 0 ${controls.alphaChannel}, ${value}`
  );
});

const f2 = gui.addFolder("Particle Property");
f2.open();

f2.add(controls, "acc", 1, 1.5, 0.01).onChange((value) => {
  particles.forEach((particle) => (particle.acc = value));
});

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
    this.acc = 1.02;
  }

  update() {
    this.vy *= this.acc;
    this.y += this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
  }
}

//최대 값과 최소 값 사이의 값을 랜덤하게 리턴 하는 함수
const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

let interval = 1000 / 60;
let now, delta;
let then = Date.now();

function animate() {
  // requestAnimationFrame 각 모니터의 주사율에 따라서 1초에 몇번 실행될지 다름
  // 144hz면 1초에 144번 실행됨
  // fps : 1초에 requestAnimationFrame를 몇번을 실행 시킬까?
  window.requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, canvasWidth);
      particle.radius = randomNumBetween(50, 100);
      particle.vy = randomNumBetween(1, 5);
    }
  });

  then = now - (delta & interval);
}

window.addEventListener("load", () => {
  init();
  animate();
});

window.addEventListener("resize", () => init());
