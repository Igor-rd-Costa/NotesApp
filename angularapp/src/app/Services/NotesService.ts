import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface NotePreview {
    guid: string,
    name: string,
    modifyDate: string,
    preview: string
}

export interface NoteSettingsCardInfo {
    guid : string,
    name : string,
    createDate : string,
    modifyDate : string
}

export interface Note {
    id : number,
    userId: number,
    guid: string,
    name : string,
    creationDate : string,
    modifyDate : string, 
    content : string,
}

export interface NoteData {
    note: Note,
    settings: NoteSettings
}

export type NoteSettingsProperty = 'marginFormat' | 'marginLeft' | 'marginRight' | 'marginTop' | 'marginBottom' | 'backgroundColor';

export type MarginFormat = 'px' | 'cm'
export interface NoteSettings {
    id: number,
    noteId: number,
    marginFormat: MarginFormat,
    marginLeft: number,
    marginRight: number,
    marginTop: number,
    marginBottom: number,
    backgroundColor: number,
}

@Injectable()
export class NotesService {
    constructor(private http : HttpClient) {}
    private months : string[] = [ "Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Set", "Oct", "Nov", "Dec" ];

    public Create() : Observable<string> {
        return this.http.post<string>("https://localhost:7216/note/create/", {}, { withCredentials: true, });
    }

    public GetNote(guid : string) {
        return this.http.get<NoteData>("https://localhost:7216/note/"+ guid, { withCredentials: true});
    }

    public GetNoteSettings(guid : string) {
        return this.http.get<NoteSettings>("https://localhost:7216/settings/note/"+ guid, { withCredentials: true});
    }

    public UpdateSettings(guid : string, property : NoteSettingsProperty, newValue : string) {
        return this.http.put("https://localhost:7216/settings/update/", {Guid: guid, Property: property, NewValue: newValue}, {withCredentials: true});
    }

    public Update(guid : string, content : string) {
        return this.http.patch("https://localhost:7216/note/update/", { Guid: guid, Content: content }, { withCredentials: true});
    }

    public Rename(guid : string, newName : string) : Observable<boolean> {
        return this.http.patch<boolean>("https://localhost:7216/note/rename/", { Guid: guid, NewName: newName }, {withCredentials: true});
    }

    public GetNotePreviews() : Observable<NotePreview[]> {
        return this.http.get<Array<NotePreview>>('https://localhost:7216/', {withCredentials: true});
    }

    public GetSettingsNoteCards() : Observable<NoteSettingsCardInfo[]> {
        return this.http.get<Array<NoteSettingsCardInfo>>("https://localhost:7216/notes-settings-cards/", {withCredentials: true});
    }

    public GetNoteCount() : Observable<number> {
            return this.http.get<number>('https://localhost:7216/note/count/', {withCredentials: true});
    }

    public Delete(guid : string) {
        return this.http.delete('https://localhost:7216/note/delete/', { body: { Guid: guid }, withCredentials: true});
    }
    
    public CheckDelete(guid : string) {
        return this.http.delete('https://localhost:7216/note/checkdelete/', { body: { Guid: guid }, withCredentials: true});
    }

    public GetNotePreviewDateText(date : Date): string {
        return this.months[date.getMonth()] + ' ' + date.getDate(); 
    }
}