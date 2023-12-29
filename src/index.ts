import { ChatManager } from './chat/ChatManager';
import { AdapterFactory } from './adapters/AdapterFactory';
import { UserMessagesManager } from './chat/UserMessagesManager';
import OpenAIChatManager from './ai/OpenAiChatManager';


require('dotenv').config();

async function startBot() {
    const adapterName = process.env.ADAPTER_NAME || 'venom';
    const adapter = await AdapterFactory.createAdapter(adapterName);
    const userMessagesManager = new UserMessagesManager();
    await adapter.initialize();

    // Inicialize o OpenAIChatManager
    const openAIChatManager = new OpenAIChatManager();

    // Inicie o ChatManager com o OpenAIChatManager
    const chatManager = new ChatManager(adapter, userMessagesManager, openAIChatManager);

    // Aqui, você pode adicionar qualquer lógica adicional necessária para iniciar o bot
}

startBot().catch(console.error);
