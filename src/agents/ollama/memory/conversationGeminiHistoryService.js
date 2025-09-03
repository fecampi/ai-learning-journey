const { loggerAssistent } = require("../config/prompts");

class ConversationGeminiHistoryService {
  constructor(maxHistory = 10) {
    this.maxHistory = maxHistory;
    this.systemInstruction = loggerAssistent;
    this.history = [
      { 
        role: "user", 
        parts: [{ text: "Quais são as sessão que tem salva no device?" }] 
      },
      { 
        role: "model", 
        parts: [{ text: "[101,102,103]" }] 
      },
    ];
  }

  add(role, content) {
    // Converte o role para o formato Gemini
    const geminiRole = role === 'assistant' ? 'model' : role === 'system' ? 'user' : role;
    
    // Se for system, não adiciona ao histórico, apenas atualiza a instrução
    if (role === 'system') {
      this.systemInstruction = content;
      return;
    }

    this.history.push({ 
      role: geminiRole, 
      parts: [{ text: content }] 
    });
    
    while (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getMessages() {
    return this.history;
  }

  getSystemInstruction() {
    return {
      parts: [{ text: this.systemInstruction }]
    };
  }

  get() {
    return {
      contents: this.history,
      systemInstruction: this.getSystemInstruction()
    };
  }
}

module.exports = { ConversationGeminiHistoryService}
