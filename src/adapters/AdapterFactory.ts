// src/adapters/AdapterFactory.ts

import { IChatAdapter } from "../interfaces/IChatAdapter";
import * as fs from 'fs';
import * as path from 'path';

export class AdapterFactory {
    static async createAdapter(adapterName: string): Promise<IChatAdapter> {
        const configPath = path.resolve(__dirname, '../../config/adapters.json');
        const adapterConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const adapterPath = adapterConfig[adapterName];

        if (!adapterPath) {
            throw new Error(`Adapter não encontrado: ${adapterName}`);
        }

        const modulePath = path.resolve(__dirname, adapterPath);
        const AdapterModule = await import(modulePath);
        return new AdapterModule.default();
    }
}
