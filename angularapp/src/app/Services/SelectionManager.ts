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

    public static selectionAnchorOffset = -1;
    public static selectionFocusOffset = -1;

    public static RestoreSelection() {
        setTimeout(() => {
            let selection = window.getSelection();
            selection?.removeAllRanges();
            let range : Range = new Range;
            const page = document.getElementsByClassName("note-page")[0] as HTMLElement;
            if (page) {
                const nodes = SelectionManager.FindAnchor(page);
                if (nodes.anchor && nodes.focus && nodes.focus.textContent) {
                   range.setStart(nodes.anchor, 0)
                   range.setEnd(nodes.focus, nodes.focus.textContent.length)
                   selection?.addRange(range);
                }
            }
            SelectionManager.selectionAnchorOffset = -1;
            SelectionManager.selectionFocusOffset = -1;
        }, 100);
    }

    private static FindAnchor(node : Node) {
        let nodes : {anchor: Node | null, focus: Node | null} = {
            anchor: null,
            focus: null
        };
        (function ParseNode(node : Node) {
            if (nodes.anchor && nodes.focus) {
                return;
            }
            if (node.nodeName === "#text" && node.textContent) {
                if (nodes.anchor === null)
                    SelectionManager.selectionAnchorOffset -= node.textContent.length;
                if (nodes.focus === null) {
                    SelectionManager.selectionFocusOffset -= node.textContent.length;
                }
            }
            if (SelectionManager.selectionAnchorOffset <= 0 && nodes.anchor === null) {
                let tempNode = node;
                if (node.nextSibling) {
                    tempNode = node.nextSibling;
                } else if (node.parentElement && node.parentElement.nextSibling) {
                    tempNode = node.parentElement.nextSibling;
                }
                while (tempNode.nodeName === "SPAN" && tempNode.firstChild) {
                    tempNode = tempNode.firstChild;
                }
                nodes.anchor = tempNode;
            }
            if (SelectionManager.selectionFocusOffset <= 0 && nodes.focus === null) {
                let tempNode = node;
                while (tempNode.nodeName === "SPAN" && tempNode.firstChild) {
                    tempNode = tempNode.firstChild;
                }
                nodes.focus = tempNode;
            }


            if (node.hasChildNodes()) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    ParseNode(node.childNodes[i]);
                    if (nodes.anchor && nodes.focus)
                        return;
                }
            }
        })(node);
        return nodes;
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
        SelectionManager.currentSelection = SelectionManager.ToNoteSelection(window.getSelection());
    }
}