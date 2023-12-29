import { Message, CustomerChat } from '../chat/UserMessagesManager';
import { redis } from '../lib/redis';
import { AssistantManager } from './AssistantManager';
import OpenAIChatManager from './OpenAiChatManager';

export async function generateChatResponse(openAIChatManager: OpenAIChatManager, customerChat: CustomerChat, newMessage: Message): Promise<string> {
    try {
        console.debug('generateChatResponse : NewMessage = ' +newMessage)
        // Adiciona a nova mensagem ao histórico de conversas
        customerChat.messages.push(newMessage);


        // Envia a mensagem para o assistente e processa a resposta
        const responseContent = await openAIChatManager.sendMessageAndGetResponse(customerChat, newMessage.content);

        // Atualiza o registro da conversa no Redis com a resposta mais recente
        customerChat.messages.push({ role: 'assistant', content: responseContent, dateTime: new Date().toISOString() });
        await redis.set(customerChat.id, JSON.stringify(customerChat));

        return responseContent;
    } catch (error) {
        console.error("Erro ao gerar resposta do ChatGPT:", error);
        return "Desculpe, ocorreu um erro.";
    }
}