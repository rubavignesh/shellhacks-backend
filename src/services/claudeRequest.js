const { ChatAnthropicMessages } = require("@langchain/anthropic");
const dotenv = require('dotenv');

dotenv.config();

const modelOutput = async (prompt) => {
  const model = new ChatAnthropicMessages({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-3-5-sonnet-20240620",
  });

  try {
    const response = await model.invoke(prompt);
    return response.content;
  } catch (error) {
    console.error('Error invoking model:', error);
    throw error;
  }
};

module.exports = { modelOutput };





