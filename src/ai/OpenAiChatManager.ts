import openaiClient from './OpenaiClient';
import { redis } from '../lib/redis';
import { CustomerChat } from '../chat/UserMessagesManager';


interface AssistantParams {
    id?: string;
    name: string;
    model: string;
    instructions: string;
}

class OpenAIChatManager {

    private key = "assistant:assistant-extreme-fight";
    private assistantId?: string;

    constructor() {
        this.initializeAssistant().catch(error => console.error('Error initializing assistant:', error));
    }

    private async initializeAssistant() {
        const assistantData = await redis.get(this.key);
        if (!assistantData) {
            throw new Error("Dados do assistente não encontrados no Redis.");
        }

        const params: AssistantParams = JSON.parse(assistantData);
        console.log(JSON.stringify(assistantData))

        if (params.id) {
            try {
                const existingAssistant = await openaiClient.beta.assistants.retrieve(params.id);
                this.assistantId = existingAssistant.id;
            } catch {
                // Se não conseguir recuperar, cria um novo
                const newAssistant = await openaiClient.beta.assistants.create(params);
                this.assistantId = newAssistant.id;
                await redis.set(this.key, JSON.stringify({...params, id: newAssistant.id}));
            }
        } else {
            // Se não houver ID, cria um novo assistente
            const newAssistant = await openaiClient.beta.assistants.create(params);
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

    async getOrCreateThread(customerChat: CustomerChat): Promise<string> {
        // Garantir que threadId seja inicializado como uma string vazia se for undefined
        if (!customerChat.threadId) {
            // Se não existir uma thread, crie uma nova
            const thread = await openaiClient.beta.threads.create();
            customerChat.threadId = thread.id;
            await this.saveChatState(customerChat);
        }
    
        // Como agora sabemos que threadId é definido, podemos retorná-lo com segurança
        return customerChat.threadId;
    }
    
    

    async sendMessageAndGetResponse(customerChat: CustomerChat): Promise<string> {
        const threadId = await this.getOrCreateThread(customerChat);
    
        // Pegar o conteúdo da última mensagem do usuário no customerChat
        const lastUserMessage = customerChat.messages[customerChat.messages.length - 1].content;
    
        // Adicionar mensagem à thread
        await openaiClient.beta.threads.messages.create(threadId, {
            role: 'user',
            content: lastUserMessage
        });

        // Iniciar execução com o assistente
        const run = await openaiClient.beta.threads.runs.create(threadId, {
            assistant_id: this.getAssistantId()
        });

        // Aguardar até que a execução esteja concluída
        let runStatus;
        do {
            await new Promise(resolve => setTimeout(resolve, 500)); // Esperar 500ms
            runStatus = (await openaiClient.beta.threads.runs.retrieve(threadId, run.id)).status;
        } while (runStatus !== 'completed');

        // Obter a última mensagem do assistente
        const messages = await openaiClient.beta.threads.messages.list(threadId);
        const lastMessage = messages.body.data.find((m: { role: string; }) => m.role === 'assistant')?.content;

        console.log(JSON.stringify(lastMessage));

        return lastMessage[0].text.value || "Não foi possível obter uma resposta.";
    }

    async saveChatState(customerChat: CustomerChat): Promise<void> {
        await redis.set(`customerChat:${customerChat.id}`, JSON.stringify(customerChat));
    }

    async getChatState(customerId: string): Promise<CustomerChat | null> {
        const rawData = await redis.get(`customerChat:${customerId}`);
        return rawData ? JSON.parse(rawData) : null;
    }
}

export default OpenAIChatManager;
