import FileSystemBash from "./fileSystemBash";
import Applications from "./applications";

type Cmd = {
  docs: {
    name: string;
    short: string;
    long: string;
  };
  cmd: (self: Cmd, args: string[], options: string[]) => void;
};

export default function Bash(print: (s: string, md?: boolean) => void) {
  const fileSystem = FileSystemBash();
  let path = { p: fileSystem.goHome() };

  const getApp = Applications(print, path);

  function splitArgs(a: string[]) {
    const args: string[] = [];
    const options: string[] = [];

    a.forEach((v) => {
      if (v === "") return;

      if (v.charAt(0) === "-") {
        options.push(v);
        return;
      }

      args.push(v);
    });

    return [args, options];
  }

  function cmdNotFound(cmdName: string) {
    print(`\n${cmdName}:command not found. type "help" for a list`);
  }

  /**
   * Split a glued command like `show-all` into `show` + `-all`.
   *
   * The CRT's pixel font renders the space in `show -all` narrow enough that
   * it reads as a single hyphenated word, so typing it without the space is a
   * very easy mistake — and the bare "command not found" gave no hint. Only
   * rewrites when the prefix is a real command, so genuine typos still fail.
   */
  function splitGluedOption(
    cmdName: string
  ): { name: string; option: string } | null {
    const i = cmdName.indexOf("-");
    if (i <= 0 || i === cmdName.length - 1) return null;
    const name = cmdName.slice(0, i);
    if (!getApp(name)) return null;
    return { name, option: cmdName.slice(i) };
  }

  function prompt() {
    let out = "";
    for (let i = 0; i < path.p.length; i++) {
      out += path.p[i].name;
      if (i !== 0 && i < path.p.length - 1) out += "/";
    }
    out = out.replace(/^\/home\/user/, "~");
    if (out !== "~") out += " ";
    print(`\nuser:${out}$`);
  }

  function input(cmd: string) {
    cmd = cmd.replaceAll(/\s+/g, " ");
    const cmdSplit = cmd.split(" ");
    const cmdName = cmdSplit[0];
    const cmdArgs: string[] = cmdSplit.slice(1);
    console.log("cmd", cmdName, cmdArgs);

    if (cmd) {
      const app = getApp(cmdName);
      if (app) {
        const [args, options] = splitArgs(cmdArgs);
        app(args, options);
      } else {
        const glued = splitGluedOption(cmdName);
        if (glued) {
          const [args, options] = splitArgs([glued.option, ...cmdArgs]);
          getApp(glued.name)!(args, options);
        } else cmdNotFound(cmdName);
      }
    }

    prompt();
  }

  return { input };
}
