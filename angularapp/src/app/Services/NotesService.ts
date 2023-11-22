import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface NotePreview {
    id: string,
    name: string,
    modifyDate: string,
    preview: string
}

export interface NoteInfo {
    id : string,
    name : string,
    content : string,
    date : string
}

@Injectable()
export class NotesService {
    constructor(private http : HttpClient) {}
    
    private Months : string[] = [ "Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Set", "Oct", "Nov", "Dec" ];

    public Create() : Observable<string> {
        return this.http.post<string>("https://localhost:7216/note/create/", {}, { withCredentials: true, });
    }

    public GetNote(id : string) : Observable<NoteInfo> {
        return this.http.get<NoteInfo>("https://localhost:7216/note/"+ id, { withCredentials: true});
    }

    public Update(id : string, content : string) {
        return this.http.patch("https://localhost:7216/note/update/", { Id: id, Content: content }, { withCredentials: true});
    }

    public Rename(id : string, newName : string) : Observable<boolean> {
        return this.http.patch<boolean>("https://localhost:7216/note/rename/", { Id: id, NewName: newName }, {withCredentials: true});
    }

    public GetNotePreviews() : Observable<NotePreview[]> {
        return this.http.get<Array<NotePreview>>('https://localhost:7216/', {withCredentials: true});
    }

    public GetNoteCount() : Observable<number> {
            return this.http.get<number>('https://localhost:7216/note/count/', {withCredentials: true});
    }

    public Delete(id : string) {
        return this.http.delete('https://localhost:7216/note/delete/', { body: { Id: id }, withCredentials: true});
    }
    
    public CheckDelete(id : string) {
        return this.http.delete('https://localhost:7216/note/checkdelete/', { body: { Id: id }, withCredentials: true});
    }

    public GetNotePreviewDateText(date : Date): string {
        return this.Months[date.getMonth()] + ' ' + date.getDate(); 
    }
}