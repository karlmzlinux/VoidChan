// Sistema de Multi-idioma
class LanguageManager {
    constructor() {
        this.currentLang = 'es';
        this.translations = {
            es: {
                // Navegación
                'nav_main': 'Principal',
                'nav_creative': 'Creativo',
                'nav_tech': 'Tecnología',
                'nav_gaming': 'Gaming',
                'nav_anime': 'Anime',
                'nav_global': 'Global',
                'nav_random': 'Random',
                'nav_void': 'Void',
                
                // Board Descriptions
                'global_description': 'Conversaciones globales en tiempo real',
                'random_description': 'Todo vale en el vacío',
                'void_description': 'El vacío absoluto',
                
                // Formulario
                'new_post': 'Nuevo Post',
                'name_placeholder': '🕶️ Nombre (opcional)',
                'subject_placeholder': '📌 Asunto (opcional)',
                'message_placeholder': '💭 Escribe tu mensaje aquí...',
                'upload_image': '🖼️ Subir imagen',
                'publish': '🚀 Publicar',
                'clear': '🗑️',
                'format_help': '❓',
                'post_tips': 'Usa >>123 para citar',
                
                // Footer
                'footer_about': 'void chan',
                'footer_desc': 'Un foro anónimo en la profundidad del vacío digital',
                'footer_nav': 'Navegación',
                'footer_games': 'Juegos',
                'footer_legal': 'Legal',
                
                // Juegos
                'game_snake': 'Snake',
                'game_tetris': 'Tetris',
                'game_miner': 'Void Miner',
                
                // General
                'site_title': 'void chan',
                'site_subtitle': 'donde el vacío habla',
                'search_placeholder': 'Buscar en el vacío...',
                'loading_posts': 'Cargando el vacío...',
                'online_users': 'usuarios en línea',
                'total_posts': 'posts totales'
            },
            en: {
                'nav_main': 'Main',
                'nav_creative': 'Creative',
                'nav_tech': 'Technology',
                'nav_gaming': 'Gaming',
                'nav_anime': 'Anime',
                'nav_global': 'Global',
                'nav_random': 'Random',
                'nav_void': 'Void',
                
                'global_description': 'Real-time global conversations',
                'random_description': 'Anything goes in the void',
                'void_description': 'The absolute void',
                
                'new_post': 'New Post',
                'name_placeholder': '🕶️ Name (optional)',
                'subject_placeholder': '📌 Subject (optional)',
                'message_placeholder': '💭 Write your message here...',
                'upload_image': '🖼️ Upload image',
                'publish': '🚀 Publish',
                'clear': '🗑️',
                'format_help': '❓',
                'post_tips': 'Use >>123 to quote',
                
                'footer_about': 'void chan',
                'footer_desc': 'An anonymous forum in the depth of digital void',
                'footer_nav': 'Navigation',
                'footer_games': 'Games',
                'footer_legal': 'Legal',
                
                'game_snake': 'Snake',
                'game_tetris': 'Tetris',
                'game_miner': 'Void Miner',
                
                'site_title': 'void chan',
                'site_subtitle': 'where the void speaks',
                'search_placeholder': 'Search in the void...',
                'loading_posts': 'Loading the void...',
                'online_users': 'users online',
                'total_posts': 'total posts'
            },
            jp: {
                'nav_main': 'メイン',
                'nav_creative': 'クリエイティブ',
                'nav_tech': 'テクノロジー',
                'nav_gaming': 'ゲーム',
                'nav_anime': 'アニメ',
                'nav_global': 'グローバル',
                'nav_random': 'ランダム',
                'nav_void': '虚空',
                
                'global_description': 'リアルタイムグローバル会話',
                'random_description': '虚では何でもあり',
                'void_description': '絶対虚空',
                
                'new_post': '新規投稿',
                'name_placeholder': '🕶️ 名前（任意）',
                'subject_placeholder': '📌 件名（任意）',
                'message_placeholder': '💭 ここにメッセージを書いてください...',
                'upload_image': '🖼️ 画像をアップロード',
                'publish': '🚀 投稿',
                'clear': '🗑️',
                'format_help': '❓',
                'post_tips': '>>123で引用できます',
                
                'footer_about': 'void chan',
                'footer_desc': 'デジタル虚空の深みにある匿名フォーラム',
                'footer_nav': 'ナビゲーション',
                'footer_games': 'ゲーム',
                'footer_legal': '法的',
                
                'game_snake': 'スネーク',
                'game_tetris': 'テトリス',
                'game_miner': '虚空採掘',
                
                'site_title': 'void chan',
                'site_subtitle': '虚空が語るところ',
                'search_placeholder': '虚空で検索...',
                'loading_posts': '虚空を読み込み中...',
                'online_users': 'オンラインユーザー',
                'total_posts': '総投稿数'
            },
            fr: {
                'nav_main': 'Principal',
                'nav_creative': 'Créatif',
                'nav_tech': 'Technologie',
                'nav_gaming': 'Jeux',
                'nav_anime': 'Anime',
                'nav_global': 'Global',
                'nav_random': 'Aléatoire',
                'nav_void': 'Vide',
                
                'global_description': 'Conversations globales en temps réel',
                'random_description': 'Tout est permis dans le vide',
                'void_description': 'Le vide absolu',
                
                'new_post': 'Nouveau Post',
                'name_placeholder': '🕶️ Nom (optionnel)',
                'subject_placeholder': '📌 Sujet (optionnel)',
                'message_placeholder': '💭 Écrivez votre message ici...',
                'upload_image': '🖼️ Télécharger image',
                'publish': '🚀 Publier',
                'clear': '🗑️',
                'format_help': '❓',
                'post_tips': 'Utilisez >>123 pour citer',
                
                'footer_about': 'void chan',
                'footer_desc': 'Un forum anonyme dans la profondeur du vide numérique',
                'footer_nav': 'Navigation',
                'footer_games': 'Jeux',
                'footer_legal': 'Légal',
                
                'game_snake': 'Snake',
                'game_tetris': 'Tetris',
                'game_miner': 'Mineur du Vide',
                
                'site_title': 'void chan',
                'site_subtitle': 'où le vide parle',
                'search_placeholder': 'Rechercher dans le vide...',
                'loading_posts': 'Chargement du vide...',
                'online_users': 'utilisateurs en ligne',
                'total_posts': 'posts totaux'
            }
        };
        
        this.init();
    }

    init() {
        this.loadSavedLanguage();
        this.setupEventListeners();
        this.applyLanguage(this.currentLang);
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('voidchan_language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.applyLanguage(lang);
            this.updateActiveButton(lang);
            this.saveLanguage(lang);
        }
    }

    applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.translations[lang][key];
                } else {
                    element.textContent = this.translations[lang][key];
                }
            }
        });

        // Actualizar textos dinámicos
        this.updateDynamicTexts(lang);
    }

    updateDynamicTexts(lang) {
        const onlineCount = document.getElementById('online-count');
        const postCount = document.getElementById('post-count');
        
        if (onlineCount) {
            const count = onlineCount.textContent.match(/\d+/);
            if (count) {
                onlineCount.textContent = `🌐 ${count[0]} ${this.translations[lang]['online_users']}`;
            }
        }
        
        if (postCount) {
            const count = postCount.textContent.match(/\d+/);
            if (count) {
                postCount.textContent = `📝 ${count[0]} ${this.translations[lang]['total_posts']}`;
            }
        }
    }

    updateActiveButton(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
    }

    saveLanguage(lang) {
        localStorage.setItem('voidchan_language', lang);
    }

    getText(key) {
        return this.translations[this.currentLang][
