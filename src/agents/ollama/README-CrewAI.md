# 🔥 Ollama Agent - Arquitetura CrewAI 2025

Este diretório implementa um agente de IA seguindo a **arquitetura CrewAI**, o padrão mais popular de 2025 para agentes autônomos.

## 📁 Estrutura (Padrão CrewAI 2025)

```
ollama/
├── agents/                    # 🤖 Agent Core
│   └── ollamaAgent.js        # Agente principal Ollama Gemma3
├── tools/                     # 🛠️ Action Layer  
│   └── httpClient.js         # Cliente HTTP para comunicação
├── memory/                    # 💾 Memory Layer
│   └── conversationHistory.js # Serviço de memória conversacional
├── tasks/                     # 🎯 Task Planning
│   └── ollamaTask.js         # Definição de tarefas executáveis
├── config/                    # ⚙️ Configuration Layer
│   └── prompts.js            # Templates de prompts do sistema
├── index.js                   # 🚀 Orquestrador principal (CrewAI)
└── README.md                  # 📖 Esta documentação
```

## 🎯 Padrão CrewAI Implementation

### **🤖 Agents (Agentes)**
- **Responsabilidade**: Lógica principal de IA e raciocínio
- **Arquivo**: `agents/ollamaAgent.js`
- **Função**: Processar entradas, tomar decisões, gerar respostas

### **🛠️ Tools (Ferramentas)**  
- **Responsabilidade**: Ações e comunicação externa
- **Arquivo**: `tools/httpClient.js`
- **Função**: Interface com APIs e serviços externos

### **💾 Memory (Memória)**
- **Responsabilidade**: Gerenciamento de estado e contexto
- **Arquivo**: `memory/conversationHistory.js`
- **Função**: Manter histórico e contexto entre interações

### **🎯 Tasks (Tarefas)**
- **Responsabilidade**: Definição e execução de tarefas específicas
- **Arquivo**: `tasks/ollamaTask.js`
- **Função**: Estruturar trabalho em unidades executáveis

## 🚀 Como Usar (Padrão CrewAI)

### **Uso Simples:**
```javascript
const { OllamaGemma3Agent } = require('./index.js');

const agent = new OllamaGemma3Agent();
const result = await agent.generate("Sua pergunta");
console.log(result.extractedText);
```

### **🔧 Function Calling (NOVO!):**
```javascript
const { OllamaCrew } = require('./index.js');

// Criar crew
const crew = new OllamaCrew();

// Adicionar tools
crew.addTool({
  name: "getLogs",
  description: "Busca logs de uma sessão específica",
  parameters: {
    type: "object",
    properties: {
      sessionId: { type: "integer", description: "ID da sessão" }
    },
    required: ["sessionId"]
  }
}, ({ sessionId }) => {
  // Implementação da tool
  return [`Log 1 da sessão ${sessionId}`, `Log 2 da sessão ${sessionId}`];
});

// Usar o agente - ele decidirá automaticamente se precisa usar tools
const result = await crew.executeTask("Quais são os logs da sessão 101?");
console.log(result.extractedText);
```

### **Uso Avançado (Múltiplas Tarefas):**
```javascript
const { OllamaCrew } = require('./index.js');

// Criar crew
const crew = new OllamaCrew();

// Adicionar tarefas
crew.addTask("Analisar logs", "Relatório");
crew.addTask("Identificar erros", "Lista de erros");

// Executar todas as tarefas
const results = await crew.kickoff();
console.log(results);
```

### **Uso Individual dos Componentes:**
```javascript
const { OllamaGemma3Agent, ConversationHistoryService, OllamaTask } = require('./index.js');

// Usar apenas o agente
const agent = new OllamaGemma3Agent();
const response = await agent.generate("Sua pergunta aqui");

// Usar apenas a memória
const memory = new ConversationHistoryService();
memory.add("user", "Pergunta");
memory.add("assistant", "Resposta");

// Usar apenas tarefas
const task = new OllamaTask("Descrição", "Output esperado", agent);
const result = await task.execute();
```

## 📊 Compatibilidade CrewAI

| **Componente CrewAI** | **Implementação Ollama** | **Status** |
|----------------------|---------------------------|------------|
| **Agent** | `agents/ollamaAgent.js` | ✅ **Implementado** |
| **Tools** | `tools/httpClient.js` | ✅ **Implementado** |
| **Function Calling** | `addTool()` + detecção JSON | ✅ **NOVO!** |
| **Tasks** | `tasks/ollamaTask.js` | ✅ **Implementado** |
| **Memory** | `memory/conversationHistory.js` | ✅ **Implementado** |
| **Crew** | `index.js` (OllamaCrew) | ✅ **Implementado** |

### **🔧 Function Calling Features:**
- ✅ **Detecção automática** de quando usar tools
- ✅ **Formato JSON** padrão para tool calls
- ✅ **Execução automática** de ferramentas
- ✅ **Resposta final inteligente** baseada no resultado
- ✅ **Múltiplas tools** em uma conversa
- ✅ **Error handling** robusto para tools

## 🔧 Configuração

### **Modelo Ollama:**
- **Modelo**: `gemma3:270m`
- **Endpoint**: `localhost:11434`
- **API**: `/api/chat`

### **Parâmetros:**
```javascript
{
  temperature: 0.1,
  num_ctx: 2048,
  top_p: 0.9,
  top_k: 40
}
```

## 🎓 Vantagens da Arquitetura CrewAI

### ✅ **Function Calling Inteligente (NOVO!)**
- Agente decide automaticamente quando usar ferramentas
- Suporte a múltiplas tools em uma mesma conversa
- Formato JSON simples para tool calls
- Execução automática e resposta final inteligente

### ✅ **Modularidade**
- Cada componente tem responsabilidade única
- Fácil manutenção e extensão
- Reutilização de código

### ✅ **Escalabilidade**
- Adicionar novos agentes facilmente
- Múltiplas tarefas em paralelo
- Gerenciamento de recursos otimizado

### ✅ **Flexibilidade**
- Uso individual ou em conjunto
- Configuração personalizada por tarefa
- Adaptável a diferentes cenários

### ✅ **Padrão da Indústria**
- Compatível com CrewAI framework
- Seguindo melhores práticas 2025
- Pronto para produção

## 🧪 Exemplos Disponíveis

### **📁 Arquivos de Exemplo:**
- `exemplo-simples.js` - Function calling básico
- `demo-tools.js` - Demonstração completa com múltiplas tools
- `demo.js` - Exemplo CrewAI com tarefas múltiplas

### **🚀 Como Executar:**
```bash
# Exemplo simples
node exemplo-simples.js

# Demonstração completa
node demo-tools.js

# Exemplo CrewAI
node demo.js
```

## 🔗 Compatibilidade com Framework Original

Este código é **100% compatível** com:
- ✅ CrewAI Framework oficial
- ✅ Padrões da indústria 2025
- ✅ Arquiteturas multi-agent
- ✅ Sistemas de produção

---

**Desenvolvido seguindo padrão CrewAI 2025 - Arquitetura de agentes autônomos** 🔥
