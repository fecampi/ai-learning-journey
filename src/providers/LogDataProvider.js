// =============================================
// PROVEDOR DE DADOS (Data Provider)
// Simula um sistema que tem dados que a IA pode acessar
// =============================================


class LogDataProvider {
  // Retorna o modelo do device
  static getDeviceModel() {
    return "linux-x86_64";
  }
  // Mock data: simula logs de sessões de usuários
  static sessionLogs = {
    101: ["warn: Playback stalled", "error: WebSocket disconnected"],
    102: ["debug: starting process", "warn: Failed to fetch VAST ad"],
    103: ["info: system healthy", "warn: Buffer underrun detected"]
  };

  // Buscar logs por ID da sessão
  static getLogs(sessionId) {
    console.log(`LogDataProvider: Buscando logs da sessão ${sessionId}`);
    return LogDataProvider.sessionLogs[sessionId] || ["error: session not found"];
  }

  // Listar todas as sessões disponíveis
  static getAvailableSessions() {
    console.log(`LogDataProvider: Listando sessões disponíveis`);
    return Object.keys(LogDataProvider.sessionLogs).map(Number);
  }
}

module.exports = LogDataProvider;
