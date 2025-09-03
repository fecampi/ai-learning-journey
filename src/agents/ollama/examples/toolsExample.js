/**
 * Exemplo de uso dos métodos addTool e addTools
 */

const OllamaGemma3Agent = require('./ollamaAgent');

// Exemplo de tools em array
const mathTools = [
  {
    name: "add",
    description: "Soma dois números",
    parameters: {
      type: "object",
      properties: {
        a: { type: "integer", description: "Primeiro número" },
        b: { type: "integer", description: "Segundo número" }
      },
      required: ["a", "b"]
    }
  },
  {
    name: "multiply",
    description: "Multiplica dois números",
    parameters: {
      type: "object",
      properties: {
        a: { type: "integer", description: "Primeiro número" },
        b: { type: "integer", description: "Segundo número" }
      },
      required: ["a", "b"]
    }
  }
];

// Exemplo de tools em objeto
const weatherTools = {
  getCurrentWeather: {
    name: "getCurrentWeather",
    description: "Obtém o clima atual de uma cidade",
    parameters: {
      type: "object",
      properties: {
        city: { type: "string", description: "Nome da cidade" },
        country: { type: "string", description: "País (opcional)" }
      },
      required: ["city"]
    }
  },
  getWeatherForecast: {
    name: "getWeatherForecast",
    description: "Obtém previsão do tempo para os próximos dias",
    parameters: {
      type: "object",
      properties: {
        city: { type: "string", description: "Nome da cidade" },
        days: { type: "integer", description: "Número de dias (1-7)" }
      },
      required: ["city", "days"]
    }
  }
};

// Demonstração de uso
async function demonstrateUsage() {
  const agent = new OllamaGemma3Agent();
  
  console.log("=== Ferramentas iniciais ===");
  console.log(`Tools carregadas: ${agent.getToolsInfo().count}`);
  
  // Adicionando uma tool individual
  agent.addTool({
    name: "getTime",
    description: "Obtém a hora atual",
    parameters: { type: "object", properties: {}, required: [] }
  });
  
  console.log("\n=== Após addTool ===");
  console.log(`Tools carregadas: ${agent.getToolsInfo().count}`);
  
  // Adicionando múltiplas tools (array)
  agent.addTools(mathTools);
  
  console.log("\n=== Após addTools (array) ===");
  console.log(`Tools carregadas: ${agent.getToolsInfo().count}`);
  
  // Adicionando múltiplas tools (objeto)
  agent.addTools(weatherTools);
  
  console.log("\n=== Após addTools (objeto) ===");
  console.log(`Tools carregadas: ${agent.getToolsInfo().count}`);
  
  console.log("\n=== Descrição completa das tools ===");
  console.log(agent.getToolsInfo().description);
}

// Executar demonstração
if (require.main === module) {
  demonstrateUsage().catch(console.error);
}

module.exports = { mathTools, weatherTools };
