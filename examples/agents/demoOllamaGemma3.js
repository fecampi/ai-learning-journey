const OllamaGemma3Agent = require("../../src/agents/ollama/agents/ollamaAgent.js");

async function runDemo() {
  const agent = new OllamaGemma3Agent();
  try {
    const resposta = await agent.generate();
    console.log("Resposta da API Ollama:");
    try {
      const obj = JSON.parse(resposta);
      console.dir(obj, { depth: null, colors: true });
    } catch {
      console.log(resposta);
    }
  } catch (error) {
    console.error("Erro ao acessar a API Ollama:", error);
  }
}

runDemo();
