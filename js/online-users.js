// js/online-users.js - Sistema de usuarios en línea
class OnlineUsersManager {
    constructor() {
        this.onlineUsers = new Map();
        this.currentUser = this.generateUserID();
        this.updateInterval = null;
        this.init();
    }

    init() {
        // Generar ID único para este usuario
        this.currentUser = this.generateUserID();
        
        // Agregar usuario actual a la lista
        this.addUser(this.currentUser);
        
        // Iniciar actualizaciones periódicas
        this.startUpdates();
        
        // Configurar evento antes de cerrar página
        this.setupUnloadHandler();
        
        console.log('👥 Sistema de usuarios en línea iniciado');
    }

    generateUserID() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    addUser(userId) {
        this.onlineUsers.set(userId, {
            id: userId,
            lastSeen: Date.now(),
            board: 'global'
        });
        
        this.saveToStorage();
        this.updateDisplay();
    }

    removeUser(userId) {
        this.onlineUsers.delete(userId);
        this.saveToStorage();
        this.updateDisplay();
    }

    updateUserBoard(userId, board) {
        const user = this.onlineUsers.get(userId);
        if (user) {
            user.board = board;
            user.lastSeen = Date.now();
            this.onlineUsers.set(userId, user);
        }
    }

    startUpdates() {
        // Actualizar cada 30 segundos
        this.updateInterval = setInterval(() => {
            this.cleanInactiveUsers();
            this.updateDisplay();
        }, 30000);

        // Actualizar board cada 10 segundos
        setInterval(() => {
            this.updateCurrentUserBoard();
        }, 10000);
    }

    updateCurrentUserBoard() {
        const currentBoard = window.voidChanApp?.currentBoard || 'global';
        this.updateUserBoard(this.currentUser, currentBoard);
    }

    cleanInactiveUsers() {
        const now = Date.now();
        const inactiveTime = 2 * 60 * 1000; // 2 minutos
        
        for (let [userId, user] of this.onlineUsers) {
            if (now - user.lastSeen > inactiveTime) {
                this.onlineUsers.delete(userId);
            }
        }
        
        this.saveToStorage();
    }

    saveToStorage() {
        const usersData = Array.from(this.onlineUsers.entries());
        localStorage.setItem('voidchan_online_users', JSON.stringify(usersData));
        localStorage.setItem('voidchan_online_timestamp', Date.now().toString());
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('voidchan_online_users');
            const timestamp = localStorage.getItem('voidchan_online_timestamp');
            
            if (stored && timestamp) {
                const usersData = JSON.parse(stored);
                const storedTime = parseInt(timestamp);
                const now = Date.now();
                
                // Solo cargar si los datos tienen menos de 5 minutos
                if (now - storedTime < 5 * 60 * 1000) {
                    this.onlineUsers = new Map(usersData);
                    this.cleanInactiveUsers(); // Limpiar inactivos al cargar
                }
            }
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    }

    updateDisplay() {
        const onlineCount = this.getOnlineCount();
        const onlineNumber = document.getElementById('online-number');
        
        if (onlineNumber) {
            onlineNumber.textContent = onlineCount;
            
            // Animación cuando cambia el número
            onlineNumber.style.transform = 'scale(1.2)';
            setTimeout(() => {
                onlineNumber.style.transform = 'scale(1)';
            }, 300);
        }

        // Actualizar título con conteo
        this.updateTitle(onlineCount);
    }

    getOnlineCount() {
        return this.onlineUsers.size;
    }

    getUsersByBoard(board) {
        return Array.from(this.onlineUsers.values()).filter(user => user.board === board);
    }

    updateTitle(onlineCount) {
        const baseTitle = 'void chan - donde el vacío habla';
        document.title = `[${onlineCount} online] ${baseTitle}`;
    }

    setupUnloadHandler() {
        window.addEventListener('beforeunload', () => {
            this.removeUser(this.currentUser);
        });
    }

    // Simular otros usuarios (para demo)
    simulateOtherUsers() {
        setInterval(() => {
            // Solo en modo demo
            if (this.getOnlineCount() < 3) {
                const demoUser = 'demo_' + Math.random().toString(36).substr(2, 6);
                this.addUser(demoUser);
                
                // Remover usuario demo después de un tiempo
                setTimeout(() => {
                    this.removeUser(demoUser);
                }, 60000 + Math.random() * 120000);
            }
        }, 30000);
    }

    // Para desarrollo - ver usuarios actuales
    debugUsers() {
        console.log('👥 Usuarios en línea:', Array.from(this.onlineUsers.values()));
    }
}
