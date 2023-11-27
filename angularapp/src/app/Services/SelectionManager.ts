export interface NoteSelection {
    Range : Range | null,
    AnchorNode : Node | null,
    FocusNode : Node | null,
    AnchorOffset : number,
    FocusOffset : number
}

export class SelectionManager {
    private static currentSelection : NoteSelection = {
        Range: null,
        AnchorNode: null,
        FocusNode : null,
        AnchorOffset: -1,
        FocusOffset: -1,
    };

    private static selectionNode : Node | null | undefined = null;
    private static selectionOffset : number = -1;

    public static SaveSelection(selection : NoteSelection) {
        const page = document.getElementsByClassName("note-page")[0] as HTMLElement;
        if (page !== undefined) {
            this.selectionOffset = 0;
            SelectionManager.CalculateOffset(page, selection);
        }
    }

    public static RestoreSelection() {
        setTimeout(() => {
            let selection = window.getSelection();
            selection?.removeAllRanges();
            let range : Range = new Range;
            const page = document.getElementsByClassName("note-page")[0] as HTMLElement;
            if (page) {
                SelectionManager.FindAnchor(page);
                if (this.selectionNode) {
                    range.setStart(this.selectionNode, 0)
                    if (this.selectionNode.textContent)
                        range.setEnd(this.selectionNode, this.selectionNode.textContent.length)
                    else 
                        range.setEnd(this.selectionNode, 0)
            
                    selection?.addRange(range);
                }
                this.selectionNode = null;
                this.selectionOffset = -1;                
            }
        }, 100);
    }

    private static CalculateOffset(node : Node, selection : NoteSelection) {
        if (this.selectionNode === undefined) {
            return;
        }
        if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
                SelectionManager.CalculateOffset(childNode, selection);
            })
        }
        if (this.selectionNode === null) {
            if (node === selection.AnchorNode) {
                this.selectionNode = undefined;
                this.selectionOffset += selection.AnchorOffset;    
            } else {
                if (node.nodeName === "#text" && node.textContent) {
                    this.selectionOffset += node.textContent.length;
                }
            }
        }
    }

    private static FindAnchor(node : Node) {
        if (this.selectionNode !== undefined)
            return;

        if (this.selectionOffset <= 0) {
            while (node.nodeName === "SPAN" && node.firstChild) {
                node = node.firstChild;
            }
            this.selectionNode = node;
            return;
        }
        else if (node.nodeName === "#text" && node.textContent) {
            this.selectionOffset -= node.textContent.length;
        }
        if (node.hasChildNodes()) {
            for (let i = 0; i < node.childNodes.length; i++) {
                const childNode = node.childNodes[i];
                SelectionManager.FindAnchor(childNode);
                if (this.selectionNode !== undefined) {
                    break;
                }
            }
        }

        
    }

    public static GetSelection() : NoteSelection {
        return SelectionManager.currentSelection;
    }

    public static ToNoteSelection(selection : Selection | null) : NoteSelection {
        if (selection && selection.getRangeAt && selection.anchorNode && selection.focusNode) {
            return {
                Range: selection.getRangeAt(0),
                AnchorNode: selection.anchorNode,
                FocusNode: selection.focusNode,
                AnchorOffset: selection.anchorOffset,
                FocusOffset: selection.focusOffset,
            }
        }
        else {
            return {
                Range: null,
                AnchorNode: null,
                FocusNode : null,
                AnchorOffset: -1,
                FocusOffset: -1,
            }
        }
    }

    public static UpdateSelection() : void {
        this.currentSelection = SelectionManager.ToNoteSelection(window.getSelection());
    }
}