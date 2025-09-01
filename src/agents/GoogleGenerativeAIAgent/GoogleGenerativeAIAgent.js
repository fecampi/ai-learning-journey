// =============================================
// AGENTE GEMINI COM FUNCTION CALLING
// Esta é a classe principal que demonstra como criar um agente
// inteligente capaz de executar funções dinamicamente
// =============================================

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Logger = require("../../utils/Logger");
const FunctionExecutor = require("./services/FunctionExecutor");
const FunctionCallHandler = require("./services/FunctionCallHandler");
const FallbackPlanner = require("./services/FallbackPlanner");
const UserQuestionProcessor = require("./services/UserQuestionProcessor");

class GoogleGenerativeAIAgent {
  constructor(apiKey, model = "gemini-1.5-flash", logger = null) {
    this.modelName = model;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.tools = [];
    this.functionMap = {};
    this.model = null;
    this.chat = null;
    // Usa Logger customizado ou padrão
    this.logger =
      logger instanceof Logger
        ? logger
        : new Logger("GoogleGenerativeAIAgent", logger);
    this.functionExecutor = null;
    this.functionCallHandler = null;
    this.fallbackPlanner = null;
    this.userQuestionProcessor = null;
  }

  addTool(functionDeclaration, implementation) {
    this.tools.push({ functionDeclarations: [functionDeclaration] });
    this.functionMap[functionDeclaration.name] = implementation;
    // Atualiza o executor se já existir
    if (this.functionExecutor) {
      this.functionExecutor.functionMap = this.functionMap;
    }
    if (this.fallbackPlanner) {
      this.fallbackPlanner.functionMap = this.functionMap;
    }
  }

  async startSession(systemPrompt) {
    this.model = this.genAI.getGenerativeModel({
      model: this.modelName,
      tools: this.tools,
    });
    if (systemPrompt) {
      this.chat = this.model.startChat({
        history: [{ role: "user", parts: [{ text: systemPrompt }] }],
      });
    } else {
      this.chat = this.model.startChat();
    }
    // Instancia os serviços
    this.functionExecutor = new FunctionExecutor(this.functionMap, this.logger);
    this.functionCallHandler = new FunctionCallHandler(
      this.chat,
      this.functionExecutor,
      this.logger
    );
    this.fallbackPlanner = new FallbackPlanner(
      this.chat,
      this.functionMap,
      this.logger
    );
    this.userQuestionProcessor = new UserQuestionProcessor(
      this.chat,
      this.modelName,
      this.logger
    );
  }

  /**
   * Orquestrador principal do agente IA.
   * Este método coordena todo o fluxo de uma interação, delegando responsabilidades para serviços especializados.
   *
   * @param {string} question - Pergunta do usuário.
   * @param {number} maxSteps - Máximo de ciclos de function calling permitidos.
   * @returns {Promise<string>} - Resposta final da IA.
   */
  async ask(question, maxSteps = 5) {
    // Loga a pergunta recebida
    this.logger.log(`Pergunta recebida: "${question}"`);
    this.logger.log("");
    try {
      // 1. Envia a pergunta para a IA usando o serviço UserQuestionProcessor
      //    Isso retorna a primeira resposta do modelo, que pode ou não conter function calls
      let response = await this.userQuestionProcessor.process(question);

      // 2. Executa o loop de function calling usando FunctionCallHandler
      //    Enquanto a IA pedir chamadas de função, executa e envia os resultados de volta
      const { response: finalResponse, steps } =
        await this.functionCallHandler.handle(response, maxSteps);

      // 3. Se não atingiu o limite de steps e não há mais function calls:
      //    Se a IA já respondeu com texto, retorna esse texto. Só chama o fallback se a resposta for vazia.
      if (steps < maxSteps) {
        const functionCalls = finalResponse.functionCalls();
        const iaText = finalResponse.text && finalResponse.text();
        if (!functionCalls || functionCalls.length === 0) {
          if (iaText && iaText.trim().length > 0 && iaText !== "null") {
            // Se a IA já respondeu com texto útil, retorna direto
            return iaText;
          } else {
            // Só chama o fallback se não houver texto útil
            return await this.fallbackPlanner.planAndExecute(
              question,
              finalResponse
            );
          }
        }
      }

      // 4. Se chegou ao limite de steps, retorna a resposta parcial gerada até aqui
      this.logger.warn(
        `Limite de chamadas (${maxSteps}) atingido. Retornando resposta parcial.`
      );
      return finalResponse.text();
    } catch (error) {
      // 5. Em caso de erro, loga e retorna mensagem de erro amigável
      this.logger.log(`Erro durante a execução: ${error}`);
      return `Erro: ${error.message}`;
    }
  }
}

module.exports = GoogleGenerativeAIAgent;
