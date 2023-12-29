"use strict";
// src/adapters/VenomWhatsAppAdapter.ts
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
const venom_bot_1 = require("venom-bot");
const ClientType_1 = require("../enums/ClientType");
class VenomWhatsAppAdapter {
    constructor() {
        this.clientType = ClientType_1.ClientType.WhatsApp;
        this.client = null;
        // Outros métodos...
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.client = yield (0, venom_bot_1.create)({
                    session: "xtreme-bot", // Nome da sessão
                    disableWelcome: true, // Desabilitar mensagem de boas-vindas do venom-bot
                    debug: true, // Habilita logs detalhados
                    logQR: true, // Exibe o QR code no console
                    // Outras configurações conforme necessário
                });
                // this.client.onMessage((message) => {
                //     console.log(message);
                // });
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    sendMessage(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error("Cliente WhatsApp não inicializado");
            }
            yield this.client.sendText(chatId, message);
        });
    }
    onMessage(callback) {
        if (this.client) {
            this.client.onMessage((message) => {
                if (!message.body || message.isGroupMsg)
                    return;
                callback(message);
            });
        }
        else {
            console.error("Cliente WhatsApp não foi inicializado.");
        }
    }
}
exports.default = VenomWhatsAppAdapter;
//# sourceMappingURL=VenomWhatsappAdapter.js.map