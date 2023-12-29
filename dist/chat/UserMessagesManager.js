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
exports.UserMessagesManager = void 0;
const redis_1 = require("../lib/redis");
const initPrompt_1 = require("../utils/initPrompt");
class UserMessagesManager {
    createOrUpdateChat(customerPhone, chatData) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `customerChat:${customerPhone}`;
            let chat = yield this.getChat(customerPhone);
            if (chat) {
                // Atualizar conversa existente
                chat = Object.assign(Object.assign({}, chat), chatData);
            }
            else {
                // Criar nova conversa
                chat = Object.assign(Object.assign({}, chatData), { id: customerPhone, chatAt: new Date().toISOString(), messages: [
                        {
                            role: "assistant",
                            content: (0, initPrompt_1.initPrompt)(),
                        },
                    ] });
            }
            // Garanta que o status seja "open" ao criar uma nova conversa
            chat.status = "open";
            // Armazenar o objeto customerChat no Redis
            yield redis_1.redis.set(key, JSON.stringify(chat));
        });
    }
    getChat(customerPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `customerChat:${customerPhone}`;
            try {
                const chatString = yield redis_1.redis.get(key);
                console.debug(chatString);
                return chatString ? JSON.parse(chatString) : null;
            }
            catch (error) {
                console.error(`Error parsing chat data for ${customerPhone}:`, error);
                // Handle the error appropriately
                return null;
            }
        });
    }
    closeChat(customerPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createOrUpdateChat(customerPhone, { status: "closed" });
        });
    }
}
exports.UserMessagesManager = UserMessagesManager;
//# sourceMappingURL=UserMessagesManager.js.map