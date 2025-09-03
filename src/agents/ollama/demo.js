/**
 * Demonstração da Arquitetura CrewAI com Ollama
 * Exemplo prático de uso seguindo padrão CrewAI 2025
 */

const { OllamaCrew } = require('./index.js');

async function demonstracaoCrewAI() {
  console.log("🔥 DEMONSTRAÇÃO CREWAI ARCHITECTURE - OLLAMA");
  console.log("=" .repeat(50));
  
  try {
    // 1. Criar crew (equivalente ao CrewAI)
    const crew = new OllamaCrew();
    
    // 2. Exemplo 1: Execução simples de tarefa
    console.log("\n📋 EXEMPLO 1: Execução Simples");
    console.log("-".repeat(30));
    
    const result1 = await crew.executeTask(
      "Quais são os logs da sessão 101?"
    );
    
    console.log("Resposta:", result1.extractedText);
    
    // 3. Exemplo 2: Múltiplas tarefas (padrão CrewAI)
    console.log("\n🎯 EXEMPLO 2: Múltiplas Tarefas (CrewAI Pattern)");
    console.log("-".repeat(30));
    
    // Adicionar tarefas ao crew
    crew.addTask(
      "Analise o histórico de conversas e identifique padrões", 
      "Relatório de padrões identificados"
    );
    
    crew.addTask(
      "Qual foi o último erro encontrado?",
      "Descrição do último erro"
    );
    
    crew.addTask(
      "Resuma o estado atual do sistema",
      "Resumo do sistema"
    );
    
    // Executar todas as tarefas
    console.log("Executando tarefas em sequência...");
    const results = await crew.kickoff();
    
    // Mostrar resultados
    results.forEach((result, index) => {
      console.log(`\nTarefa ${index + 1}:`);
      console.log(`- Status: ${result.status}`);
      if (result.result) {
        console.log(`- Resultado: ${result.result.extractedText.substring(0, 100)}...`);
      }
    });
    
    // 4. Exemplo 3: Verificar contexto/memória
    console.log("\n💾 EXEMPLO 3: Contexto e Memória");
    console.log("-".repeat(30));
    
    const context = crew.getContext();
    console.log(`Histórico de conversas: ${context.length} entradas`);
    console.log(`Última entrada: ${context[context.length - 1]?.content?.substring(0, 50)}...`);
    
    // 5. Exemplo 4: Status das tarefas
    console.log("\n📊 EXEMPLO 4: Status das Tarefas");
    console.log("-".repeat(30));
    
    const tasksStatus = crew.getTasksStatus();
    tasksStatus.forEach((task, index) => {
      console.log(`Tarefa ${index + 1}: ${task.status} - ${task.description}`);
    });
    
    console.log("\n✅ Demonstração concluída com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro na demonstração:", error.message);
    console.log("\n💡 Dica: Certifique-se de que o Ollama está rodando:");
    console.log("   ollama serve");
    console.log("   ollama run gemma3:270m");
  }
}

// Executar demonstração se arquivo foi chamado diretamente
if (require.main === module) {
  demonstracaoCrewAI();
}

module.exports = { demonstracaoCrewAI };
