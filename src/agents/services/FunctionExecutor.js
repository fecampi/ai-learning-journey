// Responsável por executar funções dinamicamente
class FunctionExecutor {
  constructor(functionMap, logger) {
    this.functionMap = functionMap;
    this.logger = logger;
  }

  async execute(functionName, args) {
    this.logger.log(`Executando função '${functionName}' com argumentos:`, args);
    if (typeof this.functionMap[functionName] === 'function') {
      const result = await this.functionMap[functionName](args);
      this.logger.log(`FunctionExecutor: Função '${functionName}' executada. Resultado bruto:`, result);
      // Loga o tipo do resultado para depuração
      this.logger.log(`[FunctionExecutor: Tipo do resultado:`, typeof result);
      this.logger.log(`Função executada com sucesso. Resultado: ${JSON.stringify(result)}`);
      return result;
    } else {
      const error = `Função '${functionName}' não encontrada no functionMap`;
      this.logger.log(error);
      return error;
    }
  }
}

module.exports = FunctionExecutor;
