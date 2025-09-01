// Responsável pelo fallback dinâmico (decomposição de plano via Gemini)
class FallbackPlanner {
  constructor(chat, functionMap, logger) {
    this.chat = chat;
    this.functionMap = functionMap;
    this.logger = logger;
  }

  async planAndExecute(question, response) {
    this.logger.info("Fallback dinâmico: solicitando decomposição de funções ao Gemini.");
    const availableFunctions = Object.keys(this.functionMap);
    const planPrompt = `Decomponha a seguinte pergunta do usuário em uma sequência de funções a serem chamadas, usando apenas as funções disponíveis: ${availableFunctions.join(", ")}. Para cada etapa, retorne o nome da função e os argumentos necessários em formato JSON. Pergunta: ${question}`;
    const planResult = await this.chat.sendMessage(planPrompt);
    const planText = planResult.response.text();
    let stepsPlan;
    try {
      stepsPlan = JSON.parse(planText.match(/\[.*\]/s)?.[0] || planText);
    } catch (e) {
      this.logger.warn("Não foi possível extrair plano de funções do Gemini. Retornando resposta direta.");
      return response.text();
    }
    if (Array.isArray(stepsPlan) && stepsPlan.length > 0) {
      let lastResult = null;
      for (const step of stepsPlan) {
        if (!step.name || !this.functionMap[step.name]) continue;
        lastResult = await this.functionMap[step.name](step.args || {});
      }
      return typeof lastResult === 'string' ? lastResult : JSON.stringify(lastResult, null, 2);
    } else {
      this.logger.warn("Plano de funções vazio ou inválido. Retornando resposta direta.");
      return response.text();
    }
  }
}

module.exports = FallbackPlanner;
