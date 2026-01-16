export class User {
    id: string;
    email: string;
    name: string;
    lastName: string;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IntegrationStatus {
    telegramStatus: string;
}
