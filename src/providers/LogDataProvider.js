// =============================================
// PROVEDOR DE DADOS (Data Provider)
// Simula um sistema que tem dados que a IA pode acessar
// =============================================

class LogDataProvider {
  constructor() {
    // Mock data: simula logs de sessões de usuários
    // Em um sistema real, isso viria de um banco de dados
    this.sessionLogs = {
      101: ["warn: Playback stalled", "error: WebSocket disconnected"],
      102: ["debug: starting process", "warn: Failed to fetch VAST ad"],
      103: ["info: system healthy", "warn: Buffer underrun detected"]
    };
  }

  // MÉTODO 1: Buscar logs por ID da sessão
  // A IA pode chamar esta função quando o usuário pedir logs
  getLogs(sessionId) {
    console.log(`LogDataProvider: Buscando logs da sessão ${sessionId}`);
    return this.sessionLogs[sessionId] || ["error: session not found"];
  }

  // MÉTODO 2: Listar todas as sessões disponíveis
  // A IA pode chamar esta função para mostrar quais sessões existem
  getAvailableSessions() {
    console.log(`LogDataProvider: Listando sessões disponíveis`);
    return Object.keys(this.sessionLogs).map(Number);
  }
}

module.exports = LogDataProvider;
