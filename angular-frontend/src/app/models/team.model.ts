import { Escalation } from "./escalation.model";
import { Update } from "./update.model";
import { User } from "./user.model";

export class Team {
    public id?: string;
    public name: string;
    public escalations: Escalation[];
    public updates: Update[];
    public users: User[];

    constructor(name: string, escalations: Escalation[], updates: Update[], users: User[]) {
        this.name = name;
        this.escalations = escalations;
        this.updates = updates;
        this.users = users
    }
}