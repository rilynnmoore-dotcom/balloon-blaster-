const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let balloons = [];
let score = 0;
let misses = 0;
let gameOver = false;

function spawnBalloon() {
  const size = Math.random() * 20 + 20;
  balloons.push({
    x: Math.random() * (canvas.width - size),
    y: canvas.height + size,
    radius: size,
    speed: Math.random() * 1.5 + 1,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`
  });
}

setInterval(spawnBalloon, 800);

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balloons = balloons.filter(b => {
    const dx = mouseX - (b.x + b.radius);
    const dy = mouseY - (b.y + b.radius);
    const hit = Math.sqrt(dx * dx + dy * dy) < b.radius;
    if (hit) score += Math.floor(100 / b.radius);
    return !hit;
  });
});

function update() {
  if (gameOver) return;

  balloons.forEach(b => b.y -= b.speed);

  balloons = balloons.filter(b => {
    if (b.y + b.radius < 0) {
      misses++;
      return false;
    }
    return true;
  });

  if (misses >= 5) gameOver = true;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balloons.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x + b.radius, b.y + b.radius, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
  });

  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("Misses: " + misses + "/5", 20, 60);

  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 300, 250);
    ctx.font = "20px Arial";
    ctx.fillText("Refresh to play again", 320, 290);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
