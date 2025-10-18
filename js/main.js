// Sistema de Void Chan COMPLETO
class VoidChan {
    constructor() {
        this.currentBoard = 'global';
        this.posts = {};
        this.onlineUsers = 1;
        this.currentTheme = 'purple';
        this.userId = this.generateUserId();
        this.init();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // INICIAR CARGA CON PROGRESO - FUNCIONANDO
        this.startLoadingProgress();
    }

    startLoadingProgress() {
        let progress = 0;
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const loadingMessage = document.getElementById('loading-message');
        
        console.log('🔄 Iniciando barra de carga...');
        
        const progressInterval = setInterval(() => {
            progress += Math.random() * 10 + 5; // Incremento variable más realista
            if (progress > 100) progress = 100;
            
            // ACTUALIZAR PROGRESO VISUAL - CORREGIDO
            if (progressFill) {
                progressFill.style.width = progress + '%';
                progressFill.style.transition = 'width 0.3s ease';
            }
            if (progressText) {
                progressText.textContent = Math.round(progress) + '%';
            }
            
            // Actualizar mensaje de estado
            const message = this.getLoadingMessage(progress);
            if (loadingMessage) {
                loadingMessage.textContent = message;
            }
            
            console.log(`Progreso: ${Math.round(progress)}% - ${message}`);
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                console.log('✅ Carga completada');
                this.showWelcomeScreen();
            }
        }, 200); // Más lento para mejor visualización
    }

    getLoadingMessage(progress) {
        if (progress < 15) return "Inicializando núcleo del void...";
        if (progress < 30) return "Cargando interfaz espacial...";
        if (progress < 45) return "Conectando a la matrix...";
        if (progress < 60) return "Sincronizando partículas...";
        if (progress < 75) return "Cargando posts cósmicos...";
        if (progress < 90) return "Configurando tiempo real...";
        if (progress < 100) return "Activando protocolos...";
        return "¡Void listo!";
    }

    showWelcomeScreen() {
        console.log('🎭 Mostrando pantalla de bienvenida...');
        
        const loadingScreen = document.getElementById('loading-screen');
        const welcomeScreen = document.getElementById('welcome-screen');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
        
        this.updateWelcomeStats();
        this.setupWelcomeEvents();
    }

    setupWelcomeEvents() {
        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                this.hideWelcomeScreen();
            });
        }
    }

    updateWelcomeStats() {
        // Simular estadísticas
        const welcomeOnline = document.getElementById('welcome-online');
        const welcomePosts = document.getElementById('welcome-posts');
        
        if (welcomeOnline) welcomeOnline.textContent = Math.floor(Math.random() * 50) + 10;
        if (welcomePosts) welcomePosts.textContent = Math.floor(Math.random() * 1000) + 500;
    }

    hideWelcomeScreen() {
        console.log('🌌 Entrando al void...');
        
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainApp = document.getElementById('main-app');
        
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (mainApp) {
            mainApp.style.display = 'block';
            // Iniciar sistemas después de mostrar la app principal
            this.setupMainSystems();
        }
        
        this.showMessage('🎉 ¡Bienvenido a Void Chan!', 'success');
    }

    setupMainSystems() {
        console.log('⚙️ Configurando sistemas principales...');
        
        this.setupParticles();
        this.setupEventListeners();
        this.loadUserPreferences();
        this.setupOnlineUsers();
        this.renderPosts();
        this.updateAllStats();
    }

    setupParticles() {
        console.log('✨ Configurando partículas...');
        try {
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    particles: {
                        number: { value: 80, density: { enable: true, value_area: 800 } },
                        color: { value: "#8a2be2" },
                        shape: { type: "circle" },
                        opacity: { value: 0.5, random: true },
                        size: { value: 3, random: true },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: "#8a2be2",
                            opacity: 0.4,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 2,
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
        } catch (error) {
            console.log('⚠️ No se pudieron cargar las partículas');
        }
    }

    setupEventListeners() {
        console.log('🎯 Configurando event listeners...');
        
        // Selector de temas
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }
        
        // Navegación rápida
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleNavAction(action);
            });
        });
        
        // Boards rápidos
        const quickBoards = document.querySelectorAll('.quick-board');
        quickBoards.forEach(board => {
            board.addEventListener('click', (e) => {
                const boardName = e.target.getAttribute('data-board');
                this.changeBoard(boardName);
            });
        });
        
        // Formulario de posts
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePostSubmit();
            });
        }
        
        // Limpiar formulario
        const clearForm = document.getElementById('clear-form');
        if (clearForm) {
            clearForm.addEventListener('click', () => {
                this.clearPostForm();
            });
        }
        
        // Contador de caracteres
        const postMessage = document.getElementById('post-message');
        if (postMessage) {
            postMessage.addEventListener('input', () => {
                this.updateCharCount();
            });
        }
    }

    setupOnlineUsers() {
        // Simular usuarios en línea
        setInterval(() => {
            const onlineCount = document.getElementById('online-count');
            const boardOnline = document.getElementById('board-online');
            const footerOnline = document.getElementById('footer-online');
            
            const baseUsers = 15;
            const randomUsers = Math.floor(Math.random() * 10);
            const totalUsers = baseUsers + randomUsers;
            
            if (onlineCount) onlineCount.textContent = totalUsers;
            if (boardOnline) boardOnline.textContent = totalUsers;
            if (footerOnline) footerOnline.textContent = totalUsers;
        }, 5000);
    }

    changeTheme(theme) {
        console.log('🎨 Cambiando tema a:', theme);
        document.body.className = 'theme-' + theme;
        this.currentTheme = theme;
        localStorage.setItem('voidchan-theme', theme);
    }

    loadUserPreferences() {
        const savedTheme = localStorage.getItem('voidchan-theme');
        if (savedTheme) {
            this.changeTheme(savedTheme);
            const themeSelect = document.getElementById('theme-select');
            if (themeSelect) themeSelect.value = savedTheme;
        }
    }

    changeBoard(boardName) {
        console.log('📋 Cambiando a board:', boardName);
        this.currentBoard = boardName;
        
        // Actualizar UI
        const quickBoards = document.querySelectorAll('.quick-board');
        quickBoards.forEach(board => {
            board.classList.remove('active');
            if (board.getAttribute('data-board') === boardName) {
                board.classList.add('active');
            }
        });
        
        // Actualizar título del board
        const boardTitle = document.getElementById('board-title');
        const boardDescription = document.getElementById('board-description');
        
        if (boardTitle && boardDescription) {
            const boardInfo = this.getBoardInfo(boardName);
            boardTitle.textContent = boardInfo.title;
            boardDescription.textContent = boardInfo.description;
        }
        
        this.renderPosts();
    }

    getBoardInfo(boardName) {
        const boards = {
            'global': { title: '/global/ - Canal Global', description: 'Conversaciones en tiempo real con la comunidad global' },
            'random': { title: '/b/ - Random', description: 'Todo vale, sin reglas' },
            'art': { title: '/art/ - Arte', description: 'Comparte y discute arte' },
            'programming': { title: '/prog/ - Programación', description: 'Código, lenguajes y tecnología' },
            'anime': { title: '/a/ - Anime', description: 'Anime, manga y cultura japonesa' }
        };
        
        return boards[boardName] || { title: `/${boardName}/`, description: 'Board de la comunidad' };
    }

    renderPosts() {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;
        
        const boardPosts = this.posts[this.currentBoard] || [];
        
        if (boardPosts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts-icon">🌌</div>
                    <h3>No hay posts aún</h3>
                    <p>Sé el primero en publicar en este board</p>
                </div>
            `;
            return;
        }
        
        postsContainer.innerHTML = boardPosts.map(post => `
            <div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-meta">
                        <span class="post-name">${post.name || 'Anónimo'}</span>
                        <span class="post-id">ID: ${post.id || 'N/A'}</span>
                    </div>
                    <div class="post-date">${new Date(post.created_at).toLocaleString()}</div>
                </div>
                ${post.subject ? `<div class="post-subject">${post.subject}</div>` : ''}
                <div class="post-content">${this.formatPostContent(post.message)}</div>
            </div>
        `).join('');
        
        // Actualizar estadísticas
        this.updatePostStats();
    }

    formatPostContent(content) {
        // Convertir saltos de línea y URLs
        return content
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    }

    updatePostStats() {
        const boardPosts = this.posts[this.currentBoard] || [];
        const boardPostsElement = document.getElementById('board-posts');
        const footerPostsElement = document.getElementById('footer-posts');
        
        if (boardPostsElement) boardPostsElement.textContent = boardPosts.length;
        if (footerPostsElement) footerPostsElement.textContent = Object.values(this.posts).flat().length;
    }

    updateAllStats() {
        this.updatePostStats();
        
        // Actualizar actividad
        const boardActivity = document.getElementById('board-activity');
        if (boardActivity) {
            boardActivity.textContent = Math.floor(Math.random() * 5);
        }
    }

    async handlePostSubmit() {
        const name = document.getElementById('post-name').value || 'Anónimo';
        const subject = document.getElementById('post-subject').value;
        const message = document.getElementById('post-message').value;
        
        if (!message.trim()) {
            this.showMessage('❌ El mensaje no puede estar vacío', 'error');
            return;
        }
        
        const post = {
            name: name,
            subject: subject,
            message: message,
            board: this.currentBoard,
            created_at: new Date().toISOString()
        };
        
        console.log('📤 Publicando post:', post);
        
        try {
            // Intentar guardar en Supabase
            const { data, error } = await window.supabase
                .from('posts')
                .insert([post]);
            
            if (error) throw error;
            
            // Agregar a posts locales
            if (!this.posts[this.currentBoard]) {
                this.posts[this.currentBoard] = [];
            }
            this.posts[this.currentBoard].unshift(post);
            
            this.clearPostForm();
            this.renderPosts();
            this.showMessage('✅ Post publicado exitosamente', 'success');
            
        } catch (error) {
            console.log('⚠️ Guardando post localmente');
            // Guardar localmente si falla Supabase
            if (!this.posts[this.currentBoard]) {
                this.posts[this.currentBoard] = [];
            }
            this.posts[this.currentBoard].unshift(post);
            localStorage.setItem('voidchan-posts', JSON.stringify(this.posts));
            
            this.clearPostForm();
            this.renderPosts();
            this.showMessage('✅ Post publicado (modo local)', 'success');
        }
    }

    clearPostForm() {
        document.getElementById('post-name').value = '';
        document.getElementById('post-subject').value = '';
        document.getElementById('post-message').value = '';
        this.updateCharCount();
    }

    updateCharCount() {
        const message = document.getElementById('post-message');
        const charCount = document.getElementById('char-count');
        
        if (message && charCount) {
            const count = message.value.length;
            charCount.textContent = count;
            
            if (count > 1800) {
                charCount.style.color = '#ff4444';
            } else if (count > 1500) {
                charCount.style.color = '#ffaa00';
            } else {
                charCount.style.color = '';
            }
        }
    }

    handleNavAction(action) {
        switch (action) {
            case 'scroll-to-posts':
                document.getElementById('posts-container').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'scroll-to-form':
                document.getElementById('post-form-container').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'scroll-to-games':
                document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'scroll-to-top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
        }
    }

    showMessage(text, type) {
        // Crear mensaje temporal
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#ff4444' : '#00aa00'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    loadLocalPosts() {
        const savedPosts = localStorage.getItem('voidchan-posts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        } else {
            // Posts de ejemplo
            this.posts = {
                'global': [
                    {
                        name: 'Sistema',
                        subject: '¡Bienvenido a Void Chan!',
                        message: 'Este es el foro global. Puedes publicar mensajes y conversar con otros usuarios.\n\nCaracterísticas:\n✅ Posts en tiempo real\n✅ Múltiples boards\n✅ Interfaz espacial\n✅ Sin censura\n\n¡Disfruta del void! 🌌',
                        board: 'global',
                        created_at: new Date().toISOString()
                    }
                ]
            };
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 DOM cargado, iniciando Void Chan...');
    window.voidChan = new VoidChan();
});

// CSS para animaciones de mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .no-posts {
        text-align: center;
        padding: 3rem;
        color: var(--color-text-secondary);
    }
    
    .no-posts-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
`;
document.head.appendChild(style);
