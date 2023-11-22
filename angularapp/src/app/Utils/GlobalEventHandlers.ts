export interface TouchInfo {
  touchStart: {
    X: number,
    Y: number
  },
  touchMove: {
    X: number,
    Y: number
  },
  touchDelta: {
    X: number,
    Y: number
  },
  wheelDelta: {
    X: number,
    Y: number
  }
}

export const touchInfo : TouchInfo = {
    touchStart: {
      X: -1,
      Y: -1
    },
    touchMove: {
      X: -1,
      Y: -1
    },
    touchDelta: {
      X: -1,
      Y: -1
    },
    wheelDelta: {
        X: -1,
        Y: -1
    }
};

export function ResetTouchInfoData(info : TouchInfo) {
  info.touchStart= { X:-1, Y: -1 };
  info.touchMove = { X:-1, Y: -1 };
  info.touchDelta = { X:-1, Y:-1 };
  info.wheelDelta = { X:-1, Y: -1 };
}

export function HandleTouchStart(event : TouchEvent) : void {
    if (touchInfo.touchStart.X === -1 && touchInfo.touchStart.Y === -1) {
      touchInfo.touchStart.X = event.touches[0].screenX;
      touchInfo.touchStart.Y = event.touches[0].screenY;
    }
}

export function HandleTouchMove(event : TouchEvent) {
    touchInfo.touchMove.X = event.touches[0].screenX;
    touchInfo.touchMove.Y = event.touches[0].screenY;
}

export function HandleTouchEnd() {
    if (touchInfo.touchMove.X === -1 && touchInfo.touchMove.Y === -1) {
        touchInfo.touchDelta.X = 0;
        touchInfo.touchDelta.Y = 0;
    }
    else {
      touchInfo.touchDelta.X = touchInfo.touchMove.X - touchInfo.touchStart.X;
      touchInfo.touchDelta.Y = touchInfo.touchMove.Y - touchInfo.touchStart.Y;
    }

    touchInfo.touchStart.X = -1;
    touchInfo.touchStart.Y = -1;
    touchInfo.touchMove.X = -1;
    touchInfo.touchMove.Y = -1;
}

export function HandleWheel(event : WheelEvent) {
    touchInfo.wheelDelta.X = event.deltaX;
    touchInfo.wheelDelta.Y = event.deltaY;
}

export function UpdateDefaultButtonState() {
  const buttonList = document.getElementsByTagName("BUTTON") as HTMLCollectionOf<HTMLButtonElement>;
  if (buttonList.length === 0)
    return;
  const buttons : HTMLButtonElement[] = [];
  for (let i = 0; i < buttonList.length; i++) {
    if (buttonList[i].classList.contains("default-button")) {
      if (buttonList[i].type === "submit") {
        buttons.push(buttonList[i]);
      } else {
        buttonList[i].classList.add("active-button");
      }
    }
  }
  
  buttons.forEach(button => {
    const form = button.closest("FORM") as HTMLFormElement | null;
    if (form !== null) {
      const inputs = Array.from(form.getElementsByTagName("INPUT")) as HTMLInputElement[];
      let buttonActive = true;
      if (inputs.length === 0) {
        buttonActive = false;
      } else {
        inputs.forEach(input => {
          if (input.required && input.value.trim().length === 0) {
            buttonActive = false;
          }
        })
      }
      if (buttonActive) {
        button.classList.add("active-button");
      } else {
        button.classList.add("inactive-button");
        button.disabled = true;
      }
    }
  })
}