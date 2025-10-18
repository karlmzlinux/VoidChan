class UIManager {
    constructor(postsManager) {
        this.postsManager = postsManager;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navegación entre tableros
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const board = e.target.dataset.board;
                this.changeBoard(board);
            });
        });

        // Formulario de posts
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePostSubmit(e);
        });

        // Validación de imagen
        document.getElementById('image').addEventListener('change', (e) => {
            this.validateImage(e.target);
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    // Cambiar de tablero
    async changeBoard(board) {
        // Actualizar navegación activa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-board="${board}"]`).classList.add('active');

        // Cambiar en el manager
        await this.postsManager.changeBoard(board);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Manejar envío de post
    async handlePostSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        const message = formData.get('message');

        if (!message.trim()) {
            this.showError('El mensaje no puede estar vacío');
            return;
        }

        // Deshabilitar formulario temporalmente
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publicando...';

        try {
            await this.postsManager.createPost(formData);
        } finally {
            // Rehabilitar formulario
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publicar';
        }
    }

    // Validar imagen
    validateImage(input) {
        const file = input.files[0];
        if (!file) return;

        // Tamaño máximo: 5MB
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('La imagen no puede ser mayor a 5MB');
            input.value = '';
            return;
        }

        // Tipo de archivo
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError('Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
            input.value = '';
            return;
        }
    }

    // Manejar navegación con teclado
    handleKeyboard(e) {
        // Ctrl + Enter para publicar
        if (e.ctrlKey && e.key === 'Enter') {
            document.getElementById('post-form').dispatchEvent(new Event('submit'));
        }

        // Escape para limpiar formulario
        if (e.key === 'Escape') {
            this.postsManager.clearForm();
        }
    }

    // Mostrar error
    showError(message) {
        this.postsManager.showError(message);
    }
}
