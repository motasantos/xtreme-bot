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

        if (!chatState) {
            // Inicialize chatState se for nulo
            chatState = {
                status: "open",
                id: customerPhone,
                threadId: "", // Defina o threadId, se necessário
                chatAt: new Date().toISOString(),
                customer: {
                    name: "", // Nome do cliente, se disponível
                    phone: customerPhone
                },
                messages: []
            };
        }
    
        const isNewChatState = !chatState;
        if (isNewChatState) {
            chatState = { status: "open", id: customerPhone, threadId: "", chatAt: new Date().toISOString(), customer: { name: "", phone: customerPhone }, messages: [] };
        }

        // Adiciona a mensagem recebida ao chatState
        const receivedMessage: Message = { role: 'user', content: message.content, dateTime: new Date().toISOString() };
        chatState.messages.push(receivedMessage);

        // Processa a resposta
        const response = await generateChatResponse(this.openAIChatManager, chatState, receivedMessage);

        // Adiciona a resposta do assistente ao chatState
        const responseMessage: Message = { role: 'assistant', content: response, dateTime: new Date().toISOString() };
        chatState.messages.push(responseMessage);

        // Atualiza o chatState no UserMessagesManager
        await this.userMessagesManager.createOrUpdateChat(customerPhone, chatState);

        // Envia a resposta
        await this.adapter.sendMessage(customerPhone, response);
    }
}
