require("dotenv").config();
const { post } = require("../tools/httpClient");
const {ConversationGeminiHistoryService } = require("../memory/conversationGeminiHistoryService");
const { ToolManager } = require("../tools/ToolManager");
const { logTools } = require("../tools/registry/logTools");
const {loggerAssistent} = require('../config/prompts')

class OllamaGemma3Agent {
  constructor() {
    this.apiOptions = {
      hostname: "generativelanguage.googleapis.com",
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };
    this.modelOptions = {
      temperature: 0.1,
      maxOutputTokens: 1000
    };
    this.systemPrompt = 
    this.historyService = new ConversationGeminiHistoryService();
    this.toolManager = new ToolManager();
    this.setupTools();
  }

  setupTools() {
    // Carregando todas as tools do registro de logs de uma vez
    this.toolManager.addTools(logTools);
  }

  buildPayload(question) {


    // Adiciona a pergunta atual ao histórico temporariamente
    const currentMessage = { 
      role: "user", 
      parts: [{ text: question }] 
    };

    return {
      contents: [...this.historyService.getMessages(), currentMessage],
      systemInstruction: {
        parts: [{ text: loggerAssistent }]
      },
      generationConfig: {
        temperature: this.modelOptions.temperature,
        maxOutputTokens: this.modelOptions.maxOutputTokens
      }
    };
  }

  // Método para executar conversa básica com o modelo
  async executeConversation(question) {
    // Adiciona pergunta do usuário ao histórico temporariamente

    const payload = this.buildPayload(question);
    console.log("[DEBUG] Sending payload:", JSON.stringify(payload, null, 2));

    const response = await post(this.apiOptions, JSON.stringify(payload));
    console.log("[DEBUG] Raw response:", response);

    // Salva a pergunta no histórico
    this.historyService.add("user", question);

    // Extração da resposta do Gemini API
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.error?.message ||
      "Sem resposta do modelo";

 
    console.log(response.candidates[0].content.parts[0])


    this.historyService.add("assistant", text);

    return {
      ...response,
      extractedText: text,
    };
  }

  async generate(
    question = "Me mostre os logs da primeira e segunda sessão"
  ) {
    try {
      return await this.executeConversation(question);
    } catch (error) {
      console.error("[ERROR] Failed to generate response:", error);
      throw error;
    }
  }

  getContext() {
    return this.historyService.get();
  }

  // Método público para adicionar tools externamente
  addTool(tool) {
    this.toolManager.addTool(tool);
  }

  // Método público para adicionar múltiplas tools externamente
  addTools(tools) {
    this.toolManager.addTools(tools);
  }

  // Método para obter informações sobre as tools
  getToolsInfo() {
    return {
      count: this.toolManager.getToolsCount(),
      description: this.toolManager.getTools(),
    };
  }
}

module.exports = OllamaGemma3Agent;
