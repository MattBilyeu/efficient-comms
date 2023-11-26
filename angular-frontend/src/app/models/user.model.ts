export class User {
    public name: string;
    public email: string;
    public role: string;
    public teamId: string;
    public peerReviewer: boolean;

    constructor (name: string, email: string, role: string, teamId: string, peerReviewer: boolean) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.teamId = teamId;
        this.peerReviewer = peerReviewer
    }
}

