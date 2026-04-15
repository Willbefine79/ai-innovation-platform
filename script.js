// 游戏常量
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

// 游戏状态
let gameState = {
    snake: [],
    food: {},
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    isRunning: false,
    gameOver: false,
    gameLoop: null
};

// 初始化游戏
function initGame() {
    // 初始化蛇
    gameState.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    // 生成初始食物
    generateFood();
    
    // 重置游戏状态
    gameState.direction = 'right';
    gameState.nextDirection = 'right';
    gameState.score = 0;
    gameState.isRunning = false;
    gameState.gameOver = false;
    
    // 更新分数显示
    document.getElementById('score').textContent = gameState.score;
    
    // 绘制游戏
    drawGame();
}

// 生成食物
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (isSnakeAtPosition(newFood.x, newFood.y));
    
    gameState.food = newFood;
}

// 检查蛇是否在指定位置
function isSnakeAtPosition(x, y) {
    return gameState.snake.some(segment => segment.x === x && segment.y === y);
}

// 绘制游戏
function drawGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    gameState.snake.forEach(segment => {
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    
    // 绘制蛇头
    ctx.fillStyle = '#388E3C';
    const head = gameState.snake[0];
    ctx.fillRect(head.x * CELL_SIZE, head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // 绘制食物
    ctx.fillStyle = '#F44336';
    ctx.fillRect(gameState.food.x * CELL_SIZE, gameState.food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // 绘制游戏结束信息
    if (gameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
        ctx.fillText(`最终分数: ${gameState.score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10);
    }
}

// 更新游戏状态
function updateGame() {
    if (!gameState.isRunning || gameState.gameOver) return;
    
    // 更新方向
    gameState.direction = gameState.nextDirection;
    
    // 获取蛇头
    const head = { ...gameState.snake[0] };
    
    // 移动蛇头
    switch (gameState.direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 检查碰撞
    // 边界碰撞
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameState.gameOver = true;
        gameState.isRunning = false;
        clearInterval(gameState.gameLoop);
        drawGame();
        return;
    }
    
    // 自身碰撞
    if (isSnakeAtPosition(head.x, head.y)) {
        gameState.gameOver = true;
        gameState.isRunning = false;
        clearInterval(gameState.gameLoop);
        drawGame();
        return;
    }
    
    // 检查是否吃到食物
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        // 增加分数
        gameState.score += 10;
        document.getElementById('score').textContent = gameState.score;
        
        // 生成新食物
        generateFood();
        
        // 蛇长度增加（不删除尾部）
        gameState.snake.unshift(head);
    } else {
        // 移动蛇（删除尾部，添加新头部）
        gameState.snake.pop();
        gameState.snake.unshift(head);
    }
    
    // 绘制游戏
    drawGame();
}

// 开始游戏
function startGame() {
    if (!gameState.isRunning && !gameState.gameOver) {
        gameState.isRunning = true;
        gameState.gameLoop = setInterval(updateGame, 150);
    }
}

// 暂停游戏
function pauseGame() {
    gameState.isRunning = !gameState.isRunning;
    if (gameState.isRunning) {
        gameState.gameLoop = setInterval(updateGame, 150);
    } else {
        clearInterval(gameState.gameLoop);
    }
}

// 重新开始游戏
function restartGame() {
    clearInterval(gameState.gameLoop);
    initGame();
}

// 处理键盘输入
function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (gameState.direction !== 'down') {
                gameState.nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (gameState.direction !== 'up') {
                gameState.nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
            if (gameState.direction !== 'right') {
                gameState.nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (gameState.direction !== 'left') {
                gameState.nextDirection = 'right';
            }
            break;
        case ' ': // 空格键暂停/开始
            if (gameState.gameOver) {
                restartGame();
            } else {
                pauseGame();
            }
            break;
    }
}

// 事件监听器
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('pause-btn').addEventListener('click', pauseGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeyPress);

// 初始化游戏
initGame();