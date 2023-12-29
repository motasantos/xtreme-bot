    // src/adapters/VenomWhatsAppAdapter.ts

import  venom,  { Message, Whatsapp, create } from "venom-bot"
import { IChatAdapter } from '../interfaces/IChatAdapter';
import { ClientType } from "../enums/ClientType";


    export default class VenomWhatsAppAdapter implements IChatAdapter {
        clientType = ClientType.WhatsApp;
        private client: Whatsapp | null = null;

        async initialize(): Promise<void> {

            try {
                this.client = await create({
                    session: "xtreme-bot - " + Math.random(), // Nome da sessão
                    disableWelcome: true,  // Desabilitar mensagem de boas-vindas do venom-bot
                    debug: true, // Habilita logs detalhados
                    logQR: true, // Exibe o QR code no console
    
                    // Outras configurações conforme necessário
                });

                // this.client.onMessage((message) => {
                //     console.log(message);
                // });
            } catch (err) {
                console.error(err);
                throw err;
            }
        }

        async sendMessage(chatId: string, message: string): Promise<void> {
            if (!this.client) {
                throw new Error("Cliente WhatsApp não inicializado");
            }
            await this.client.sendText(chatId, message);
        }

        onMessage(callback: (message: Message) => void): void {
            if (this.client) {
                this.client.onMessage((message) => {
                    if (!message.body || message.isGroupMsg) return
                    callback(message);
                });
            } else {
                console.error("Cliente WhatsApp não foi inicializado.");
            }
            
        }

        // Outros métodos...
    }
