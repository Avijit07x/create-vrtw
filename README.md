<br>

<div align="center">
  <p align="center" dir="auto">
  <img width="180"  src="https://res.cloudinary.com/dltj8bim0/image/upload/v1761060580/logo_kukwt0.png" alt="vrtw logo" style="max-width: 100%;">
  </p>
  <img  />
  <img src="https://img.shields.io/npm/v/create-vrtw" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/create-vrtw" alt="npm downloads" />
  <img src="https://github.com/avijit07x/create-vrtw/actions/workflows/publish.yml/badge.svg" alt="CI status" />
  <img src="https://img.shields.io/npm/l/create-vrtw" alt="license" />
  <img src="https://img.shields.io/github/stars/avijit07x/create-vrtw?style=social" alt="GitHub stars" />
</div>
<br>

<h1 align="center">create-vrtw</h1>

> Scaffold a modern Vite + React + Tailwind/Bootstrap app in seconds — zero config, one prompt.

A zero-config CLI to instantly scaffold a modern front-end project with **[Vite](https://vitejs.dev/)**, **[React](https://react.dev/learn)** (JavaScript or TypeScript), and your choice of **[Tailwind CSS v4](https://tailwindcss.com/)** (with the new **[@tailwindcss/vite](https://tailwindcss.com/docs/installation#vite-plugin)** plugin) **or [Bootstrap v5](https://getbootstrap.com/)** — or no CSS framework at all.  
Optional extras (with one prompt!): **react-icons, React Router, Redux Toolkit**.  
Unnecessary files and assets are auto-cleaned, so you get a fresh, production-ready workspace in seconds.

## Features

-   **Vite + React + JavaScript/TypeScript**: Fast, modern development stack
-   **CSS Framework Choice**:  
    Choose between **Tailwind CSS v4**, **Bootstrap v5**, or _no CSS framework_
-   **Tailwind v4 with official Vite plugin** or **Bootstrap 5** ready to use instantly
-   **Extra Libraries (optional)**: Add react-icons, React Router, Redux Toolkit, Zustand, and Axios in one step
-   **Automatic Cleanup**: Removes default assets, public files, boilerplate noise
-   **Ready-to-Code**: Minimal `App.jsx` / `App.tsx`, clean folder, and CSS framework imported for you
-   **One Command, Super Fast!**

## Quick Start

_using npm:_

```sh
npm create vrtw
```

_using bun:_

```sh
bun create vrtw
```

_using pnpm:_

```sh
pnpm create vrtw
```

_using yarn:_

```sh
yarn create vrtw
```

_or if installed globally:_

```sh
create-vrtw
```

## What Happens?

1. Prompts for your **project name**
2. Asks: **JavaScript or TypeScript?**
3. **Asks which CSS framework you want to use:**
    - [Tailwind CSS v4](https://tailwindcss.com/docs/installation)
    - [Bootstrap v5](https://getbootstrap.com/docs/)
    - None
4. Optionally: Install
    - [React-Icons](https://react-icons.github.io/react-icons/) (icon library)
    - [React Router](https://reactrouter.com/)
    - [Redux Toolkit](https://redux-toolkit.js.org/) (+ React Redux)
    - [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) (lightweight state manager)
    - [Axios](https://axios-http.com/)
5. Creates a Vite + React app (chosen language)
6. Installs your chosen CSS framework, and configures everything for it:
    - **Tailwind**: Adds plugin, config, template CSS file
    - **Bootstrap**: Installs, auto-imports CSS in main file, cleans up any default index.css
7. Wipes out unnecessary default files:
    - Deletes: `src/App.css`, all of `public/`
    - Cleans/minimizes: `src/App.jsx` / `src/App.tsx` and `src/index.css`
8. Your starting `App` component matches your CSS framework
9. Shows next steps — just `cd` and `npm run dev`!

## Example File Structure

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

## Example App Component (After Setup)

```jsx
function App() {
	return <div>Hello Vite + React + TailwindCSS!</div>;
}

export default App;
```

## Optional Extras

> If you choose at the prompt, the following will also be installed:

-   **[react-icons](https://react-icons.github.io/react-icons/)** (icon components)
-   **[react-router](https://reactrouter.com/)**
-   **[@reduxjs/toolkit](https://redux-toolkit.js.org/) + [react-redux](https://react-redux.js.org/)**
-   **[zustand](https://github.com/pmndrs/zustand)** (lightweight state manager)
-   **[axios](https://axios-http.com/)** (for API requests)

These are **optional** – just answer “yes” at the prompt!

## Documentation

-   [Vite Guide](https://vitejs.dev/guide/)
-   [React Quick Start](https://react.dev/learn)
-   [Tailwind CSS v4](https://tailwindcss.com/docs/installation)
-   [Bootstrap Docs](https://getbootstrap.com/docs/)
-   [React Icons](https://react-icons.github.io/react-icons/)
-   [React Router](https://reactrouter.com/en/main/start/tutorial)
-   [Redux Toolkit](https://redux-toolkit.js.org/)
-   [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
-   [Axios](https://axios-http.com/)

## Contribute

Got feedback or want to add features?  
[Open an issue or pull request!](https://github.com/avijit07x/create-vrtw)

## License

MIT

**Enjoy building fast, clean React UIs—with zero fuss!**
