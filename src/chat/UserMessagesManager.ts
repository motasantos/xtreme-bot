import { ChatCompletionMessageParam } from "openai/resources";
import { redis } from "../lib/redis";
import { initPrompt } from "../utils/initPrompt";

export interface Message {
    role: string;
    content: string;
    dateTime: string;
}

export interface CustomerChat {
    status?: "open" | "closed";
    id: string;
    threadId: string;
    chatAt: string;
    customer: {
        name: string;
        phone: string;
    };
    messages: Message[];
}

export class UserMessagesManager {
    async createOrUpdateChat(customerPhone: string, chatData: Partial<CustomerChat>): Promise<void> {
        const key = `customerChat:${customerPhone}`;
        let chat = await this.getChat(customerPhone);

        if (chat) {
            // Atualizar conversa existente
            chat = { ...chat, ...chatData };
        } else {
            // Criar nova conversa
            chat = {
                ...chatData,
                id: customerPhone,
                chatAt: new Date().toISOString(),
                messages: [
                    {
                        role: "system",
                        content: initPrompt(),
                    },
                ],
            } as CustomerChat;
        }

        // Garanta que o status seja "open" ao criar uma nova conversa
        chat.status = "open";

        // Armazenar o objeto customerChat no Redis
        await redis.set(key, JSON.stringify(chat));
    }

    async getChat(customerPhone: string): Promise<CustomerChat | null> {
        const key = `customerChat:${customerPhone}`;
        try {
            const chatString = await redis.get(key);
            return chatString ? JSON.parse(chatString) : null;
        } catch (error) {
            console.error(`Error parsing chat data for ${customerPhone}:`, error);
            // Handle the error appropriately
            return null;
        }
    }
    

    async closeChat(customerPhone: string): Promise<void> {
        await this.createOrUpdateChat(customerPhone, { status: "closed" });
    }
}
