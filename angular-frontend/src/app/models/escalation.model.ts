export class Escalation {
    public id?: string;
    public title: string;
    public notes: string[];
    public files: string[] | File[];
    public teamId: string[];
    public ownerId: string;
    public ownerName: string;
    public stage: string;

    constructor(title: string, notes: string[], files: string[], teamId: string[], ownerId: string, ownerName: string, stage: string) {
        this.title = title;
        this.notes = notes;
        this.files = files;
        this.teamId = teamId;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.stage = stage;
    }
}