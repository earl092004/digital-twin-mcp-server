# Digital Twin MCP Server

## Project Overview
This is a Next.js application serving as the foundation for a Model Context Protocol (MCP) server for the Digital Twin project.

## Technology Stack
- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Turbopack (enabled)
- **Linting**: ESLint with Next.js configuration
- **Version Control**: Git

## Project Structure
```
mydigitaltwin/
├── app/                    # Next.js App Router directory
│   ├── favicon.ico        # Site favicon
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── public/                # Static assets
├── .git/                  # Git repository
├── .gitignore            # Git ignore rules
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Configuration Details

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Path mapping: `@/*` → `./*`
- Next.js plugin enabled

### Package.json Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Development Server
- Local: http://localhost:3000
- Network: http://192.168.56.1:3000

## Next Steps
1. Set up GitHub repository (if needed)
2. Configure MCP server specific functionality
3. Integrate with Digital Twin RAG application
4. Add API routes for MCP endpoints

## Getting Started
```bash
cd mydigitaltwin
npm run dev
```

Visit http://localhost:3000 to see the application running.

## Dependencies
- React 19.1.0
- Next.js 15.5.3
- TypeScript 5.x
- Tailwind CSS 4.x
- ESLint 9.x

Created: September 15, 2025