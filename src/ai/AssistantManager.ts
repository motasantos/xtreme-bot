import { ThreadRunManager } from './ThreadRunManager';
import { CustomerChat, Message } from '../chat/UserMessagesManager';
import { redis } from '../lib/redis';
import openaiClient from './OpenaiClient';
import dotenv from 'dotenv';

dotenv.config();

interface AssistantParams {
    id: string;
    name: string;
    instructions: string;
    model: string;
}

export class AssistantManager {
    private key = "assistant:assistant-extreme-fight";
    private assistantId: string | undefined;
    //private threadRunManager: ThreadRunManager;

    constructor() {
//        this.threadRunManager = new ThreadRunManager();
        this.initializeAssistant();
    }



    
    private async initializeAssistant() {
        const assistantData = await redis.get(this.key);
        if (!assistantData) {
            throw new Error("Dados do assistente não encontrados no Redis.");
        }

        const params: AssistantParams = JSON.parse(assistantData);
        try {
            const existingAssistant = await openaiClient.beta.assistants.retrieve(params.id);
            console.debug('ExistingAssistant: ' + existingAssistant);
            this.assistantId = existingAssistant.id;
        } catch {
            const newAssistant = await openaiClient.beta.assistants.create(params);
            console.debug('NewAssistant: ' + newAssistant);
            this.assistantId = newAssistant.id;
            await redis.set(this.key, JSON.stringify({...params, id: newAssistant.id}));
        }
    }

    getAssistantId(): string {
        if (!this.assistantId) {
            throw new Error("Assistant ID is not set");
        }
        return this.assistantId;
    }

    // async sendMessageToAssistant(customerChat: CustomerChat, newMessage: Message): Promise<string> {
    //     if (!this.assistantId) {
    //         throw new Error("Assistant ID is not initialized");
    //     }

    //     try {
    //         console.debug('sendMessageToAssistant: assistantId = ' + this.assistantId + ', customerChat = ' + JSON.stringify(customerChat) + ', newMessage = ' + JSON.stringify(newMessage));

    //         let thread = await this.threadRunManager.checkOrCreateThread(customerChat.threadId);
    //         customerChat.threadId = thread.id;

    //         let run = await this.threadRunManager.createRun(thread.id, this.assistantId);
    //         customerChat.runId = run.id;

    //         const response = await this.threadRunManager.addMessageToThreadAndProcessResponse(thread.id, run.id, newMessage);

    //         // Atualize o CustomerChat no Redis ou onde for armazenado
    //         // Exemplo: await redis.set(customerChat.id, JSON.stringify(customerChat));

    //         return response;
    //     } catch (error) {
    //         console.error("Erro ao enviar mensagem para o Assistente:", error);
    //         throw error;
    //     }
    // }
}
