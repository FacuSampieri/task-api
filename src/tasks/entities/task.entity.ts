import { User } from "../../users/entities/user.entity";

export class Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed'
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: Date;
    user: User;
}
