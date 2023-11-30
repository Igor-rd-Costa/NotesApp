import { Injectable } from "@angular/core";
import { NoteManager } from "./NoteManager";
import { NoteSelection, SelectionManager } from "./SelectionManager";

export interface NoteNodeStyles {
    fontSize?: number,
}

interface NoteStyleInfo {
    className: string,
    code: string,
}

enum TagOpenState {
    OPEN_BEFORE_CLOSE_AFTER, OPEN_BEFORE_CLOSE_MIDDLE, 
    OPEN_MIDDLE_CLOSE_AFTER, OPEN_MIDDLE_CLOSE_MIDDLE  
}

type NoteTagState = {
    tag : string,
    start : number,
    end : number,
    state : TagOpenState
    remove : boolean
};

@Injectable()
export class NoteFormater {

    constructor(private noteManager : NoteManager) {}

    private static noteStyleClasses : NoteStyleInfo[] = [
        { className: "font-", code: "f" } 
    ];
    
    private focusedElement : HTMLElement | null = null;

    public SetFontSize(fontSize : number) : string {
        const style : NoteNodeStyles = {
            fontSize: fontSize
        };
        return this.StyleSelectionTest(style);
    }

    public StyleSelectionTest(style : NoteNodeStyles) {
        const content = this.noteManager.GetNoteContent();
        const selection = SelectionManager.GetSelection();
        if (selection.Range == null || selection.AnchorNode == null || selection.FocusNode == null
            || selection.AnchorOffset == null || selection.FocusOffset == null) {
            return content;
        }
        if (selection.AnchorNode === selection.FocusNode) {
            if (selection.AnchorOffset > selection.FocusOffset) {
                let temp = selection.FocusOffset;
                selection.FocusOffset = selection.AnchorOffset;
                selection.AnchorOffset = temp;
            }
        }
       
        const page = (selection.AnchorNode.parentElement)?.closest(".note-page");
        if (!page)
            return content;

        SelectionManager.selectionAnchorOffset = selection.AnchorOffset;
        SelectionManager.selectionFocusOffset = selection.FocusOffset;
        this.CalculateStyleOffsets(selection, page);

        let openTags : NoteTagState[] = [];
        (function FindAffectedTags() {
            let foundStart = false;
            let foundEnd = false;
            let openBeforeTags : {tag : string, start : number}[] = [];
            let openMiddleTags : {tag : string, start : number}[] = [];
            let openAfterTags : {tag : string, start : number}[] = [];
            for (let i = 0; i < content.length; i++) {
                if (i === selection.AnchorOffset) {
                    foundStart = true;
                } else if (i === selection.FocusOffset) {
                    foundEnd = true;
                }
                if (content[i] === '%') {
                    if (content[i + 1] === '%') {
                        i++;
                        continue;
                    } else {
                        let tagClose = content.indexOf('%', i + 1);
                        let tag = content.substring(i, tagClose + 1);
                        if (tag !== "%/%") { // is opening tag
                            if (!foundStart) { // before selection
                                openBeforeTags.push({tag, start: i});
                            } else if (!foundEnd) { // middle of selection
                                openMiddleTags.push({tag, start: i});
                            } else { // after selection
                                if (foundEnd && openBeforeTags.length === 0 && openMiddleTags.length === 0 
                                    && openAfterTags.length === 0) {
                                    break;
                                }
                                openAfterTags.push({tag, start: i});
                            }
                        } else { // is closing tag
                            if (!foundStart) { // before selection
                                openBeforeTags.pop();
                            } else if (!foundEnd) { // middle of selection
                                if (openMiddleTags.length > 0) {
                                    let tag = openMiddleTags.pop();
                                    if (tag) {
                                        openTags.push({
                                            tag: tag.tag, 
                                            start: tag.start, 
                                            end: i, 
                                            state: TagOpenState.OPEN_MIDDLE_CLOSE_MIDDLE, 
                                            remove: false
                                        });
                                    }
                                } else if (openBeforeTags.length > 0) {
                                    let tag = openBeforeTags.pop();
                                    if (tag) {
                                        openTags.push({
                                            tag: tag.tag, 
                                            start: tag.start, 
                                            end: i, 
                                            state: TagOpenState.OPEN_BEFORE_CLOSE_MIDDLE, 
                                            remove: false
                                        });
                                    }
                                } 
                            } else { // after selection
                                if (openAfterTags.length > 0) {
                                    openAfterTags.pop();
                                } else if (openMiddleTags.length > 0) {
                                    let tag = openMiddleTags.pop();
                                    if (tag) {
                                        openTags.push({
                                            tag: tag.tag, 
                                            start: tag.start, 
                                            end: i, 
                                            state: TagOpenState.OPEN_MIDDLE_CLOSE_AFTER, 
                                            remove: false
                                        });
                                    }
                                } else if (openBeforeTags.length > 0) {
                                    let tag = openBeforeTags.pop();
                                    if (tag) {
                                        openTags.push({
                                            tag: tag.tag, 
                                            start: tag.start, 
                                            end: i, 
                                            state: TagOpenState.OPEN_BEFORE_CLOSE_AFTER, 
                                            remove: false
                                        });
                                    }
                                }
                            }
                        }
                        i = tagClose;
                    }
                }
            }
        })();
        let newContent = "";
        (function BuildNote(this: NoteFormater) {
            openTags.sort((a, b) => {
                if (a.start < b.start) {
                    return -1;
                } else if (a.start > b.start) {
                    return 1;
                } else {
                    return 0;
                }
            })
            newContent += content.substring(0, selection.AnchorOffset);
            let lastEdit : number = selection.AnchorOffset;
            let closeTagsString : string = "";
            for (let i = 0; i < openTags.length; i++) {
                let openTag = openTags[i];
                if (openTag.state !== TagOpenState.OPEN_BEFORE_CLOSE_AFTER) {
                    let overwrittenTag = this.OverwriteStyles(openTag.tag, style);
                    if (overwrittenTag === "%%") {
                        openTag.remove = true;
                    }
                }
                if (openTag.state === TagOpenState.OPEN_BEFORE_CLOSE_AFTER
                    || openTag.state === TagOpenState.OPEN_BEFORE_CLOSE_MIDDLE) {
                    closeTagsString += "%/%";
                }
            }
            newContent += closeTagsString + this.BuildTag(style);
            for (let i = selection.AnchorOffset; i < content.length; i++) {
                if (i === selection.FocusOffset) {
                    if (i > lastEdit) {
                        newContent += content.substring(lastEdit, i);
                        lastEdit = i;
                    }
                    newContent += "%/%";
                    for (let j = 0; j < openTags.length; j++) {
                        let openTag = openTags[j];
                        if (openTag.state === TagOpenState.OPEN_MIDDLE_CLOSE_AFTER || openTag.state === TagOpenState.OPEN_BEFORE_CLOSE_AFTER) {
                            newContent += openTag.tag;
                        }
                    }
                    newContent += content.substring(lastEdit);
                    break;
                }
                if (content[i] === '\r') {
                    newContent += `${content.substring(lastEdit, i)}%/%\r\n${this.BuildTag(style)}`;
                    i += 2;
                    lastEdit = i;
                }
                if (content[i] === '%') {
                    if (content[i + 1] === '%') {
                        i++;
                        continue;
                    }
                    let tagEnd = content.indexOf('%', i + 1);
                    let tag = content.substring(i, tagEnd + 1);
                    let relatedTagInfo : NoteTagState | null = null;
                    if (tag !== "%/%") {
                        relatedTagInfo = this.GetRelatedTagInfoByStart(openTags, i);
                    } else {
                        relatedTagInfo = this.GetRelatedTagInfoByEnd(openTags, i);
                    }
                    if (relatedTagInfo === null) {
                        i = tagEnd;
                        continue;
                    }
                    if (tag !== "%/%") { // is opening tag
                        if (i > lastEdit) {
                            newContent += content.substring(lastEdit, i);
                            lastEdit = i;
                        }
                        if (relatedTagInfo.remove) {
                            lastEdit += tag.length;
                        } else {
                            // TODO: Implement this when adding more styles
                        }
                    } else { // is closing tag
                        if (relatedTagInfo.state !== TagOpenState.OPEN_MIDDLE_CLOSE_AFTER) {
                            if (relatedTagInfo.remove) {
                                newContent += content.substring(lastEdit, relatedTagInfo.end);
                            } else {
                                // TODO: Implement this when adding more styles
                            }
                            lastEdit = relatedTagInfo.end + 3;
                        }
                    }
                    i = tagEnd;
                }
            }
        }).bind(this)();
        return newContent;
    }

