export interface NoteSelection {
    Range : Range | null,
    AnchorNode : Node | null,
    FocusNode : Node | null,
    AnchorOffset : number | null,
    FocusOffset : number | null
}

export class SelectionManager {
    private static currentSelection : NoteSelection = {
        Range: null,
        AnchorNode: null,
        FocusNode : null,
        AnchorOffset: null,
        FocusOffset: null
    };

    public static GetSelection() : NoteSelection {
        return SelectionManager.currentSelection;
    }

    public static UpdateSelection() : void {
        let selection = window.getSelection();
        if (selection == null || selection.anchorNode == null || selection.focusNode == null || selection.anchorNode.parentElement == null) {
            this.currentSelection.Range = null;
            this.currentSelection.AnchorNode = null;
            this.currentSelection.FocusNode = null;
            this.currentSelection.AnchorOffset = null;
            this.currentSelection.FocusOffset = null;
            return;
        }

        if ((selection.anchorNode.parentElement as HTMLElement).closest(".note-page") != null) {
            SelectionManager.currentSelection.Range = selection.getRangeAt(0);
            SelectionManager.currentSelection.AnchorNode = selection.anchorNode;
            SelectionManager.currentSelection.AnchorOffset = selection.anchorOffset;
            SelectionManager.currentSelection.FocusNode = selection.focusNode;
            SelectionManager.currentSelection.FocusOffset = selection.focusOffset;
        }
    }

    public static SetSelection() : void {
        let selection = window.getSelection();
        if (selection === null || selection.type === "caret")
            return;
        selection.removeAllRanges();
        if (SelectionManager.currentSelection.Range !== null)
            selection.addRange(SelectionManager.currentSelection.Range);
    }
}