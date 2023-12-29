"use strict";
// src/index.ts
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
const ChatManager_1 = require("./chat/ChatManager");
const AdapterFactory_1 = require("./adapters/AdapterFactory");
const UserMessagesManager_1 = require("./chat/UserMessagesManager");
require('dotenv').config();
function startBot() {
    return __awaiter(this, void 0, void 0, function* () {
        const adapterName = process.env.ADAPTER_NAME || 'venom';
        const adapter = yield AdapterFactory_1.AdapterFactory.createAdapter(adapterName);
        const userMessagesManager = new UserMessagesManager_1.UserMessagesManager();
        yield adapter.initialize();
        const chatManager = new ChatManager_1.ChatManager(adapter, userMessagesManager);
    });
}
startBot().catch(console.error);
//# sourceMappingURL=index.js.map