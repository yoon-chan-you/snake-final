const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 30;
const canvasWidth = 900;
const canvasHeight = 600;

// 자동차(스네이크) 시작 위치와 길이
let snake = [
  { x: 15 * box, y: 10 * box },
  { x: 14 * box, y: 10 * box },
  { x: 13 * box, y: 10 * box }
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
      x: Math.floor(Math.random() * (canvasWidth / box)) * box,
      y: Math.floor(Math.random() * (canvasHeight / box)) * box
    };
    // food가 자동차와 겹치지 않게
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

function drawCar(x, y, isHead) {
  // 자동차 몸통
  ctx.fillStyle = isHead ? '#ff3b3b' : '#4fc3f7';
  ctx.fillRect(x, y, box, box);
  // 자동차 창문
  if (isHead) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + box * 0.2, y + box * 0.2, box * 0.6, box * 0.3);
  }
  // 자동차 바퀴
  ctx.fillStyle = '#222';
  ctx.fillRect(x + 3, y + box - 6, box * 0.3, 5);
  ctx.fillRect(x + box - box * 0.3 - 3, y + box - 6, box * 0.3, 5);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // 자동차(스네이크) 그리기
  for (let i = 0; i < snake.length; i++) {
    drawCar(snake[i].x, snake[i].y, i === 0);
  }
  // 먹이(연료) 그리기
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd700';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.closePath();

  // 자동차 이동
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'DOWN') headY += box;

  // 벽 충돌 체크
  if (
    headX < 0 || headX >= canvasWidth ||
    headY < 0 || headY >= canvasHeight
  ) {
    gameOver();
    return;
  }

  // 자기 몸 충돌 체크
  for (let i = 0; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      gameOver();
      return;
    }
  }

  // 먹이 먹었는지 체크
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById('score').textContent = `점수: ${score}`;
    food = spawnFood();
    // 꼬리 유지(길이 증가)
  } else {
    snake.pop();
  }

  // 머리 추가
  snake.unshift({ x: headX, y: headY });
}

function gameOver() {
  clearInterval(gameInterval);
  isGameOver = true;
  setTimeout(() => {
    alert('게임 오버! 점수: ' + score + '\n새로고침(F5)으로 다시 시작하세요.');
  }, 100);
}

gameInterval = setInterval(draw, 90);
