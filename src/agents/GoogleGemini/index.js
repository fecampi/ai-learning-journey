require("dotenv").config();
const { post } = require("./tools/httpClient");
const { conversationHistory } = require("./memory/conversationHistory");
const { ToolManager } = require("./tools/ToolManager");
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
    this.historyService = new conversationHistory();
    this.toolManager = new ToolManager();
    this.systemInstruction = " ";
  }

  setSystemInstruction(instruction) {
    this.systemInstruction = instruction;
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
        parts: [{ text: this.systemInstruction }],
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
    this.historyService.add("user", question || "");
    const payload = this.buildPayload(question);
    const response = await post(this.apiOptions, JSON.stringify(payload));
    const { text, candidate } = getTextAndCandidateFromResponse(response);
    this.historyService.add("assistant", text);
    return {
      ...response,
      text,
      functionsRequested: getCallsFromResponse(candidate),
    };
  }

  async generate(
    question = "Qual é o device e me mostre ao mesmo tempo os logs da seção 101"
  ) {
    try {
      let result = await this.executeConversation(question);

      const maxCycles = 5;
      let resultsText = "";
      for (let cycles = 0; cycles < maxCycles; cycles++) {
        if (
          !result.functionsRequested ||
          result.functionsRequested.length === 0
        )
          break;
        resultsText = this.toolManager.executeFunctions(
          result.functionsRequested
        );
        result = await this.executeConversation(resultsText);
      }

      // Se atingiu o limite, concatena aviso e faz uma última chamada
      if (result.functionsRequested && result.functionsRequested.length > 0) {
        const warning =
          "Limite de chamadas de funções atingido. Por favor, responda com base nos dados disponíveis ou peça mais informações ao usuário.";
        resultsText = (resultsText ? resultsText + "\n" : "") + warning;
        result = await this.executeConversation(resultsText);
      }

      if (result.text) {
        console.log("Texto retornado:", result.text);
      }
      return result;
    } catch (error) {
      console.error("[ERROR] Failed to generate response:", error);
      throw error;
    }
  }
}

module.exports = GoogleGemini;
