// js/app.js - Versión que funciona inmediatamente
class VoidChan {
    constructor() {
        this.currentBoard = 'global';
        this.posts = {};
        this.onlineUsers = 15;
        this.currentTheme = 'purple';
        this.currentLanguage = 'es';
        this.userId = this.generateUserId();
        this.translations = this.getTranslations();
        this.init();
  // En la clase VoidChan, agregar estos métodos:

setupScrollSystem() {
    // Botón para subir
    this.createScrollToTopButton();
    
    // Indicador de scroll
    this.createScrollIndicator();
    
    // Header compacto al hacer scroll
    this.setupCompactHeader();
    
    // Navegación sticky
    this.setupStickyNavigation();
    
    // Smooth scroll para anclas
    this.setupSmoothScroll();
}

createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.title = 'Subir al inicio';
    document.body.appendChild(scrollBtn);

    // Mostrar/ocultar botón
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    // Click para subir
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        
        indicator.style.transform = `scaleX(${scrollPercent})`;
    });
}

setupCompactHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('compact');
        } else {
            header.classList.remove('compact');
        }
        
        lastScroll = currentScroll;
    });
}

setupStickyNavigation() {
    const nav = document.querySelector('.main-nav');
    const quickBoards = document.querySelector('.quick-boards');
    
    // Asegurar que la navegación no tape el contenido
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    quickBoards.style.position = 'sticky';
                    quickBoards.style.top = '0';
                }
            });
        },
        { threshold: 0.1 }
    );
    
    // Observar el primer post
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        observer.observe(postsContainer);
    }
}

