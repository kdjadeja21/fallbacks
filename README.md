# Fallbacks | A Gallery of React Error Boundary Templates

A collection of reusable, customizable Error Boundary components for Next.js applications. This project provides a variety of pre-built error boundary templates that you can easily integrate into your Next.js projects.

## Features

- 🎨 Multiple pre-built error boundary templates
- 🔄 Retry functionality
- 📱 Responsive designs
- ⚡ Easy to customize and extend
- 🎭 Animation support
- 💾 Downloadable templates

## Setup

1. Clone the repository:
   ```bash
   git clone <repo>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the gallery.

## How to Use

### Using a Template

1. Browse the gallery at [http://localhost:3000](http://localhost:3000)
2. Click on any template to see it in action
3. Use the "Download" button to get the template code
4. Copy the downloaded template to your project's components directory
5. Import and use the error boundary in your components:

```tsx
import { FancyErrorBoundary } from '@/components/error-boundaries/FancyErrorBoundary';

export default function MyComponent() {
  return (
    <FancyErrorBoundary>
      {/* Your component content */}
    </FancyErrorBoundary>
  );
}
```

## Contributing

### Adding a New Template

1. Create a new file in `app/components/error-boundaries/` with your template name:
   ```tsx
   // Example: CustomErrorBoundary.tsx
   ```

2. Implement your error boundary component using the base structure:
   ```tsx
   'use client';
   
   import { ErrorBoundary } from 'react-error-boundary';
   import { YourErrorFallbackComponent } from './YourFallbackComponent';

   export function CustomErrorBoundary({ children }) {
     return (
       <ErrorBoundary
         FallbackComponent={YourErrorFallbackComponent}
         onReset={() => {
           // Reset error boundary state
         }}
       >
         {children}
       </ErrorBoundary>
     );
   }
   ```

3. Add your template to the gallery by updating `app/data/snippets.tsx`:
   ```tsx
   export const templates = [
     // ... existing templates
     {
       name: 'Custom Template',
       component: CustomErrorBoundary,
       description: 'Your template description',
       tags: ['custom', 'other-relevant-tags'],
       templatePath:'path',
     },
   ];
   ```

4. Test your template:
   - Ensure it handles errors properly
   - Test responsive design
   - Verify any animations or interactions
   - Check accessibility features

5. Create a pull request with:
   - Your new template component
   - Updated snippets file
   - Brief description of the template
   - Screenshots (if applicable)

### Development Guidelines

- Follow the existing code structure and naming conventions
- Ensure components are properly typed with TypeScript
- Add proper documentation and comments
- Test for accessibility
- Keep the bundle size in mind
- Ensure responsive design

## License

MIT License - feel free to use this in your own projects and contribute back to the community!

## Support

If you find this project helpful, please give it a star �star on GitHub and consider contributing to make it even better!
