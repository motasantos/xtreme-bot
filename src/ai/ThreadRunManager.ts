import openaiClient from './OpenaiClient';
import { Thread } from 'openai/resources/beta/threads/threads';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Message } from '../chat/UserMessagesManager';

export class ThreadRunManager {
    async checkOrCreateThread(threadId?: string): Promise<Thread> {
        if (threadId) {
            try {
                const existingThread = await openaiClient.beta.threads.retrieve(threadId);
                return existingThread;
            } catch (error) {
                console.error("Erro ao recuperar Thread existente:", error);
            }
        }
        return await openaiClient.beta.threads.create();
    }

    async createRun(threadId: string, assistantId: string): Promise<Run> {
        try {
            const runParams = { assistant_id: assistantId };
            return await openaiClient.beta.threads.runs.create(threadId, runParams);
        } catch (error) {
            console.error("Erro ao criar Run:", error);
            throw error;
        }
    }

    async addMessageToThreadAndProcessResponse(threadId: string, runId: string, newMessage: Message): Promise<string> {
        try {
            await openaiClient.beta.threads.messages.create(threadId, {
                role: 'user',
                content: newMessage.content
            });

            const runStatus = await this.pollRunStatus(threadId, runId);
            if (runStatus === 'completed') {
                return await this.getLatestAssistantMessage(threadId);
            } else {
                throw new Error(`Run não completou com sucesso. Status: ${runStatus}`);
            }
        } catch (error) {
            console.error("Erro ao adicionar mensagem à Thread e processar resposta:", error);
            throw error;
        }
    }

    async pollRunStatus(threadId: string, runId: string): Promise<string> {
        let runStatus;
        const maxAttempts = 10;
        const delay = 2000;

        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            const run = await openaiClient.beta.threads.runs.retrieve(threadId, runId);
            runStatus = run.status;

            if (['completed', 'failed', 'cancelled'].includes(runStatus)) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return runStatus;
    }

    async getLatestAssistantMessage(threadId: string): Promise<string> {
        try {
            const messages = await openaiClient.beta.threads.messages.list(threadId);
            const lastAssistantMessage = messages.body.data.find((m: { role: string; }) => m.role === 'assistant');

            if (lastAssistantMessage) {
                return lastAssistantMessage.content;
            } else {
                throw new Error("Nenhuma mensagem do assistente encontrada.");
            }
        } catch (error) {
            console.error("Erro ao obter a última mensagem do assistente:", error);
            throw error;
        }
    }
}
