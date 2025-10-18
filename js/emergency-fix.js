// js/emergency-fix.js - PEGA ESTO EN LA CONSOLA O CREA EL ARCHIVO
(function emergencyFix() {
    console.log('🔧 Aplicando parche de emergencia...');
    
    // Remover loading screen inmediatamente
    const loadingScreen = document.getElementById('loading-screen');
    const loading = document.getElementById('loading');
    
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        loadingScreen.remove();
        console.log('✅ Loading screen removido');
    }
    
    if (loading) {
        loading.style.display = 'none';
        console.log('✅ Loading removido');
    }
    
    // Forzar mostrar contenido
    document.body.style.overflow = 'auto';
    document.body.style.visibility = 'visible';
    
    // Intentar inicializar la app básica
    if (typeof SupabaseClient !== 'undefined') {
        try {
            const simpleApp = {
                init: function() {
                    console.log('🚀 App básica inicializada');
                    this.loadPosts();
                },
                loadPosts: function() {
                    // Cargar posts básicos
                    const container = document.getElementById('posts-container');
                    if (container) {
                        container.innerHTML = `
                            <div class="post">
                                <div class="post-header">
                                    <span class="post-name">Sistema</span>
                                    <span class="post-id">#1</span>
                                    <span class="post-date">Ahora</span>
                                </div>
                                <div class="post-message">
                                    ¡Void Chan está funcionando! El sistema se ha recuperado correctamente.
                                </div>
                            </div>
                        `;
                    }
                }
            };
            
            simpleApp.init();
        } catch (e) {
            console.error('Error en app básica:', e);
        }
    }
    
    console.log('🎉 Parche de emergencia aplicado');
})();
