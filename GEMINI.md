## Project Overview

This is a web-based AI chat application named PolyChat-AI. It is built with React, TypeScript, and Vite, and styled with Tailwind CSS. The application features a modern, polychated user interface and utilizes the OpenRouter API to provide access to various AI models. The state is managed with Zustand and custom hooks.

The application is structured with a clear separation of concerns, with components, hooks, services, and context organized into their own directories.

## Building and Running

To get the project running locally, use the following commands:

*   **Install dependencies:**
    ```bash
    npm install
    ```

*   **Run the development server:**
    ```bash
    npm run dev
    ```

*   **Build for production:**
    ```bash
    npm run build
    ```

*   **Lint the code:**
    ```bash
    npm run lint
    ```

*   **Preview the production build:**
    ```bash
    npm run preview
    ```

## Development Conventions

*   **Linting:** The project uses ESLint for code linting. Run `npm run lint` to check for issues.
*   **Styling:** The project uses Tailwind CSS for styling, with a custom theme defined in `tailwind.config.js` and additional styles in the `src/styles` directory.
*   **Component Structure:** The application is built with a component-based architecture. Components are located in `src/components` and organized by feature (Chat, Layout, Settings).
*   **State Management:** Global state is managed using Zustand, with the `ChatProvider` in `src/context/ChatProvider.tsx` and custom hooks in `src/hooks`.
*   **API Interaction:** API calls to the OpenRouter API are handled in the `src/services` directory.
