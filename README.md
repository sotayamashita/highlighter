# Markdown Highlighter

A web-based Markdown editor with highlighting and annotation capabilities, built with Remix and React.

## Features

- 📝 Markdown preview with Typography styling
- 🎨 Text highlighting with multiple colors
- 💭 Add comments to highlighted sections
- 📥 Import Markdown files
- 📤 Export with highlights preserved
- 📏 Resizable panels for better workspace organization

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Make sure to deploy the output of `npm run build`:
- `build/server`
- `build/client`

## Tech Stack

- **Framework**: [Remix](https://remix.run/docs)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Markdown**: [marked](https://marked.js.org/)
- **Icons**: [Lucide](https://lucide.dev/)

## Implementation Details

### Components
- `HighlightCard`: Displays highlighted text with comments
- `HighlightToolbar`: Floating toolbar for color selection

### Custom Hooks
- `useHighlight`: Manages highlight operations and state
- `useFileOperations`: Handles file import/export with highlight preservation

### Features
1. **Text Selection**:
   - Select text to trigger the highlight toolbar
   - Choose from 4 highlight colors (yellow, pink, blue, green)

2. **Highlighting**:
   - Highlights are stored with unique IDs
   - Uses HTML `mark` elements for highlighting
   - Preserves original text structure

3. **Annotations**:
   - Add comments to any highlight
   - Comments are stored alongside highlight data

4. **File Operations**:
   - Import any Markdown file
   - Export with highlights preserved as HTML `mark` tags

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. See the [Vite docs on CSS](https://vitejs.dev/guide/features.html#css) for more information.
