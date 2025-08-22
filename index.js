require('dotenv').config();

const SmartAIAgent = require('./src/agents/SmartAIAgent');
const LogDataProvider = require('./src/providers/LogDataProvider');
const availableFunctions = require('./src/config/functions');
const API_KEY = process.env.GOOGLE_API_KEY;

module.exports = {
  SmartAIAgent,
  LogDataProvider,
  availableFunctions,
  API_KEY
};
