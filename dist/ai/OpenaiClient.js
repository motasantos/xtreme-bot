"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
require('dotenv').config();
if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
}
const openaiClient = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.default = openaiClient;
//# sourceMappingURL=OpenaiClient.js.map