require("dotenv").config();
const { post } = require("./tools/httpClient");
const {
  ConversationGeminiHistoryService,
} = require("./memory/conversationHistory");
const { ToolManager } = require("./tools/ToolManager");
const { loggerAssistent } = require("./config/prompts");
const {
  getTextAndCandidateFromResponse,
  getCallsFromResponse,
} = require("./parsers/responseParser");

class GoogleGemini {
  constructor() {
    this.apiOptions = {
      hostname: "generativelanguage.googleapis.com",
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    this.modelOptions = {
      temperature: 0.1,
      maxOutputTokens: 1000,
    };
    this.systemPrompt = this.historyService =
      new ConversationGeminiHistoryService();
    this.toolManager = new ToolManager();
  }

  buildPayload(question) {
    // Adiciona a pergunta atual ao histórico temporariamente
    const currentMessage = {
      role: "user",
      parts: [{ text: question }],
    };

    return {
      contents: [...this.historyService.getMessages(), currentMessage],
      systemInstruction: {
        parts: [{ text: loggerAssistent }],
      },
      generationConfig: {
        temperature: this.modelOptions.temperature,
        maxOutputTokens: this.modelOptions.maxOutputTokens,
      },
      tools: this.toolManager.getTools(),
    };
  }

  // Método para executar conversa básica com o modelo
  async executeConversation(question) {
    // Adiciona pergunta do usuário ao histórico temporariamente

    const payload = this.buildPayload(question);
    console.log("[DEBUG] Sending payload:", JSON.stringify(payload, null, 2));

    const response = await post(this.apiOptions, JSON.stringify(payload));
    console.log(
      "[DEBUG] Resposta completa da API Gemini:",
      JSON.stringify(response, null, 2)
    );

    // Salva a pergunta no histórico
    this.historyService.add("user", question);

    const { text, candidate } = getTextAndCandidateFromResponse(
      response,
      this.historyService
    );

    return {
      ...response,
      extractedText: text,
      functionsRequested: getCallsFromResponse(candidate),
    };
  }

  async generate(
    question = "Qual é o device e me mostre ao mesmo tempo os logs da seção 101"
  ) {
    try {
      const result = await this.executeConversation(question);
      if (result.functionsRequested && result.functionsRequested.length > 0) {
        console.log("Chamando funções:", result.functionsRequested);
      }
      return result;
    } catch (error) {
      console.error("[ERROR] Failed to generate response:", error);
      throw error;
    }
  }
}

module.exports = GoogleGemini;
