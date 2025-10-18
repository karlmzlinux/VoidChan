// js/online-users.js - Sistema de usuarios en tiempo real REAL
class OnlineUsersManager {
    constructor() {
        this.users = new Map();
        this.currentUser = this.generateUserID();
        this.sessionId = this.generateSessionID();
        this.isOnline = false;
        this.updateInterval = null;
        this.cleanupInterval = null;
        this.init();
    }

    async init() {
        console.log('👥 Iniciando sistema de usuarios en línea...');
        
        // Crear tabla de sesiones si no existe
        await this.createSessionsTable();
        
        // Registrar usuario actual
        await this.registerUser();
        
        // Iniciar actualizaciones
        this.startPeriodicUpdates();
        this.startCleanupProcess();
        
        // Suscribirse a cambios en tiempo real
        this.subscribeToRealTime();
        
        console.log('✅ Sistema de usuarios en línea iniciado');
    }

    generateUserID() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    generateSessionID() {
        return 'session_' + Math.random().toString(36).substr(2, 12);
    }

    async createSessionsTable() {
        try {
            // Verificar si la tabla existe
            const { error } = await window.supabase
                .from('user_sessions')
                .select('*')
                .limit(1);
                
            if (error && error.message.includes('does not exist')) {
                console.log('📦 La tabla user_sessions se creará automáticamente');
            }
        } catch (error) {
            console.log('Tabla de sesiones lista');
        }
    }

    async registerUser() {
        try {
            const userData = {
                session_id: this.sessionId,
                user_id: this.currentUser,
                user_agent: navigator.userAgent,
                last_activity: new Date().toISOString(),
                current_board: 'global',
                ip_country: 'unknown',
                is_active: true,
                created_at: new Date().toISOString()
            };

            const { data, error } = await window.supabase
                .from('user_sessions')
                .upsert([userData], { 
                    onConflict: 'session_id',
                    ignoreDuplicates: false 
                })
                .select();

            if (error) throw error;
            
            this.isOnline = true;
            console.log('✅ Usuario registrado en línea');
            
        } catch (error) {
            console.error('❌ Error registrando usuario:', error);
        }
    }

    async updateUserActivity(board = null) {
        if (!this.isOnline) return;

        try {
            const updateData = {
                session_id: this.sessionId,
                last_activity: new Date().toISOString(),
                is_active: true
            };

            if (board) {
                updateData.current_board = board;
            }

            const { error } = await window.supabase
                .from('user_sessions')
                .upsert([updateData])
                .select();

            if (error) throw error;

        } catch (error) {
            console.error('Error actualizando actividad:', error);
        }
    }

