import { Injectable, signal } from "@angular/core";
import { MarginFormat, NotesService } from "./NotesService";

@Injectable()
export class NoteManager {
    private note = {
        id: signal<number>(-1),
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
            this.noteSettings.backgroundColor.set(noteData.settings.backgroundColor);
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

    public UpdateMarginFormat(newFormat : MarginFormat) {
        this.notesService.UpdateSettings(this.note.guid(), 'marginFormat', newFormat).subscribe(a => {
            this.noteSettings.marginFormat.set(newFormat);
        })
    }

    public UpdateMarginLeft(newVal : string) {
        this.notesService.UpdateSettings(this.note.guid(), 'marginLeft', newVal).subscribe(a => {
            this.noteSettings.marginLeft.set(parseFloat(newVal));
        });
    }

    public UpdateMarginRight(newVal : string) {
        this.notesService.UpdateSettings(this.note.guid(), 'marginRight', newVal).subscribe(a => {
            this.noteSettings.marginRight.set(parseFloat(newVal));
        });
    }

    public UpdateMarginTop(newVal : string) {
        this.notesService.UpdateSettings(this.note.guid(), 'marginTop', newVal).subscribe(a => {
            this.noteSettings.marginTop.set(parseFloat(newVal));
        });
    }

    public UpdateMarginBottom(newVal : string) {
        this.notesService.UpdateSettings(this.note.guid(), 'marginBottom', newVal).subscribe(a => {
            this.noteSettings.marginBottom.set(parseFloat(newVal));
        });
    }

    public UpdateBackgroundColor(newVal : string) {
        if (newVal.length !== 9) {
            console.error("UpdateBackgroundColor: invalid value '" + newVal + "'");
            return;
        }
        this.notesService.UpdateSettings(this.note.guid(), 'backgroundColor', newVal).subscribe(a => {
            this.noteSettings.backgroundColor.set(newVal);
        })
    }


    public TestInfo() {
        console.log(this.note.id());
    }
}