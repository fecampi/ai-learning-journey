/**
 * CrewAI Architecture Pattern - Ollama Implementation
 * Orquestrador principal seguindo padrão CrewAI 2025
 */

// Imports seguindo padrão CrewAI
const OllamaGemma3Agent = require("./agents/ollamaAgent");
const ConversationHistoryService = require("./memory/conversationHistory");
const OllamaTask = require("./tasks/ollamaTask");

class OllamaCrew {
  constructor() {
    this.agent = new OllamaGemma3Agent();
    this.tasks = [];
    this.results = [];
  }

  // Método para adicionar tools ao agente (CrewAI pattern)
  addTool(toolDefinition, implementation) {
    return this.agent.addTool(toolDefinition, implementation);
  }

  // Método para adicionar tarefas (CrewAI pattern)
  addTask(description, expectedOutput) {
    const task = new OllamaTask(description, expectedOutput, this.agent);
    this.tasks.push(task);
    return task;
  }

  // Método para executar todas as tarefas
  async kickoff() {
    console.log("[CREW] Iniciando execução das tarefas...");
    
    for (const task of this.tasks) {
      try {
        const result = await task.execute();
        this.results.push({
          task: task.description,
          result: result,
          status: "completed"
        });
      } catch (error) {
        this.results.push({
          task: task.description,
          error: error.message,
          status: "failed"
        });
      }
    }
    
    console.log("[CREW] Todas as tarefas processadas!");
    return this.results;
  }

  // Método para executar uma tarefa específica
  async executeTask(description, input = null) {
    const task = new OllamaTask(description, "Resposta do modelo", this.agent);
    return await task.execute(input);
  }

  // Método para obter contexto/memória
  getContext() {
    return this.agent.getContext();
  }

  // Método para obter status de todas as tarefas
  getTasksStatus() {
    return this.tasks.map(task => task.getStatus());
  }
}

// Exporta tanto a classe principal quanto os componentes individuais
module.exports = {
  OllamaCrew,
  OllamaGemma3Agent,
  ConversationHistoryService,
  OllamaTask
};
