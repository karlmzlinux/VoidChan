// Configuración de Supabase
const SUPABASE_URL = 'https://hyoqobgkjmvnjwfpkmyv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b3FvYmdram12bmp3ZnBrbXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzQ5MzIsImV4cCI6MjA3NjMxMDkzMn0.iTCBoaZOWF5jAyYa3tas4XjtZLAtPpoBrJEod-xSWC4';

// Inicializar Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class SupabaseClient {
    constructor() {
        this.client = supabase;
    }

    // Obtener todos los posts de un tablero
    async getPosts(board = 'random') {
        try {
            const { data, error } = await this.client
                .from('posts')
                .select('*')
                .eq('board', board)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo posts:', error);
            return [];
        }
    }

    // Crear un nuevo post
    async createPost(postData) {
        try {
            const { data, error } = await this.client
                .from('posts')
                .insert([{
                    name: postData.name || 'Anónimo',
                    subject: postData.subject,
                    message: postData.message,
                    image_url: postData.image_url,
                    board: postData.board,
                    ip_hash: await this.hashIP(postData.ip)
                }])
                .select();

            if (error) throw error;
            return data ? data[0] : null;
        } catch (error) {
            console.error('Error creando post:', error);
            throw error;
        }
    }

    // Subir imagen a Supabase Storage
    async uploadImage(file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `posts/${fileName}`;

            const { data, error } = await this.client.storage
                .from('post-images')
                .upload(filePath, file);

            if (error) throw error;

            // Obtener URL pública
            const { data: { publicUrl } } = this.client.storage
                .from('post-images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            throw error;
        }
    }

    // Obtener estadísticas
    async getStats() {
        try {
            const { data, error } = await this.client
                .from('posts')
                .select('id', { count: 'exact' });

            if (error) throw error;
            return data ? data.length : 0;
        } catch (error) {
            console.error('Error obteniendo stats:', error);
            return 0;
        }
    }

    // Hash simple para IP (para moderación)
    async hashIP(ip) {
        const encoder = new TextEncoder();
        const data = encoder.encode(ip);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .substring(0, 16);
    }

    // Suscribirse a nuevos posts en tiempo real
    subscribeToPosts(callback, board = 'random') {
        return this.client
            .channel('posts-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'posts',
                    filter: `board=eq.${board}`
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .subscribe();
    }
}

// Instancia global
const supabaseClient = new SupabaseClient();
