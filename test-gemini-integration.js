const OllamaAgent = require("./src/agents/GoogleGemini/agents/ollamaAgent");

async function testGeminiIntegration() {
  console.log("🚀 Testando integração com Gemini 1.5 Flash via HTTP POST...\n");

  try {
    const agent = new OllamaAgent();
    
    console.log("📝 Fazendo pergunta simples para testar a API...");
    const response = await agent.generate("Olá! Você pode me explicar brevemente o que é inteligência artificial?");
    
    console.log("\n✅ Resposta recebida:");
    console.log("Texto extraído:", response.extractedText);
    
    console.log("\n📊 Dados completos da resposta:");
    console.log(JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error("❌ Erro durante o teste:", error.message);
    
    if (error.message.includes('GOOGLE_API_KEY')) {
      console.log("\n💡 Dica: Certifique-se de configurar sua GOOGLE_API_KEY no arquivo .env");
      console.log("   1. Copie .env.example para .env");
      console.log("   2. Obtenha sua API key em: https://aistudio.google.com/app/apikey");
      console.log("   3. Substitua 'your_google_api_key_here' pela sua API key");
    }
  }
}

testGeminiIntegration();
