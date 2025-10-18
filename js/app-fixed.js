// js/app-fixed.js
class VoidChanApp {
    constructor() {
        this.currentBoard = 'global';
        this.posts = [];
        this.isInitialized = false;
        this.loadTimeout = null;
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // ⚡ INICIAR TEMPORIZADOR DE SEGURIDAD (4 segundos máximo)
        this.loadTimeout = setTimeout(() => {
            console.log('⏰ Timeout de seguridad: Forzando carga');
            this.emergencyLoad();
        }, 4000);

        try {
            // 🎯 FASE 1: Carga crítica (debe funcionar siempre)
            this.startProgressBar();
            this.updateProgress(10, 'Iniciando sistema...');
            
            // Configuración básica que NUNCA falla
            this.setupParticles();
            this.setupEventListeners();
            
            this.updateProgress(30, 'Preparando contenido...');
            await this.initializePosts(); // Esta función es segura
            
            this.updateProgress(60, 'Casi listo...');
            
            // 🎯 FASE 2: Carga opcional (si falla, no importa)
            try {
                window.onlineUsersManager = new OnlineUsersManager();
            } catch (e) {
                console.warn('⚠️ Usuarios en línea no disponibles:', e);
            }
            
            try {
                window.gameLoader = new GameLoader();
            } catch (e) {
                console.warn('⚠️ Juegos no disponibles:', e);
            }
            
            this.updateProgress(90, 'Finalizando...');
            await this.loadBoardPosts(this.currentBoard);
            
            this.updateProgress(100, '¡Bienvenido!');
            
            // ✅ ÉXITO - Limpiar timeout y mostrar contenido
            clearTimeout(this.loadTimeout);
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ Void Chan iniciado correctamente');
            
        } catch (error) {
            console.error('❌ Error en carga principal:', error);
            // ⚠️ ERROR - Pero igual mostrar contenido
            this.emergencyLoad();
        }
    }

    // 🆘 MÉTODO DE EMERGENCIA - SIEMPRE FUNCIONA
    emergencyLoad() {
        console.log('🆘 Activando carga de emergencia');
        clearTimeout(this.loadTimeout);
        
        // Forzar mostrar contenido inmediatamente
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.querySelector('.main');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.remove();
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
        }
        
        // Asegurar que al menos haya posts básicos
        if (!this.posts || Object.keys(this.posts).length === 0) {
            this.initializePosts();
        }
        
