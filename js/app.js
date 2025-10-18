// js/app.js - Versión con sistema de carga corregido
class VoidChan {
    constructor() {
        this.currentBoard = 'global';
        this.posts = {};
        this.onlineUsers = 1;
        this.currentTheme = 'purple';
        this.currentLanguage = 'es';
        this.userId = this.generateUserId();
        this.translations = this.getTranslations();
        this.loadingProgress = 0;
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // Iniciar sistema de progreso
        this.startProgressSystem();
        
        try {
            await this.executeLoadingSteps();
        } catch (error) {
            console.error('Error en carga:', error);
            this.completeLoading(); // Forzar completar carga
        }
    }

    startProgressSystem() {
        this.progressInterval = setInterval(() => {
            // Incremento automático para que no se quede pegado
            if (this.loadingProgress < 90) {
                this.loadingProgress += 1;
                this.updateProgress(this.loadingProgress, 'Cargando sistema...');
            }
        }, 100);
    }

    async executeLoadingSteps() {
        // Paso 1: Configuración básica (0-20%)
        this.updateProgress(10, 'Iniciando partículas...');
        this.setupParticles();

        this.updateProgress(20, 'Configurando interfaz...');
        this.setupEventListeners();
        this.loadUserPreferences();

        // Paso 2: Conexión a base de datos (20-60%)
        this.updateProgress(30, 'Conectando a la base de datos...');
        await this.connectToSupabase();

        this.updateProgress(50, 'Cargando posts...');
        await this.loadPosts();

        // Paso 3: Datos iniciales (60-90%)
        this.updateProgress(70, 'Actualizando estadísticas...');
        await this.updateOnlineUsers();
        
        this.updateProgress(80, 'Preparando interfaz...');
        this.renderPosts();
        this.updateAllStats();

        this.updateProgress(90, 'Iniciando tiempo real...');
        this.startRealTimeUpdates();

        // Completar carga (90-100%)
        this.updateProgress(100, '¡Listo!');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.completeLoading();
    }

    updateProgress(percent, message) {
        this.loadingProgress = percent;
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = percent + '%';
            // Cambiar color según progreso
            if (percent >= 90) {
                progressFill.style.background = 'linear-gradient(90deg, #00ff88, #00cc66)';
            } else if (percent >= 70) {
                progressFill.style.background = 'linear-gradient(90deg, #8a2be2, #9d4dff)';
            }
        }
        
        if (progressText) {
            progressText.textContent = percent + '%';
        }
        
