# create-vrtw

A zero-config CLI to instantly scaffold a modern front-end project with **[Vite](https://vitejs.dev/)**, **[React](https://react.dev/learn)** (JavaScript or TypeScript), and the latest **[Tailwind CSS v4](https://tailwindcss.com/)** using the new **[@tailwindcss/vite](https://tailwindcss.com/docs/installation#vite-plugin)** plugin.  
Unnecessary files and assets are auto-cleaned—so you get a fresh, production-ready workspace in seconds.

## ✨ Features

- **Vite + React + JavaScript/TypeScript**: Fast development, instant HMR, DX-focused stack
- **Tailwind CSS v4**: Latest Tailwind with official Vite integration
- **Automatic Cleanup**: Removes default assets, public files, and App boilerplate
- **Ready-to-Code**: Minimal `App.jsx`/`App.tsx`, empty clean project folder
- **One Command, Super Fast!**

## 🚀 Quick Start

```sh
npx create-vrtw
```

or (if installed globally):

```sh
create-vrtw
```

## 🪄 What Happens?

1. Prompts you for a **project name**
2. Asks if you want **JavaScript or TypeScript**
3. Creates a Vite + React app (chosen language)
4. Installs Tailwind CSS v4 and the new Vite plugin
5. Configures `vite.config.js` or `vite.config.ts` for Tailwind
6. Wipes out unnecessary default files:
   - Deletes: `src/App.css`, `src/assets/`, all of `public/`
   - Cleans/minimizes: `src/App.jsx`/`src/App.tsx` and `src/index.css`
7. Shows next steps — just `cd` and `npm run dev`!

## 🗂️ Example File Structure

```
my-app/
├── public/
├── src/
│   ├── App.jsx / App.tsx    # Cleaned minimal component (depends on your choice)
│   ├── index.css            # Tailwind import
│   ├── main.jsx / main.tsx
│   └── ...
├── vite.config.js / vite.config.ts   # Tailwind Plugin Integrated
├── tsconfig.json?           # Only for TypeScript projects
└── ...
```

## 📝 Minimal Example

**src/App.jsx or src/App.tsx after setup:**

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

## 📚 Documentation

- [Vite](https://vitejs.dev/guide/)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation)

## ❤️ Contribute

Got feedback or want to add features?  
Open an issue or pull request!

## 📄 License

MIT

**Enjoy building fast UIs with zero fuss! 🚀**
