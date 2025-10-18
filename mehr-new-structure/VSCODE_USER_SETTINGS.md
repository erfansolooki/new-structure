# VSCode User Settings Configuration

## How to Add to Your User Settings

### Method 1: Using Settings UI
1. Press `Ctrl+,` (or `Cmd+,` on Mac) to open Settings
2. Click the `{}` icon in the top right to open `settings.json`
3. Copy and paste the settings below

### Method 2: Command Palette
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Preferences: Open User Settings (JSON)"
3. Copy and paste the settings below

---

## Recommended User Settings

```json
{
  // ============================================
  // PRETTIER CONFIGURATION
  // ============================================
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.formatOnType": false,
  
  // File-specific formatters
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ============================================
  // ESLINT CONFIGURATION
  // ============================================
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // ============================================
  // TYPESCRIPT CONFIGURATION
  // ============================================
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.preferTypeOnlyAutoImports": true,

  // ============================================
  // EDITOR CONFIGURATION
  // ============================================
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.renderWhitespace": "boundary",
  "editor.trimAutoWhitespace": true,
  "editor.linkedEditing": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.suggestSelection": "first",
  "editor.inlineSuggest.enabled": true,
  "editor.quickSuggestions": {
    "strings": true
  },

  // ============================================
  // FILES CONFIGURATION
  // ============================================
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.eol": "\n",
  "files.autoSave": "onFocusChange",

  // ============================================
  // FILE EXPLORER
  // ============================================
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "*.ts": "${capture}.js",
    "*.tsx": "${capture}.ts",
    "*.js": "${capture}.js.map, ${capture}.min.js, ${capture}.d.ts",
    "package.json": "package-lock.json, yarn.lock, pnpm-lock.yaml",
    "tsconfig.json": "tsconfig.*.json",
    ".prettierrc": ".prettierignore",
    ".eslintrc": ".eslintignore",
    "README.md": "README.*.md"
  },
  "explorer.compactFolders": false,

  // ============================================
  // SEARCH CONFIGURATION
  // ============================================
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.vite": true,
    "**/*.tsbuildinfo": true,
    "**/yarn.lock": true,
    "**/package-lock.json": true,
    "**/.git": true
  },

  // ============================================
  // FILE ASSOCIATIONS
  // ============================================
  "files.associations": {
    "*.css": "css",
    "*.scss": "scss",
    ".prettierrc": "json",
    ".eslintrc": "json"
  },

  // ============================================
  // CSS/SCSS CONFIGURATION
  // ============================================
  "css.lint.unknownAtRules": "ignore",
  "scss.lint.unknownAtRules": "ignore",
  "css.validate": true,
  "scss.validate": true,

  // ============================================
  // EMMET CONFIGURATION
  // ============================================
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "emmet.triggerExpansionOnTab": true,

  // ============================================
  // TERMINAL CONFIGURATION
  // ============================================
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.fontSize": 14,

  // ============================================
  // GIT CONFIGURATION
  // ============================================
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true
}
```

---

## Required VSCode Extensions

Install these extensions for the best experience:

1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **ESLint** (`dbaeumer.vscode-eslint`)
3. **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
4. **Path Intellisense** (`christian-kohler.path-intellisense`)
5. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)

### Install Extensions via Command Line:
```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension christian-kohler.path-intellisense
code --install-extension formulahendry.auto-rename-tag
```

---

## Keyboard Shortcuts

- **Format Document**: `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (Mac)
- **Format Selection**: `Ctrl+K Ctrl+F` (Windows/Linux) or `Cmd+K Cmd+F` (Mac)
- **Organize Imports**: `Shift+Alt+O` (Windows/Linux) or `Shift+Option+O` (Mac)

---

## Workspace vs User Settings

- **Workspace Settings** (`.vscode/settings.json`): Project-specific, committed to Git
- **User Settings**: Global settings for all projects

For this project, the workspace settings are already configured in `.vscode/settings.json`.
The settings above are for your **User Settings** if you want them applied globally.

