export class SupabaseClient {
  constructor(config) {
    this.url = config.url;
    this.anonKey = config.anonKey;
    this.supabase = null;
    this.currentUser = null;
    this.init();
  }

  init() {
    if (window.supabase) {
      this.supabase = window.supabase.createClient(this.url, this.anonKey);
      this.setupAuth();
    } else {
      console.warn('Supabase no disponible globalmente');
    }
  }

  setupAuth() {
    this.supabase?.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
    });
    this.supabase?.auth.getSession().then(({ data: { session } }) => {
      this.currentUser = session?.user || null;
    });
  }

  async saveQuestion(question) {
    if (!this.currentUser) return;
    try {
      await this.supabase.from('user_questions').insert({
        user_id: this.currentUser.id,
        email: this.currentUser.email,
        question: question
      });
    } catch (err) {
      console.error('Error guardando pregunta:', err);
    }
  }

  async logout() {
    await this.supabase?.auth.signOut();
    window.location.href = 'login_register.html';
  }
}