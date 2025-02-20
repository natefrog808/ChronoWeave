# Create Next.js app with additional flags for consistency
npx create-next-app@latest chronoweave --typescript --tailwind --eslint --src-dir --no-app --no-turbo

# Navigate to project directory
cd chronoweave

# Install core dependencies
npm install lucide-react class-variance-authority clsx tailwind-merge framer-motion zustand @types/node @types/react @types/react-dom

# Initialize shadcn-ui with custom settings
npx shadcn-ui@latest init

# Add shadcn-ui components
npx shadcn-ui@latest add card button select
