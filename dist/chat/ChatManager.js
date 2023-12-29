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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
const ChatResponseGenerator_1 = require("../ai/ChatResponseGenerator");
class ChatManager {
    constructor(adapter, userMessagesManager) {
        this.adapter = adapter;
        this.userMessagesManager = userMessagesManager;
        this.adapter.onMessage(this.handleMessage.bind(this));
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerPhone = message.from;
            let chatState = yield this.userMessagesManager.getChat(customerPhone);
            // Crie uma matriz de mensagens contendo a mensagem recebida
            const userMessage = {
                role: 'user',
                content: message.content,
            };
            const messages = [userMessage];
            const response = yield (0, ChatResponseGenerator_1.generateChatResponse)(messages);
            // Crie uma representação da mensagem de resposta
            const responseMessage = {
                role: 'assistant',
                content: response,
            };
            // Atualiza o histórico de mensagens
            const updatedMessages = [...((chatState === null || chatState === void 0 ? void 0 : chatState.messages) || []), userMessage, responseMessage];
            // Atualiza o estado da conversa no Redis
            yield this.userMessagesManager.createOrUpdateChat(customerPhone, Object.assign(Object.assign({}, chatState), { messages: updatedMessages }));
            // Envia a resposta ao usuário
            yield this.adapter.sendMessage(customerPhone, response);
        });
    }
}
exports.ChatManager = ChatManager;
//# sourceMappingURL=ChatManager.js.map