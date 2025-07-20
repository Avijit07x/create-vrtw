# create-vrtw

A zero-config CLI to instantly scaffold a modern front-end project with **[Vite](https://vitejs.dev/)**, **[React](https://react.dev/learn)** (JavaScript or TypeScript), and the latest **[Tailwind CSS v4](https://tailwindcss.com/)** using the new **[@tailwindcss/vite](https://tailwindcss.com/docs/installation#vite-plugin)** plugin.  
Optional extras (with one prompt!): **Lucide icons, React Router, Redux Toolkit**.  
Unnecessary files and assets are auto-cleaned, so you get a fresh, production-ready workspace in seconds.

## ✨ Features

-   **Vite + React + JavaScript/TypeScript**: Fast, modern development stack
-   **Tailwind CSS v4**: Latest release with official Vite plugin
-   **Extra Libraries (optional)**: Add [Lucide icons](https://lucide.dev/), [React Router](https://reactrouter.com/), and [Redux Toolkit](https://redux-toolkit.js.org/) in one step
-   **Automatic Cleanup**: Removes default assets, public files, boilerplate noise
-   **Ready-to-Code**: Minimal `App.jsx` / `App.tsx`, clean folder
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
3. Optionally asks to install:
    - [Lucide](https://lucide.dev/) (icon library)
    - [React Router](https://reactrouter.com/)
    - [Redux Toolkit](https://redux-toolkit.js.org/) (+ React Redux)
4. Creates a Vite + React app (chosen language)
5. Installs Tailwind CSS v4 and official Vite plugin
6. Configures `vite.config.js` or `vite.config.ts` for Tailwind
7. Wipes out unnecessary default files:
    - Deletes: `src/App.css`, `src/assets/`, all of `public/`
    - Cleans/minimizes: `src/App.jsx` / `src/App.tsx` and `src/index.css`
8. Shows next steps — just `cd` and `npm run dev`!

## 🗂️ Example File Structure

```
my-app/
├── public/
├── src/
│   ├── App.jsx / App.tsx      # Cleaned minimal
│   ├── index.css              # Tailwind import
│   ├── main.jsx / main.tsx
│   └── ...
├── vite.config.js / vite.config.ts   # Tailwind Plugin Integrated
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
-   [Lucide Icons](https://lucide.dev/)
-   [React Router](https://reactrouter.com/en/main/start/tutorial)
-   [Redux Toolkit](https://redux-toolkit.js.org/)

## ❤️ Contribute

Got feedback or want to add features?  
[Open an issue or pull request!](https://github.com/avijit07x/create-vrtw)

## 📄 License

MIT

**Enjoy building fast, clean React UIs—with zero fuss! 🚀**
