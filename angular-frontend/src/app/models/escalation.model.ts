import { SafeHtml } from "@angular/platform-browser";
import { Mixed } from "mongoose";

export class Escalation {
    public _Id?: string;
    public title: string;
    public notes: string[] | SafeHtml[];
    public files: string[] | FileList;
    public teamId: string;
    public ownerId: string;
    public ownerName: string;
    public stage: string;

    constructor(title: string, notes: string[] | SafeHtml[], files: string[] | FileList, teamId: string, ownerId: string, ownerName: string, stage: string) {
        this.title = title;
        this.notes = notes;
        this.files = files;
        this.teamId = teamId;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.stage = stage;
    }
}