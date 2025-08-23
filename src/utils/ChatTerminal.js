const readline = require('readline');

class ChatTerminal {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  input() {
    return new Promise((resolve) => {
      this.rl.question('User: ', (answer) => {
        resolve(answer);
      });
    });
  }

  output(message) {
    if (typeof message === 'string' && message.trim() === '') {
      console.log('');
    } else {
      console.log(`AI: ${message}`);
    }
  }

  close() {
    this.rl.close();
  }
}

module.exports = ChatTerminal;
