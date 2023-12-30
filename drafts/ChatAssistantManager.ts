import ChatAssistantManager from './ChatAssistantManager';

class ChatManager {
    private assistantManagers: Map<string, ChatAssistantManager>;

    constructor() {
        this.assistantManagers = new Map();
    }

    // Método para obter ou criar uma instância do ChatAssistantManager
    getAssistantManager(instanceIdentifier: string): ChatAssistantManager {
        if (!this.assistantManagers.has(instanceIdentifier)) {
            this.assistantManagers.set(instanceIdentifier, new ChatAssistantManager(instanceIdentifier));
        }
        return this.assistantManagers.get(instanceIdentifier);
    }

    // Métodos adicionais para gerenciar a lógica de encaminhamento de mensagens, controle de sessões, etc.
}

export default ChatManager;
