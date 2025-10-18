// js/games/game-loader.js - Cargador de juegos
class GameLoader {
    constructor() {
        this.currentGame = null;
        this.games = {
            'snake': { name: 'Snake Game', file: 'snake-game.js' },
            'tetris': { name: 'Tetris', file: 'tetris-game.js' },
            'miner': { name: 'Void Miner', file: 'void-miner.js' }
        };
        this.init();
    }

    init() {
        this.setupGameListeners();
        console.log('🎮 Cargador de juegos listo');
    }

    setupGameListeners() {
        // Listeners para botones de juegos
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-game]') || e.target.closest('[data-game]')) {
                const gameElement = e.target.matches('[data-game]') ? e.target : e.target.closest('[data-game]');
                const gameId = gameElement.getAttribute('data-game');
                this.loadGame(gameId);
            }
        });

        // Listener para cerrar juego
        const closeBtn = document.getElementById('close-game');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGame());
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentGame) {
                this.closeGame();
            }
        });
    }

    async loadGame(gameId) {
        if (this.currentGame === gameId) {
            this.showGameContainer();
            return;
        }

        this.currentGame = gameId;
        const gameInfo = this.games[gameId];

        if (!gameInfo) {
            console.error('Juego no encontrado:', gameId);
            return;
        }

        try {
            this.showLoadingGame();
            
            // Cargar el juego
            await this.loadGameScript(gameInfo.file);
            
            // Inicializar el juego
            await this.initializeGame(gameId);
            
            this.showGameContainer();
            this.updateGameTitle(gameInfo.name);
            
        } catch (error) {
            console.error('Error cargando juego:', error);
            this.showGameError(gameInfo.name);
        }
    }

    async loadGameScript(filename) {
        return new Promise((resolve, reject) => {
            // Verificar si el script ya está cargado
            const existingScript = document.querySelector(`script[src="js/games/${filename}"]`);
            if (existingScript) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `js/games/${filename}`;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async initializeGame(gameId) {
        // Dar tiempo para que el script se ejecute
        await new Promise(resolve => setTimeout(resolve, 100));

        switch (gameId) {
            case 'snake':
                if (typeof SnakeGame !== 'undefined') {
                    window.snakeGame = new SnakeGame('game-content');
                }
                break;
            case 'tetris':
                if (typeof TetrisGame !== 'undefined') {
                    window.tetrisGame = new TetrisGame('game-content');
                }
                break;
            case 'miner':
                if (typeof VoidMiner !== 'undefined') {
                    window.voidMiner = new VoidMiner('game-content');
                }
                break;
        }
    }

    showLoadingGame() {
        const gameContent = document.getElementById('game-content');
        if (gameContent) {
            gameContent.innerHTML = `
                <div class="game-loading">
                    <div class="void-spinner"></div>
                    <p>Cargando juego...</p>
                </div>
            `;
        }
        this.showGameContainer();
    }

    showGameContainer() {
        const gamesContainer = document.getElementById('games-container');
        const postsContainer = document.getElementById('posts-container');
        const postForm = document.querySelector('.post-form-container');
        
        if (gamesContainer) gamesContainer.style.display = 'block';
        if (postsContainer) postsContainer.style.display = 'none';
        if (postForm) postForm.style.display = 'none';
    }

    hideGameContainer() {
        const gamesContainer = document.getElementById('games-container');
        const postsContainer = document.getElementById('posts-container');
        const postForm = document.querySelector('.post-form-container');
        
        if (gamesContainer) gamesContainer.style.display = 'none';
        if (postsContainer) postsContainer.style.display = 'block';
        if (postForm) postForm.style.display = 'block';
    }

    updateGameTitle(name) {
        const gameTitle = document.getElementById('game-title');
        if (gameTitle) {
            gameTitle.textContent = name;
        }
    }

    closeGame() {
        this.currentGame = null;
        this.hideGameContainer();
        
        // Limpiar juegos activos
        if (window.snakeGame) {
            window.snakeGame.destroy();
            window.snakeGame = null;
        }
        if (window.tetrisGame) {
            window.tetrisGame.destroy();
            window.tetrisGame = null;
        }
        if (window.voidMiner) {
            window.voidMiner.destroy();
            window.voidMiner = null;
        }
    }

    showGameError(gameName) {
        const gameContent = document.getElementById('game-content');
        if (gameContent) {
            gameContent.innerHTML = `
                <div class="game-error">
                    <h3>❌ Error cargando ${gameName}</h3>
                    <p>El juego no pudo cargarse. Intenta recargar la página.</p>
                    <button onclick="gameLoader.closeGame()" class="neon-btn">Cerrar</button>
                </div>
            `;
        }
    }
}
