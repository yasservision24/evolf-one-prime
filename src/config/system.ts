// System Configuration
// All colors, themes, and global settings are defined here

export const system = {
  // Colors - using HSL format to match Tailwind
  colors: {
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    border: 'hsl(var(--border))',
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',
    
    // Brand colors
    brandBlue: 'hsl(var(--brand-blue))',
    brandBlueLight: 'hsl(var(--brand-blue-light))',
    brandGray: 'hsl(var(--brand-gray))',
    
    // Chart colors
    chart1: 'hsl(var(--chart-1))',
    chart2: 'hsl(var(--chart-2))',
    chart3: 'hsl(var(--chart-3))',
    chart4: 'hsl(var(--chart-4))',
    chart5: 'hsl(var(--chart-5))',
  },
  
  // Gradients
  gradients: {
    logo: 'linear-gradient(90deg, #6B9BD1 0%, #4A5568 100%)',
    buttonHover: 'linear-gradient(90deg, #6B9BD1 0%, #5A6C7D 100%)',
    heroBackground: 'linear-gradient(135deg, hsl(var(--sidebar-primary)), hsl(var(--background)))',
  },
  
  // Typography
  typography: {
    fonts: {
      body: 'Inter, sans-serif',
      heading: 'Poppins, sans-serif',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    weights: {
      normal: '400',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Border radius
  radius: {
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 4px)',
    full: '9999px',
  },
  
  // Animations
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // App-specific settings
  app: {
    name: 'EvOlf',
    description: 'GPCR receptor-ligand interaction database and prediction platform',
    stats: {
      interactions: '10K+',
      receptors: '487',
      ligands: '3.5K+',
      accuracy: '95%',
    },
  },
};

// Helper function to get system values
export const getSystemValue = (path: string): any => {
  return path.split('.').reduce((obj, key) => obj?.[key], system as any);
};

export default system;
