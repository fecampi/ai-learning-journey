// =============================================
// AGENTE DE IA COM FUNCTION CALLING
// Esta é a classe principal que demonstra como criar um agente
// inteligente capaz de executar funções dinamicamente
// =============================================

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Logger = require("../utils/Logger");

class SmartAIAgent {
  constructor(apiKey, model = "gemini-1.5-flash", logger = null) {
    this.modelName = model;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.tools = [];
    this.functionMap = {};
    this.model = null;
    this.chat = null;
    // Usa Logger customizado ou padrão
    this.logger = logger instanceof Logger ? logger : new Logger("SmartAIAgent", logger);
  }

  addTool(functionDeclaration, implementation) {
    this.tools.push({ functionDeclarations: [functionDeclaration] });
    this.functionMap[functionDeclaration.name] = implementation;
  }

  async startSession(systemPrompt) {
    this.model = this.genAI.getGenerativeModel({
      model: this.modelName,
      tools: this.tools
    });
    if (systemPrompt) {
      this.chat = this.model.startChat({ history: [ { role: "user", parts: [{ text: systemPrompt }] } ] });
    } else {
      this.chat = this.model.startChat();
    }
  }

  // MÉTODO 1: COMUNICAÇÃO COM A IA
  // Envia o resultado de uma função de volta para a IA processar
  async sendFunctionResult(functionName, result) {
    this.logger.log(`Enviando resultado da função '${functionName}' para a IA processar`);
    // Formato específico do Gemini para function responses
    const response = await this.chat.sendMessage([{
      functionResponse: {
        name: functionName,
        response: { content: result }
      }
    }]);
    return response.response.text();
  }

  // MÉTODO 2: EXECUÇÃO DINÂMICA DE FUNÇÕES  
  // Este é o coração do sistema - executa qualquer função do dataProvider
  async executeFunction(functionName, args) {
    this.logger.log(`Executando função '${functionName}' com argumentos:`, args);
    if (typeof this.functionMap[functionName] === 'function') {
      const result = await this.functionMap[functionName](args);
      this.logger.log(`Função executada com sucesso. Resultado: ${JSON.stringify(result)}`);
      return result;
    } else {
      const error = `Função '${functionName}' não encontrada no functionMap`;
      this.logger.log(error);
      return error;
    }
  }

  // MÉTODO 3: ORQUESTRADOR PRINCIPAL
  // Este método coordena todo o fluxo de uma conversa com function calling
  async ask(question) {
    this.logger.log(`Pergunta recebida: "${question}"`);
    this.logger.log("");
    try {
      // PASSO 1: Envia a pergunta para a IA
      this.logger.log(`PASSO 1: Enviando pergunta para o modelo ${this.modelName}`);
      const result1 = await this.chat.sendMessage(question + "\nRespond in Portuguese.");
      const response1 = result1.response;

      // PASSO 2: Verifica se a IA quer executar alguma função
      this.logger.log(`PASSO 2: Verificando se a IA solicitou function calls`);
      const functionCalls = response1.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        this.logger.log(`PASSO 3: IA solicitou execução de função!`);
        // Pega a primeira function call (pode haver várias)
        const call = functionCalls[0];
        const functionName = call.name;
        const args = call.args;
        // PASSO 3: Executa a função solicitada
        const result = await this.executeFunction(functionName, args);
        // PASSO 4: Envia o resultado de volta para a IA processar
        this.logger.log(`PASSO 4: Enviando resultado de volta para a IA gerar resposta final`);
        return await this.sendFunctionResult(functionName, result);
      }
      // Se não há function calls, retorna a resposta direta da IA
      this.logger.log(`Resposta direta da IA (sem function calls)`);
      return response1.text();
    } catch (error) {
      this.logger.log(`Erro durante a execução: ${error}`);
      return `Erro: ${error.message}`;
    }
  }
}

module.exports = SmartAIAgent;