    private CalculateStyleOffsets(selection : NoteSelection, node : Node) {
        let foundStart : boolean = false;
        let foundEnd : boolean = false;
        (function CalculateOffsets (this: NoteFormater, node : Node) {
            if (node === selection.AnchorNode) { // node === anchor
                foundStart = true;
                if (node.textContent) {
                    let percentCount = this.CountStringOccurrences(node.textContent, '%', selection.AnchorOffset); 
                    selection.AnchorOffset += percentCount;
                }
                if (selection.AnchorNode === selection.FocusNode) {
                    foundEnd = true;
                    return;
                }
            } else if (node === selection.FocusNode) { // node === focus
                if (!foundStart) { // !foundStart
                    let tempNode = selection.FocusNode;
                    selection.FocusNode = selection.AnchorNode;
                    selection.AnchorNode = tempNode;
                    
                    let tempOffset = selection.FocusOffset;
                    selection.FocusOffset = selection.AnchorOffset;
                    selection.AnchorOffset = tempOffset;

                    if (node.textContent) {
                        let percentCount = this.CountStringOccurrences(node.textContent, '%', selection.AnchorOffset);
                        selection.AnchorOffset += percentCount;
                    }
                    foundStart = true;
                } else { // foundStart
                    foundEnd = true;
                    if (node.textContent) {
                        let percentCount = this.CountStringOccurrences(node.textContent, '%', selection.FocusOffset); 
                        selection.FocusOffset += percentCount;
                    }
                    return;
                }
            }
            if (node.nodeName === "#text" && node.textContent) {
                let percentCount = this.CountStringOccurrences(node.textContent, '%');
                if (!foundStart) {
                    selection.AnchorOffset += node.textContent.length + percentCount;
                    SelectionManager.selectionAnchorOffset += node.textContent.length;
                }
                selection.FocusOffset += node.textContent.length + percentCount;
                SelectionManager.selectionFocusOffset += node.textContent.length;
            }
            if (node.nodeName === "SPAN") {
                let tag = this.SpanToTag(node as HTMLSpanElement);
                if (!foundStart)
                    selection.AnchorOffset += tag.length;
                selection.FocusOffset += tag.length;
            }
            if (node.hasChildNodes()) {
                node.childNodes.forEach(child => {
                    if (!foundEnd) {
                        CalculateOffsets.bind(this)(child);
                    }
                })
            }
            if (foundStart && foundEnd) {
                return;
            }
            if (node.nodeName === "P") {
                if (!foundStart)
                    selection.AnchorOffset += 2;
                selection.FocusOffset += 2;
            }
            if (node.nodeName === "SPAN") {
                if (!foundStart)
                    selection.AnchorOffset += 3;
                selection.FocusOffset += 3;
            }
        }).bind(this)(node);
    }

