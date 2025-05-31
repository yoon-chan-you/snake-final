const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
// 뱀을 중앙에 길이 3으로 시작
let snake = [
  { x: 10 * box, y: 10 * box },
  { x: 9 * box, y: 10 * box },
  { x: 8 * box, y: 10 * box }
];
let direction = 'RIGHT';
let food = spawnFood();
let score = 0;
let gameInterval;
let isGameOver = false;

function spawnFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    // food가 뱀과 겹치지 않게
    let overlap = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!overlap) break;
  }
  return newFood;
}

document.addEventListener('keydown', (e) => {
  if (isGameOver) return;
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#00ff00' : '#fff';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
  // Draw food
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'DOWN') headY += box;

  // Check collision with wall
  if (
    headX < 0 || headX >= canvasSize ||
    headY < 0 || headY >= canvasSize
  ) {
    gameOver();
    return;
  }

  // Check collision with self
  for (let i = 0; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      gameOver();
      return;
    }
  }

  // Check if food is eaten
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById('score').textContent = `점수: ${score}`;
    food = spawnFood();
    // Don't remove tail (snake grows)
  } else {
    snake.pop();
  }

  // Add new head
  snake.unshift({ x: headX, y: headY });
}

function gameOver() {
  clearInterval(gameInterval);
  isGameOver = true;
  setTimeout(() => {
    alert('게임 오버! 점수: ' + score + '\n새로고침(F5)으로 다시 시작하세요.');
  }, 100);
}

gameInterval = setInterval(draw, 120);