    async getOnlineUsers() {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            
            const { data, error, count } = await window.supabase
                .from('user_sessions')
                .select('*', { count: 'exact' })
                .gte('last_activity', fiveMinutesAgo)
                .eq('is_active', true);

            if (error) throw error;

            return {
                users: data || [],
                count: count || 0
            };

        } catch (error) {
            console.error('Error obteniendo usuarios en línea:', error);
            return { users: [], count: 1 }; // Fallback
        }
    }

    async getUsersByBoard(board) {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            
            const { data, error, count } = await window.supabase
                .from('user_sessions')
                .select('*', { count: 'exact' })
                .gte('last_activity', fiveMinutesAgo)
                .eq('is_active', true)
                .eq('current_board', board);

            if (error) throw error;

            return count || 0;

        } catch (error) {
            console.error('Error obteniendo usuarios por board:', error);
            return 1;
        }
    }

    startPeriodicUpdates() {
        // Actualizar actividad cada 30 segundos
        this.updateInterval = setInterval(() => {
            this.updateUserActivity();
        }, 30000);

        // Actualizar contador cada 10 segundos
        setInterval(async () => {
            await this.updateOnlineCount();
        }, 10000);
    }

    startCleanupProcess() {
        // Limpiar sesiones inactivas cada minuto
        this.cleanupInterval = setInterval(async () => {
            await this.cleanupInactiveSessions();
        }, 60000);
    }

    async cleanupInactiveSessions() {
        try {
            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
            
            const { error } = await window.supabase
                .from('user_sessions')
                .update({ is_active: false })
                .lt('last_activity', fifteenMinutesAgo)
                .eq('is_active', true);

            if (error) throw error;

        } catch (error) {
            console.error('Error limpiando sesiones:', error);
        }
    }

    subscribeToRealTime() {
        // Suscribirse a cambios en tiempo real
        window.supabase
            .channel('online-users')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_sessions'
                },
                (payload) => {
                    this.handleUserUpdate(payload);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('🔔 Suscrito a cambios de usuarios en tiempo real');
                }
            });
    }

    handleUserUpdate(payload) {
        // Cuando hay cambios en las sesiones, actualizar el contador
        setTimeout(async () => {
            await this.updateOnlineCount();
        }, 1000);
    }

    async updateOnlineCount() {
        try {
            const onlineData = await this.getOnlineUsers();
            const count = onlineData.count;
            
            this.updateDisplay(count);
            this.updateBoardSpecificCounts();

        } catch (error) {
            console.error('Error actualizando contador:', error);
            this.updateDisplay(1); // Fallback
        }
    }

    updateDisplay(count) {
        // Actualizar todos los elementos que muestran el contador
        const elements = [
            'online-count',
            'board-online', 
            'footer-online',
            'welcome-online'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Efecto visual cuando cambia
                const oldCount = parseInt(element.textContent) || 0;
                if (oldCount !== count) {
                    element.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 300);
                }
                
                element.textContent = count;
            }
        });

        // Actualizar título de la página
        this.updatePageTitle(count);
    }

    async updateBoardSpecificCounts() {
        // Actualizar contadores específicos por board
        const boards = ['global', 'random', 'art', 'programming', 'anime', 'games'];
        
        for (const board of boards) {
            const count = await this.getUsersByBoard(board);
            // Aquí puedes actualizar contadores específicos por board si los tienes
        }
    }

    updatePageTitle(count) {
        const baseTitle = 'void chan - donde el vacío habla';
        document.title = count > 1 ? `[${count} online] ${baseTitle}` : baseTitle;
    }

    async userChangedBoard(board) {
        await this.updateUserActivity(board);
        await this.updateOnlineCount();
    }

    async unregisterUser() {
        try {
            const { error } = await window.supabase
                .from('user_sessions')
                .update({ 
                    is_active: false,
                    last_activity: new Date().toISOString()
                })
                .eq('session_id', this.sessionId);

            if (error) throw error;
            
            this.isOnline = false;
            console.log('👋 Usuario desconectado');

        } catch (error) {
            console.error('Error desconectando usuario:', error);
        }
    }

    setupUnloadHandler() {
        // Manejar cierre de página
        window.addEventListener('beforeunload', () => {
            this.unregisterUser();
        });

        // Manejar pérdida de conexión
        window.addEventListener('online', () => {
            if (!this.isOnline) {
                this.registerUser();
            }
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Métodos para estadísticas avanzadas
    async getActiveUsersLastHour() {
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            
            const { data, error, count } = await window.supabase
                .from('user_sessions')
                .select('*', { count: 'exact' })
                .gte('last_activity', oneHourAgo);

            if (error) throw error;
            return count || 0;

        } catch (error) {
            console.error('Error obteniendo usuarios de la última hora:', error);
            return 0;
        }
    }

    async getPopularBoards() {
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            
            const { data, error } = await window.supabase
                .from('user_sessions')
                .select('current_board')
                .gte('last_activity', oneHourAgo)
                .eq('is_active', true);

            if (error) throw error;

            // Contar boards populares
            const boardCounts = {};
            data.forEach(session => {
                const board = session.current_board || 'global';
                boardCounts[board] = (boardCounts[board] || 0) + 1;
            });

            return Object.entries(boardCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5);

        } catch (error) {
            console.error('Error obtenendo boards populares:', error);
            return [];
        }
    }

    // Método para debug
    async debugUsers() {
        const onlineData = await this.getOnlineUsers();
        console.log('👥 Usuarios en línea:', onlineData);
        
        const popularBoards = await this.getPopularBoards();
        console.log('🏆 Boards populares:', popularBoards);
    }

    // Método para simular usuarios (solo desarrollo)
    simulateUsersForDevelopment() {
        if (process.env.NODE_ENV === 'development') {
            setInterval(async () => {
                // Solo simular si hay pocos usuarios
                const onlineData = await this.getOnlineUsers();
                if (onlineData.count < 3) {
                    const simulatedUser = {
                        session_id: 'sim_' + Math.random().toString(36).substr(2, 8),
                        user_id: 'sim_user_' + Math.random().toString(36).substr(2, 6),
                        user_agent: 'Simulated User',
                        last_activity: new Date().toISOString(),
                        current_board: ['global', 'random', 'anime'][Math.floor(Math.random() * 3)],
                        is_active: true,
                        created_at: new Date().toISOString()
                    };

                    try {
                        await window.supabase
                            .from('user_sessions')
                            .upsert([simulatedUser]);
                    } catch (error) {
                        // Ignorar errores en simulación
                    }
                }
            }, 30000); // Cada 30 segundos
        }
    }

    // Destructor
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.unregisterUser();
    }
}

// Inicializar automáticamente
let onlineUsersManager;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        onlineUsersManager = new OnlineUsersManager();
        window.onlineUsersManager = onlineUsersManager;
        
        // Configurar manejador de cierre
        onlineUsersManager.setupUnloadHandler();
        
    } catch (error) {
        console.error('Error iniciando sistema de usuarios:', error);
    }
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnlineUsersManager;
}