    private GetRelatedTagInfoByStart(infoArray : NoteTagState[], start : number) {
        for (let i =0; i < infoArray.length; i++) {
            if (infoArray[i].start === start)
                return infoArray[i];
        }
        return null;
    }

    private GetRelatedTagInfoByEnd(infoArray : NoteTagState[], end : number) {
        for (let i =0; i < infoArray.length; i++) {
            if (infoArray[i].end === end)
                return infoArray[i];
        }
        return null;
    }

    private OverwriteStyles(tag : string, style : NoteNodeStyles) {
        let newTag = "%";
        for (let i = 1; i < tag.length - 2; i++) {
            switch(tag[i]) {
                case 'f': {
                    let end = i + 1;
                    while (tag[end] >= '0' && tag[end] <= '9') {
                        end++;
                    }
                    if (!style.fontSize) {
                        newTag += tag.substring(i, end);    
                    }
                    i = end + 1;
                } break;
            }
        }
        newTag += '%';
        return newTag;
    }

    private CountStringOccurrences(src : string, needle : string, limit : number = -1) : number {
        let index : number = src.indexOf(needle);
        let occurrenceCount : number = 0;
        while (index !== -1 && (index < limit || limit === -1)) {
            occurrenceCount ++;
            index = src.indexOf(needle, index + 1);
        }
        return occurrenceCount;
    }

