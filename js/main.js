// Sistema de Void Chan MEJORADO
class VoidChan {
    constructor() {
        this.currentBoard = 'global';
        this.posts = {};
        this.onlineUsers = 15;
        this.currentTheme = 'purple';
        this.userId = this.generateUserId();
        this.isConnectedToSupabase = false;
        this.init();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        this.startLoadingProgress();
    }

    startLoadingProgress() {
        let progress = 0;
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const loadingMessage = document.getElementById('loading-message');
        
        const progressInterval = setInterval(async () => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressText) progressText.textContent = Math.round(progress) + '%';
            
            const message = this.getLoadingMessage(progress);
            if (loadingMessage) loadingMessage.textContent = message;
            
            // En 50% intentar conectar a Supabase
            if (progress >= 50 && !this.isConnectedToSupabase) {
                await this.testSupabaseConnection();
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                this.showWelcomeScreen();
            }
        }, 150);
    }

    async testSupabaseConnection() {
        try {
            console.log('🔗 Probando conexión a Supabase...');
            const { data, error } = await window.supabase
                .from('posts')
                .select('id')
                .limit(1);
            
            if (error) {
                if (error.message.includes('does not exist')) {
                    await this.createPostsTable();
                } else {
                    throw error;
                }
            }
            
            this.isConnectedToSupabase = true;
            console.log('✅ Conectado a Supabase');
            
        } catch (error) {
            console.log('❌ Error conectando a Supabase:', error.message);
            this.isConnectedToSupabase = false;
        }
    }

    async createPostsTable() {
        try {
            console.log('📦 Creando tabla posts...');
            // Crear tabla insertando un post de prueba
            const testPost = {
                name: 'Sistema',
                subject: 'Tabla Creada',
                message: 'La base de datos ha sido inicializada',
                board: 'global',
                created_at: new Date().toISOString()
            };
            
            const { error } = await window.supabase
                .from('posts')
                .insert([testPost]);
            
            if (error) throw error;
            console.log('✅ Tabla posts creada exitosamente');
            
        } catch (error) {
            console.log('❌ Error creando tabla:', error.message);
        }
    }

    getLoadingMessage(progress) {
        if (progress < 20) return "Inicializando void...";
        if (progress < 40) return "Cargando interfaz...";
        if (progress < 60) return "Conectando a la base...";
        if (progress < 80) return "Sincronizando datos...";
        return "Activando sistemas...";
    }

    showWelcomeScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('welcome-screen').style.display = 'flex';
            this.updateWelcomeStats();
            this.setupWelcomeEvents();
        }, 500);
    }

    setupWelcomeEvents() {
        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => this.hideWelcomeScreen());
        }
    }

    updateWelcomeStats() {
        const welcomeOnline = document.getElementById('welcome-online');
        const welcomePosts = document.getElementById('welcome-posts');
        
        if (welcomeOnline) welcomeOnline.textContent = this.onlineUsers;
        if (welcomePosts) welcomePosts.textContent = '1.2k';
    }

    hideWelcomeScreen() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        this.setupMainSystems();
    }

    setupMainSystems() {
        this.setupParticles();
        this.setupEventListeners();
        this.loadUserPreferences();
        this.setupOnlineUsers();
        this.loadAllPosts();
        this.updateAllStats();
    }

    setupParticles() {
        try {
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
                            out_mode: "out"
                        }
                    }
                });
            }
        } catch (error) {
            console.log('⚠️ Partículas no disponibles');
        }
    }

    setupEventListeners() {
        // Selector de temas
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        }

        // Navegación rápida - CORREGIDO
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.nav-btn').getAttribute('data-action');
                this.handleNavAction(action);
            });
        });

        // Boards rápidos - CORREGIDO
        document.querySelectorAll('.quick-board').forEach(board => {
            board.addEventListener('click', (e) => {
                const boardName = e.target.closest('.quick-board').getAttribute('data-board');
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
            clearForm.addEventListener('click', () => this.clearPostForm());
        }

        // Contador de caracteres
        const postMessage = document.getElementById('post-message');
        if (postMessage) {
            postMessage.addEventListener('input', () => this.updateCharCount());
        }

        // Categorías colapsables
        document.querySelectorAll('.nav-category h3').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.target.closest('.nav-category');
                category.classList.toggle('collapsed');
            });
        });

        // NSFW Warning
        document.querySelectorAll('.nsfw-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNSFWWarning();
            });
        });

        document.getElementById('nsfw-confirm')?.addEventListener('click', () => {
            this.hideNSFWWarning();
        });

        document.getElementById('nsfw-cancel')?.addEventListener('click', () => {
            this.hideNSFWWarning();
        });
    }

    setupOnlineUsers() {
        // Simular usuarios en línea
        setInterval(() => {
            const baseUsers = 15;
            const randomUsers = Math.floor(Math.random() * 8);
            const totalUsers = baseUsers + randomUsers;
            this.onlineUsers = totalUsers;

            document.querySelectorAll('#online-count, #board-online, #footer-online').forEach(el => {
                el.textContent = totalUsers;
            });
        }, 8000);
    }

    changeTheme(theme) {
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

    async loadAllPosts() {
        try {
            if (this.isConnectedToSupabase) {
                const { data, error } = await window.supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                this.posts = {};
                if (data && data.length > 0) {
                    data.forEach(post => {
                        if (!this.posts[post.board]) {
                            this.posts[post.board] = [];
                        }
                        this.posts[post.board].push(post);
                    });
                    console.log(`✅ Cargados ${data.length} posts de Supabase`);
                } else {
                    await this.createSamplePosts();
                }
            } else {
                this.loadLocalPosts();
            }
        } catch (error) {
            console.log('⚠️ Cargando posts locales');
            this.loadLocalPosts();
        }
        
        this.renderPosts();
    }

    async createSamplePosts() {
        const samplePosts = [
            {
                name: 'Sistema',
                subject: '¡Bienvenido a Void Chan!',
                message: 'Este es el foro global. Los posts se guardan permanentemente y son visibles para todos los usuarios.\n\n¡Únete a la conversación! 🌌',
                board: 'global',
                created_at: new Date().toISOString()
            },
            {
                name: 'Anónimo',
                subject: 'Primer post',
                message: '¡Hola a todos! 👋\n\nForo conectado a base de datos real. Posts permanentes.',
                board: 'global', 
                created_at: new Date().toISOString()
            }
        ];

        if (this.isConnectedToSupabase) {
            const { error } = await window.supabase
                .from('posts')
                .insert(samplePosts);
            
            if (!error) {
                samplePosts.forEach(post => {
                    if (!this.posts[post.board]) this.posts[post.board] = [];
                    this.posts[post.board].push(post);
                });
            }
        } else {
            samplePosts.forEach(post => {
                if (!this.posts[post.board]) this.posts[post.board] = [];
                this.posts[post.board].push(post);
            });
            this.saveLocalPosts();
        }
    }

    loadLocalPosts() {
        const saved = localStorage.getItem('voidchan-posts');
        this.posts = saved ? JSON.parse(saved) : {};
        
        if (Object.keys(this.posts).length === 0) {
            this.createSamplePosts();
        }
    }

    saveLocalPosts() {
        localStorage.setItem('voidchan-posts', JSON.stringify(this.posts));
    }

    changeBoard(boardName) {
        this.currentBoard = boardName;
        
        // Actualizar UI de boards
        document.querySelectorAll('.quick-board').forEach(board => {
            board.classList.toggle('active', board.getAttribute('data-board') === boardName);
        });
        
        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-board') === boardName);
        });
        
        // Actualizar título
        const boardInfo = this.getBoardInfo(boardName);
        document.getElementById('board-title').textContent = boardInfo.title;
        document.getElementById('board-description').textContent = boardInfo.description;
        
        this.renderPosts();
    }

    getBoardInfo(boardName) {
        const boards = {
            'global': { title: '/global/', description: 'Global' },
            'random': { title: '/b/', description: 'Random' },
            'art': { title: '/art/', description: 'Arte' },
            'programming': { title: '/prog/', description: 'Programación' },
            'anime': { title: '/a/', description: 'Anime' },
            'videogames': { title: '/v/', description: 'Videojuegos' },
            'music': { title: '/mu/', description: 'Música' },
            'movies': { title: '/tv/', description: 'Cine & TV' }
        };
        return boards[boardName] || { title: `/${boardName}/`, description: boardName };
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        if (!container) return;

        const boardPosts = this.posts[this.currentBoard] || [];
        
        if (boardPosts.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts-icon">🌌</div>
                    <h3>Vacío cósmico</h3>
                    <p>Sé el primero en romper el silencio</p>
                </div>
            `;
        } else {
            container.innerHTML = boardPosts.map(post => this.createPostHTML(post)).join('');
        }
        
        this.updatePostStats();
    }

    createPostHTML(post) {
        const date = new Date(post.created_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="post">
                <div class="post-header">
                    <span class="post-name">${post.name || 'Anónimo'}</span>
                    <span class="post-date">${date}</span>
                </div>
                ${post.subject ? `<div class="post-subject">${post.subject}</div>` : ''}
                <div class="post-content">${this.formatPostContent(post.message)}</div>
            </div>
        `;
    }

    formatPostContent(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">🔗</a>');
    }

    updatePostStats() {
        const boardPosts = this.posts[this.currentBoard] || [];
        const totalPosts = Object.values(this.posts).flat().length;
        
        document.getElementById('board-posts').textContent = boardPosts.length;
        document.getElementById('footer-posts').textContent = totalPosts;
    }

    updateAllStats() {
        this.updatePostStats();
        document.getElementById('board-activity').textContent = Math.floor(Math.random() * 3) + 1;
    }

    async handlePostSubmit() {
        const name = document.getElementById('post-name').value.trim() || 'Anónimo';
        const subject = document.getElementById('post-subject').value.trim();
        const message = document.getElementById('post-message').value.trim();
        
        if (!message) {
            this.showMessage('Escribe algo primero', 'error');
            return;
        }
        
        const post = {
            name: name,
            subject: subject,
            message: message,
            board: this.currentBoard,
            created_at: new Date().toISOString()
        };
        
        try {
            if (this.isConnectedToSupabase) {
                const { data, error } = await window.supabase
                    .from('posts')
                    .insert([post])
                    .select();
                
                if (error) throw error;
                
                if (data && data[0]) {
                    post.id = data[0].id;
                }
            }
            
            // Agregar localmente
            if (!this.posts[this.currentBoard]) {
                this.posts[this.currentBoard] = [];
            }
            this.posts[this.currentBoard].unshift(post);
            this.saveLocalPosts();
            
            this.clearPostForm();
            this.renderPosts();
            this.showMessage('Post publicado 🌟', 'success');
            
        } catch (error) {
            console.log('Error publicando:', error);
            this.showMessage('Error al publicar', 'error');
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
            charCount.style.color = count > 1800 ? '#ff4444' : count > 1500 ? '#ffaa00' : '';
        }
    }

    handleNavAction(action) {
        const targets = {
            'scroll-to-posts': 'posts-container',
            'scroll-to-form': 'post-form-container', 
            'scroll-to-games': 'games-section'
        };
        
        if (action === 'scroll-to-top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (targets[action]) {
            const target = document.getElementById(targets[action]);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showNSFWWarning() {
        document.getElementById('nsfw-warning').style.display = 'flex';
    }

    hideNSFWWarning() {
        document.getElementById('nsfw-warning').style.display = 'none';
    }

    showMessage(text, type) {
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
        setTimeout(() => message.remove(), 3000);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.voidChan = new VoidChan();
});
