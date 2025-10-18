// js/app.js - VERSIÓN CORREGIDA
class VoidChanApp {
    constructor() {
        this.postsManager = new PostsManager();
        this.uiManager = null;
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Void Chan...');
        
        // QUITAR LOADING INMEDIATAMENTE
        this.hideLoadingScreen();
        
        try {
            // Inicializar managers
            this.uiManager = new UIManager(this.postsManager);
            await this.postsManager.init();
            
            // Configuraciones adicionales
            this.setupPWA();
            this.setupAnalytics();
            
            console.log('✅ Void Chan iniciado correctamente');
        } catch (error) {
            console.error('❌ Error iniciando Void Chan:', error);
            this.showError('Error al cargar la aplicación');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loading = document.getElementById('loading');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.remove();
        }
        
        if (loading) {
            loading.style.display = 'none';
        }
        
        // Mostrar contenido principal inmediatamente
        document.body.style.overflow = 'auto';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        errorDiv.textContent = `Error: ${message}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    setupPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('Service Worker registrado'))
                .catch(err => console.log('SW registration failed'));
        }
    }

    setupAnalytics() {
        console.log('📊 Analytics configurado');
    }
}

// Inicializar la app INMEDIATAMENTE
document.addEventListener('DOMContentLoaded', () => {
    window.voidChanApp = new VoidChanApp();
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error no capturado:', e.error);
    document.getElementById('loading-screen').style.display = 'none';
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada no capturada:', e.reason);
    document.getElementById('loading-screen').style.display = 'none';
});
