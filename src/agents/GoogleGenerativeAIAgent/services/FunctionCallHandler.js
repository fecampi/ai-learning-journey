// Responsável por lidar com o loop de function calls da IA
class FunctionCallHandler {
  constructor(chat, functionExecutor, logger) {
    this.chat = chat;
    this.functionExecutor = functionExecutor;
    this.logger = logger;
  }

  async handle(response, maxSteps = 5) {
    let steps = 0;
    let currentResponse = response;
    while (steps < maxSteps) {
      this.logger.log(`PASSO 2: Verificando se a IA solicitou function calls (step ${steps + 1}/${maxSteps})`);
      const functionCalls = currentResponse.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        this.logger.log(`PASSO 3: IA solicitou execução de função!`);
        const call = functionCalls[0];
        const functionName = call.name;
        const args = call.args;
        const funcResult = await this.functionExecutor.execute(functionName, args);
        this.logger.log(`PASSO 4: Enviando resultado de volta para a IA gerar resposta final`);
        const result = await this.chat.sendMessage([
          {
            functionResponse: {
              name: functionName,
              response: { content: funcResult }
            }
          }
        ]);
        currentResponse = result.response;
        steps++;
      } else {
        break;
      }
    }
    return { response: currentResponse, steps };
  }
}

module.exports = FunctionCallHandler;
