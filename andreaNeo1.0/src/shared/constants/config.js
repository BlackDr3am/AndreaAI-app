export const config = {
  supabase: {
    url: 'https://hhdcobkizdzpqbcdpnea.supabase.co',
    anonKey: 'sb_publishable_8QakOu7YlXMKq2nSRjBocw_ap3zVPmQ'
  },
  openRouter: {
    apiKey: atob('c2stb3ItdjEtYjYyMmEwYTFlYjg3MjcxMzg3ZmM3ZjJmMjQxYmQ2MGMyNGMxN2UxMGY1NGIyZWI2ZTI0YTY4NjZlZTUwMWY3ZA=='),
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    model: localStorage.getItem('andrea_selected_model') || 'openrouter/free',
    temperature: 0.7,
    maxTokens: 7000
  }
};