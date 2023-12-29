const { OpenAI } = require("openai");

require('dotenv').config()

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export default openaiClient;