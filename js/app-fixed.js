async init() {
    console.log('🚀 Iniciando Void Chan...');
    
    // ⏰ INICIAR TEMPORIZADOR DE 3 SEGUNDOS
    const loadStartTime = Date.now();
    const MIN_LOAD_TIME = 3000; // 3 segundos mínimo
    
    try {
        // Iniciar sistemas esenciales inmediatamente
        this.setupParticles();
        this.setupEventListeners();
        await this.initializePosts();
        
        // ⏰ ESPERAR A QUE PASEN LOS 3 SEGUNDOS MÍNIMOS
        const elapsed = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsed);
        
        if (remainingTime > 0) {
            console.log(`⏰ Esperando ${remainingTime}ms para completar carga...`);
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Iniciar sistemas adicionales después del tiempo mínimo
        window.onlineUsersManager = new OnlineUsersManager();
        window.gameLoader = new GameLoader();
        
        // Cargar contenido final
        await this.loadBoardPosts(this.currentBoard);
        
        // Ocultar loading screen
        this.hideLoadingScreen();
        
        this.isInitialized = true;
        console.log('✅ Void Chan iniciado correctamente');
        
    } catch (error) {
        console.error('❌ Error iniciando Void Chan:', error);
        // ⏰ AUN CON ERROR, OCULTAR LOADING DESPUÉS DE 3 SEGUNDOS
        const elapsed = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsed);
        
        if (remainingTime > 0) {
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        this.hideLoadingScreen();
        this.showError('Error al iniciar la aplicación');
    }
}
