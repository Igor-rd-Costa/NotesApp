import { Injectable, signal } from "@angular/core";
import { MarginFormat, NotesService } from "./NotesService";

@Injectable()
export class NoteManager {
    private note = {
        id: signal<number>(0),
        userId: signal<number>(0),
        guid: signal<string>(""),
        name: signal<string>(""),
        creationDate: signal<string>(""),
        modifyDate: signal<string>(""),
        content: signal<string>(""),
    }
    private noteSettings = {
        marginFormat: signal<MarginFormat>('px'),
        marginLeft: signal<number>(0),
        marginRight: signal<number>(0),
        marginTop: signal<number>(0),
        marginBottom: signal<number>(0),
        backgroundColor: signal<string>("#FFFFFFFF")
    }

    
    constructor(private notesService : NotesService) {}

    public Load(guid : string) : void {
        this.notesService.GetNote(guid).subscribe(noteData => {
            this.note.id.set(noteData.note.id);
            this.note.userId.set(noteData.note.userId);
            this.note.guid.set(noteData.note.guid);
            this.note.name.set(noteData.note.name);
            this.note.creationDate.set(noteData.note.creationDate);
            this.note.modifyDate.set(noteData.note.modifyDate);
            this.note.content.set(noteData.note.content);
            this.noteSettings.marginFormat.set(noteData.settings.marginFormat);
            this.noteSettings.marginLeft.set(noteData.settings.marginLeft);
            this.noteSettings.marginRight.set(noteData.settings.marginRight);
            this.noteSettings.marginTop.set(noteData.settings.marginTop);
            this.noteSettings.marginBottom.set(noteData.settings.marginBottom);
            this.noteSettings.backgroundColor.set(this.BgColorToHex(noteData.settings.backgroundColor));
        })
    }

    public GetNoteId() : number {
        return this.note.id();
    }

    public GetNoteGuid() : string {
        return this.note.guid();
    }

    public GetNoteName() : string {
        return this.note.name();
    }

    public GetNoteDate() : string {
        return this.note.creationDate();
    }

    public GetNoteContent() : string {
        return this.note.content();
    }

    public GetNoteMarginFormat() {
        return this.noteSettings.marginFormat();
    }

    public GetNoteMarginLeft() {
        return this.noteSettings.marginLeft();
    }

    public GetNoteMarginRight() {
        return this.noteSettings.marginRight();
    }

    public GetNoteMarginTop() {
        return this.noteSettings.marginTop();
    }

    public GetNoteMarginBottom() {
        return this.noteSettings.marginBottom();
    }

    public GetNoteBackgroundColor() {
        return this.noteSettings.backgroundColor();
    }

    public SetNoteContent(content : string) : void {
        this.note.content.set(content);
    }

    public SaveNote(newContent : string) {
        const page = document.getElementsByClassName("note-page")[0];
        if (page === null)
            return;

        if (this.note.content() !== newContent) {
            this.notesService.Update(this.note.guid(), newContent).subscribe(() => {
                this.note.content.set(newContent);
            });
        }
    }

    private BgColorToHex(color : number) {
        return "#FFFFFFFF";
    }
}