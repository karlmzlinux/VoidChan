class PostsManager {
    constructor() {
        this.currentBoard = 'random';
        this.posts = [];
        this.isLoading = false;
    }

    // Inicializar el manager
    init() {
        this.loadPosts();
        this.setupRealTimeUpdates();
        this.updateStats();
    }

    // Cambiar de tablero
    async changeBoard(board) {
        this.currentBoard = board;
        this.posts = [];
        this.showLoading();
        await this.loadPosts();
        this.updateBoardInfo();
    }

    // Cargar posts
    async loadPosts() {
        this.isLoading = true;
        this.showLoading();

        try {
            this.posts = await supabaseClient.getPosts(this.currentBoard);
            this.renderPosts();
        } catch (error) {
            this.showError('Error cargando posts');
        } finally {
            this.hideLoading();
            this.isLoading = false;
        }
    }

    // Crear nuevo post
    async createPost(formData) {
        const postData = {
            name: formData.get('name'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            board: this.currentBoard,
            ip: await this.getClientIP()
        };

        // Manejar imagen
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            try {
                postData.image_url = await supabaseClient.uploadImage(imageFile);
            } catch (error) {
                this.showError('Error subiendo imagen');
                return;
            }
        }

        try {
            await supabaseClient.createPost(postData);
            // El nuevo post llegará por la suscripción en tiempo real
            this.clearForm();
            this.showSuccess('Post publicado');
        } catch (error) {
            this.showError('Error publicando post');
        }
    }

    // Renderizar posts
    renderPosts() {
        const container = document.getElementById('posts-container');
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="post">
                    <div class="post-message" style="text-align: center; color: var(--void-text-secondary);">
                        No hay posts en este tablero. Sé el primero en publicar.
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.posts.map(post => this.createPostHTML(post)).join('');
    }

    // Crear HTML de un post
    createPostHTML(post) {
        return `
            <div class="post" data-id="${post.id}">
                <div class="post-header">
                    <div class="post-info">
                        <span class="post-name">${this.escapeHTML(post.name)}</span>
                        <span class="post-id">#${post.id}</span>
                        <span class="post-date">${this.formatDate(post.created_at)}</span>
                    </div>
                </div>
                ${post.subject ? `<div class="post-subject">${this.escapeHTML(post.subject)}</div>` : ''}
                <div class="post-message">${this.formatMessage(post.message)}</div>
                ${post.image_url ? `<img src="${post.image_url}" alt="Imagen del post" class="post-image" loading="lazy">` : ''}
            </div>
        `;
    }

    // Formatear mensaje con soporte para citas
    formatMessage(text) {
        if (!text) return '';
        
        return this.escapeHTML(text)
            .replace(/\n/g, '<br>')
            .replace(/>>(\d+)/g, '<a href="#post-$1" class="quote">>>$1</a>')
            .replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank" rel="noopener">$&</a>');
    }

    // Escapar HTML
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        // Menos de 1 minuto
        if (diff < 60000) return 'Ahora';
        
        // Menos de 1 hora
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
        
        // Hoy
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Esta semana
        if (diff < 604800000) {
            return date.toLocaleDateString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        }
        
        // Más de una semana
        return date.toLocaleDateString('es-ES');
    }

    // Obtener IP del cliente (simplificado)
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // Configurar actualizaciones en tiempo real
    setupRealTimeUpdates() {
        supabaseClient.subscribeToPosts((newPost) => {
            if (newPost.board === this.currentBoard) {
                this.posts.unshift(newPost);
                this.renderPosts();
                this.updateStats();
            }
        }, this.currentBoard);
    }

    // Actualizar estadísticas
    async updateStats() {
        const totalPosts = await supabaseClient.getStats();
        document.getElementById('post-count').textContent = totalPosts;
    }

    // Mostrar/ocultar loading
    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // Limpiar formulario
    clearForm() {
        document.getElementById('post-form').reset();
    }

    // Mostrar mensajes
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            background: ${type === 'success' ? 'var(--void-success)' : 'var(--void-danger)'};
            color: white;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // Actualizar info del tablero
    updateBoardInfo() {
        const boards = {
            random: { title: '/b/ - Random', desc: 'Todo vale en el vacío' },
            anime: { title: '/a/ - Anime', desc: 'Cultura japonesa y animación' },
            video: { title: '/v/ - Video', desc: 'Juegos y contenido multimedia' },
            void: { title: '/void/ - Void', desc: 'El vacío absoluto' }
        };

        const board = boards[this.currentBoard];
        document.getElementById('board-title').textContent = board.title;
        document.getElementById('board-description').textContent = board.desc;
    }
}
