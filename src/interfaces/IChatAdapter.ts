// src/adapters/IChatAdapter.ts

export interface IChatAdapter {
    initialize(): Promise<void>; 
    sendMessage(chatId: string, message: string): Promise<void>;
    onMessage(callback: (message: any) => void): void;
    // Outros métodos comuns...
}
