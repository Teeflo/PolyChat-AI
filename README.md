# PolyChat-AI

**Your customizable, stylish AI chat companion.**

A modern, intuitive interface for interacting with the best language models via OpenRouter.

<!-- Badges -->

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-blue?logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-5.0.7-orange)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Teeflo/PolyChat-AI)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-blue)](https://polychat-ai-xi.vercel.app)

<!-- Quick Links -->

[Live Demo](https://polychat-ai-xi.vercel.app) |
[Features](#features) |
[Installation](#installation) |
[Configuration](#configuration) |
[Usage](#usage) |
[Contributing](#contributing)

---

## About the Project

**PolyChat-AI** is a next-generation AI chat web application designed to deliver an exceptional, interactive, and visually unique user experience. Built with modern web technologies, it emphasizes customization, performance, and accessibility.

### Goals

- **Multi-Model Access**: Connect to **OpenRouter API** for access to 100+ language models (GPT-4, Claude, Gemini, and more)
- **AI Image Generation**: Generate images using multimodal models with automatic retry and fallback
- **RAG Context Enhancement**: Local embeddings for intelligent conversation context
- **Themed Interface**: Multiple visual themes including modern dark/light and retro pixel art styles
- **Optimal Performance**: Modern React architecture with Vite for ultra-fast load times
- **Security**: Secure API key management with local storage
- **Responsive Design**: Interface adapted for all devices (desktop, tablet, mobile)

### Technical Architecture

| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Frontend         | React 19 + TypeScript + Vite               |
| Styling          | Tailwind CSS 4 with custom themes          |
| State Management | Zustand for performant state handling      |
| API              | OpenRouter for language model access       |
| Embeddings       | @xenova/transformers for local RAG         |
| Build Tool       | Vite for ultra-fast development and builds |

---

## Features

### AI & Language Models

- **OpenRouter Integration**: Access to 100+ language models through a single API
- **Popular Models**: GPT-4o, Claude 4 Sonnet, Gemini 2.5 Pro, and many more
- **Real-time Streaming**: Fluid responses with live character count and loading animations
- **Dynamic Model Switching**: Change models mid-conversation seamlessly
- **Multi-Model Chat**: Run up to 3 AI models simultaneously in a grid layout for comparison

### AI Image Generation

Generate images directly within your conversations using multimodal AI models.

| Feature              | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| **Supported Models** | Gemini 2.5 Flash, GPT-4o, Claude 3.5 Sonnet                                  |
| **Size Options**     | 256x256, 512x512, 1024x1024                                                  |
| **Style Presets**    | Natural, Vivid, Digital Art, Photorealistic, Anime, Oil Painting, Watercolor |
| **Mood Settings**    | Bright, Dark, Serene, Dramatic, Playful, Mysterious                          |
| **Lighting Options** | Natural, Studio, Dramatic, Soft, Neon, Golden Hour                           |
| **Smart Features**   | Automatic prompt optimization, retry with fallback models on failure         |

### RAG (Context Enhancement)

Intelligent conversation context using local embeddings for enhanced AI responses.

- **Local Processing**: Uses @xenova/transformers with all-MiniLM-L6-v2 model
- **Privacy-Focused**: All processing done locally, no data sent to external services
- **Smart Context**: Automatically retrieves semantically relevant conversation history
- **Configurable**: Enable/disable in settings based on your needs

### Chat & Conversations

- **Intelligent History**: Save and manage conversations with search functionality
- **Multiple Sessions**: Handle multiple conversations simultaneously
- **Message Regeneration**: Regenerate assistant responses with a single click
- **Inline Model Info**: See which model generated each response

### Templates (16+ Pre-built)

Jump-start conversations with professionally crafted templates across 7 categories:

| Category        | Templates | Examples                                                             |
| --------------- | --------- | -------------------------------------------------------------------- |
| **Programming** | 4         | Advanced Code Review, Debugging, Optimization, Documentation         |
| **Writing**     | 3         | Professional Content Creation, Grammar & Style Review, Email Writing |
| **Analysis**    | 2         | Comprehensive Data Analysis, Market Research & Competitive Analysis  |
| **Creative**    | 2         | Structured Brainstorming, Professional Story Writing                 |
| **Learning**    | 2         | Clear Concept Explanation, Personalized Study Plan                   |
| **Business**    | 2         | Comprehensive Business Strategy, Presentation Preparation            |
| **Personal**    | 2         | SMART Goal Setting, Structured Decision Making                       |

Each template includes:

- Detailed system prompts optimized for the task
- User message templates with placeholders
- Suggested models for best results
- Usage examples

### Quick Actions (10+)

Apply instant transformations to selected text or code:

| Action       | Icon | Description                                 |
| ------------ | ---- | ------------------------------------------- |
| Explain Code | 💡   | Get detailed explanations with examples     |
| Optimize     | ⚡   | Performance and efficiency improvements     |
| Debug        | 🐛   | Systematic bug analysis and solutions       |
| Add Comments | 📝   | Generate comprehensive documentation        |
| Translate    | 🌐   | Multi-language translation                  |
| Summarize    | 📋   | Create concise summaries                    |
| Review       | ✅   | Code and text review with suggestions       |
| Improve      | 🔧   | General quality improvements                |
| Simplify     | 🎯   | Reduce complexity while maintaining meaning |
| Expand       | 📖   | Elaborate and add detail to content         |

### Customization

#### Themes

| Theme      | Description                            |
| ---------- | -------------------------------------- |
| Dark Mode  | Elegant interface with dark background |
| Light Mode | Clean, modern light interface          |
| Pixel Art  | Retro style with animations            |
| Hacker     | Terminal-style with custom cursor      |

#### Accent Colors (8 Options)

Personalize your interface with: **Violet**, **Blue**, **Green**, **Rose**, **Orange**, **Teal**, **Red**, **Cyan**

#### Advanced Settings

- **System Instructions**: Customize AI behavior with custom prompts
- **Conversation Tone**: Neutral, Formal, Friendly, Professional, Enthusiastic
- **Notifications**: Configure alerts for new responses
- **Default Model**: Set your preferred model

### Usage Dashboard

Access detailed usage statistics with `Ctrl + U`:

- **Total Conversations**: Number of conversations created
- **Messages Exchanged**: User and assistant message counts
- **Average Response Time**: Model performance metrics
- **Per-Model Statistics**: Usage breakdown by model

---

## Installation

### Try Online (Recommended)

Experience PolyChat-AI instantly without installing anything:

**Live Demo**: https://polychat-ai-xi.vercel.app

Or deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Teeflo/PolyChat-AI)

### Local Development

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **OpenRouter API Key** (free tier available)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Teeflo/PolyChat-AI.git
   cd PolyChat-AI
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**

   The application will be available at `http://localhost:5173`

---

## Configuration

### API Key Setup

1. **Get your free API key**:
   - Visit [OpenRouter.ai](https://openrouter.ai/)
   - Create a free account
   - Generate your API key

2. **Automatic configuration**:
   - On first launch, a modal will appear
   - Enter your OpenRouter API key
   - The key will be securely stored in `localStorage`

3. **Manual configuration**:
   - Open settings (⚙️ icon)
   - Go to the "API" tab
   - Enter your API key

### Theme Customization

Select from 4 themes and 8 accent colors in the settings panel to match your preferences.

### RAG Configuration

Enable or disable RAG (Retrieval Augmented Generation) in settings. When enabled, the AI will use semantic search to find relevant context from your conversation history.

---

## Usage

### Getting Started

1. **Initial Setup**:
   - Follow the automatic onboarding
   - Enter your OpenRouter API key
   - Choose your preferred model

2. **Start a Conversation**:
   - Click "New Conversation"
   - Select a model (optional)
   - Start typing your message

### Using Templates

1. Click the template icon in the chat input
2. Browse categories or search for specific templates
3. Select a template to apply its system prompt
4. Fill in the placeholder fields
5. Send your message

### Using Quick Actions

1. Type or paste your code/text in the chat
2. Click on a quick action button
3. The action will be applied with optimized prompts
4. Receive AI-enhanced results

### Multi-Model Chat

1. Click the multi-model icon to enable grid view
2. Select up to 3 different models
3. Send a message to compare responses side-by-side
4. Each response shows which model generated it

### Image Generation

1. Use a prompt like "Generate an image of..."
2. Select an image-capable model (Gemini 2.5 Flash, GPT-4o, etc.)
3. The system will automatically optimize your prompt
4. If generation fails, fallback models will be tried automatically

### Keyboard Shortcuts

| Shortcut       | Action               |
| -------------- | -------------------- |
| `Ctrl/Cmd + U` | Open usage dashboard |
| `Ctrl/Cmd + K` | Open settings        |
| `Ctrl/Cmd + N` | New conversation     |
| `Ctrl/Cmd + S` | Save conversation    |
| `Ctrl/Cmd + /` | Show help            |

---

## Project Structure

```
PolyChat-AI/
├── public/                    # Static files (logo, icons, etc.)
├── src/
│   ├── assets/               # Resources (images, etc.)
│   ├── components/           # React components
│   │   ├── Chat/             # Chat window and features
│   │   ├── Layout/           # Layout components (Header, Sidebar)
│   │   ├── Settings/         # Settings components
│   │   ├── Onboarding/       # First-launch components
│   │   └── ui/               # Generic UI components
│   ├── context/              # React context (ChatProvider)
│   ├── data/                 # Static data (conversation templates)
│   ├── hooks/                # Custom hooks (useChat, useSettings, etc.)
│   ├── services/             # Business logic and API calls
│   │   ├── openRouter.ts     # OpenRouter API + image generation
│   │   ├── ragService.ts     # RAG with local embeddings
│   │   ├── modelsApi.ts      # Model fetching and filtering
│   │   └── localStorage.ts   # Data persistence
│   ├── styles/               # CSS files and global themes
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Root application component
│   └── main.tsx              # Application entry point
├── .gitignore
├── .prettierrc               # Prettier configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
├── README.md                 # This file
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

---

## Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start development server            |
| `npm run build`   | TypeScript check + production build |
| `npm run preview` | Preview production build locally    |
| `npm run lint`    | Check code quality with ESLint      |
| `npm run format`  | Format code with Prettier           |

### Development Workflow

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Production build
npm run build

# Check code quality
npm run lint

# Format code
npm run format
```

---

## Contributing

Contributions are what make the open-source community thrive. Any contribution you make will be **greatly appreciated**.

### How to Contribute

1. **Report a Bug**
   - Open an issue with the "bug" tag
   - Describe the problem in detail
   - Include steps to reproduce

2. **Suggest an Enhancement**
   - Open an issue with the "enhancement" tag
   - Explain your idea and its benefits
   - Discuss implementation approach

3. **Submit Code**
   - Fork the project
   - Create a feature branch
   - Commit your changes
   - Open a Pull Request

### Contribution Process

1. **Fork the Project**

   ```bash
   git clone https://github.com/YOUR_USERNAME/PolyChat-AI.git
   cd PolyChat-AI
   ```

2. **Create your feature branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'feat: Add AmazingFeature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Code Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured linting rules
- **Prettier**: Format code before committing
- **Commits**: Use conventional commit messages
- **Tests**: Add tests for new features when possible

---

## Known Limitations

### Current Limitations

- **Message Size**: Limited by the context window of the selected model
- **History Storage**: Local storage only (no cloud synchronization)
- **Model Availability**: Dependent on OpenRouter API availability
- **Image Generation**: Requires models that support image output

### Workarounds

- **Long Messages**: Split large messages into multiple parts
- **Backup**: Export important conversations regularly
- **Unavailable Models**: The application automatically suggests alternatives

---

## License

This project is distributed under the **MIT License**. See the `LICENSE` file for more information.

### MIT License Terms

- ✅ **Commercial Use**: Allowed
- ✅ **Modification**: Allowed
- ✅ **Distribution**: Allowed
- ✅ **Private Use**: Allowed
- ❌ **Liability**: Not guaranteed
- ❌ **Warranty**: None provided

---

## Acknowledgments

- **[OpenRouter](https://openrouter.ai/)** for language model API access
- **[React Team](https://react.dev/)** for the excellent framework
- **[Vite Team](https://vitejs.dev/)** for the ultra-fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** for the utility-first CSS framework
- **[Zustand](https://github.com/pmndrs/zustand)** for simple, performant state management
- **[@xenova/transformers](https://github.com/xenova/transformers.js)** for browser-based ML embeddings

---

## Support

### Need Help?

- **Documentation**: See this README
- **Bug Report**: [Open an issue](https://github.com/Teeflo/PolyChat-AI/issues)
- **Discussions**: [GitHub Forum](https://github.com/Teeflo/PolyChat-AI/discussions)
- **Contact**: [Create an issue](https://github.com/Teeflo/PolyChat-AI/issues/new)

### Useful Links

- **Website**: [PolyChat-AI](https://github.com/Teeflo/PolyChat-AI)
- **Documentation**: [Project Wiki](https://github.com/Teeflo/PolyChat-AI/wiki)
- **Releases**: [Versions](https://github.com/Teeflo/PolyChat-AI/releases)
- **Analytics**: [Statistics](https://github.com/Teeflo/PolyChat-AI/graphs/contributors)

---

**Created with care by [Teeflo](https://github.com/Teeflo)**

[![Stars](https://img.shields.io/github/stars/Teeflo/PolyChat-AI?style=social)](https://github.com/Teeflo/PolyChat-AI/stargazers)
[![Forks](https://img.shields.io/github/forks/Teeflo/PolyChat-AI?style=social)](https://github.com/Teeflo/PolyChat-AI/forks)
[![Issues](https://img.shields.io/github/issues/Teeflo/PolyChat-AI)](https://github.com/Teeflo/PolyChat-AI/issues)

---

## Roadmap

Planned features for upcoming releases:

- [ ] **Display Model Capabilities**: Show model capabilities (image reasoning, document analysis, etc.) directly in the model selector
- [ ] **Image Editing & Regeneration**: Add options to edit generated images or create variations
- [ ] **History Panel Improvement**: Modernize the conversation history panel design for better readability
- [ ] **Cloud Synchronization**: Optional cloud backup for conversations
- [ ] **Custom Templates**: Create and save your own conversation templates
- [ ] **Voice Input**: Add speech-to-text for hands-free interaction
- [ ] **Export Options**: Export conversations to Markdown, PDF, or JSON formats

Your contributions are welcome!
