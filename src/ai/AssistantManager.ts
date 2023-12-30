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

    constructor() {
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

}