        console.log(`📊 ${percent}% - ${message}`);
    }

    completeLoading() {
        // Detener el intervalo de progreso
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        // Asegurar 100%
        this.updateProgress(100, 'Completado');
        
        // Ocultar loading y mostrar bienvenida
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('welcome-screen').style.display = 'flex';
            this.updateWelcomeStats();
            
            console.log('✅ Carga completada');
        }, 800);
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
            console.warn('Partículas no disponibles:', e);
        }
    }

    async connectToSupabase() {
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    const { data, error } = await window.supabase.from('posts').select('count');
                    if (error) throw error;
                    console.log('✅ Conectado a Supabase');
                    resolve();
                } catch (error) {
                    console.error('❌ Error conectando a Supabase:', error);
                    resolve(); // Continuar aunque falle
                }
            }, 1000);
        });
    }

    async loadPosts() {
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    const { data, error } = await window.supabase
                        .from('posts')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(100);

                    if (error) throw error;

                    this.posts = {};
                    if (data) {
                        data.forEach(post => {
                            if (!this.posts[post.board]) {
                                this.posts[post.board] = [];
                            }
                            this.posts[post.board].push(post);
                        });
                    }

                    // Si no hay posts, crear algunos
                    if (!data || data.length === 0) {
                        await this.createSamplePosts();
                    }

                    resolve();
                } catch (error) {
                    console.error('Error cargando posts:', error);
                    await this.createSamplePosts();
                    resolve();
                }
            }, 1500);
        });
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
            try {
                await this.createPostInSupabase(post);
            } catch (error) {
                console.warn('No se pudo crear post de ejemplo:', error);
            }
        }
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

    // ... (el resto de los métodos se mantienen igual)

    showWelcomeScreen() {
        // Ya no es necesario, se maneja en completeLoading
    }

    hideWelcomeScreen() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        this.showMessage('🎉 ¡Bienvenido a Void Chan!', 'success');
    }

    setupEventListeners() {
        // Botón entrar
        document.getElementById('enter-btn').addEventListener('click', () => {
            this.hideWelcomeScreen();
        });

        // Formulario de posts - CORREGIDO
        document.getElementById('post-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handlePostSubmit(e);
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

    async handlePostSubmit(e) {
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
            
            this.clearForm();
            this.showMessage('✅ Post publicado correctamente', 'success');

        } catch (error) {
            console.error('Error publicando post:', error);
            this.showMessage('❌ Error al publicar el post', 'error');
        }
    }

    // ... (los demás métodos se mantienen igual)

    loadUserPreferences() {
        // Cargar tema
        const savedTheme = localStorage.getItem('voidchan_theme') || 'purple';
        this.changeTheme(savedTheme);
        document.getElementById('theme-select').value = savedTheme;

        // Cargar idioma
        const savedLang = localStorage.getItem('voidchan_language') || 'es';
        this.currentLanguage = savedLang;
        document.getElementById('language-select').value = savedLang;
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `flash-message flash-${type}`;
        message.textContent = text;
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-family: 'Share Tech Mono', monospace;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    getMessageColor(type) {
        const colors = {
            'success': '#00cc66',
            'error': '#ff4444',
            'info': '#8a2be2',
            'warning': '#ffaa00'
        };
        return colors[type] || colors.info;
    }

    // Sistema de traducción completo
    getTranslations() {
        return {
            'es': {
                'welcome': '¡Bienvenido!',
                'global_description': 'Conversaciones en tiempo real con la comunidad global',
                'random_description': 'Todo vale en el vacío',
                'void_description': 'El vacío absoluto',
                'art_description': 'Arte y creatividad visual',
                'programming_description': 'Código, desarrollo y tecnología',
                'anime_description': 'Anime, manga y cultura japonesa',
                'no_posts': 'No hay posts en este board. ¡Sé el primero en publicar!',
                'just_now': 'Ahora mismo',
                'minutes_ago': 'Hace {minutes} min',
                'theme_changed': 'Tema cambiado a {theme}',
                'language_changed': 'Idioma cambiado a {language}',
                'board_changed': 'Cambiado a /{board}/',
                'default_board_description': 'Board de discusión'
            },
            'en': {
                'welcome': 'Welcome!',
                'global_description': 'Real-time conversations with the global community',
                'random_description': 'Anything goes in the void',
                'void_description': 'The absolute void',
                'art_description': 'Art and visual creativity',
                'programming_description': 'Code, development and technology',
                'anime_description': 'Anime, manga and Japanese culture',
                'no_posts': 'No posts in this board. Be the first to post!',
                'just_now': 'Just now',
                'minutes_ago': '{minutes} min ago',
                'theme_changed': 'Theme changed to {theme}',
                'language_changed': 'Language changed to {language}',
                'board_changed': 'Changed to /{board}/',
                'default_board_description': 'Discussion board'
            },
            'jp': {
                'welcome': 'ようこそ！',
                'global_description': 'グローバルコミュニティとのリアルタイム会話',
                'random_description': '虚では何でもあり',
                'void_description': '絶対虚空',
                'art_description': 'アートとビジュアルクリエイティビティ',
                'programming_description': 'コード、開発、テクノロジー',
                'anime_description': 'アニメ、漫画、日本文化',
                'no_posts': 'このボードには投稿がありません。最初の投稿者になりましょう！',
                'just_now': 'たった今',
                'minutes_ago': '{minutes}分前',
                'theme_changed': 'テーマを{theme}に変更',
                'language_changed': '言語を{language}に変更',
                'board_changed': '/{board}/に変更',
                'default_board_description': '討論ボード'
            },
            'fr': {
                'welcome': 'Bienvenue !',
                'global_description': 'Conversations en temps réel avec la communauté mondiale',
                'random_description': 'Tout est permis dans le vide',
                'void_description': 'Le vide absolu',
                'art_description': 'Art et créativité visuelle',
                'programming_description': 'Code, développement et technologie',
                'anime_description': 'Anime, manga et culture japonaise',
                'no_posts': 'Aucun post dans ce board. Soyez le premier à poster !',
                'just_now': 'À l\'instant',
                'minutes_ago': 'Il y a {minutes} min',
                'theme_changed': 'Thème changé en {theme}',
                'language_changed': 'Langue changée en {language}',
                'board_changed': 'Changé vers /{board}/',
                'default_board_description': 'Board de discussion'
            }
        };
    }

    t(key) {
        const langTranslations = this.translations[this.currentLanguage];
        return langTranslations ? langTranslations[key] : this.translations['es'][key] || key;
    }

    getLanguageName(lang) {
        const names = {
            'es': 'Español',
            'en': 'English',
            'jp': '日本語',
            'fr': 'Français',
            'de': 'Deutsch',
            'ru': 'Русский',
            'zh': '中文',
            'ko': '한국어'
        };
        return names[lang] || lang;
    }

    loadGame(game) {
        const gameNames = {
            'snake': '🐍 Snake',
            'pong': '🎾 Pong',
            'memory': '🧠 Memory',
            'miner': '⛏️ Void Miner',
            'tetris': '🧱 Tetris',
            'flappy': '🐦 Flappy Void',
            'dino': '🦖 Dino Run',
            'space': '🚀 Space Invaders'
        };
        
        this.showMessage(`🎮 ${this.t('loading_game')} ${gameNames[game]}...`, 'info');
        
        // Simular carga de juego
        setTimeout(() => {
            this.showMessage('🎯 Los juegos estarán disponibles en la próxima actualización!', 'warning');
        }, 1500);
    }

    closeGame() {
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatMessage(text) {
        return this.escapeHTML(text).replace(/\n/g, '<br>');
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.voidChan = new VoidChan();
});

// CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .flash-message {
        animation: slideInRight 0.3s ease-out;
    }
`;
document.head.appendChild(style);
