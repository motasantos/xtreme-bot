import { ChatCompletionMessageParam } from "openai/resources";
import { redis } from "../lib/redis";

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

    async getOrCreateChatState(customerPhone: string, message: Message): Promise<CustomerChat> {
        let chat = await this.getChat(customerPhone);
    
        if (!chat) {
            chat = {
                status: "open",
                id: customerPhone,
                threadId: "", // Defina o threadId, se necessário
                chatAt: new Date().toISOString(),
                customer: {
                    name: "", // Nome do cliente, se disponível
                    phone: customerPhone
                },
                messages: [message]
            };
        } else {
            chat.messages.push(message);
        }
    
        await this.createOrUpdateChat(customerPhone, chat);
        return chat;
    }
    
    async createOrUpdateChat(customerPhone: string, chatData: Partial<CustomerChat>): Promise<void> {
        const key = `customerChat:${customerPhone}`;
        let chat = await this.getChat(customerPhone);
    
        if (chat) {
            // Atualize apenas os campos fornecidos em chatData
            Object.assign(chat, chatData);
        } else {
            // Criar nova conversa
            chat = {
                ...chatData,
                id: customerPhone,
                chatAt: new Date().toISOString(),
                messages: [],
            } as CustomerChat;
            
        }
    
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
