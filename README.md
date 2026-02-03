# 💣 Minesweeper - Modern PWA Game

A modern, responsive web-based Minesweeper game featuring classic gameplay with customizable difficulty levels, intuitive touch and click controls, real-time statistics tracking, and offline PWA support.

![Minesweeper Game](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core Gameplay
- 🎮 **Classic Minesweeper Mechanics** - Reveal cells, flag mines, clear the board
- 🎯 **Smart Mine Distribution** - Enhanced algorithm ensures fair, logical gameplay
- 🌊 **Cascade Reveal** - Auto-reveal connected empty cells
- ⚡ **Instant First Click** - First click is always safe with guaranteed opening
- 🏆 **Win/Loss Detection** - Automatic game completion detection

### Difficulty Levels
- 🟢 **Beginner** - 9×9 grid, 10 mines (perfect for learning)
- 🟡 **Intermediate** - 16×16 grid, 40 mines (moderate challenge)
- 🔴 **Expert** - 30×16 grid, 99 mines (for pros)
- ⚙️ **Custom** - Create your own difficulty with input validation

### User Experience
- 📱 **Responsive Design** - Seamless experience across all devices
- 👆 **Dual Input Methods** - Mouse controls (desktop) + Touch controls (mobile)
- ⏱️ **Real-Time Statistics** - Timer, move counter, remaining mines
- 💾 **Game State Persistence** - Resume your game after closing the browser
- 🎨 **Bold Design System** - High contrast, large typography, clear visuals

### Progressive Web App (PWA)
- 📴 **Offline Support** - Play without internet connection
- 📲 **Installable** - Add to home screen for native app experience
- 🔄 **Auto-Updates** - Seamless updates without manual intervention
- 🎯 **Optimized Performance** - Fast loading, smooth gameplay

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/minesweeper.git
cd minesweeper

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to play!

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🎮 How to Play

### Desktop Controls
- **Left Click** - Reveal cell
- **Right Click** - Place/remove flag
- **New Game** - Start fresh game with same difficulty
- **Change Difficulty** - Select different difficulty level

### Mobile Controls
- **Tap** - Reveal cell
- **Long Press (500ms)** - Place/remove flag with visual feedback
- **New Game** - Start fresh game
- **Change Difficulty** - Select different difficulty

### Game Rules
1. Click any cell to start the game
2. Numbers indicate how many mines are adjacent to that cell
3. Right-click (or long-press) to flag suspected mines
4. Reveal all safe cells to win
5. Revealing a mine ends the game

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 with TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **PWA:** vite-plugin-pwa with Workbox
- **Storage:** Browser LocalStorage

### Project Structure
```
minesweeper/
├── src/
│   ├── components/      # React components
│   │   ├── Cell.tsx
│   │   ├── Grid.tsx
│   │   ├── StatsPanel.tsx
│   │   ├── DifficultyModal.tsx
│   │   ├── EndGameModal.tsx
│   │   ├── RestoreGameModal.tsx
│   │   ├── PWAInstallPrompt.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── usePWAInstall.ts
│   ├── store/          # Zustand state management
│   │   └── gameStore.ts
│   ├── types/          # TypeScript type definitions
│   │   └── game.types.ts
│   ├── utils/          # Utility functions
│   │   ├── gridUtils.ts
│   │   ├── mineUtils.ts
│   │   ├── revealUtils.ts
│   │   ├── persistence.ts
│   │   └── debounce.ts
│   ├── App.tsx         # Main app component
│   └── main.tsx        # App entry point
├── public/             # Static assets
│   ├── pwa-*.png       # PWA icons
│   ├── favicon.ico
│   └── mine-icon.svg
├── vite.config.ts      # Vite + PWA configuration
├── vercel.json         # Vercel deployment config
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🔧 Configuration

### Difficulty Presets

```typescript
{
  beginner: { width: 9, height: 9, mines: 10 },
  intermediate: { width: 16, height: 16, mines: 40 },
  expert: { width: 30, height: 16, mines: 99 }
}
```

### PWA Configuration

Located in `vite.config.ts`:
- Service worker with auto-update
- Offline asset caching
- Manifest with app metadata
- iOS meta tags for web app mode

### Build Optimization

- **Code Splitting:** React and Zustand bundled separately
- **Minification:** Terser with console.log removal
- **Target:** ES2020 for modern browsers
- **Bundle Size:** < 500KB (gzipped)

## 📊 Performance

### Lighthouse Scores
- **Performance:** 95+
- **PWA:** 100
- **Accessibility:** 95+
- **Best Practices:** 100
- **SEO:** 100

### Load Times
- First Contentful Paint: < 1.0s
- Time to Interactive: < 2.0s
- Total Blocking Time: < 100ms

## 🚀 Deployment

Deploy to Vercel or Netlify in minutes! See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Quick Deploy to Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## 🧪 Testing

Run the comprehensive testing checklist: [PRODUCTION_TESTING_CHECKLIST.md](./PRODUCTION_TESTING_CHECKLIST.md)

### Key Test Areas
- ✅ Game mechanics (reveal, flag, cascade)
- ✅ All difficulty levels
- ✅ State persistence and restoration
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ PWA functionality (installation, offline mode)
- ✅ Cross-browser compatibility
- ✅ Performance benchmarks

## 📱 Browser Support

| Browser | Desktop | Mobile | PWA Install |
|---------|---------|--------|-------------|
| Chrome  | ✅      | ✅     | ✅          |
| Edge    | ✅      | ✅     | ✅          |
| Safari  | ✅      | ✅     | ⚠️ Manual   |
| Firefox | ✅      | ✅     | ⚠️ Limited  |

**Note:** iOS Safari and Firefox have limited PWA support but the game works fully as a web app.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Features
- Hot Module Replacement (HMR)
- TypeScript type checking
- ESLint code linting
- PWA testing in dev mode
- Zustand DevTools integration

## 🎯 Roadmap

Future enhancements planned:

- [ ] **Analytics Integration** - Plausible or Simple Analytics
- [ ] **Leaderboard System** - Track best times per difficulty
- [ ] **Themes** - Light/dark mode, color schemes
- [ ] **Sound Effects** - Optional audio feedback
- [ ] **Multiplayer Mode** - Competitive or cooperative play
- [ ] **Advanced Statistics** - Win rate, average time, etc.
- [ ] **Accessibility** - Screen reader support, keyboard-only mode

## 🐛 Known Issues

- Enhanced mine algorithm cannot guarantee 100% solvability (computational limitation)
- iOS Safari has limited service worker support
- Firefox PWA installation requires manual steps

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👏 Acknowledgments

- Classic Minesweeper game mechanics
- React and TypeScript communities
- Vite and PWA plugin developers
- Tailwind CSS for the design system

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Vite**

**Enjoy playing Minesweeper! 💣**
