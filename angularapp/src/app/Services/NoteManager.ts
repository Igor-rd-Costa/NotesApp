import { Injectable, signal } from "@angular/core";
import { NoteInfo, NotesService } from "./NotesService";
import { NoteFormater } from "../Utils/NoteFormater";

@Injectable()
export class NoteManager {
    private note = {
        id: signal<string>(""),
        name: signal<string>(""),
        date: signal<string>(""),
        content: signal<string>("")
    }

    constructor(private notesService : NotesService) {}

    public Load(id : string) : void {
            this.notesService.GetNote(id).subscribe(noteInfo => {
                this.note.id.set(noteInfo.id);
                this.note.name.set(noteInfo.name);
                this.note.date.set(noteInfo.date);
                this.note.content.set(noteInfo.content);
            })
    }

    public GetNoteInfo() : NoteInfo {
        return {
            id: this.note.id(),
            name: this.note.name(),
            date: this.note.date(),
            content: this.note.content()
        };
    }

    public GetNoteId() : string {
        return this.note.id();
    }

    public GetNoteName() : string {
        return this.note.name();
    }

    public GetNoteDate() : string {
        return this.note.date();
    }

    public GetNoteContent() : string {
        return this.note.content();
    }

    public SaveNote() {
        const page = document.getElementsByClassName("note-page")[0];
        if (page === null)
            return;
        
        const content = NoteFormater.ParseNode(page).trimEnd();
        if (this.note.content() !== content) {
            this.notesService.Update(this.note.id(), content).subscribe(() => {
                this.note.content.set(content);
            });
        }
    }
}