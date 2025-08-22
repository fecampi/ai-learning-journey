// =============================================
// AGENTE DE IA COM FUNCTION CALLING
// Esta é a classe principal que demonstra como criar um agente
// inteligente capaz de executar funções dinamicamente
// =============================================

const { GoogleGenerativeAI } = require("@google/generative-ai");

class SmartAIAgent {
  constructor(apiKey, dataProvider, availableFunctions, model = "gemini-1.5-flash") {
    // Armazena o provedor de dados (onde estão as funções que a IA pode chamar)
    this.dataProvider = dataProvider;
    
    // Modelo de IA configurável - permite trocar de modelo facilmente
    // Gemini Flash é rápido e suporta function calling
    // Outros modelos: "gemini-1.5-pro", "gemini-1.0-pro", etc.
    this.modelName = model;
    
    // CONFIGURAÇÃO DA IA GEMINI
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Cria o modelo com configurações específicas para function calling
    // O parâmetro 'tools' informa à IA quais funções ela pode usar
    this.model = this.genAI.getGenerativeModel({
      model: this.modelName, // Agora usa a variável do construtor
      tools: [{ functionDeclarations: availableFunctions }]
    });
    
    // SESSÃO DE CHAT COM HISTÓRICO
    // startChat() cria uma conversa persistente que mantém contexto
    // Isso significa que a IA lembra das mensagens anteriores
    // Exemplo: se você perguntar "e a sessão anterior?" ela entenderá o contexto
    this.chat = this.model.startChat();
  }

  // MÉTODO 1: COMUNICAÇÃO COM A IA
  // Envia o resultado de uma função de volta para a IA processar
  async sendFunctionResult(functionName, result) {
    console.log(`SmartAIAgent: Enviando resultado da função '${functionName}' para a IA processar`);
    
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
    console.log(`SmartAIAgent: Executando função '${functionName}' com argumentos:`, args);
    
    // MAGIA DINÂMICA: Chama função por nome (string)
    // Isso permite adicionar novas funções sem modificar este código!
    if (typeof this.dataProvider[functionName] === 'function') {
      const result = this.dataProvider[functionName](...Object.values(args));
      console.log(`SmartAIAgent: Função executada com sucesso. Resultado:`, result);
      return result;
    } else {
      const error = `Função '${functionName}' não encontrada no data provider`;
      console.log(error);
      return error;
    }
  }

  // MÉTODO 3: ORQUESTRADOR PRINCIPAL
  // Este método coordena todo o fluxo de uma conversa com function calling
  async ask(question) {
    console.log(`SmartAIAgent: Pergunta recebida: "${question}"`);
    console.log("");

    try {
      // PASSO 1: Envia a pergunta para a IA
      console.log(`PASSO 1: Enviando pergunta para o modelo ${this.modelName}`);
      const result1 = await this.chat.sendMessage(question + "\nRespond in Portuguese.");
      const response1 = result1.response;

      // PASSO 2: Verifica se a IA quer executar alguma função
      console.log(`PASSO 2: Verificando se a IA solicitou function calls`);
      const functionCalls = response1.functionCalls();
      
      if (functionCalls && functionCalls.length > 0) {
        console.log(`PASSO 3: IA solicitou execução de função!`);
        
        // Pega a primeira function call (pode haver várias)
        const call = functionCalls[0];
        const functionName = call.name;
        const args = call.args;
        
        // PASSO 3: Executa a função solicitada
        const result = await this.executeFunction(functionName, args);
        
        // PASSO 4: Envia o resultado de volta para a IA processar
        console.log(`PASSO 4: Enviando resultado de volta para a IA gerar resposta final`);
        return await this.sendFunctionResult(functionName, result);
      }

      // Se não há function calls, retorna a resposta direta da IA
      console.log(`Resposta direta da IA (sem function calls)`);
      return response1.text();

    } catch (error) {
      console.error(`Erro durante a execução:`, error);
      return `Erro: ${error.message}`;
    }
  }
}

module.exports = SmartAIAgent;
