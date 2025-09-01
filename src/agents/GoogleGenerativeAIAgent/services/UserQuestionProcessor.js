// Responsável por enviar a pergunta inicial para a IA
class UserQuestionProcessor {
  constructor(chat, modelName, logger) {
    this.chat = chat;
    this.modelName = modelName;
    this.logger = logger;
  }

  async process(question) {
    this.logger.log(`PASSO 1: Enviando pergunta para o modelo ${this.modelName}`);
    const result = await this.chat.sendMessage(question + "\nRespond in Portuguese.");
    return result.response;
  }
}

module.exports = UserQuestionProcessor;
