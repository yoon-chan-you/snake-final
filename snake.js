const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasWidth = 900;
const canvasHeight = 600;

let snake = [
  { x: 15 * box, y: 10 * box },
  { x: 14 * box, y: 10 * box },
  { x: 13 * box, y: 10 * box }
];
let direction = 'RIGHT';
let foods = [];
const FOOD_COUNT = 5;
let score = 0;
let life = 5;
let gameInterval;
let isGameOver = false;

const appleImg = new window.Image();
appleImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><ellipse cx="16" cy="20" rx="11" ry="10" fill="%23ff2d2d"/><ellipse cx="16" cy="14" rx="6" ry="4" fill="%23fff" opacity="0.15"/><rect x="14.5" y="6" width="3" height="7" rx="1.5" fill="%233d2c13"/><path d="M16 6 Q17 2 21 4" stroke="%23080" stroke-width="2" fill="none"/></svg>';

function spawnFood() {
  let arr = [];
  while (arr.length < FOOD_COUNT) {
    let newFood = {
      x: Math.floor(Math.random() * (canvasWidth / box)) * box,
      y: Math.floor(Math.random() * (canvasHeight / box)) * box
    };
    let overlap = snake.some(seg => seg.x === newFood.x && seg.y === newFood.y) || arr.some(f => f.x === newFood.x && f.y === newFood.y);
    if (!overlap) arr.push(newFood);
  }
  return arr;
}

document.addEventListener('keydown', (e) => {
  if (isGameOver) return;
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function drawCar(x, y, isHead) {
  if (isHead) {
    ctx.save();
    ctx.translate(x + box / 2, y + box / 2);
    ctx.rotate(direction === 'UP' ? -Math.PI/2 : direction === 'DOWN' ? Math.PI/2 : direction === 'LEFT' ? Math.PI : 0);
    ctx.translate(-box / 2, -box / 2);
    ctx.fillStyle = '#ff3b3b';
    ctx.fillRect(0, 4, box, box - 8);
    ctx.fillStyle = '#fff';
    ctx.fillRect(box * 0.2, box * 0.2, box * 0.6, box * 0.3);
    ctx.fillStyle = '#222';
    ctx.fillRect(2, box - 4, box * 0.3, 4);
    ctx.fillRect(box - box * 0.3 - 2, box - 4, box * 0.3, 4);
    ctx.restore();
  } else {
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(x, y, box, box);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // 자동차(스네이크) 그리기
  for (let i = 0; i < snake.length; i++) {
    drawCar(snake[i].x, snake[i].y, i === 0);
  }
  // 사과 5개 그리기
  foods.forEach(food => {
    ctx.drawImage(appleImg, food.x + 2, food.y + 2, box - 4, box - 4);
  });

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
    loseLife();
    return;
  }

  // 자기 몸 충돌 체크
  for (let i = 0; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      loseLife();
      return;
    }
  }

  // 사과 먹었는지 체크
  let ate = false;
  for (let i = 0; i < foods.length; i++) {
    if (headX === foods[i].x && headY === foods[i].y) {
      score++;
      document.getElementById('score').textContent = `점수: ${score}`;
      foods.splice(i, 1);
      ate = true;
      break;
    }
  }
  if (ate) {
    // 사과가 5개 미만이면 새로 추가
    while (foods.length < FOOD_COUNT) {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * (canvasWidth / box)) * box,
          y: Math.floor(Math.random() * (canvasHeight / box)) * box
        };
        let overlap = snake.some(seg => seg.x === newFood.x && seg.y === newFood.y) || foods.some(f => f.x === newFood.x && f.y === newFood.y);
        if (!overlap) break;
      }
      foods.push(newFood);
    }
    // 꼬리 유지(길이 증가)
  } else {
    snake.pop();
  }

  // 머리 추가
  snake.unshift({ x: headX, y: headY });
}

function loseLife() {
  life--;
  updateLifeUI();
  if (life > 0) {
    // 뱀 위치/길이 초기화, 방향 초기화
    snake = [
      { x: 15 * box, y: 10 * box },
      { x: 14 * box, y: 10 * box },
      { x: 13 * box, y: 10 * box }
    ];
    direction = 'RIGHT';
  } else {
    gameOver();
  }
}

function updateLifeUI() {
  const lifeDiv = document.getElementById('life');
  lifeDiv.textContent = '목숨: ' + '❤️'.repeat(life) + '♡'.repeat(5 - life);
}

function gameOver() {
  clearInterval(gameInterval);
  isGameOver = true;
  setTimeout(() => {
    alert('게임 오버! 점수: ' + score + '\n새로고침(F5)으로 다시 시작하세요.');
  }, 100);
}

appleImg.onload = () => {
  foods = spawnFood();
  updateLifeUI();
  gameInterval = setInterval(draw, 70);
};
