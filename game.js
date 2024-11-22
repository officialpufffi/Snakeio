const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startMenu = document.getElementById('startMenu');
const startButton = document.getElementById('startButton');
const playerNameInput = document.getElementById('playerName');

canvas.width = 1080;
canvas.height = 720;

const gridSize = 5;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snakeSpeed = 10;
const maxSpeed = 30;

const snakeSegmentSize = gridSize * 4;
let snakeLength = 10;
let snake = [];
let mousePos = { x: 0, y: 0 };
let gameStarted = false;
let playerName = '';

startButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim() || 'Player';
    startMenu.style.display = 'none';
    canvas.style.display = 'block';
    gameStarted = true;
    initGame();
});

canvas.addEventListener('mousemove', (event) => {
    mousePos.x = event.offsetX;
    mousePos.y = event.offsetY;
});

canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        snakeSpeed = maxSpeed;
    }
});

canvas.addEventListener('mouseup', () => {
    snakeSpeed = 10;
});

function initGame() {
    snake = spawnSnake(snakeLength);
    gameLoop();
}

function spawnSnake(length) {
    const startPosition = getRandomPosition();
    const direction = getRandomDirection();
    const snakeBody = [];
    for (let i = 0; i < length; i++) {
        snakeBody.push({
            x: startPosition.x - i * direction.x,
            y: startPosition.y - i * direction.y,
            direction: direction
        });
    }
    return snakeBody;
}

function updateSnake() {
    const head = snake[0];
    const deltaX = mousePos.x - head.x;
    const deltaY = mousePos.y - head.y;
    const angle = Math.atan2(deltaY, deltaX);

    const newDirection = {
        x: Math.cos(angle) * gridSize,
        y: Math.sin(angle) * gridSize
    };

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = { ...snake[i - 1] };
    }

    snake[0].x += newDirection.x;
    snake[0].y += newDirection.y;
}

function drawSnake() {
    for (let i = snake.length - 1; i >= 0; i--) {
        ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, snakeSegmentSize, snakeSegmentSize);
    }
}

function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawName() {
    const head = snake[0];
    const maxNameLength = 16;
    const nameToDisplay = playerName.slice(0, maxNameLength);
    ctx.fillStyle = 'white';
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillText(nameToDisplay, head.x - (nameToDisplay.length * 4), head.y - 20);
}

function gameLoop() {
    if (!gameStarted) return;
    drawBackground();
    drawName();
    drawSnake();
    updateSnake();
    setTimeout(gameLoop, 1000 / snakeSpeed);
}

function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * gridWidth) * gridSize,
        y: Math.floor(Math.random() * gridHeight) * gridSize
    };
}

function getRandomDirection() {
    const directions = [
        { x: gridSize, y: 0 },
        { x: -gridSize, y: 0 },
        { x: 0, y: gridSize },
        { x: 0, y: -gridSize }
    ];
    return directions[Math.floor(Math.random() * directions.length)];
}
