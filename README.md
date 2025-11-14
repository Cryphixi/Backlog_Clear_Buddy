# Backlog Buddy

Meet **Clear**, your AI-powered gaming schedule assistant that helps you plan when to play games based on your free time and gaming preferences. Clear analyzes your Steam library and creates personalized gaming schedules to help you clear your backlog!

## Features

- **Steam Integration**: Connect your Steam account to analyze your game library
- **AI-Powered Recommendations**: Clear uses Google Gemini AI to analyze your gaming habits and suggest games
- **Schedule Planning**: Input your weekly availability to get personalized gaming schedules
- **Backlog Management**: Prioritize your favorite games or clear out your backlog
- **Cross-Platform**: Available as a web application and downloadable desktop app for Mac and Windows

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Steam account (optional, for full features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Backlog_Clear_Buddy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
GOOGLE_GEMINI_API_KEY=your_api_key_here
STEAM_API_KEY=your_steam_api_key_here
```

### Running the Web Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The web application will be available at `http://localhost:9002`

### Running the Desktop Application

#### Development Mode

```bash
# Start Electron with Next.js dev server
npm run dev:electron
```

#### Building for Production

```bash
# Build for current platform
npm run build:electron

# Build for macOS
npm run build:electron:mac

# Build for Windows
npm run build:electron:win

# Build for both platforms (requires macOS for Mac builds)
npm run build:electron:all
```

Built applications will be in the `dist-electron` directory.

## Project Structure

```
Backlog_Clear_Buddy/
├── electron/           # Electron main process files
│   ├── main.ts        # Main Electron process
│   ├── preload.ts     # Preload script for security
│   └── tsconfig.json  # TypeScript config for Electron
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── page.tsx   # Login page
│   │   └── dashboard/ # Dashboard page
│   ├── components/    # React components
│   ├── services/      # API services (Steam, etc.)
│   └── ai/            # AI integration (Gemini)
├── electron-builder.config.js  # Electron builder configuration
└── next.config.ts     # Next.js configuration
```

## How It Works

1. **Connect Your Steam Account**: Enter your Steam Profile ID to connect your account
2. **Input Your Schedule**: Select your available gaming time slots for the week
3. **Get Recommendations**: Clear analyzes your game library, playtime, and schedule to suggest games
4. **Plan Your Gaming**: Get personalized recommendations from Clear based on your preferences and availability

## Technologies Used

- **Next.js 15**: React framework for web application
- **Electron**: Desktop application framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **Google Gemini AI**: AI-powered game recommendations
- **Steam API**: Game library and player data

## Development

### Scripts

- `npm run dev` - Start Next.js dev server
- `npm run dev:electron` - Start Electron with dev server
- `npm run build` - Build Next.js app for production
- `npm run build:electron` - Build Electron app for current platform
- `npm run build:electron:mac` - Build Electron app for macOS
- `npm run build:electron:win` - Build Electron app for Windows
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
