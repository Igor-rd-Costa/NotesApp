import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


export interface NotePreview {
    id: number,
    name: string,
    modifyDate: string,
    preview: string
  }

const Months : string[] = [ "Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Set", "Oct", "Nov", "Dec" ]

@Injectable()
export class NotesService {
    notePreviews : NotePreview[] = [];

    constructor(private http : HttpClient) {}

    async GetNotePreviews() : Promise<NotePreview[]> {
        return new Promise<NotePreview[]>(resolve => {
            this.http.get<Array<NotePreview>>('https://localhost:7216/').subscribe(result => {
                for (let i = 0; i < result.length; i++) {
                    result[i].modifyDate = this.GetNotePreviewDateText(new Date(result[i].modifyDate))
                }
                resolve(result);
            })
        })
    }
    
    async GetNoteCount() : Promise<number> {
        return new Promise<number>(resolve => {
            this.http.get<number>('https://localhost:7216/count/').subscribe(result => {
                resolve(result);        
            })
        })
    }

    private GetNotePreviewDateText(date : Date): string {
        return Months[date.getMonth()] + ' ' + date.getDate(); 
    }
}