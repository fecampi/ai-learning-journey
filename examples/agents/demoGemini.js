const GoogleGemini = require("../../src/agents/GoogleGemini");

async function runDemo() {
  const agent = new GoogleGemini();
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
