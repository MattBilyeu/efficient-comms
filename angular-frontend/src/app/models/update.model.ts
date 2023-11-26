export class Update {
    public teamId: string;
    public title: string;
    public text: string;
    public acknowledged: string[];
    public notAcknowledged: string[];
    public files: string[];

    constructor(teamId: string, title: string, text: string, acknowledged: string[], notAcknowledged: string[], files: string[]) {
        this.teamId = teamId;
        this.title = title;
        this.text = text;
        this.acknowledged = acknowledged;
        this.notAcknowledged = notAcknowledged;
        this.files = files;
    }
}