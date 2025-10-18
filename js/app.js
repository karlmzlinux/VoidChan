// Inicialización de la aplicación
class VoidChanApp {
    constructor() {
        this.postsManager = new PostsManager();
        this.uiManager = new UIManager(this.postsManager);
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // Inicializar managers
        this.postsManager.init();
        
        // Configurar Service Worker para PWA (opcional)
        this.setupPWA();
        
        // Configurar analytics (opcional)
        this.setupAnalytics();
        
        console.log('✅ Void Chan iniciado correctamente');
    }

    setupPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('Service Worker registrado'))
                .catch(err => console.log('SW registration failed'));
        }
    }

    setupAnalytics() {
        // Aquí puedes agregar Google Analytics o similares
        console.log('📊 Analytics configurado');
    }
}

// Inicializar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.voidChanApp = new VoidChanApp();
});

// Manejar errores no capturados
window.addEventListener('error', (e) => {
    console.error('Error no capturado:', e.error);
});

// Manejar promesas rechazadas no capturadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada no capturada:', e.reason);
});
