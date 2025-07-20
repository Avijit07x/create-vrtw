# create-vrtw

A zero-config CLI to instantly scaffold a modern front-end project with **[Vite](https://vitejs.dev/)**, **[React](https://react.dev/learn)** (JavaScript or TypeScript), and your choice of **[Tailwind CSS v4](https://tailwindcss.com/)** (with the new **[@tailwindcss/vite](https://tailwindcss.com/docs/installation#vite-plugin)** plugin) **or [Bootstrap v5](https://getbootstrap.com/)** — or no CSS framework at all.  
Optional extras (with one prompt!): **Lucide icons, React Router, Redux Toolkit**.  
Unnecessary files and assets are auto-cleaned, so you get a fresh, production-ready workspace in seconds.

## ✨ Features

-   **Vite + React + JavaScript/TypeScript**: Fast, modern development stack
-   **CSS Framework Choice**:  
    Choose between **Tailwind CSS v4**, **Bootstrap v5**, or _no CSS framework_
-   **Tailwind v4 with official Vite plugin** or **Bootstrap 5** ready to use instantly
-   **Extra Libraries (optional)**: Add [Lucide icons](https://lucide.dev/), [React Router](https://reactrouter.com/), and [Redux Toolkit](https://redux-toolkit.js.org/) in one step
-   **Automatic Cleanup**: Removes default assets, public files, boilerplate noise
-   **Ready-to-Code**: Minimal `App.jsx` / `App.tsx`, clean folder, and CSS framework imported for you
-   **One Command, Super Fast!**

## 🚀 Quick Start

```sh
npx create-vrtw
```

_or if installed globally:_

```sh
create-vrtw
```

## 🪄 What Happens?

1. Prompts for your **project name**
2. Asks: **JavaScript or TypeScript?**
3. **Asks which CSS framework you want to use:**
    - [Tailwind CSS v4](https://tailwindcss.com/docs/installation)
    - [Bootstrap v5](https://getbootstrap.com/docs/)
    - None
4. Optionally: Install
    - [Lucide](https://lucide.dev/) (icon library)
    - [React Router](https://reactrouter.com/)
    - [Redux Toolkit](https://redux-toolkit.js.org/) (+ React Redux)
5. Creates a Vite + React app (chosen language)
6. Installs your chosen CSS framework, and configures everything for it:
    - **Tailwind**: Adds plugin, config, template CSS file
    - **Bootstrap**: Installs, auto-imports CSS in main file, cleans up any default index.css
7. Wipes out unnecessary default files:
    - Deletes: `src/App.css`, `src/assets/`, all of `public/`
    - Cleans/minimizes: `src/App.jsx` / `src/App.tsx` and `src/index.css`
8. Your starting `App` component matches your CSS framework
9. Shows next steps — just `cd` and `npm run dev`!

## 🗂️ Example File Structure

```
my-app/
├── public/
├── src/
│   ├── App.jsx / App.tsx      # Cleaned minimal
│   ├── index.css              # Present if Tailwind; empty if Bootstrap/None
│   ├── main.jsx / main.tsx    # Imports Bootstrap CSS if chosen
│   └── ...
├── vite.config.js / vite.config.ts   # Tailwind Plugin integrated if using Tailwind
├── tsconfig.json    # Only for TypeScript projects
└── ...
```

## 🏗️ Example App Component (After Setup)

```jsx
function App() {
    return (
        <div>
            Hello Vite + React + TailwindCSS!
        </div>

    );
}
export default App;
```

## 📦 Optional Extras

> If you choose at the prompt, the following will also be installed:

-   **[lucide-react](https://lucide.dev/icons)** (icon components)
-   **[react-router](https://reactrouter.com/)**
-   **[@reduxjs/toolkit](https://redux-toolkit.js.org/) + [react-redux](https://react-redux.js.org/)**

These are **optional** – just answer “yes” at the prompt!

## 📚 Documentation

-   [Vite Guide](https://vitejs.dev/guide/)
-   [React Quick Start](https://react.dev/learn)
-   [Tailwind CSS v4](https://tailwindcss.com/docs/installation)
-   [Bootstrap Docs](https://getbootstrap.com/docs/)
-   [Lucide Icons](https://lucide.dev/)
-   [React Router](https://reactrouter.com/en/main/start/tutorial)
-   [Redux Toolkit](https://redux-toolkit.js.org/)

## ❤️ Contribute

Got feedback or want to add features?  
[Open an issue or pull request!](https://github.com/avijit07x/create-vrtw)

## 📄 License

MIT

**Enjoy building fast, clean React UIs—with zero fuss! 🚀**