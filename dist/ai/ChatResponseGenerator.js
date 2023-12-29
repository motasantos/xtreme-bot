"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatResponse = void 0;
const OpenaiClient_1 = __importDefault(require("./OpenaiClient"));
function generateChatResponse(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verifica se 'messages' é uma matriz válida
            if (!Array.isArray(messages)) {
                throw new Error("O parâmetro 'messages' deve ser uma matriz.");
            }
            // Formatando as mensagens no formato esperado
            const formattedMessages = messages.map(message => ({
                role: message.role,
                content: message.content
            }));
            // Cria a resposta do chat
            const response = yield OpenaiClient_1.default.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: formattedMessages // Substitua as mensagens formatadas fornecidas pelo parâmetro
            });
            const choice = response.choices[0];
            if (choice && choice.message && choice.message.content) {
                return choice.message.content.trim();
            }
            else {
                return "Não foi possível gerar uma resposta.";
            }
        }
        catch (error) {
            console.error("Erro ao gerar resposta do ChatGPT:", error);
            return "Desculpe, ocorreu um erro.";
        }
    });
}
exports.generateChatResponse = generateChatResponse;
//# sourceMappingURL=ChatResponseGenerator.js.map