        this.renderPosts();
        this.showMessage('⚠️ Modo de emergencia activado', 'warning');
    }

    setupParticles() {
        try {
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    particles: {
                        number: { value: 40, density: { enable: true, value_area: 800 } },
                        color: { value: "#8a2be2" },
                        shape: { type: "circle" },
                        opacity: { value: 0.3, random: true },
                        size: { value: 2, random: true },
                        line_linked: {
                            enable: true,
                            distance: 120,
                            color: "#8a2be2",
                            opacity: 0.2,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 1.5,
                            direction: "none",
                            random: true,
                            straight: false,
                            out_mode: "out",
                            bounce: false
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: { enable: true, mode: "repulse" },
                            onclick: { enable: true, mode: "push" },
                            resize: true
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('⚠️ Partículas no disponibles:', e);
        }
    }

    setupEventListeners() {
        try {
            // 🎯 FORMULARIO (CRÍTICO)
            const postForm = document.getElementById('post-form');
            if (postForm) {
                postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
            }

            // 🧹 BOTÓN LIMPIAR
            const clearBtn = document.getElementById('clear-form');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearForm());
            }

            // 🌐 NAVEGACIÓN (CRÍTICO)
            document.querySelectorAll('.nav-link, .quick-board').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const board = e.target.getAttribute('data-board');
                    if (board === 'nsfw') {
                        this.showNSFWWarning(board);
                    } else {
                        this.changeBoard(board);
                    }
                });
            });

            // 🔤 CONTADOR DE CARACTERES
            const messageTextarea = document.getElementById('message');
            if (messageTextarea) {
                messageTextarea.addEventListener('input', (e) => {
                    this.updateCharCounter(e.target.value.length);
                });
            }

            // 📜 REGLAS
            const rulesBtn = document.getElementById('rules-btn');
            const rulesModal = document.getElementById('rules-modal');
            if (rulesBtn && rulesModal) {
                rulesBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    rulesModal.style.display = 'block';
                });
                
                const closeModal = rulesModal.querySelector('.close-modal');
                if (closeModal) {
                    closeModal.addEventListener('click', () => {
                        rulesModal.style.display = 'none';
                    });
                }
            }

            // 🈲 NSFW
            const nsfwConfirm = document.getElementById('nsfw-confirm');
            const nsfwDeny = document.getElementById('nsfw-deny');
            if (nsfwConfirm) nsfwConfirm.addEventListener('click', () => this.confirmNSFW());
            if (nsfwDeny) nsfwDeny.addEventListener('click', () => this.hideNSFWWarning());

            // 🌍 IDIOMAS (OPCIONAL)
            try {
                document.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const lang = e.target.getAttribute('data-lang');
                        this.changeLanguage(lang);
                    });
                });
            } catch (e) {
                console.warn('⚠️ Selector de idiomas no disponible');
            }

        } catch (error) {
            console.error('❌ Error en event listeners:', error);
        }
    }

    async initializePosts() {
        // 🎯 ESTA FUNCIÓN NUNCA DEBE FALLAR
        try {
            this.posts = {
                'global': [
                    {
                        id: 1,
                        name: 'Sistema',
                        subject: '¡Bienvenido a Void Chan!',
                        message: 'El foro está funcionando. Puedes publicar mensajes y navegar entre boards.',
                        date: 'Ahora mismo',
                        board: 'global'
                    },
                    {
                        id: 2,
                        name: 'Anónimo',
                        subject: '',
                        message: '¡Hola! Todo parece estar funcionando correctamente 🎉',
                        date: 'Hace 1 min',
                        board: 'global'
                    }
                ]
            };

            // Inicializar otros boards
            const boards = ['random', 'art', 'programming', 'anime', 'games', 'void'];
            boards.forEach(board => {
                if (!this.posts[board]) {
                    this.posts[board] = [
                        {
                            id: Date.now() + boards.indexOf(board),
                            name: 'Sistema',
                            subject: `Board /${board}/`,
                            message: `Bienvenido al board /${board}/. Sé el primero en publicar aquí!`,
                            date: 'Ahora mismo',
                            board: board
                        }
                    ];
                }
            });
            
        } catch (error) {
            console.error('❌ Error crítico en posts:', error);
            // 🆘 FALLBACK MÍNIMO
            this.posts = {
                'global': [
                    {
                        id: 1,
                        name: 'Sistema',
                        message: 'Void Chan - Modo básico activado',
                        date: 'Ahora',
                        board: 'global'
                    }
                ]
            };
        }
    }

    startProgressBar() {
        try {
            this.progressFill = document.getElementById('progress-fill');
            this.progressText = document.getElementById('progress-text');
            this.loadTip = document.getElementById('load-tip');
            
            if (this.progressFill) this.progressFill.style.width = '0%';
            if (this.progressText) this.progressText.textContent = '0%';
        } catch (e) {
            console.warn('⚠️ Barra de progreso no disponible');
        }
    }

    updateProgress(percent, message) {
        try {
            if (this.progressFill) this.progressFill.style.width = percent + '%';
            if (this.progressText) this.progressText.textContent = percent + '%';
            if (this.loadTip && message) this.loadTip.textContent = message;
        } catch (e) {
            // Silencioso - no es crítico
        }
    }

    hideLoadingScreen() {
        console.log('🎯 Ocultando pantalla de carga...');
        
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.querySelector('.main');
        
        // 🎪 ANIMACIÓN DE SALIDA
        if (loadingScreen) {
            loadingScreen.style.transition = 'opacity 0.5s ease-out';
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // 🎪 MOSTRAR CONTENIDO PRINCIPAL
        if (mainContent) {
            mainContent.style.display = 'block';
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.3s ease-in';
            }, 50);
        }
        
        // 🎉 EFECTO VISUAL DE BIENVENIDA
        setTimeout(() => {
            this.showMessage('🎉 ¡Bienvenido a Void Chan!', 'success');
        }, 600);
    }

    // 📝 MÉTODOS BÁSICOS (NUNCA FALLAN)
    handlePostSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const message = formData.get('message');
            const name = formData.get('name') || 'Anónimo';
            const subject = formData.get('subject') || '';

            if (!message.trim()) {
                this.showMessage('❌ El mensaje no puede estar vacío', 'error');
                return;
            }

            const newPost = {
                id: Date.now(),
                name: name,
                subject: subject,
                message: message,
                date: 'Ahora mismo',
                board: this.currentBoard
            };

            if (!this.posts[this.currentBoard]) {
                this.posts[this.currentBoard] = [];
            }
            
            this.posts[this.currentBoard].unshift(newPost);
            this.renderPosts();
            this.clearForm();
            this.showMessage('✅ Post publicado', 'success');
            
        } catch (error) {
            this.showMessage('❌ Error al publicar', 'error');
        }
    }

    renderPosts() {
        try {
            const container = document.getElementById('posts-container');
            const boardPosts = this.posts[this.currentBoard] || [];
            
            if (!container) return;
            
            if (boardPosts.length === 0) {
                container.innerHTML = `
                    <div class="post">
                        <div class="post-message">No hay posts en este board.</div>
                    </div>
                `;
                return;
            }

            container.innerHTML = boardPosts.map(post => `
                <div class="post">
                    <div class="post-header">
                        <span class="post-name">${this.escapeHTML(post.name)}</span>
                        <span class="post-id">#${post.id}</span>
                        <span class="post-date">${post.date}</span>
                    </div>
                    ${post.subject ? `<div class="post-subject">${this.escapeHTML(post.subject)}</div>` : ''}
                    <div class="post-message">${this.formatMessage(post.message)}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error renderizando posts:', error);
        }
    }

    changeBoard(board) {
        this.currentBoard = board;
        this.updateBoardInfo(board);
        this.renderPosts();
        this.showMessage(`📁 Cambiado a /${board}/`, 'info');
    }

    // 🛡️ MÉTODOS DE SEGURIDAD
    escapeHTML(text) {
        try {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        } catch {
            return text;
        }
    }

    formatMessage(text) {
        try {
            return this.escapeHTML(text).replace(/\n/g, '<br>');
        } catch {
            return text;
        }
    }

    showMessage(text, type = 'info') {
        try {
            // Remover mensajes existentes
            document.querySelectorAll('.flash-message').forEach(msg => msg.remove());
            
            const colors = {
                'success': '#00ff88',
                'error': '#ff4444',
                'info': '#8a2be2',
                'warning': '#ffaa00'
            };
            
            const message = document.createElement('div');
            message.className = 'flash-message';
            message.textContent = text;
            message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type] || '#8a2be2'};
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                z-index: 10000;
                font-family: 'Share Tech Mono', monospace;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.opacity = '0';
                message.style.transition = 'opacity 0.3s ease-in';
                setTimeout(() => message.remove(), 300);
            }, 3000);
        } catch (error) {
            console.warn('No se pudo mostrar mensaje:', error);
        }
    }

    // ... (otros métodos se mantienen igual pero con try/catch)
}

// 🚀 INICIALIZACIÓN A PRUEBA DE FALLOS
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.voidChanApp = new VoidChanApp();
    } catch (error) {
        console.error('❌ ERROR CRÍTICO:', error);
        
        // 🆘 MÁXIMA EMERGENCIA - MOSTRAR ALGO FUNCIONAL
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.querySelector('.main');
        
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        
        alert('Void Chan - Modo de emergencia activado. La funcionalidad puede ser limitada.');
    }
});

// 🛡️ SEGURIDAD EXTRA - GARANTIZAR QUE EL LOADING SE OCULTE
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('🛡️ Seguridad: Forzando cierre de loading');
        loadingScreen.style.display = 'none';
    }
}, 5000); // 5 segundos máximo
