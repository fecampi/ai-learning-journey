class Logger {
  constructor(context = "SmartAIAgent", enabled = true) {
    this.enabled = enabled;
    this.context = context;
  }

  log(...args) {
    if (this.enabled) {
      console.log(`[${this.context}]`, ...args);
    }
  }

  info(...args) {
    if (this.enabled) {
      console.info(`[${this.context}][INFO]`, ...args);
    }
  }

  warn(...args) {
    if (this.enabled) {
      console.warn(`[${this.context}][WARN]`, ...args);
    }
  }

  error(...args) {
    if (this.enabled) {
      console.error(`[${this.context}][ERROR]`, ...args);
    }
  }

  setEnabled(value) {
    this.enabled = value;
  }

  setContext(context) {
    this.context = context;
  }
}

module.exports = Logger;
