// js/games/snake-game.js - Juego Snake funcional
class SnakeGame {
    constructor(containerId) {
        this.containerId = containerId;
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.tileCount = 20;
        this.gameSpeed = 10;
        this.init();
    }

    init() {
        this.createCanvas();
        this.resetGame();
        this.setupControls();
        this.gameLoop = setInterval(() => this.update(), 1000 / this.gameSpeed);
        console.log('🐍 Snake Game iniciado');
    }

    createCanvas() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="snake-game-container">
                <div class="game-header">
                    <h4>🐍 Snake Game</h4>
                    <div class="game-stats">
                        <span>Puntuación: <span id="snake-score">0</span></span>
                        <span>Mejor: <span id="snake-highscore">0</span></span>
                    </div>
                </div>
                <canvas id="snake-canvas" width="400" height="400"></canvas>
                <div class="game-controls">
                    <p>Controles: ← ↑ → ↓ o WASD</p>
                    <button id="snake-restart" class="game-btn">🔄 Reiniciar</button>
                    <button id="snake-pause" class="game-btn">⏸️ Pausar</button>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Event listeners para botones
        document.getElementById('snake-restart').addEventListener('click', () => this.resetGame());
        document.getElementById('snake-pause').addEventListener('click', () => this.togglePause());
    }

    resetGame() {
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.highScore = localStorage.getItem('snake_highscore') || 0;
        this.updateScore();
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }

    update() {
        if (this.paused || this.gameOver) return;

        this.moveSnake();
        
        if (this.checkCollision()) {
            this.gameOver = true;
            this.showGameOver();
            return;
        }

        this.checkFood();
        this.draw();
    }

    moveSnake() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateScore();
        } else {
            this.snake.pop();
        }
    }

    checkCollision() {
        const head = this.snake[0];
        
        // Paredes
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // Colisión consigo mismo
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }

    checkFood() {
        const head = this.snake[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            // Hacer la serpiente más larga
            this.snake.push({...this.snake[this.snake.length - 1]});
            this.updateScore();
        }
    }

    draw() {
        if (!this.ctx) return;

        // Limpiar canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar serpiente
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#00ff88' : '#8a2be2';
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });

        // Dibujar comida
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.paused || this.gameOver) return;

            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.dy !== 1) { this.dx = 0; this.dy = -1; }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.dy !== -1) { this.dx = 0; this.dy = 1; }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.dx !== 1) { this.dx = -1; this.dy = 0; }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.dx !== -1) { this.dx = 1; this.dy = 0; }
                    break;
            }
        });
    }

    updateScore() {
        const scoreElement = document.getElementById('snake-score');
        const highscoreElement = document.getElementById('snake-highscore');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (highscoreElement) {
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('snake_highscore', this.highScore);
            }
            highscoreElement.textContent = this.highScore;
        }
    }

    togglePause() {
        this.paused = !this.paused;
        const pauseBtn = document.getElementById('snake-pause');
        if (pauseBtn) {
            pauseBtn.textContent = this.paused ? '▶️ Reanudar' : '⏸️ Pausar';
        }
    }

    showGameOver() {
        if (this.ctx) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ff4444';
            this.ctx.font = '20px "Share Tech Mono"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.fillText(`Puntuación: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    }

    destroy() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }
}
