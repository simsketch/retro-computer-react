# Third-party notice — retro computer

The 3D scene and terminal emulator in this directory, together with the assets
in `public/retro/`, are a port of [retro-computer-website][upstream] by Edward
Hinrichsen, used under the MIT licence reproduced below.

Changes made in this repository:

- ported from Vite to Next.js/webpack (`?raw` imports and `import.meta.glob`
  replaced by the generated `terminal/fileSystemContent.ts`)
- wrapped in a React client component with a full `dispose()` teardown
- pinned to three.js 0.134, whose APIs the scene depends on
- the virtual file system's content replaced with Elon Zito's own, which lives
  in `content/retro-file-system/`
- portrait viewports keep the computer upright instead of rotating it 90°

[upstream]: https://github.com/edhinrichsen/retro-computer-website

---

MIT License

Copyright (c) 2024 Edward Hinrichsen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
