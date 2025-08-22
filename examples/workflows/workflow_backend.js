const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '../../.env' });

// Verifica se a API key está configurada
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY não encontrada no arquivo .env');
  console.log('📋 Configure sua API key no arquivo .env na raiz do projeto');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function run() {
 const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const logs = [
    {
      device_id: "device_1",
      level_name: "WARNING",
      message: "Playback stalled after 10s",
      context: "player.buffering",
      date_time: "2025-06-21T14:15:00Z"
    },
    {
      device_id: "device_2",
      level_name: "WARNING",
      message: "WebSocket disconnected unexpectedly",
      context: "ws.connection",
      date_time: "2025-06-21T14:16:00Z"
    },
    {
      device_id: "device_1",
      level_name: "WARNING",
      message: "Failed to fetch VAST ad",
      context: "ads.loader",
      date_time: "2025-06-21T14:17:00Z"
    }
  ];

  const prompt = `
### LOGS (JSON)
${JSON.stringify(logs, null, 2)}

### OBJETIVO
1. Liste os \`device_id\` que apresentaram problemas.
2. Agrupe por contexto e descreva os principais problemas.
3. Identifique qualquer padrão que sugira falha de rede, player ou anúncios.

Responda em português técnico, de forma objetiva.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log(text);
}

run();
