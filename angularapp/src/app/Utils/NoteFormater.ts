import { NoteSelection } from "../Services/SelectionManager";

// Used to test if the note is being formated correctly
const NoteNodeTypes = {
    DIV: "DIV",
    P: "P",
    SPAN: "SPAN",
    TEXT: "TEXT"
}

interface NoteNode {
    type : string,
    childs : NoteNode[],
    parent : NoteNode | null,
    content: string,
    style: NoteNodeStyles | null
}
//--------------------------------------------------//

export interface NoteNodeStyles {
    fontSize?: number,
}

interface NoteStyleInfo {
    className: string,
    code: string,
}

interface TagInfo {
    tag : string,
    start: number,
    end: number,
}

interface AnchorInfo {
    node : Node,
    offset : number,
}

interface FocusInfo {
    node : Node,
    offset : number,
}

enum ParseMode {
    BEFORE_EDIT_START, MIDDLE_OF_EDIT, AFTER_EDIT_END
}

export class NoteFormater {
    private static noteStyleClasses : NoteStyleInfo[] = [
        { className: "font-", code: "f" } 
    ];
    
    private static focusedElement : HTMLElement | null = null;
    
    public static SetFontSize(fontSize : number, selection : NoteSelection) {
        if (selection.Range == null || selection.AnchorNode == null || selection.FocusNode == null
            || selection.AnchorOffset == null || selection.FocusOffset == null) {
            return;
        }

        const anchor = selection.AnchorNode;
        const focus = selection.FocusNode;
        if (anchor.textContent != null && focus.textContent != null) {
            let start = selection.AnchorOffset;
            let end = selection.FocusOffset;
            const startString = anchor.textContent.substring(0, start);
            const endString = focus.textContent.substring(0, end);
            let percentCount = 0;
            let index = startString.indexOf('%');
            while (index !== -1) {
                percentCount++;
                index = startString.indexOf('%', index + 1);
            }
            start += percentCount;
            percentCount = 0;
            index = endString.indexOf('%');
            while(index !== -1) {
                percentCount++;
                index = endString.indexOf('%', index + 1);
            }
            end += percentCount;


            if (anchor === focus && start > end) {
                let temp = end;
                end = start;
                start = temp;
            }

            let style : NoteNodeStyles = {
                fontSize: fontSize
            };
            let commonAncestor = selection.Range.commonAncestorContainer as HTMLElement;
            if (commonAncestor.nodeName === "#text" && commonAncestor.parentElement) {
                commonAncestor = commonAncestor.parentElement;
            }
            const html = this.StyleSelection(commonAncestor, 
                style, 
                { node: anchor, offset: start }, 
                { node: focus, offset: end }
            );




            if (commonAncestor.nodeName === "SPAN") {
                const parent = commonAncestor.parentElement;
                if (parent) {
                    const firstChild = html[0].firstChild;
                    if (firstChild)
                        parent.replaceChild(firstChild, commonAncestor);
                }
                return;
            }
            else if (commonAncestor.nodeName === "P") {
                const parent = commonAncestor.parentElement;
                if (parent) {
                    const paragrath = html[0];
                    parent.replaceChild(paragrath, commonAncestor);
                }
                return;
            }
            else if (commonAncestor.nodeName === "DIV") {
                while (commonAncestor.childNodes.length > 0) {
                    commonAncestor.removeChild(commonAncestor.childNodes[0]);
                }
                html.forEach(child => {
                    commonAncestor.appendChild(child);
                })
            } else {
                console.error("Unexpected common ancestor ", commonAncestor);
            }
        }
    }

    private static StyleSelection(commonAncestor : HTMLElement, style : NoteNodeStyles, anchorInfo : AnchorInfo, focusInfo : FocusInfo) {
        const original = NoteFormater.ParseNode(commonAncestor);
        anchorInfo.offset = this.FindOffset(commonAncestor, anchorInfo);
        focusInfo.offset = this.FindOffset(commonAncestor, focusInfo);

        const startString = original.substring(0, anchorInfo.offset);
        const middleString = original.substring(anchorInfo.offset, focusInfo.offset);
        const endString = original.substring(focusInfo.offset);
        let parsed = startString + '%s%' + middleString + "%e%" + endString;
        parsed = this.AddStyle(parsed, style);
        const html = this.NoteToHMTL(parsed);
        return html;
    }

