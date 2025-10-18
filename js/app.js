// js/app-fixed.js - VERSIÓN 3.0
class VoidChanApp {
    constructor() {
        this.currentBoard = 'global';
        this.posts = [];
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        try {
            // Configurar partículas
            this.setupParticles();
            
            // Configurar todos los event listeners
            this.setupEventListeners();
            
            // Inicializar sistema de posts
            await this.initializePosts();
            
            // Ocultar loading y mostrar contenido
            this.hideLoadingScreen();
            
            // Cargar posts iniciales
            await this.loadBoardPosts(this.currentBoard);
            
            this.isInitialized = true;
            console.log('✅ Void Chan iniciado correctamente');
            
        } catch (error) {
            console.error('❌ Error iniciando Void Chan:', error);
            this.showError('Error al iniciar la aplicación');
            this.hideLoadingScreen(); // Asegurar que no se quede bloqueado
        }
    }

    setupParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 60, density: { enable: true, value_area: 800 } },
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
    }

    setupEventListeners() {
        // 🎯 FORMULARIO DE POSTS
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        }

        // 🧹 BOTÓN LIMPIAR FORMULARIO
        const clearBtn = document.getElementById('clear-form');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }

        // 🌐 NAVEGACIÓN PRINCIPAL
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const board = e.target.getAttribute('data-board');
                this.changeBoard(board);
            });
        });

        // ⚡ QUICK BOARDS
        document.querySelectorAll('.quick-board').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const board = e.target.getAttribute('data-board');
                if (board === 'nsfw') {
                    this.showNSFWWarning(board);
                } else {
                    this.changeBoard(board);
                }
            });
        });

        // 🈲 NSFW WARNING
        const nsfwConfirm = document.getElementById('nsfw-confirm');
        const nsfwDeny = document.getElementById('nsfw-deny');
        if (nsfwConfirm) {
            nsfwConfirm.addEventListener('click', () => this.confirmNSFW());
        }
        if (nsfwDeny) {
            nsfwDeny.addEventListener('click', () => this.hideNSFWWarning());
        }

        // 🔤 CONTADOR DE CARACTERES
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.addEventListener('input', (e) => {
                this.updateCharCounter(e.target.value.length);
            });
        }

        // 📜 MODAL DE REGLAS
        const rulesBtn = document.getElementById('rules-btn');
        const closeModal = document.querySelector('.close-modal');
        const rulesModal = document.getElementById('rules-modal');
        
        if (rulesBtn && rulesModal) {
            rulesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                rulesModal.style.display = 'block';
            });
        }
        
        if (closeModal && rulesModal) {
            closeModal.addEventListener('click', () => {
                rulesModal.style.display = 'none';
            });
        }

        // 🎨 CAMBIO DE TEMA
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 🌍 CAMBIO DE IDIOMA - FUNCIONAL
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });

        // 📁 MANEJO DE ARCHIVOS
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            const rulesModal = document.getElementById('rules-modal');
            if (e.target === rulesModal) {
                rulesModal.style.display = 'none';
            }
            
            const nsfwWarning = document.getElementById('nsfw-warning');
            if (e.target === nsfwWarning) {
                this.hideNSFWWarning();
            }
        });
    }

    async initializePosts() {
        // Posts de ejemplo para demostración
        this.posts = {
            'global': [
                {
                    id: 1,
                    name: 'Sistema',
                    subject: '¡Bienvenido!',
                    message: 'Bienvenido a Void Chan. Este es el canal global donde puedes conversar con todos.',
                    date: 'Ahora mismo',
                    board: 'global'
                },
                {
                    id: 2,
                    name: 'Anónimo',
                    subject: '',
                    message: '¡Hola a todos! ¿Cómo están? El foro se ve increíble 👻',
                    date: 'Hace 2 min',
                    board: 'global'
                }
            ],
            'random': [
                {
                    id: 3,
                    name: 'Anónimo',
                    subject: 'Random post',
                    message: '¿Alguien más piensa que los gatos son los mejores animales? 🐱',
                    date: 'Hace 5 min',
                    board: 'random'
                }
            ],
            'art': [
                {
                    id: 4,
                    name: 'Artista',
                    subject: 'Mi último dibujo',
                    message: 'Acabo de terminar este dibujo digital. ¿Qué opinan? 🎨',
                    date: 'Hace 10 min',
                    board: 'art'
                }
            ]
        };

        // Inicializar posts vacíos para otros boards
        const boards = ['programming', 'anime', 'games', 'void', 'music', 'literature', 'ai', 'tech', 'nsfw'];
        boards.forEach(board => {
            if (!this.posts[board]) {
                this.posts[board] = [
                    {
                        id: Date.now(),
                        name: 'Sistema',
                        subject: 'Board vacío',
                        message: `Este es el board /${board}/. Sé el primero en publicar aquí!`,
                        date: 'Ahora mismo',
                        board: board
                    }
                ];
            }
        });
    }

    async handlePostSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const message = formData.get('message');
        const name = formData.get('name') || 'Anónimo';
        const subject = formData.get('subject') || '';

        if (!message.trim()) {
            this.showMessage('❌ El mensaje no puede estar vacío', 'error');
            return;
        }

        try {
            const newPost = {
                id: Date.now(),
                name: name,
                subject: subject,
                message: message,
                date: 'Ahora mismo',
                board: this.currentBoard
            };

            // Agregar post localmente
            this.posts[this.currentBoard].unshift(newPost);
            
            // Renderizar posts
            this.renderPosts();
            
            // Limpiar formulario
            this.clearForm();
            
            // Mostrar mensaje de éxito
            this.showMessage('✅ Post publicado correctamente', 'success');
            
            // Actualizar estadísticas
            this.updateStats();

        } catch (error) {
            console.error('Error publicando post:', error);
            this.showMessage('❌ Error al publicar el post', 'error');
        }
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        const boardPosts = this.posts[this.currentBoard] || [];
        
        if (boardPosts.length === 0) {
            container.innerHTML = `
                <div class="post">
                    <div class="post-message" style="text-align: center; color: var(--void-text-secondary);">
                        No hay posts en este board. Sé el primero en publicar.
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = boardPosts.map(post => `
            <div class="post fade-in">
                <div class="post-header">
                    <span class="post-name">${this.escapeHTML(post.name)}</span>
                    <span class="post-id">#${post.id}</span>
                    <span class="post-date">${post.date}</span>
                </div>
                ${post.subject ? `<div class="post-subject">${this.escapeHTML(post.subject)}</div>` : ''}
                <div class="post-message">${this.formatMessage(post.message)}</div>
            </div>
        `).join('');
    }

    formatMessage(text) {
        return this.escapeHTML(text)
            .replace(/\n/g, '<br>')
            .replace(/>>(\d+)/g, '<a href="#post-$1" class="quote">>>$1</a>');
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async changeBoard(board) {
        console.log(`🔄 Cambiando a board: /${board}/`);
        
        // Actualizar navegación activa
        this.updateActiveNavigation(board);
        
        // Actualizar UI
        this.currentBoard = board;
        this.updateBoardInfo(board);
        
        // Mostrar loading
        this.showLoading();
        
        // Simular carga
        setTimeout(() => {
            this.renderPosts();
            this.hideLoading();
            this.showMessage(`📁 Cambiado a /${board}/`, 'info');
        }, 500);
    }

    updateActiveNavigation(board) {
        // Actualizar nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-board') === board) {
                link.classList.add('active');
            }
        });

        // Actualizar quick boards
        document.querySelectorAll('.quick-board').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-board') === board) {
                btn.classList.add('active');
            }
        });
    }

    updateBoardInfo(board) {
        const boardNames = {
            'global': 'Global',
            'random': 'Random',
            'void': 'Void',
            'art': 'Arte',
            'music': 'Música',
            'literature': 'Literatura',
            'programming': 'Programación',
            'ai': 'Inteligencia Artificial',
            'tech': 'Tecnología',
            'anime': 'Anime',
            'games': 'Juegos',
            'nsfw': 'NSFW - Adultos'
        };

        const descriptions = {
            'global': 'Conversaciones globales en tiempo real',
            'random': 'Todo vale en el vacío',
            'void': 'El vacío absoluto',
            'art': 'Arte y creatividad visual',
            'music': 'Música y sonido',
            'programming': 'Código y desarrollo',
            'anime': 'Anime y cultura japonesa',
            'games': 'Videojuegos y gaming',
            'nsfw': 'Contenido para adultos +18'
        };

        const titleElement = document.getElementById('board-title');
        const descElement = document.getElementById('board-description');

        if (titleElement) {
            titleElement.textContent = `/${board}/ - ${boardNames[board] || board}`;
        }
        if (descElement) {
            descElement.textContent = descriptions[board] || `Board /${board}/`;
        }
    }

    showNSFWWarning(board) {
        const warning = document.getElementById('nsfw-warning');
        if (warning) {
            warning.style.display = 'flex';
            warning.setAttribute('data-target-board', board);
        }
    }

    hideNSFWWarning() {
        const warning = document.getElementById('nsfw-warning');
        if (warning) {
            warning.style.display = 'none';
        }
    }

    confirmNSFW() {
        const warning = document.getElementById('nsfw-warning');
        const board = warning.getAttribute('data-target-board');
        this.hideNSFWWarning();
        this.changeBoard(board);
    }

    changeLanguage(lang) {
        console.log(`🌍 Cambiando idioma a: ${lang}`);
        
        // Actualizar botones activos
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Aquí iría la lógica de traducción
        this.showMessage(`🌐 Idioma cambiado a ${lang.toUpperCase()}`, 'info');
        
        // Guardar preferencia
        localStorage.setItem('voidchan_language', lang);
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('theme-dark');
        
        if (isDark) {
            body.classList.remove('theme-dark');
            body.classList.add('theme-light');
            this.showMessage('☀️ Tema claro activado', 'info');
        } else {
            body.classList.remove('theme-light');
            body.classList.add('theme-dark');
            this.showMessage('🌙 Tema oscuro activado', 'info');
        }
    }

    updateCharCounter(count) {
        const counter = document.getElementById('char-count');
        if (counter) {
            counter.textContent = count;
            counter.style.color = count > 1800 ? '#ff4444' : '#a0a0a0';
        }
    }

    clearForm() {
        const form = document.getElementById('post-form');
        if (form) {
            form.reset();
            this.updateCharCounter(0);
            
            const fileName = document.getElementById('file-name');
            if (fileName) fileName.textContent = '';
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        const fileName = document.getElementById('file-name');
        
        if (file && fileName) {
            fileName.textContent = `📎 ${file.name}`;
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.querySelector('.main');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'block';
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showMessage(text, type = 'info') {
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
            animation: slideInFromRight 0.3s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOutToRight 0.3s ease-in';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.showMessage(`❌ ${message}`, 'error');
    }

    updateStats() {
        const onlineNumber = document.getElementById('online-number');
        const postNumber = document.getElementById('post-number');
        const speedNumber = document.getElementById('speed-number');
        
        if (onlineNumber) onlineNumber.textContent = Math.floor(Math.random() * 50) + 1;
        if (postNumber) postNumber.textContent = Object.values(this.posts).flat().length;
        if (speedNumber) speedNumber.textContent = Math.floor(Math.random() * 10) + 1;
    }

    async loadBoardPosts(board) {
        this.showLoading();
        
        try {
            // Simular carga de posts
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (!this.posts[board]) {
                this.posts[board] = [
                    {
                        id: Date.now(),
                        name: 'Sistema',
                        subject: 'Nuevo board',
                        message: `Bienvenido al board /${board}/. Sé el primero en publicar!`,
                        date: 'Ahora mismo',
                        board: board
                    }
                ];
            }
            
            this.renderPosts();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error cargando posts:', error);
            this.showError('Error cargando posts');
            this.hideLoading();
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.voidChanApp = new VoidChanApp();
});

// CSS para animaciones de mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutToRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .flash-message {
        animation: slideInFromRight 0.3s ease-out;
    }
`;
document.head.appendChild(style);
