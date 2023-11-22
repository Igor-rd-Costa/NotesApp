export class ClickHighlight {
    ClickStart(event : MouseEvent | TouchEvent) {
        if (event.target === null)
            return;
        const target = event.target as HTMLElement;
        target.classList.add("clicked");
    }

    ClickEnd(event : MouseEvent | TouchEvent) {
        if (event.target === null)
            return;
        const target = event.target as HTMLElement;
        setTimeout(() => {
            target.classList.remove("clicked");
        }, 175);
    }

    MouseOut(event : MouseEvent) {
        if (event.target === null)
            return;
        const target = event.target as HTMLElement;
        target.classList.remove("clicked");
    }
}