setupSmoothScroll() {
    // Smooth scroll para anclas internas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Método para cambiar de board con scroll suave
changeBoardWithScroll(board) {
    // Cambiar el board
    this.changeBoard(board);
    
    // Hacer scroll suave hacia los posts
    setTimeout(() => {
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            postsContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}

// Método para agregar botones de navegación rápida
addQuickNavigation() {
    const quickNav = document.createElement('div');
    quickNav.className = 'quick-navigation';
    quickNav.innerHTML = `
        <button class="nav-btn" data-action="scroll-to-posts">📝 Ver Posts</button>
        <button class="nav-btn" data-action="scroll-to-form">✍️ Nuevo Post</button>
        <button class="nav-btn" data-action="scroll-to-games">🎮 Juegos</button>
    `;
    
    document.querySelector('.container').insertBefore(quickNav, document.querySelector('.main'));
    
    // Event listeners para los botones
    quickNav.addEventListener('click', (e) => {
        if (e.target.matches('.nav-btn')) {
            const action = e.target.getAttribute('data-action');
            this.handleQuickNavigation(action);
        }
    });
}

handleQuickNavigation(action) {
    switch(action) {
        case 'scroll-to-posts':
            document.getElementById('posts-container').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'scroll-to-form':
            document.querySelector('.post-form-container').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'scroll-to-games':
            document.querySelector('.games-section').scrollIntoView({ behavior: 'smooth' });
            break;
    }
}

// Modificar el método changeBoard para usar scroll suave
changeBoard(board) {
    // Actualizar navegación
    document.querySelectorAll('.nav-link, .quick-board').forEach(el => {
        el.classList.remove('active');
    });
    
    document.querySelectorAll(`[data-board="${board}"]`).forEach(el => {
        el.classList.add('active');
    });

    this.currentBoard = board;
    this.updateBoardInfo();
    this.renderPosts();
    
    // Scroll suave hacia los posts
    setTimeout(() => {
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            const offset = 100; // Offset para no quedar justo debajo de la navegación
            const elementPosition = postsContainer.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 50);
    
    this.showMessage(`📁 Cambiado a /${board}/`, 'info');
}  

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // INICIAR CARGA INMEDIATA
        this.startInstantLoading();
        
        try {
            // Configuración básica RÁPIDA
            this.setupParticles();
            this.setupEventListeners();
            this.loadUserPreferences();
            
            // Intentar conectar a Supabase (pero no bloquear)
            this.connectToSupabase();
            
            // Cargar posts (modo offline si falla)
            await this.loadPosts();
            
            // Mostrar contenido INMEDIATAMENTE
            this.showMainApp();
            
            console.log('✅ Void Chan listo');
            
        } catch (error) {
            console.error('Error en init:', error);
            // AUN CON ERROR, MOSTRAR LA APLICACIÓN
            this.showMainApp();
        }
    }
        async init() {
    console.log('🚀 Iniciando Void Chan...');
    
    // INICIAR CARGA INMEDIATA
    this.startInstantLoading();
    
    try {
        // Configuración básica RÁPIDA
        this.setupParticles();
        this.setupEventListeners();
        this.loadUserPreferences();
        
        // SISTEMA DE SCROLL Y NAVEGACIÓN
        this.setupScrollSystem();
        this.addQuickNavigation();
        
        // Intentar conectar a Supabase (pero no bloquear)
        this.connectToSupabase();
        
        // Cargar posts (modo offline si falla)
        await this.loadPosts();
        
        // Mostrar contenido INMEDIATAMENTE
        this.showMainApp();
        
        console.log('✅ Void Chan listo');
        
    } catch (error) {
        console.error('Error en init:', error);
        // AUN CON ERROR, MOSTRAR LA APLICACIÓN
        this.showMainApp();
    }
}

    startInstantLoading() {
        // Simular progreso rápido
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            this.updateProgress(progress, this.getLoadingMessage(progress));
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                // NO esperar más - mostrar contenido inmediatamente
                setTimeout(() => {
                    document.getElementById('loading-screen').style.display = 'none';
                    document.getElementById('welcome-screen').style.display = 'flex';
                    this.updateWelcomeStats();
                }, 500);
            }
        }, 100);
    }

    getLoadingMessage(progress) {
        const messages = [
            "Iniciando sistema...",
            "Cargando interfaz...", 
            "Conectando...",
            "Preparando datos...",
            "¡Casi listo!",
            "Completado ✓"
        ];
        
        const index = Math.floor((progress / 100) * (messages.length - 1));
        return messages[index] || "Cargando...";
    }

    updateProgress(percent, message) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = percent + '%';
            progressFill.style.transition = 'width 0.3s ease';
        }
        
        if (progressText) {
            progressText.textContent = percent + '%';
        }
        
        console.log(`📊 ${percent}% - ${message}`);
    }

    showMainApp() {
        // Ocultar loading si todavía está visible
        document.getElementById('loading-screen').style.display = 'none';
        
        // Mostrar bienvenida o aplicación principal directamente
        document.getElementById('welcome-screen').style.display = 'flex';
        this.updateWelcomeStats();
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
            console.warn('Partículas no disponibles');
        }
    }

    async connectToSupabase() {
        // No bloquear - hacer en segundo plano
        setTimeout(async () => {
            try {
                const { data, error } = await window.supabase.from('posts').select('count');
                if (error) throw error;
                console.log('✅ Conectado a Supabase');
            } catch (error) {
                console.log('⚠️ Usando modo offline');
            }
        }, 100);
    }

    async loadPosts() {
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    const { data, error } = await window.supabase
                        .from('posts')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(50);

                    if (!error && data) {
                        this.posts = {};
                        data.forEach(post => {
                            if (!this.posts[post.board]) {
                                this.posts[post.board] = [];
                            }
                            this.posts[post.board].push(post);
                        });
                    }

                    // Si no hay datos, crear posts de ejemplo
                    if (!data || data.length === 0) {
                        this.createLocalPosts();
                    }

                } catch (error) {
                    console.log('⚠️ Cargando posts locales');
                    this.createLocalPosts();
                }
                
                resolve();
            }, 500);
        });
    }

    createLocalPosts() {
        this.posts = {
            'global': [
                {
                    id: 1,
                    name: 'Sistema',
                    subject: '¡Bienvenido a Void Chan!',
                    message: 'Foro anónimo con 150+ boards. Publica mensajes y únete a la conversación.',
                    board: 'global',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Anónimo',
                    subject: 'Primer post',
                    message: '¡Hola a todos! El foro se ve increíble 🎉\n¿En qué board están?',
                    board: 'global',
                    created_at: new Date().toISOString()
                }
            ],
            'random': [
                {
                    id: 3,
                    name: 'Anónimo',
                    subject: 'Random',
                    message: '¿Alguien más piensa que los gatos son los mejores animales? 🐱',
                    board: 'random',
                    created_at: new Date().toISOString()
                }
            ],
            'programming': [
                {
                    id: 4,
                    name: 'Dev',
                    subject: 'JavaScript',
                    message: '¿Qué framework están usando en 2025?',
                    board: 'programming',
                    created_at: new Date().toISOString()
                }
            ]
        };
    }

    setupEventListeners() {
        // Botón entrar
        document.getElementById('enter-btn').addEventListener('click', () => {
            this.hideWelcomeScreen();
        });

        // Formulario de posts - CORREGIDO
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePostSubmit(e);
        });

        // Contador de caracteres
        document.getElementById('post-message').addEventListener('input', (e) => {
            const count = e.target.value.length;
            document.getElementById('char-count').textContent = count;
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

    hideWelcomeScreen() {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        this.renderPosts();
        this.updateAllStats();
        this.showMessage('🎉 ¡Bienvenido a Void Chan!', 'success');
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

            // Intentar guardar en Supabase
            try {
                const { data, error } = await window.supabase
                    .from('posts')
                    .insert([postData])
                    .select();

                if (error) throw error;
                
                // Agregar localmente también
                if (!this.posts[this.currentBoard]) {
                    this.posts[this.currentBoard] = [];
                }
                this.posts[this.currentBoard].unshift(data[0]);
                
            } catch (supabaseError) {
                // Fallback: guardar localmente
                console.log('⚠️ Guardando post localmente');
                postData.id = Date.now();
                if (!this.posts[this.currentBoard]) {
                    this.posts[this.currentBoard] = [];
                }
                this.posts[this.currentBoard].unshift(postData);
            }

            this.clearForm();
            this.renderPosts();
            this.updateAllStats();
            this.showMessage('✅ Post publicado correctamente', 'success');

        } catch (error) {
            console.error('Error:', error);
            this.showMessage('✅ Post guardado localmente', 'success');
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

        this.currentBoard = board;
        this.updateBoardInfo();
        this.renderPosts();
        
        this.showMessage(`📁 Cambiado a /${board}/`, 'info');
    }

    updateBoardInfo() {
        const boardInfo = this.getBoardInfo(this.currentBoard);
        const titleElement = document.getElementById('board-title');
        const descElement = document.getElementById('board-description');
        
        if (titleElement) titleElement.textContent = boardInfo.title;
        if (descElement) descElement.textContent = boardInfo.description;
    }

    getBoardInfo(board) {
        const boards = {
            'global': { title: '/global/ - Canal Global', description: 'Conversaciones con toda la comunidad' },
            'random': { title: '/b/ - Random', description: 'Todo vale en el vacío' },
            'void': { title: '/void/ - Void', description: 'El vacío absoluto' },
            'art': { title: '/art/ - Arte', description: 'Arte y creatividad visual' },
            'programming': { title: '/prog/ - Programación', description: 'Código y desarrollo' },
            'anime': { title: '/a/ - Anime', description: 'Anime y cultura japonesa' },
            'nsfw': { title: '/nsfw/ - Adultos', description: 'Contenido para mayores de 18+' }
        };
        
        return boards[board] || { 
            title: `/${board}/`, 
            description: 'Board de discusión' 
        };
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

        if (diff < 60000) return 'Ahora mismo';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }
        
        return date.toLocaleDateString('es-ES');
    }

    updateWelcomeStats() {
        const totalPosts = Object.values(this.posts).flat().length;
        
        document.getElementById('welcome-online').textContent = this.onlineUsers;
        document.getElementById('welcome-posts').textContent = totalPosts;
        document.getElementById('welcome-boards').textContent = '150';
    }

    updateAllStats() {
        const totalPosts = Object.values(this.posts).flat().length;
        
        document.getElementById('online-count').textContent = this.onlineUsers;
        document.getElementById('board-online').textContent = this.onlineUsers;
        document.getElementById('board-posts').textContent = this.posts[this.currentBoard]?.length || 0;
        document.getElementById('footer-online').textContent = this.onlineUsers;
        document.getElementById('footer-posts').textContent = totalPosts;
    }

    clearForm() {
        document.getElementById('post-form').reset();
        document.getElementById('char-count').textContent = '0';
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
        this.showMessage(`🎨 Tema cambiado a ${theme}`, 'info');
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('voidchan_language', lang);
        document.getElementById('language-select').value = lang;
        this.showMessage(`🌐 Idioma cambiado`, 'info');
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
        
        this.showMessage(`🎮 Abriendo ${gameNames[game]}...`, 'info');
        
        // Simular carga de juego
        setTimeout(() => {
            const gameContainer = document.getElementById('game-container');
            const gameTitle = document.getElementById('game-title');
            const gameContent = document.getElementById('game-content');
            
            gameTitle.textContent = gameNames[game];
            gameContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3>${gameNames[game]}</h3>
                    <p>🎯 Este juego estará disponible en la próxima actualización</p>
                    <div style="margin: 2rem 0; font-size: 3rem;">
                        ${this.getGameIcon(game)}
                    </div>
                    <p>Mientras tanto, puedes seguir chateando en los boards</p>
                </div>
            `;
            
            gameContainer.style.display = 'block';
            document.getElementById('main-app').style.display = 'none';
        }, 1000);
    }

    getGameIcon(game) {
        const icons = {
            'snake': '🐍',
            'pong': '🎾', 
            'memory': '🧠',
            'miner': '⛏️',
            'tetris': '🧱',
            'flappy': '🐦',
            'dino': '🦖',
            'space': '🚀'
        };
        return icons[game] || '🎮';
    }

    closeGame() {
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }

    loadUserPreferences() {
        const savedTheme = localStorage.getItem('voidchan_theme') || 'purple';
        this.changeTheme(savedTheme);
        document.getElementById('theme-select').value = savedTheme;

        const savedLang = localStorage.getItem('voidchan_language') || 'es';
        this.currentLanguage = savedLang;
        document.getElementById('language-select').value = savedLang;
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.textContent = text;
        
        const colors = {
            'success': '#00cc66',
            'error': '#ff4444',
            'info': '#8a2be2',
            'warning': '#ffaa00'
        };
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-family: 'Share Tech Mono', monospace;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatMessage(text) {
        return this.escapeHTML(text).replace(/\n/g, '<br>');
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    getTranslations() {
        return {
            'es': {},
            'en': {},
            'jp': {},
            'fr': {}
        };
    }
}

// INICIALIZACIÓN GARANTIZADA
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.voidChan = new VoidChan();
    } catch (error) {
        console.error('Error crítico:', error);
        // FALLBACK MÁXIMO - MOSTRAR TODO INMEDIATAMENTE
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'flex';
        alert('Void Chan - Carga rápida activada');
    }
});

// SEGURIDAD EXTRA - SI PASAN 5 SEGUNDOS, MOSTRAR CONTENIDO
setTimeout(() => {
    if (document.getElementById('loading-screen').style.display !== 'none') {
        console.log('🛡️ Seguridad: Mostrando contenido forzadamente');
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'flex';
    }
}, 5000);
