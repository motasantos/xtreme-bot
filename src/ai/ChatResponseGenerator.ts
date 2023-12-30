import { Message, CustomerChat } from '../chat/UserMessagesManager';
import OpenAIChatManager from './OpenAiChatManager';

export async function generateChatResponse(openAIChatManager: OpenAIChatManager, customerChat: CustomerChat, newMessage: Message): Promise<string> {
    try {
        console.debug('generateChatResponse : NewMessage = ' +newMessage)
              
        // Envia a mensagem para o assistente e processa a resposta
        const responseContent = await openAIChatManager.sendMessageAndGetResponse(customerChat);

        return responseContent;
    } catch (error) {
        console.error("Erro ao gerar resposta do ChatGPT:", error);
        return "Desculpe, ocorreu um erro.";
    }
}