    private static AddStyle(noteContent : string, style : NoteNodeStyles) : string {
        let start = 0;
        let end = 0;
        let openPosition = noteContent.indexOf("%s%");
        let closePosition = noteContent.indexOf("%e%", openPosition);
        if (openPosition === -1 || closePosition === -1) {
            console.error("Could not find edit tags in note.");
            return noteContent;
        } 
        let parseMode : ParseMode = ParseMode.BEFORE_EDIT_START;
        let openBeforeTags : TagInfo[] = [];
        let openMiddleTags : TagInfo[] = [];
        let openAfterTags : TagInfo[] = [];
        let removedTag : TagInfo | undefined = undefined;
        let tempContent = noteContent;
        while (end !== -1) {
            start = noteContent.indexOf('%', end);
            end = noteContent.indexOf('%', start + 1);
            if (noteContent[start + 1] === '%') {   
                start = start + 2;
                end = noteContent.indexOf('%', start);
                continue;
            }
            let tag = noteContent.substring(start, end + 1);
            removedTag = undefined;
            if (tag !== "%/%") {
                if (tag !== "%s%" && tag !== "%e%") {
                    switch(parseMode) {
                        case ParseMode.BEFORE_EDIT_START: {
                            openBeforeTags.push({tag, start, end});
                        } break;
                        case ParseMode.MIDDLE_OF_EDIT: {
                            openMiddleTags.push({tag, start, end});
                        } break;
                        case ParseMode.AFTER_EDIT_END: {
                            openAfterTags.push({tag, start, end});
                        }
                    }
                } else {
                    if (tag === "%s%") {
                        parseMode = ParseMode.MIDDLE_OF_EDIT;
                        openPosition = start;
                    } else {
                        parseMode = ParseMode.AFTER_EDIT_END;
                        closePosition = start;
                    }
                }
            } else {
                switch(parseMode) {
                    case ParseMode.BEFORE_EDIT_START: {
                        removedTag = openBeforeTags.pop();
                    } break;
                    case ParseMode.MIDDLE_OF_EDIT: {
                        if (openMiddleTags.length > 0) {
                            let tagInfo = openMiddleTags[openMiddleTags.length -1];
                            let tag = this.ParseTag(tagInfo.tag, style);
                            if (tag === "%%") {
                                tempContent = noteContent.substring(0, tagInfo.start) + noteContent.substring(tagInfo.end + 1, start) + noteContent.substring(end + 1);
                                removedTag = openMiddleTags.pop();
                                start -= tagInfo.tag.length;
                                end = start;
                            } else {
                                console.error("Need to implement this!");
                            }
                        } else {
                            if (openBeforeTags.length > 0) {
                                let tagInfo = openBeforeTags[openBeforeTags.length -1];
                                let tag = this.ParseTag(tagInfo.tag, style);
                                if (tag === "%%") {
                                    tempContent = noteContent.substring(0, openPosition) + "%/%" + 
                                    noteContent.substring(openPosition, start) + noteContent.substring(end + 1);
                                    removedTag = openBeforeTags.pop();
                                    start -= 3;
                                    end -= 3;
                                } else {
                                    console.error("Need to implement this!");
                                }
                            }
                        }
                    } break;
                    case ParseMode.AFTER_EDIT_END: {
                        if (openAfterTags.length > 0) {
                            openAfterTags.pop();
                        } else if (openMiddleTags.length > 0) {
                            let tagInfo = openMiddleTags[openMiddleTags.length -1];
                            let tag = this.ParseTag(tagInfo.tag, style);
                            if (tag === "%%") {
                                tempContent = noteContent.substring(0, tagInfo.start) + noteContent.substring(tagInfo.end + 1, closePosition + 3) + tagInfo.tag + noteContent.substring(closePosition + 3);
                                removedTag = openMiddleTags.pop();
                            } else {
                                console.error("Need to implement this!");
                            }
                        }
                        // Should not need to remove from openBeforeTags
                        // because we are already parsing the common ancestor
                        // for the nodes.
                    } break;
                }
            }
            if (removedTag !== null) {
                noteContent = tempContent;
            }
            start = end + 1;
            end = noteContent.indexOf('%', start);
        }
        //walks over the tags again to find the start and end tags for the edit
        start = 0;
        end = 0;    
        while (end !== -1) {
            start = noteContent.indexOf('%', end);
            end = noteContent.indexOf('%', start + 1);
            if (start === -1)
                break;
            if (noteContent[start + 1] === '%') {   
                start = start + 2;
                end = start;
                continue;
            }
            let tag = noteContent.substring(start, end + 1);
            if (tag === "%s%") {
                openPosition = start;
            } else if (tag === "%e%") {
                closePosition = start;
                break;
            }
            start = end + 1;
            end = noteContent.indexOf('%', start);
        }
        noteContent = noteContent.substring(0, openPosition) + this.BuildTag(style) + noteContent.substring(openPosition + 3, closePosition) + "%/%" + noteContent.substring(closePosition + 3);
        return noteContent.trimEnd();
    }

