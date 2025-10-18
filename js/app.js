// js/app.js - Versión completa con Supabase
class VoidChan {
    constructor() {
        this.currentBoard = 'global';
        this.posts = {};
        this.onlineUsers = 1;
        this.currentTheme = 'purple';
        this.currentLanguage = 'es';
        this.userId = this.generateUserId();
        this.translations = this.getTranslations();
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // Configurar partículas
        this.setupParticles();
        
        // Mostrar pantalla de bienvenida
        this.showWelcomeScreen();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar preferencias
        this.loadUserPreferences();
        
        // Conectar a Supabase
        await this.connectToSupabase();
        
        // Cargar datos iniciales
        await this.loadInitialData();
        
        // Iniciar actualizaciones en tiempo real
        this.startRealTimeUpdates();
        
        console.log('✅ Void Chan iniciado correctamente');
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    setupParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#8a2be2" },
                    shape: { type: "circle" },
                    opacity: { value: 0.3, random: true },
                    size: { value: 2, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#8a2be2",
                        opacity: 0.2,
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
    }

    showWelcomeScreen() {
        // Ocultar loading después de 2 segundos
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('welcome-screen').style.display = 'flex';
            this.updateWelcomeStats();
        }, 2000);
    }

    hideWelcomeScreen() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }

    setupEventListeners() {
        // Botón entrar
        document.getElementById('enter-btn').addEventListener('click', () => {
            this.hideWelcomeScreen();
        });

        // Formulario de posts
        document.getElementById('post-form').addEventListener('submit', (e) => {
            this.handlePostSubmit(e);
        });

        // Contador de caracteres
        document.getElementById('post-message').addEventListener('input', (e) => {
            this.updateCharCounter(e.target.value.length);
        });

        // Limpiar formulario
        document.getElementById('clear-form').addEventListener('click', () => {
            this.clearForm();
        });

        // Navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const board = e.target.getAttribute('data-board');
                this.handleBoardChange(board);
            });
        });

        // Quick boards
        document.querySelectorAll('.quick-board').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const board = e.target.getAttribute('data-board');
                this.handleBoardChange(board);
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
        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        // Selector de idioma
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // NSFW
        document.getElementById('nsfw-confirm').addEventListener('click', () => this.confirmNSFW());
        document.getElementById('nsfw-cancel').addEventListener('click', () => this.hideNSFWWarning());

        // Cerrar juego
        document.getElementById('close-game').addEventListener('click', () => this.closeGame());
    }

    async connectToSupabase() {
        try {
            // Verificar conexión
            const { data, error } = await window.supabase.from('posts').select('count');
            if (error) throw error;
            console.log('✅ Conectado a Supabase');
        } catch (error) {
            console.error('❌ Error conectando a Supabase:', error);
        }
    }

    async loadInitialData() {
        await this.loadPosts();
        await this.updateOnlineUsers();
        this.renderPosts();
        this.updateAllStats();
    }

    async loadPosts() {
        try {
            const { data, error } = await window.supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;

            // Organizar posts por board
            this.posts = {};
            data.forEach(post => {
                if (!this.posts[post.board]) {
                    this.posts[post.board] = [];
                }
                this.posts[post.board].push(post);
            });

            // Si no hay posts, crear algunos de ejemplo
            if (data.length === 0) {
                await this.createSamplePosts();
            }

        } catch (error) {
            console.error('Error cargando posts:', error);
            await this.createSamplePosts();
        }
    }

    async createSamplePosts() {
        const samplePosts = [
            {
                name: 'Sistema',
                subject: '¡Bienvenido a Void Chan!',
                message: 'Este es el foro global. Puedes publicar mensajes y conversar con otros usuarios en tiempo real.',
                board: 'global',
                created_at: new Date().toISOString()
            },
            {
                name: 'Anónimo',
                subject: 'Primer post',
                message: '¡Hola a todos! El foro se ve increíble 🎉',
                board: 'global', 
                created_at: new Date().toISOString()
            }
        ];

        for (const post of samplePosts) {
            await this.createPostInSupabase(post);
        }

        await this.loadPosts(); // Recargar posts
    }

    async createPostInSupabase(postData) {
        try {
            const { data, error } = await window.supabase
                .from('posts')
                .insert([postData])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creando post:', error);
            throw error;
        }
    }

    async handlePostSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('post-name').value || 'Anónimo';
        const subject = document.getElementById('post-subject').value || '';
        const message = document.getElementById('post-message').value;

        if (!message.trim()) {
            this.showMessage('❌ El mensaje no puede estar vacío', 'error');
            return;
        }

        try {
            const postData = {
                name: name,
                subject: subject,
                message: message,
                board: this.currentBoard,
                created_at: new Date().toISOString(),
                user_id: this.userId
            };

            await this.createPostInSupabase(postData);
            
            // El post se agregará automáticamente via realtime
            this.clearForm();
            this.showMessage('✅ Post publicado correctamente', 'success');

        } catch (error) {
            console.error('Error publicando post:', error);
            this.showMessage('❌ Error al publicar el post', 'error');
        }
    }

    startRealTimeUpdates() {
        // Suscribirse a nuevos posts
        window.supabase
            .channel('posts')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'posts' },
                (payload) => {
                    this.handleNewPost(payload.new);
                }
            )
            .subscribe();

        // Actualizar usuarios en línea cada 30 segundos
        setInterval(() => {
            this.updateOnlineUsers();
        }, 30000);
    }

    handleNewPost(post) {
        if (!this.posts[post.board]) {
            this.posts[post.board] = [];
        }
        
        // Evitar duplicados
        const exists = this.posts[post.board].some(p => p.id === post.id);
        if (!exists) {
            this.posts[post.board].unshift(post);
            
            // Si es el board actual, renderizar
            if (post.board === this.currentBoard) {
                this.renderPosts();
                this.updateAllStats();
            }
        }
    }

    handleBoardChange(board) {
        if (board.startsWith('nsfw') || board === 'hentai' || board === 'ecchi' || 
            board === 'yuri' || board === 'yaoi') {
            this.showNSFWWarning(board);
        } else {
            this.changeBoard(board);
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
        
        this.showMessage(this.t('board_changed').replace('{board}', board), 'info');
    }

    updateBoardInfo() {
        const boardInfo = this.getBoardInfo(this.currentBoard);
        document.getElementById('board-title').textContent = boardInfo.title;
        document.getElementById('board-description').textContent = boardInfo.description;
    }

    getBoardInfo(board) {
        const boards = {
            'global': { title: '/global/ - Canal Global', description: this.t('global_description') },
            'random': { title: '/b/ - Random', description: this.t('random_description') },
            'void': { title: '/void/ - Void', description: this.t('void_description') },
            'art': { title: '/art/ - Arte', description: this.t('art_description') },
            'programming': { title: '/prog/ - Programación', description: this.t('programming_description') },
            'anime': { title: '/a/ - Anime', description: this.t('anime_description') },
            // ... agregar más boards
        };
        
        return boards[board] || { 
            title: `/${board}/ - ${board.charAt(0).toUpperCase() + board.slice(1)}`, 
            description: this.t('default_board_description') 
        };
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        const boardPosts = this.posts[this.currentBoard] || [];

        if (boardPosts.length === 0) {
            container.innerHTML = `
                <div class="post">
                    <div class="post-content">
                        <p>${this.t('no_posts')}</p>
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
                    <span class="post-date">${this.formatDate(post.created_at)}</span>
                </div>
                ${post.subject ? `<div class="post-subject">${this.escapeHTML(post.subject)}</div>` : ''}
                <div class="post-content">
                    ${this.formatMessage(post.message)}
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return this.t('just_now');
        if (diff < 3600000) return this.t('minutes_ago').replace('{minutes}', Math.floor(diff / 60000));
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString(this.currentLanguage, { hour: '2-digit', minute: '2-digit' });
        }
        
        return date.toLocaleDateString(this.currentLanguage);
    }

    async updateOnlineUsers() {
        try {
            // Simular usuarios en línea (en producción usarías una tabla de sesiones)
            this.onlineUsers = Math.max(1, Math.floor(Math.random() * 50) + 1);
            this.updateAllStats();
        } catch (error) {
            console.error('Error actualizando usuarios:', error);
        }
    }

    updateAllStats() {
        // Actualizar todas las estadísticas
        const totalPosts = Object.values(this.posts).flat().length;
        
        document.getElementById('online-count').textContent = this.onlineUsers;
        document.getElementById('board-online').textContent = this.onlineUsers;
        document.getElementById('board-posts').textContent = this.posts[this.currentBoard]?.length || 0;
        document.getElementById('footer-online').textContent = this.onlineUsers;
        document.getElementById('footer-posts').textContent = totalPosts;
        
        // Welcome screen
        document.getElementById('welcome-online').textContent = this.onlineUsers;
        document.getElementById('welcome-posts').textContent = totalPosts;
    }

    updateWelcomeStats() {
        this.updateAllStats();
    }

    clearForm() {
        document.getElementById('post-form').reset();
        this.updateCharCounter(0);
    }

    updateCharCounter(count) {
        document.getElementById('char-count').textContent = count;
    }

    showNSFWWarning(board) {
        const modal = document.getElementById('nsfw-warning');
        modal.style.display = 'flex';
        modal.setAttribute('data-board', board);
    }

    hideNSFWWarning() {
        document.getElementById('nsfw-warning').style.display = 'none';
    }

    confirmNSFW() {
        const modal = document.getElementById('nsfw-warning');
        const board = modal.getAttribute('data-board');
        this.hideNSFWWarning();
        this.changeBoard(board);
    }

    changeTheme(theme) {
        document.body.className = `theme-${theme}`;
        this.currentTheme = theme;
        localStorage.setItem('voidchan_theme', theme);
        this.showMessage(this.t('theme_changed').replace('{theme}', theme), 'info');
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('voidchan_language', lang);
        
        // Actualizar selects
        document.getElementById('language-select').value = lang;
        
        // Retraducir interfaz
        this.translateInterface();
        this.showMessage(this.t('language_changed').replace('{language}', this.getLanguageName(lang)), 'info');
    }

    translateInterface() {
        // Traducir elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.t(key)) {
                element.textContent = this.t(key);
            }
        });
        
        // Actualizar placeholders
        const nameInput = document.getElementById('post-name');
        const subjectInput = document.getElementById('post-sub
