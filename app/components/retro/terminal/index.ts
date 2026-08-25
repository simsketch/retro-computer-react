import { markdownFiles } from "./fileSystemContent";
import Bash from "./bash";

const titleText = markdownFiles["../file-system/home/user/title/title.md"];
export type Change = {
  type: "add" | "del" | "none";
  loc: number | "end" | "none";
  str: string;
};
export type TerminalElements = {
  canvas: HTMLCanvasElement;
  textarea: HTMLInputElement;
  /**
   * Whether the terminal should currently claim keystrokes typed anywhere on
   * the page. The original site was nothing but the computer, so a bare
   * `keypress` listener on `window` was safe. Here the computer is one section
   * of a longer page, so the host decides when it is allowed to capture.
   */
  isActive: () => boolean;
};

export default function Terminal(
  screenTextEngine: {
    tick: (deltaTime: number, elapsedTime: number) => void;
    userInput: (change: Change, selectionPos: number) => void;
    placeMarkdown: (md: string) => number;
    placeText: (str: string) => number;
    scroll(
      val: number,
      units: "lines" | "px",
      options?: {
        updateMaxScroll: boolean;
        moveView: boolean;
      }
    ): void;
    scrollToEnd: () => void;
    freezeInput: () => void;
  },
  elements: TerminalElements
) {
  const { canvas, textarea, isActive } = elements;
  // One controller for every listener below, so unmounting removes them all.
  const ac = new AbortController();
  const { signal } = ac;
  textarea.value = "";
  textarea.readOnly = true;
  textarea.blur();
  screenTextEngine.placeMarkdown(titleText);
  screenTextEngine.placeText("user:~$");

  const bash = Bash((s, md = false) => {
    if (md) {
      const numOfpx = screenTextEngine.placeMarkdown(s);
      screenTextEngine.scroll(numOfpx, "px", {
        updateMaxScroll: true,
        moveView: false,
      });
      screenTextEngine.scroll(12, "lines", {
        updateMaxScroll: false,
        moveView: true,
      });
    } else {
      const numOfLines = screenTextEngine.placeText(s);
      screenTextEngine.scroll(numOfLines, "lines");
    }
  });

  let oldText = "";
  function onInput() {
    const change = stringEditDistance(oldText, textarea.value);
    oldText = textarea.value;
    if (change) screenTextEngine.userInput(change, selectionOf(textarea));
    screenTextEngine.scrollToEnd();
  }
  textarea.addEventListener("input", onInput, { signal });

  canvas.addEventListener(
    "pointerup",
    (ev) => {
      if (ev.pointerType === "mouse") {
        textarea.readOnly = false;
        textarea.focus({ preventScroll: true });
        textarea.setSelectionRange(lastSelection, lastSelection);
      } else {
        textarea.readOnly = true;
        textarea.blur();
      }
    },
    { signal }
  );
  window.addEventListener("keypress", (e) => {
    // Only claim the keystroke while the computer is on screen — otherwise
    // typing anywhere further down the page would yank focus back up to it.
    if (!isActive()) return;
    if (textarea.readOnly === true || document.activeElement !== textarea) {
      textarea.readOnly = false;
      // preventScroll: the input is offscreen, so a plain focus() would jump
      // the page to it and fight the scroll-driven camera.
      textarea.focus({ preventScroll: true });

      if (e.key.length === 1) {
        textarea.value =
          textarea.value.slice(0, lastSelection) +
          e.key +
          textarea.value.slice(lastSelection);
        lastSelection += 1;
        onInput();
      }
      textarea.setSelectionRange(lastSelection, lastSelection);
    }
    // textarea
    if (e.key === "Enter") {
      screenTextEngine.freezeInput();
      bash.input(textarea.value);

      textarea.value = "";
      const change = stringEditDistance(oldText, textarea.value);
      oldText = textarea.value;
      if (change) screenTextEngine.userInput(change, selectionOf(textarea));
    }
  }, { signal });

  window.addEventListener(
    "keydown",
    (e) => {
      // Same gate as keypress, and additionally only while the terminal holds
      // focus — otherwise Arrow keys would stop scrolling the rest of the page.
      if (!isActive() || document.activeElement !== textarea) return;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          screenTextEngine.scroll(-1, "lines", {
            moveView: true,
            updateMaxScroll: false,
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          screenTextEngine.scroll(1, "lines", {
            moveView: true,
            updateMaxScroll: false,
          });
          break;
      }
    },
    { signal }
  );

  let lastSelection = 0;
  document.addEventListener(
    "selectionchange",
    () => {
      // selectionchange fires for selections anywhere in the document; ignore
      // the ones that have nothing to do with the terminal input.
      if (document.activeElement !== textarea) return;
      if (textarea.selectionStart !== textarea.selectionEnd)
        textarea.setSelectionRange(lastSelection, lastSelection);
      lastSelection = selectionOf(textarea);
      screenTextEngine.userInput(
        { type: "none", loc: "none", str: "" },
        lastSelection
      );
    },
    { signal }
  );

  /** `selectionStart` is nullable on an input; the engine wants a number. */
  function selectionOf(el: HTMLInputElement): number {
    return el.selectionStart ?? el.value.length;
  }

  /** Detach every listener registered above. Called on unmount. */
  function dispose() {
    ac.abort();
  }

  return { dispose };

  function stringEditDistance(oldStr: string, newStr: string) {
    const lenDiff = oldStr.length - newStr.length;

    let change: Change = {
      type: "none",
      loc: "none",
      str: "",
    };
    let op = 0;
    let np = 0;

    if (lenDiff === 0) {
    } else if (lenDiff > 0) {
      change.type = "del";
      while (op < oldStr.length || np < newStr.length) {
        if (op >= oldStr.length) {
          console.error("add and del");
          return;
        }
        if (oldStr.charAt(op) !== newStr.charAt(np)) {
          if (change.loc === "none")
            change.loc = np === newStr.length ? "end" : np;
          change.str += oldStr.charAt(op);
          op++;
        } else {
          op++;
          np++;
        }
      }
    } else if (lenDiff < 0) {
      change.type = "add";
      while (op < oldStr.length || np < newStr.length) {
        if (np >= newStr.length) {
          console.error("add and del");
          return;
        }
        if (oldStr.charAt(op) !== newStr.charAt(np)) {
          if (change.loc === "none")
            change.loc = op === oldStr.length ? "end" : op;
          change.str += newStr.charAt(np);
          np++;
        } else {
          op++;
          np++;
        }
      }
    }
    return change;
  }
}
