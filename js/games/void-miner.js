// js/games/void-miner.js - Juego Void Miner
class VoidMiner {
    constructor(containerId) {
        this.containerId = containerId;
        this.resources = 0;
        this.miners = 1;
        this.energy = 100;
        this.level = 1;
        this.init();
    }

    init() {
        this.createInterface();
        this.loadGame();
        this.startGameLoop();
        console.log('⛏️ Void Miner iniciado');
    }

    createInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="void-miner-container">
                <div class="game-header">
                    <h4>⛏️ Void Miner</h4>
                    <div class="game-stats">
                        <span>Nivel: <span id="miner-level">1</span></span>
                    </div>
                </div>
                
                <div class="miner-stats">
                    <div class="miner-stat">
                        <div class="miner-stat-value" id="resources-value">0</div>
                        <div class="miner-stat-label">💎 Recursos</div>
                    </div>
                    <div class="miner-stat">
                        <div class="miner-stat-value" id="miners-value">1</div>
                        <div class="miner-stat-label">👷 Mineros</div>
                    </div>
                    <div class="miner-stat">
                        <div class="miner-stat-value" id="energy-value">100</div>
                        <div class="miner-stat-label">⚡ Energía</div>
                    </div>
                </div>

                <div class="miner-actions">
                    <button id="mine-btn" class="action-btn mine-btn">⛏️ Minar (+10)</button>
                    <button id="buy-miner-btn" class="action-btn">👷 Comprar Minero (<span id="miner-cost">10</span>)</button>
                </div>

                <div class="miner-upgrades">
                    <h5>🛠️ Mejoras</h5>
                    <div class="upgrades-grid">
                        <button class="upgrade-btn" data-upgrade="auto-mine">
                            🤖 Miner Automático<br>
                            <small>Costo: <span class="upgrade-cost">50</span></small>
                        </button>
                        <button class="upgrade-btn" data-upgrade="energy-boost">
                            ⚡ Boost de Energía<br>
                            <small>Costo: <span class="upgrade-cost">100</span></small>
                        </button>
                        <button class="upgrade-btn" data-upgrade="efficiency">
                            📈 Eficiencia +<br>
                            <small>Costo: <span class="upgrade-cost">200</span></small>
                        </button>
                    </div>
                </div>

                <div class="game-controls">
                    <button id="miner-save" class="game-btn">💾 Guardar</button>
                    <button id="miner-reset" class="game-btn">🔄 Reiniciar</button>
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('mine-btn').addEventListener('click', () => this.mine());
        document.getElementById('buy-miner-btn').addEventListener('click', () => this.buyMiner());
        document.getElementById('miner-save').addEventListener('click', () => this.saveGame());
        document.getElementById('miner-reset').addEventListener('click', () => this.resetGame());
        
        // Mejoras
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const upgrade = e.target.closest('.upgrade-btn').dataset.upgrade;
                this.buyUpgrade(upgrade);
            });
        });
    }

    mine() {
        if (this.energy >= 10) {
            const mined = this.miners * this.level;
            this.resources += mined;
            this.energy -= 10;
            this.updateUI();
            this.showMiningEffect(mined);
        } else {
            this.showMessage('❌ No tienes suficiente energía!', 'error');
        }
    }

    buyMiner() {
        const cost = this.getMinerCost();
        if (this.resources >= cost) {
            this.resources -= cost;
            this.miners += 1;
            this.updateUI();
            this.showMessage(`✅ Minero comprado! Total: ${this.miners}`, 'success');
        } else {
            this.showMessage('❌ No tienes suficientes recursos!', 'error');
        }
    }

    getMinerCost() {
        return Math.floor(10 * Math.pow(1.5, this.miners - 1));
    }

    buyUpgrade(upgrade) {
        const upgrades = {
            'auto-mine': { cost: 50, effect: () => this.autoMine = true },
            'energy-boost': { cost: 100, effect: () => this.energyMax += 50 },
            'efficiency': { cost: 200, effect: () => this.level += 1 }
        };

        const upgradeInfo = upgrades[upgrade];
        if (!upgradeInfo) return;

        if (this.resources >= upgradeInfo.cost) {
            this.resources -= upgradeInfo.cost;
            upgradeInfo.effect();
            this.updateUI();
            this.showMessage(`✅ Mejora "${upgrade}" comprada!`, 'success');
            
            // Deshabilitar botón de mejora
            const btn = document.querySelector(`[data-upgrade="${upgrade}"]`);
            if (btn) btn.disabled = true;
        } else {
            this.showMessage('❌ No tienes suficientes recursos!', 'error');
        }
    }

    updateUI() {
        document.getElementById('resources-value').textContent = Math.floor(this.resources);
        document.getElementById('miners-value').textContent = this.miners;
        document.getElementById('energy-value').textContent = Math.floor(this.energy);
        document.getElementById('miner-level').textContent = this.level;
        document.getElementById('miner-cost').textContent = this.getMinerCost();
        
        // Actualizar energía máxima si existe
        if (this.energyMax) {
            document.getElementById('energy-value').textContent = 
                `${Math.floor(this.energy)}/${this.energyMax}`;
        }
    }

    showMiningEffect(amount) {
        const mineBtn = document.getElementById('mine-btn');
        const originalText = mineBtn.textContent;
        mineBtn.textContent = `⛏️ +${amount}!`;
        mineBtn.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            mineBtn.textContent = originalText;
            mineBtn.style.transform = 'scale(1)';
        }, 300);
    }

    startGameLoop() {
        setInterval(() => {
            // Regenerar energía
            this.energy = Math.min(this.energy + 2, this.energyMax || 100);
            
            // Minería automática
            if (this.autoMine) {
                this.resources += this.miners * 0.1 * this.level;
            }
            
            this.updateUI();
        }, 1000);
    }

    showMessage(text, type) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'error' ? '#ff4444' : '#00ff88'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        document.querySelector('.void-miner-container').appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    saveGame() {
        const gameData = {
            resources: this.resources,
            miners: this.miners,
            level: this.level,
            energyMax: this.energyMax,
            autoMine: this.autoMine
        };
        localStorage.setItem('void_miner_save', JSON.stringify(gameData));
        this.showMessage('💾 Juego guardado!', 'success');
    }

    loadGame() {
        const saved = localStorage.getItem('void_miner_save');
        if (saved) {
            try {
                const gameData = JSON.parse(saved);
                this.resources = gameData.resources || 0;
                this.miners = gameData.miners || 1;
                this.level = gameData.level || 1;
                this.energyMax = gameData.energyMax;
                this.autoMine = gameData.autoMine;
                this.updateUI();
            } catch (error) {
                console.error('Error cargando juego:', error);
            }
        }
    }

    resetGame() {
        if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
            this.resources = 0;
            this.miners = 1;
            this.energy = 100;
            this.level = 1;
            this.energyMax = null;
            this.autoMine = false;
            localStorage.removeItem('void_miner_save');
            this.updateUI();
            
            // Rehabilitar botones de mejora
            document.querySelectorAll('.upgrade-btn').forEach(btn => {
                btn.disabled = false;
            });
        }
    }

    destroy() {
        // Limpiar intervalos si es necesario
    }
}
