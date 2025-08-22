// =============================================
// CONCEITOS DE AGENTES IA - 
// =============================================

console.log("AI AGENT BASIC CONCEPTS");
console.log("=".repeat(50));

// ========================================
// CONCEITO 1: AGENTE REATIVO
// Resposta direta a estímulos
// ========================================

console.log("\n1. REACTIVE AGENT (Stimulus -> Response)");

function reactiveAgent(stimulus) {
  // Ações configuradas diretamente na função
  const actions = {
    ERROR: () => console.log("ALERT: Error detected"),
    WARNING: () => console.log("MONITOR: Warning registered"),
    INFO: () => console.log("LOG: Information saved"),
    DEBUG: () => console.log("DEBUG: Data collected"),
    DEFAULT: () => console.log("DEFAULT: Unknown event")
  };

  // Executa ação correspondente ao estímulo
  const action = actions[stimulus] || actions.DEFAULT;
  action();
}

// Teste do agente reativo
reactiveAgent("ERROR");
reactiveAgent("WARNING");
reactiveAgent("INFO");
reactiveAgent("UNKNOWN");

// ========================================
// CONCEITO 2: AGENTE COM MEMÓRIA
// Usa histórico para tomar decisões
// ========================================

console.log("\n2. MEMORY AGENT (History -> Decision)");

// Estado da memória (persiste entre chamadas)
const memory = [];

function memoryAgent(event) {
  // Adiciona evento à memória
  memory.push(event);
  
  // Mantém apenas últimos 5 eventos
  if (memory.length > 5) {
    memory.shift();
  }

  // Padrões de detecção configurados na função
  const patterns = [
    {
      name: "error_burst",
      condition: (history) => {
        const lastThree = history.slice(-3);
        return lastThree.filter(e => e === "ERROR").length >= 2;
      },
      action: () => console.log("CRITICAL: Error burst detected")
    },
    {
      name: "recovery_pattern",
      condition: (history) => {
        const lastTwo = history.slice(-2);
        return lastTwo[0] === "ERROR" && lastTwo[1] === "INFO";
      },
      action: () => console.log("RECOVERY: System stabilizing")
    }
  ];

  // Verifica padrões na memória
  for (const pattern of patterns) {
    if (pattern.condition(memory)) {
      pattern.action();
      return;
    }
  }

  // Ação padrão - apenas armazena
  console.log(`MEMORY: ${event} stored (${memory.length} events)`);
}

// Teste do agente com memória
memoryAgent("WARNING");
memoryAgent("ERROR");
memoryAgent("ERROR");  // Detecta explosão de erros
memoryAgent("INFO");   // Detecta recuperação

// ========================================
// CONCEITO 3: AGENTE COM OBJETIVO
// Trabalha em direção a uma meta específica
// ========================================

console.log("\n3. GOAL-BASED AGENT (Goal: 10 points)");

// Estado dos pontos (persiste entre chamadas)
let points = 0;

function goalBasedAgent(level) {
  // Sistema de pontuação configurado na função
  const scoring = {
    INFO: 3,      // Informações valem 3 pontos
    WARNING: 1,   // Avisos valem 1 ponto
    ERROR: 0,     // Erros não somam pontos
    SUCCESS: 5    // Sucessos valem 5 pontos
  };

  // Calcula pontos ganhos
  const pointsGained = scoring[level] || 0;
  points += pointsGained;

  console.log(`${level} (+${pointsGained}) = ${points} points`);

  // Verifica se atingiu a meta
  const target = 10;
  if (points >= target) {
    console.log(`GOAL ACHIEVED! ${points}/${target} points`);
    points = 0; // Reset para novo ciclo
  } else {
    console.log(`Progress: ${points}/${target} points`);
  }
}

// Teste do agente com objetivo
goalBasedAgent("INFO");     // +3 pontos
goalBasedAgent("WARNING");  // +1 ponto
goalBasedAgent("ERROR");    // +0 pontos
goalBasedAgent("INFO");     // +3 pontos
goalBasedAgent("SUCCESS");  // +5 pontos = Meta atingida!

// ========================================
// CONCEITO 4: AGENTE QUE APRENDE
// Melhora decisões através da experiência
// ========================================

console.log("\n4. LEARNING AGENT (Experience -> Knowledge)");

// Base de conhecimento (persiste entre chamadas)
const knowledge = {};

function learningAgent(situation, solution = null) {
  // Se já conhece a situação
  if (knowledge[situation]) {
    console.log(`APPLYING: ${situation} -> ${knowledge[situation]}`);
    return;
  }

  // Se uma solução foi fornecida, aprende
  if (solution) {
    knowledge[situation] = solution;
    console.log(`LEARNING: ${situation} -> ${solution}`);
    return;
  }

  // Situação nova sem solução
  console.log(`UNKNOWN: ${situation} (needs learning)`);
}

// Teste do agente que aprende
learningAgent("VIRUS", "run_antivirus");     // Aprende sobre vírus
learningAgent("CRASH", "restart_system");    // Aprende sobre crashes
learningAgent("VIRUS");                      // Aplica conhecimento
learningAgent("HACK");                       // Situação desconhecida

// ========================================
// RESUMO FINAL
// ========================================

console.log("\n" + "=".repeat(50));
console.log("SUMMARY OF 4 CONCEPTS");
console.log("=".repeat(50));
console.log("1. REACTIVE: Immediate response to stimuli");
console.log("2. MEMORY: Uses history to make decisions");
console.log("3. GOAL: Works towards specific target");
console.log("4. LEARNING: Improves through experience");
console.log("\nCURRENT STATE:");
console.log(`   Memory: ${memory.length} events`);
console.log(`   Points: ${points}/10`);
console.log(`   Knowledge: ${Object.keys(knowledge).length} situations`);
console.log("=".repeat(50));

