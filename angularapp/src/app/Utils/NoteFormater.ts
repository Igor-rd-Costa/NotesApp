import { NoteSelection } from "../Services/SelectionManager";

interface NoteStyleInfo {
    className: string,
    code: string,
}

interface TagInfo {
    name: string
    style: {
        fontSize?: string
    }
}

export interface SpanStyle {
    fontSize?: string
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
        if (selection.AnchorNode.textContent != null && selection.FocusNode.textContent != null) {
            let start = selection.AnchorOffset;
            let end = selection.FocusOffset;
            if (end < start) {
                let temp = start;
                start = end;
                end = temp;
            }
            if (selection.AnchorNode !== selection.FocusNode) {
                const anchor = `${selection.AnchorNode.textContent.substring(0, start)}%f${fontSize}%${selection.AnchorNode.textContent.substring(start)}`;
                selection.AnchorNode.textContent = anchor;
                const focus = `${selection.FocusNode.textContent?.substring(0, end)}%/%${selection.FocusNode.textContent.substring(end)}`;
                selection.FocusNode.textContent = focus;
            }
            else {
                if (start === 0 && end === selection.AnchorNode.textContent.length) {
                    selection.AnchorNode.textContent = `%f${fontSize}%${selection.AnchorNode.textContent}%/%`;
                } else {
                    selection.AnchorNode.textContent = `${selection.AnchorNode.textContent.substring(0, start)}%f${fontSize}%${selection.AnchorNode.textContent.substring(start, end)}%/%${selection.AnchorNode.textContent.substring(end)}`;
                }
            }
        }
    }

    public static ToHTML(noteContent : string) : string {
        let content= "<p>";
        let index = noteContent.indexOf('%');
        if (index === -1) {
            content += `${noteContent}<br></p>`;
            return content;
        }
        if (index > 0) {
            content += noteContent.substring(0, index);
        }
        noteContent = noteContent.replaceAll('\n', "</p><p>");
        let openStart = 0;
        let openEnd = 0;
        while (openEnd !== -1) {
            openStart = noteContent.indexOf('%', openEnd);
            openEnd = noteContent.indexOf('%', openStart + 1);
            let tag = noteContent.substring(openStart, openEnd + 1);
            let tagEnd = noteContent.indexOf('%', openEnd + 1);
            if (tag !== "%/%") {
                let tagInfo = this.GetTagInfo(tag); 
                content += `<${tagInfo.name} class="`;
                if (tagInfo.style.fontSize !== undefined) {
                    content += `font-${tagInfo.style.fontSize}`
                }
                content += `">`
            }
            else {
                content += "</span>";
            }
            if (tagEnd !== -1) {
                content += noteContent.substring(openEnd + 1, tagEnd);
            }
            openStart = openEnd + 1;
            openEnd = noteContent.indexOf('%', openStart);
        }
        content += noteContent.substring(openStart, noteContent.length);
        content += "</p>";
        return content;
    }

    public static ParseNode(node : Node) : string {
        let content = "";
        switch(node.nodeName) {
            case "#text": {
                content += node.nodeValue;
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
            content += '\n';
        }
        return content;
    }

    private static GetTagInfo(tag : string) : TagInfo {
        let tagInfo : TagInfo = { name: "span", style: {}};
        if (!tag.startsWith('%') || !tag.endsWith('%')) {
            console.error("Invalid tag!");
            return tagInfo;
        }
        let startIndex : number = 1;
        while(startIndex < (tag.length - 1)) {
            switch(tag[startIndex]) {
                case 'f': {
                    startIndex++;
                    tagInfo.style.fontSize = "";
                    while (tag[startIndex].charCodeAt(0) >= 48 && tag[startIndex].charCodeAt(0) <= 57) {
                        tagInfo.style.fontSize += tag[startIndex];
                        startIndex++;
                    }
                } break;
                default: {
                    console.error("Tag contains invalid characters!");
                    console.log(tag);
                    return tagInfo;
                }
            }
        }
        return tagInfo;
    }

    public static GetSpanStyle(span : HTMLSpanElement) : SpanStyle | null {
        const classes = span.classList;
        if (classes === null)
            return null;

        let spanStyle : SpanStyle = {}; 
        classes.forEach(className => {
            this.noteStyleClasses.forEach(styleName => {
                if (className.startsWith(styleName.className)) {
                    switch(styleName.code) {
                        case 'f': {
                            spanStyle.fontSize = className.replace(styleName.className, '');
                        } break;
                    }
                }
            })
        })
        return spanStyle;
    }

    public static SetFocusedElement(element : HTMLElement | null) {
        this.focusedElement = element;
    }

    public static GetFocusedElement() : HTMLElement | null {
        return this.focusedElement;
    }

    public static Test() {
        const text = "Hello %f24%this is a %f18%test for me to %f14%try and%/% fix this%/% issue.%/%\nPlease work soon!";
        console.log("Test text:", text);
        const htmlNew = this.ToHTML(text);
        console.log("To HTML:\n", htmlNew);
        const testElement = document.getElementById("test-div");
        if (testElement !== null) {
            testElement.innerHTML = htmlNew;
            console.log("From HTML:", this.ParseNode(testElement));
        }
    }
}