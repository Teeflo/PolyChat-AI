# PolyChat-AI Project Context

## Project Overview

**PolyChat-AI** is a modern web-based chat application with artificial intelligence capabilities, designed to provide an exceptional, interactive, and visually unique user experience. Built with cutting-edge web technologies, it emphasizes customization, performance, and accessibility.

### Key Features
- Multi-model access through OpenRouter API
- Multiple visual themes (modern, retro pixel art, hacker interface)
- Real-time streaming responses
- Conversation history with multiple sessions
- Customizable system instructions and conversation tones
- Conversation templates and quick actions
- Usage statistics dashboard
- Responsive design for all devices

### Main Technologies
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 with custom themes
- **State Management**: Zustand for performance-focused state management
- **API Integration**: OpenRouter for access to 100+ language models
- **Build Tool**: Vite for ultra-fast development and build processes

## Project Structure

```
PolyChat-AI/
├── public/                 # Static assets (logo, icons)
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # React components
│   │   ├── Chat/          # Chat window components
│   │   ├── Layout/        # Layout components (Header, Sidebar)
│   │   ├── Onboarding/    # Onboarding components
│   │   ├── Settings/      # Settings components
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React context providers (ChatProvider)
│   ├── data/              # Static data (templates)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Business logic and API services
│   ├── styles/            # CSS styles and themes
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Core Architecture

### State Management
The application uses **Zustand** for state management, with two primary stores:
1. `useChat` - Manages chat sessions, messages, and active conversations
2. `useSettings` - Manages user preferences, API keys, themes, and system settings

### Component Structure
- **App.tsx**: Root component that orchestrates the entire application
- **ChatProvider**: Context provider that initializes the chat store
- **Layout Components**: Header, sidebar, and main content areas
- **Chat Components**: Message bubbles, input areas, model selectors
- **Settings Components**: Modal dialogs for configuration
- **Onboarding Components**: First-time user experience

### Data Flow
1. User interacts with UI components
2. Components call custom hooks (useChat, useSettings)
3. Hooks update Zustand stores
4. Store changes automatically re-render subscribed components
5. Changes are persisted to localStorage via middleware

## Key Services

### OpenRouter Integration (`src/services/openRouter.ts`)
- `fetchAIResponse`: Standard API call to OpenRouter
- `streamAIResponse`: Streaming implementation for real-time responses
- `getTopWeeklyModels`: Fetches trending models from OpenRouter

### Models API (`src/services/modelsApi.ts`)
- `fetchAvailableModels`: Retrieves all available models from OpenRouter
- Model filtering, search, and categorization functions
- Pricing and provider information utilities

### Local Storage (`src/services/localStorage.ts`)
- `saveChatHistory` / `loadChatHistory`: Conversation persistence
- Automatic saving through Zustand subscription

## Custom Hooks

### `useChat` (src/hooks/useChat.ts)
Manages all chat functionality:
- Multiple session support
- Message sending and streaming
- Template application
- Quick actions execution
- Conversation history management

### `useSettings` (src/hooks/useSettings.ts)
Manages user preferences:
- API key and default model
- Theme and accent colors
- System prompts and conversation tone
- Notification settings

### `useModels` (src/hooks/useModels.ts)
Handles model-related functionality:
- Model fetching and filtering
- Provider information
- Search capabilities

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts the development server on `http://localhost:5173`

### Build
```bash
npm run build
```
Creates a production-ready build in the `dist/` directory

### Linting
```bash
npm run lint
```
Checks code quality with ESLint

### Preview
```bash
npm run preview
```
Previews the production build locally

## Key Implementation Details

### Theming System
- CSS variables for color customization
- Data attributes for theme and accent switching
- Multiple predefined themes (dark, light, retro)
- Glassmorphism effects with backdrop filters

### Conversation Templates
- Pre-built templates for different use cases (programming, writing, etc.)
- Template categories with icons and descriptions
- Quick actions for common operations (explain code, optimize, etc.)

### Multi-Model Support
- Ability to compare responses from multiple models simultaneously
- Model switching within conversations
- Trending model detection from OpenRouter

### Performance Considerations
- Streaming responses to reduce perceived latency
- Efficient state management with Zustand
- Virtualized lists for large conversation histories
- Proper cleanup of event listeners and resources

### Security
- API keys stored in localStorage (client-side only)
- Input sanitization for user messages
- Secure communication with OpenRouter API

## Customization Points

### Adding New Templates
1. Update `src/data/templates.ts`
2. Add new template object with required fields
3. Include in appropriate category

### Adding New Themes
1. Update CSS variables in theme files
2. Add new theme class in styles
3. Update theme selector in settings

### Adding New Quick Actions
1. Update `src/data/templates.ts`
2. Add new quick action object
3. Implement in chat input component

## Testing and Quality Assurance

### Code Quality
- TypeScript for type safety
- ESLint with React and TypeScript plugins
- Strict type checking enabled

### Performance Monitoring
- Built-in usage statistics tracking
- Response time measurements
- Model-specific performance metrics

## Deployment

The application is a static web app that can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Traditional web servers

Build process creates optimized static assets in the `dist/` directory.