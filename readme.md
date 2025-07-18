# create-vrtw

A zero-config CLI to instantly scaffold a modern front-end project with **[Vite](https://vitejs.dev/)**, **React**, **TypeScript**, and the latest **Tailwind CSS v4** using the new [@tailwindcss/vite](https://tailwindcss.com/docs/installation#vite-plugin) plugin.  
Unnecessary files and assets are auto-cleaned — so you get a fresh, production-ready workspace in seconds.

## ✨ Features

- **Vite + React + TypeScript**: Fast development, instant HMR, DX focused stack
- **Tailwind CSS v4**: Latest Tailwind with official Vite integration
- **Automatic Cleanup**: Removes default assets, public files, and App boilerplate
- **Ready-to-Code**: Minimal `App.tsx`, empty clean project folder
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

1. Prompts you for a project name
2. Creates a Vite + React + TypeScript app
3. Installs Tailwind CSS v4 and the new Vite plugin
4. Configures `vite.config.ts` or `vite.config.js` for Tailwind
5. Wipes out unnecessary default files:
   - Deletes: `src/App.css`, `src/assets/`, all of `public/`
   - Cleans/minimizes: `src/App.tsx` and `src/index.css`
6. Shows next steps — just `cd` and `npm run dev`!

## 🗂️ Example File Structure

```
my-app/
├── public/
├── src/
│   ├── App.tsx           # Cleaned minimal component
│   ├── index.css         # Tailwind import
│   ├── main.tsx
│   └── ...
├── vite.config.ts        # Tailwind Plugin Integrated
├── tsconfig.json
└── ...
```

## 📝 Minimal Example

**src/App.tsx after setup:**

```tsx
function App() {
  return (
    
      Hello Vite + React + TailwindCSS!
    
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
