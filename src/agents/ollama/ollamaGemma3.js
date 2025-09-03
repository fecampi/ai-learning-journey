const { post } = require("./utils/httpClient");
const { loggerAssistent } = require("./config/prompts");

class ConversationHistoryService {
  constructor(maxHistory = 10) {
    this.maxHistory = maxHistory;
    this.history = [
      { role: "system", content: loggerAssistent },
      { role: "user", content: "Quais são os IDs da primeira sessão?" },
      { role: "assistant", content: "O ID da primeira sessão é 101." },
      { role: "user", content: "Me mostre os logs dessa sessão" },
      {
        role: "assistant",
        content:
          "Logs da sessão 101: - [INFO] Início da sessão - [ERROR] Falha ao carregar módulo X - [INFO] Sessão finalizada",
      },
    ];
  }

  add(role, content) {
    this.history.push({ role, content });
    while (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getMessages() {
    return this.history.map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));
  }

  get() {
    return this.history;
  }
}

class OllamaGemma3Agent {
  constructor() {
    this.apiOptions = {
      hostname: "localhost",
      port: 11434,
      path: "/api/chat", // Para conversas com histórico
    };
    this.modelOptions = {
      model: "gemma3:270m", // Mantendo seu modelo
      stream: false,
      options: {
        temperature: 0.1,
        num_ctx: 2048, // Context menor para gemma3:270m
        top_p: 0.9,
        top_k: 40,
      },
    };
    this.historyService = new ConversationHistoryService();
  }

  buildPayload(question) {
    // Adiciona pergunta do usuário ao histórico temporariamente
    const messages = [
      ...this.historyService.getMessages(),
      { role: "user", content: question },
    ];
    return {
      model: this.modelOptions.model,
      messages,
      stream: this.modelOptions.stream,
      options: this.modelOptions.options,
    };
  }

  async generate(
    question = "já encontramos um erro no histórico na session 101?, qual seria ele?"
  ) {
    try {
      const payload = this.buildPayload(question);
      console.log("[DEBUG] Sending payload:", JSON.stringify(payload, null, 2));

      const response = await post(this.apiOptions, JSON.stringify(payload));
      console.log("[DEBUG] Raw response:", response);

      // Salva a pergunta no histórico
      this.historyService.add("user", question);

      // Extração correta da resposta para API /api/chat
      const text =
        response?.message?.content ||
        response?.response ||
        "Sem resposta do modelo";

      console.log("[DEBUG] Extracted text:", text);

      // Salva a resposta no histórico
      this.historyService.add("assistant", text);

      return {
        ...response,
        extractedText: text,
      };
    } catch (error) {
      console.error("[ERROR] Failed to generate response:", error);
      throw error;
    }
  }

  getContext() {
    return this.historyService.get();
  }
}

module.exports = { OllamaGemma3Agent, ConversationHistoryService };
