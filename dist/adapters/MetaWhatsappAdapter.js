"use strict";
// src/adapters/MetaWhatsAppAdapter.ts
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
const ClientType_1 = require("../enums/ClientType");
class MetaWhatsAppAdapter {
    constructor() {
        this.clientType = ClientType_1.ClientType.WhatsApp;
        // Configuração específica para a API do WhatsApp da Meta
    }
    initialize() {
        throw new Error('Method not implemented.');
    }
    sendMessage(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementação para enviar mensagens usando a API do WhatsApp da Meta
        });
    }
    onMessage(callback) {
        // Implementação para receber mensagens da API do WhatsApp da Meta
    }
}
exports.default = MetaWhatsAppAdapter;
//# sourceMappingURL=MetaWhatsappAdapter.js.map