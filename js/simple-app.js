// js/simple-app.js - VERSIÓN MÍNIMA FUNCIONAL
class SimpleVoidChan {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎯 Iniciando Void Chan Simple');
        
        // Remover loading inmediatamente
        this.removeLoading();
        
        // Configurar eventos básicos
        this.setupEventListeners();
        
        // Cargar posts de ejemplo
        this.loadExamplePosts();
    }

    removeLoading() {
        // Remover cualquier pantalla de loading
        const loaders = ['loading-screen', 'loading'];
        loaders.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
                element.remove();
            }
        });
        
        // Asegurar que el body sea visible
        document.body.style.overflow = 'auto';
        document.body.style.visibility = 'visible';
    }

    setupEventListeners() {
        // Formulario básico
        const form = document.getElementById('post-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePostSubmit(e);
            });
        }

        // Navegación básica
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeBoard(e.target.dataset.board);
            });
        });

        // Quick boards
        document.querySelectorAll('.quick-board').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeBoard(e.target.dataset.board);
            });
        });

        // Contador de caracteres
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const counter = document.getElementById('char-count');
                if (counter) counter.textContent = count;
            });
        }
    }

    handlePostSubmit(e) {
        const formData = new FormData(e.target);
        const message = formData.get('message');
        
        if (!message.trim()) {
            this.showMessage('El mensaje no puede estar vacío', 'error');
            return;
        }

        this.createPost({
            name: formData.get('name') || 'Anónimo',
            message: message,
            subject: formData.get('subject') || ''
        });

        e.target.reset();
        
        // Resetear contador
        const counter = document.getElementById('char-count');
        if (counter) counter.textContent = '0';
    }

    createPost(postData) {
        const post = {
            id: Date.now(),
            name: postData.name,
            subject: postData.subject,
            message: postData.message,
            date: new Date().toLocaleString()
        };

        this.addPostToDOM(post);
        this.showMessage('✅ Post publicado', 'success');
    }

    addPostToDOM(post) {
        const container = document.getElementById('posts-container');
        const postHTML = `
            <div class="post fade-in">
                <div class="post-header">
                    <span class="post-name">${post.name}</span>
                    <span class="post-id">#${post.id}</span>
                    <span class="post-date">${post.date}</span>
                </div>
                ${post.subject ? `<div class="post-subject">${post.subject}</div>` : ''}
                <div class="post-message">${post.message.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        
        // Agregar al inicio
        if (container.children.length > 0) {
            container.insertAdjacentHTML('afterbegin', postHTML);
        } else {
            container.innerHTML = postHTML;
        }
    }

    loadExamplePosts() {
        const examplePosts = [
            {
                name: 'Sistema',
                message: '¡Bienvenido a Void Chan! El foro está funcionando correctamente.\nPuedes empezar a publicar mensajes usando el formulario arriba.',
                subject: 'Bienvenida'
            },
            {
                name: 'Anónimo',
                message: 'Primer post de prueba. ¡Todo funciona! 🎉\nPrueba escribir algo y publicar.',
                subject: ''
            }
        ];

        examplePosts.forEach(post => this.createPost(post));
    }

    changeBoard(board) {
        this.showMessage(`Cambiando a /${board}/`, 'info');
        
        // Actualizar título del board
        const boardTitle = document.getElementById('board-title');
        if (boardTitle) {
            boardTitle.textContent = `/${board}/ - ${this.getBoardName(board)}`;
        }
        
        // Aquí cargarías posts del board específico
        this.loadBoardPosts(board);
    }

    getBoardName(board) {
        const boards = {
            'global': 'Global',
            'random': 'Random', 
            'void': 'Void',
            'art': 'Arte',
            'music': 'Música',
            'programming': 'Programación',
            'anime': 'Anime',
            'games': 'Juegos'
        };
        return boards[board] || board;
    }

    loadBoardPosts(board) {
        const container = document.getElementById('posts-container');
        container.innerHTML = `
            <div class="post">
                <div class="post-header">
                    <span class="post-name">Sistema</span>
                    <span class="post-id">#${Date.now()}</span>
                    <span class="post-date">Ahora</span>
                </div>
                <div class="post-message">
                    Bienvenido al board /${board}/. Posts específicos de este board aparecerán aquí.
                </div>
            </div>
        `;
    }

    showMessage(text, type = 'info') {
        const colors = {
            'success': '#00ff88',
            'error': '#ff4444', 
            'info': '#8a2be2'
        };
        
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || '#8a2be2'};
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }
}

// Inicializar inmediatamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    window.simpleVoidChan = new SimpleVoidChan();
    console.log('✅ Void Chan Simple inicializado');
});