    private static ParseTag(tag : string, style : NoteNodeStyles) {
        for (let i = 1; i < tag.length - 2; i++) {
            let fStart = 1;
            let fEnd = 1;
            switch(tag[i]) {
                case 'f': {
                    if (style.fontSize) {
                        fStart = i;
                        i++;
                        while(tag[i].charCodeAt(0) >= 48 && tag[i].charCodeAt(0) <= 57) {
                            i++;
                        }
                        fEnd = i;
                        tag = tag.substring(0, fStart) + tag.substring(fEnd, tag.length);
                    }
                } break;
                default: {
                    console.error("Invalid code in tag %s", tag);
                }
            }
        }
        return tag;
    }
    
    private static BuildTag(style : NoteNodeStyles) : string {
        let tag = '%';
        if (style.fontSize)
            tag += `f${style.fontSize}`;
    
        tag += '%';
        return tag;
    }

    private static found = false;
    private static FindOffset(ancestor : Node, info : AnchorInfo | FocusInfo) {
        let offset = info.offset;
        this.found = false;

        offset = this.GetOffsets(ancestor, info, offset);
        return offset;
    }
    
    private static GetOffsets(ancestor : Node, info : AnchorInfo | FocusInfo, offset : number) : number {
        let addOffset = 0;
        if (ancestor !== info.node) {
            if (!this.found) {
                if (ancestor.nodeName === "SPAN") {
                    let tag = this.SpanToTag(ancestor as HTMLSpanElement);
                    addOffset = tag.length;
                } else if (ancestor.nodeName === "#text") {
                    if (ancestor.textContent) {
                        let percentCount = 0;
                        let index = ancestor.textContent.indexOf('%');
                        while (index !== -1) {
                            percentCount++;
                            index = ancestor.textContent.indexOf('%', index + 1);
                        }
                        addOffset = ancestor.textContent.length + percentCount; 
                    }
                }
                if (ancestor.childNodes.length > 0) {
                    ancestor.childNodes.forEach(child => {
                        addOffset = this.GetOffsets(child, info, addOffset);
                    })
                }
            }
        } else {
            this.found = true;
        }
        if (!this.found) {
            if (ancestor.nodeName === "SPAN")
                addOffset += 3;
            if (ancestor.nodeName === "P") {
                addOffset += 2;
            }
        }
        return offset + addOffset;
    }

    private static SpanToTag(span : HTMLSpanElement) : string {
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
                        NoteFormater.noteStyleClasses.forEach(styleClass => {
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

    static error = false;
    public static NoteToHMTL(noteContent : string) {
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

    public static GetSpanStyle(span : HTMLSpanElement) : NoteNodeStyles | null {
        const classes = span.classList;
        if (classes === null)
            return null;

        let spanStyle : NoteNodeStyles = {}; 
        classes.forEach(className => {
            this.noteStyleClasses.forEach(styleName => {
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

    private static TagToStyle(tag : string) : NoteNodeStyles {
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

    private static SetSpanStyles(span : HTMLSpanElement, style : NoteNodeStyles) {
        if (style.fontSize)
            span.classList.add(`font-${style.fontSize}`);
    }

    public static SetFocusedElement(element : HTMLElement | null) {
        this.focusedElement = element;
    }

    public static GetFocusedElement() : HTMLElement | null {
        return this.focusedElement;
    }

    // This functions are used to test if the note is being formated correctly
    private static BuildTree(paragraphs : HTMLParagraphElement[]) : NoteNode {
        let topNode : NoteNode = {
            type: NoteNodeTypes.DIV,
            childs: [],
            parent: null,
            content: "",
            style: null
        };
        paragraphs.forEach(paragraph => {
            let pNode : NoteNode = {
                type: NoteNodeTypes.P,
                childs: [],
                parent: topNode,
                content: "",
                style: null
            };
            if (paragraph.hasChildNodes()) {
                paragraph.childNodes.forEach(node => {
                    let newNode = this.BuildNode(node, pNode);
                    pNode.childs.push(newNode);
                })
            }
            topNode.childs.push(pNode);
        })
        return topNode;
    }

    private static BuildNode(node : Node, parent : NoteNode) : NoteNode {
        let newNode : NoteNode = {
            type: NoteNodeTypes.SPAN,
            childs: [],
            parent: parent,
            content: "",
            style: null
        };
        switch(node.nodeName) {
            case "#text": {
                newNode.type = NoteNodeTypes.TEXT;
                if (node.textContent)
                    newNode.content = node.textContent;
            } break;
            case "SPAN": {
                newNode.type = NoteNodeTypes.SPAN;
            }
        }
        if (node.hasChildNodes()) {
            node.childNodes.forEach(child => {
                newNode.childs.push(this.BuildNode(child, newNode));
            })
        }
        return newNode;
    }
    //--------------------------------------------------------//
}