    private BuildTag(style : NoteNodeStyles) : string {
        let tag = '%';
        if (style.fontSize)
            tag += `f${style.fontSize}`;
    
        tag += '%';
        return tag;
    }

    private SpanToTag(span : HTMLSpanElement) : string {
        let tag = "";
        const classes = span.classList;
        if (classes.length > 0) {
            tag += '%';
            classes.forEach(className => {
                NoteFormater.noteStyleClasses.forEach(styleClass => {
                    if (className.startsWith(styleClass.className)) {
                        tag += styleClass.code + className.replace(styleClass.className, '');
                    }
                })
            })
            tag += '%';
        }
        return tag;
    }

    public static ParseNode(node : Node) : string {
        let content = "";
        switch(node.nodeName) {
            case "#text": {
                content += node.textContent?.replaceAll('%', "%%");
            } break;
            case "SPAN": {
                const element = node as HTMLSpanElement;
                if (element.classList.length > 0) {
                    content += '%';
                    element.classList.forEach(className => {
                        this.noteStyleClasses.forEach(styleClass => {
                            if (className.startsWith(styleClass.className)) {
                                content += `${styleClass.code}${className.replace(styleClass.className, '')}`;
                            }
                        })
                    })
                    content +='%';
                }
            } break;
        }
        if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
                content += this.ParseNode(childNode);
            })
        }
        if (node.nodeName === "SPAN") {
            content += "%/%";
        }
        else if (node.nodeName === "P") {
            content += '\r\n';
        }
        return content;
    }

    private error = false;
    public NoteToHMTL(noteContent : string) {
        const paragraphs = noteContent.split('\r\n');
        let elements : HTMLParagraphElement[] = [];
        let openTags : {tag: string, start: number}[] = [];
        paragraphs.forEach(paragraph => {
            let start = paragraph.indexOf('%');
            let end = 0;
            let pElement = document.createElement("P");
            let currentElement = pElement;
            if (openTags.length > 0) {
                openTags.forEach(tag => {
                    let span = document.createElement("SPAN");
                    this.SetSpanStyles(span, this.TagToStyle(tag.tag));
                    currentElement.appendChild(span);
                    currentElement = span;
                })
            }
            if (start !== -1) {
                while (paragraph[start + 1] === '%') {
                    start = paragraph.indexOf('%', start + 2);
                }
            }
            if (start !== -1) {
                if (start !== 0) {
                    let text = paragraph.substring(0, start).replaceAll("%%", '%');
                    currentElement.appendChild(document.createTextNode(text));
                }
                while (end !== -1 && start !== -1) {
                    if (this.error) {
                        break; 
                    }
                    start = paragraph.indexOf('%', end);
                    while (start !== -1 && paragraph[start + 1] === '%') {
                        start = paragraph.indexOf('%', start + 2);
                    }
                    end = paragraph.indexOf('%', start + 1);
                    if (start === -1) {
                        break;
                    }
                    let tag = paragraph.substring(start, end + 1);
                    if (tag !== "%/%") {
                        openTags.push({tag: tag, start: end+1});
                        let span = document.createElement("SPAN");
                        this.SetSpanStyles(span, this.TagToStyle(tag));
                        currentElement.appendChild(span);
                        currentElement = span;
                        let nextTag = paragraph.indexOf('%', end + 1);
                        while (nextTag !== -1 && paragraph[nextTag + 1] === '%') {
                            nextTag = paragraph.indexOf('%', nextTag + 2);
                        }
                        if (nextTag !== end + 1) {
                            if (nextTag === -1)
                                nextTag = paragraph.length;
                            let text = paragraph.substring(end + 1, nextTag).replaceAll("%%", '%');
                            span.appendChild(document.createTextNode(text));
                        }
                    } else { // Tag === "%/%"
                        openTags.pop();
                        if (currentElement.parentElement) {
                            currentElement = currentElement.parentElement;
                            let nextTag = paragraph.indexOf('%', end + 1);
                            while (nextTag !== -1 && paragraph[nextTag + 1] === '%') {
                                nextTag = paragraph.indexOf('%', nextTag + 2);
                            }
                            if (nextTag !== -1 && nextTag !== end + 1) {
                                let text = paragraph.substring(end + 1, nextTag).replaceAll("%%", '%');
                                currentElement.appendChild(document.createTextNode(text));
                                
                            } else if (nextTag === -1) {
                                nextTag = paragraph.length;
                                if (nextTag !== end + 1) {
                                    let text = paragraph.substring(end + 1, nextTag).replaceAll("%%", '%'); 
                                    currentElement.appendChild(document.createTextNode(text));
                                }
                            }
                        }
                    }
                    start = end + 1;
                    end = paragraph.indexOf('%', start);
                }
            } else { // tag === -1
                pElement.appendChild(document.createTextNode(paragraph.replaceAll("%%", '%')));
            }
            pElement.appendChild(document.createElement("BR"));
            elements.push(pElement as HTMLParagraphElement);
        })
        return elements;
    }

    public GetSpanStyle(span : HTMLSpanElement) : NoteNodeStyles | null {
        const classes = span.classList;
        if (classes === null)
            return null;

        let spanStyle : NoteNodeStyles = {}; 
        classes.forEach(className => {
            NoteFormater.noteStyleClasses.forEach(styleName => {
                if (className.startsWith(styleName.className)) {
                    switch(styleName.code) {
                        case 'f': {
                            spanStyle.fontSize = parseInt(className.replace(styleName.className, ''));
                        } break;
                    }
                }
            })
        })
        return spanStyle;
    }

    private TagToStyle(tag : string) : NoteNodeStyles {
        let style : NoteNodeStyles = {};
        if (!tag.startsWith('%') || !tag.endsWith('%')) {
            console.error("Invalid tag %s!", tag);
            return style;
        }
        let startIndex : number = 1;
        while(startIndex < (tag.length - 1)) {
            switch(tag[startIndex]) {
                case 'f': {
                    startIndex++;
                    let fontSize = "";
                    while (tag[startIndex].charCodeAt(0) >= 48 && tag[startIndex].charCodeAt(0) <= 57) {
                        fontSize += tag[startIndex];
                        startIndex++;
                    }
                    style.fontSize = parseInt(fontSize);
                } break;
                default: {
                    console.error("Tag %s contains invalid characters.", tag);
                    this.error = true;
                    return style;
                }
            }
        }
        return style;
    }

    private SetSpanStyles(span : HTMLSpanElement, style : NoteNodeStyles) {
        if (style.fontSize)
            span.classList.add(`font-${style.fontSize}`);
    }

    public SetFocusedElement(element : HTMLElement | null) {
        this.focusedElement = element;
    }

    public GetFocusedElement() : HTMLElement | null {
        return this.focusedElement;
    }
}