import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface NotePreview {
    id: number,
    name: string,
    modifyDate: string,
    preview: string
  }

  
  @Injectable()
  export class NotesService {
      constructor(private http : HttpClient) {}
      
    private Months : string[] = [ "Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Set", "Oct", "Nov", "Dec" ];
    
    public GetNotePreviews() : Observable<NotePreview[]> {
        return this.http.get<Array<NotePreview>>('https://localhost:7216/', {withCredentials: true});
    }
    
    public GetNoteCount() : Observable<number> {
            return this.http.get<number>('https://localhost:7216/count/', {withCredentials: true});
    }

    public GetNotePreviewDateText(date : Date): string {
        return this.Months[date.getMonth()] + ' ' + date.getDate(); 
    }
}