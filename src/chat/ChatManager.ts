import { UserMessagesManager, Message } from './UserMessagesManager';
import { IChatAdapter } from '../interfaces/IChatAdapter';
import { generateChatResponse } from '../ai/ChatResponseGenerator';
import OpenAIChatManager from '../ai/OpenAiChatManager'; // Importe a nova classe

export class ChatManager {
    private adapter: IChatAdapter;
    private userMessagesManager: UserMessagesManager;
    private openAIChatManager: OpenAIChatManager;

    constructor(adapter: IChatAdapter, userMessagesManager: UserMessagesManager, openAIChatManager: OpenAIChatManager) {
        this.adapter = adapter;
        this.userMessagesManager = userMessagesManager;
        this.openAIChatManager = openAIChatManager; // Use OpenAIChatManager
        this.adapter.onMessage(this.handleMessage.bind(this));
    }

    private async handleMessage(message: any): Promise<void> {
        const customerPhone = message.from;
        let chatState = await this.userMessagesManager.getChat(customerPhone);

        let isNewChatState = false;

        if (!chatState) {
            isNewChatState = true;
            chatState = {
                status: "open",
                id: customerPhone,
                threadId: "", // Defina o threadId, se necessário
                // Remova runId, não é mais necessário
                chatAt: new Date().toISOString(),
                customer: {
                    name: "", // Nome do cliente, se disponível
                    phone: customerPhone
                },
                messages: []
            };
        }

        const receivedMessage: Message = {
            role: 'user',
            content: message.content,
            dateTime: new Date().toISOString()
        };


        // Se for um novo chatState, cria a Thread (e atualiza o customChat)
        if (isNewChatState) {
            const threadId = await this.openAIChatManager.getOrCreateThread(chatState);
        }

        const response = await generateChatResponse(this.openAIChatManager, chatState, receivedMessage);

        const responseMessage: Message = {
            role: 'assistant',
            content: response,
            dateTime: new Date().toISOString()
        };

        chatState.messages.push(receivedMessage, responseMessage);

        await this.userMessagesManager.createOrUpdateChat(customerPhone, chatState);

        console.debug(response);


        await this.adapter.sendMessage(customerPhone, response);
        
    }
}
