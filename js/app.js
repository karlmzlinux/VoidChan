// js/app.js - Versión simple y funcional

class VoidChan {
    constructor() {
        this.currentBoard = 'global';
        this.posts = this.loadPostsFromStorage();
        this.onlineUsers = 1;
        this.currentTheme = 'purple';
        this.currentLanguage = 'es';
        this.translations = this.getTranslations();
        this.init();
    }

    init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // Ocultar loading después de 2 segundos
        setTimeout(() => {
            this.hideLoading();
            this.showWelcomeMessage();
        }, 2000);

        this.setupEventListeners();
        this.loadUserPreferences();
        this.updateOnlineUsers();
        this.renderPosts();
        this.updateStats();
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showWelcomeMessage() {
        this.showMessage('🎉 ¡Bienvenido a Void Chan!', 'success');
    }

    setupEventListeners() {
        // Formulario de posts
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        }

        // Contador de caracteres
        const messageInput = document.getElementById('post-message');
        if (messageInput) {
            messageInput.addEventListener('input', (e) => {
                this.updateCharCounter(e.target.value.length);
            });
        }

        // Navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const board = e.target.getAttribute('data-board');
                if (board === 'nsfw') {
                    this.showNSFWWarning();
                } else {
                    this.changeBoard(board);
                }
            });
        });

        // Quick boards
        document.querySelectorAll('.quick-board').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const board = e.target.getAttribute('data-board');
                if (board === 'nsfw') {
                    this.showNSFWWarning();
                } else {
                    this.changeBoard(board);
                }
            });
        });

        // Juegos
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const game = e.currentTarget.getAttribute('data-game');
                this.loadGame(game);
            });
        });

        // Selector de tema
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }

        // Selector de idioma
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // NSFW
        const nsfwConfirm = document.getElementById('nsfw-confirm');
        const nsfwCancel = document.getElementById('nsfw-cancel');
        if (nsfwConfirm) nsfwConfirm.addEventListener('click', () => this.confirmNSFW());
        if (nsfwCancel) nsfwCancel.addEventListener('click', () => this.hideNSFWWarning());
    }

    handlePostSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('post-name').value || 'Anónimo';
        const subject = document.getElementById('post-subject').value || '';
        const message = document.getElementById('post-message').value;

        if (!message.trim()) {
            this.showMessage('❌ El mensaje no puede estar vacío', 'error');
            return;
        }

        const newPost = {
            id: Date.now(),
            name: name,
            subject: subject,
            message: message,
            board: this.currentBoard,
            timestamp: new Date().toLocaleString()
        };

        // Agregar post
        if (!this.posts[this.currentBoard]) {
            this.posts[this.currentBoard] = [];
        }
        this.posts[this.currentBoard].unshift(newPost);

        // Guardar y actualizar
        this.savePostsToStorage();
        this.renderPosts();
        this.clearForm();
        this.updateStats();
        
        this.showMessage('✅ Post publicado correctamente', 'success');
    }

    clearForm() {
        document.getElementById('post-form').reset();
        this.updateCharCounter(0);
    }

    updateCharCounter(count) {
        const counter = document.getElementById('char-count');
        if (counter) {
            counter.textContent = count;
        }
    }

    changeBoard(board) {
        // Actualizar navegación
        document.querySelectorAll('.nav-link, .quick-board').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelectorAll(`[data-board="${board}"]`).forEach(el => {
            el.classList.add('active');
        });

        // Cambiar board
        this.currentBoard = board;
        this.updateBoardInfo();
        this.renderPosts();
        
        this.showMessage(`📁 Cambiado a /${board}/`, 'info');
    }

    updateBoardInfo() {
        const boardNames = {
            'global': 'Canal Global',
            'random': 'Random',
            'void': 'Void',
            'art': 'Arte',
            'music': 'Música',
            'programming': 'Programación',
            'ai': 'Inteligencia Artificial',
            'tech': 'Tecnología',
            'anime': 'Anime',
            'games': 'Juegos',
            'nsfw': 'NSFW - Adultos'
        };

        const title = document.getElementById('board-title');
        if (title) {
            title.textContent = `/${this.currentBoard}/ - ${boardNames[this.currentBoard]}`;
        }
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        const boardPosts = this.posts[this.currentBoard] || [];

        if (boardPosts.length === 0) {
            container.innerHTML = `
                <div class="post">
                    <div class="post-content">
                        <p>No hay posts en este board. ¡Sé el primero en publicar!</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = boardPosts.map(post => `
            <div class="post">
                <div class="post-header">
                    <span class="post-name">${this.escapeHTML(post.name)}</span>
                    <span class="post-id">#${post.id}</span>
                    <span class="post-date">${post.timestamp}</span>
                </div>
                ${post.subject ? `<div class="post-subject">${this.escapeHTML(post.subject)}</div>` : ''}
                <div class="post-content">
                    ${this.formatMessage(post.message)}
                </div>
            </div>
        `).join('');
    }

    formatMessage(text) {
        return this.escapeHTML(text).replace(/\n/g, '<br>');
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNSFWWarning() {
        const modal = document.getElementById('nsfw-warning');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideNSFWWarning() {
        const modal = document.getElementById('nsfw-warning');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    confirmNSFW() {
        this.hideNSFWWarning();
        this.changeBoard('nsfw');
    }

    changeTheme(theme) {
        // Remover todos los temas
        document.body.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-red', 
                                    'theme-orange', 'theme-pink', 'theme-cyber', 'theme-matrix');
        
        // Agregar nuevo tema
        document.body.classList.add(`theme-${theme}`);
        this.currentTheme = theme;
        
        // Guardar preferencia
        localStorage.setItem('voidchan_theme', theme);
        
        this.showMessage(`🎨 Tema cambiado a ${theme}`, 'info');
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        
        // Guardar preferencia
        localStorage.setItem('voidchan_language', lang);
        
        // Aquí irían las traducciones
        this.showMessage(`🌐 Idioma cambiado a ${this.getLanguageName(lang)}`, 'info');
    }

    getLanguageName(lang) {
        const names = {
            'es': 'Español',
            'en': 'English',
            'jp': '日本語',
            'fr': 'Français'
        };
        return names[lang] || lang;
    }

    loadGame(game) {
        const games = {
            'snake': '🐍 Snake Game',
            'pong': '🎾 Pong Game', 
            'memory': '🧠 Memory Game',
            'miner': '⛏️ Void Miner'
        };
        
        this.showMessage(`🎮 Cargando ${games[game]}...`, 'info');
        
        // Aquí cargarías el juego
        setTimeout(() => {
            this.showMessage('❌ Los juegos estarán disponibles pronto!', 'warning');
        }, 1000);
    }

    updateOnlineUsers() {
        // Simular usuarios en línea
        setInterval(() => {
            this.onlineUsers = Math.max(1, Math.floor(Math.random() * 50) + 1);
            this.updateStats();
        }, 30000);
    }

    updateStats() {
        const onlineElement = document.getElementById('online-count');
        const postElement = document.getElementById('post-count');
        
        if (onlineElement) {
            onlineElement.textContent = this.onlineUsers;
        }
        
        if (postElement) {
            const totalPosts = Object.values(this.posts).flat().length;
            postElement.textContent = totalPosts;
        }
    }

    loadPostsFromStorage() {
        try {
            const saved = localStorage.getItem('voidchan_posts');
            return saved ? JSON.parse(saved) : this.getDefaultPosts();
        } catch {
            return this.getDefaultPosts();
        }
    }

    getDefaultPosts() {
        return {
            'global': [
                {
                    id: 1,
                    name: 'Sistema',
                    subject: '¡Bienvenido!',
                    message: 'Bienvenido a Void Chan. Puedes publicar mensajes y navegar entre los diferentes boards.',
                    timestamp: new Date().toLocaleString(),
                    board: 'global'
                }
            ]
        };
    }

    savePostsToStorage() {
        try {
            localStorage.setItem('voidchan_posts', JSON.stringify(this.posts));
        } catch (error) {
            console.warn('No se pudieron guardar los posts:', error);
        }
    }

    loadUserPreferences() {
        // Cargar tema
        const savedTheme = localStorage.getItem('voidchan_theme');
        if (savedTheme) {
            this.changeTheme(savedTheme);
            document.getElementById('theme-select').value = savedTheme;
        }

        // Cargar idioma
        const savedLang = localStorage.getItem('voidchan_language');
        if (savedLang) {
            this.currentLanguage = savedLang;
            document.getElementById('language-select').value = savedLang;
        }
    }

    showMessage(text, type = 'info') {
        // Crear elemento de mensaje
        const message = document.createElement('div');
        message.className = `flash-message flash-${type}`;
        message.textContent = text;
        
        // Estilos
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(message);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    getMessageColor(type) {
        const colors = {
            'success': '#00cc66',
            'error': '#ff4444',
            'info': 'var(--color-accent)',
            'warning': '#ffaa00'
        };
        return colors[type] || colors.info;
    }

    getTranslations() {
        return {
            'es': {
                'welcome': '¡Bienvenido!',
                'post_published': 'Post publicado correctamente'
            },
            'en': {
                'welcome': 'Welcome!',
                'post_published': 'Post published successfully'
            }
            // Agregar más traducciones...
        };
    }
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    window.voidChan = new VoidChan();
});
