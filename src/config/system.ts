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
    brandGold: 'hsl(var(--brand-gold))',
    brandGoldLight: 'hsl(var(--brand-gold-light))',
    brandGrayDark: 'hsl(var(--brand-gray-dark))',
    brandGrayMedium: 'hsl(var(--brand-gray-medium))',
    brandTeal: 'hsl(var(--brand-teal))',
    brandPurple: 'hsl(var(--brand-purple))',
    brandPurpleAlt: 'hsl(var(--brand-purple-alt))',
    
    // Chart colors
    chart1: 'hsl(var(--chart-1))',
    chart2: 'hsl(var(--chart-2))',
    chart3: 'hsl(var(--chart-3))',
    chart4: 'hsl(var(--chart-4))',
    chart5: 'hsl(var(--chart-5))',
  },
  
  // Gradients
  gradients: {
    logo: 'linear-gradient(90deg, #C79640 0%, #D4A574 100%)',
    evolf: 'linear-gradient(90deg, #00C9A7 0%, #8B5CF6 100%)',
    buttonHover: 'linear-gradient(90deg, #D4A574 0%, #C79640 100%)',
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
      interactions: '100K+',
      receptors: '2K+',
      ligands: '40K+',
      species: '20+',
    },
  },
};

// Helper function to get system values
export const getSystemValue = (path: string): any => {
  return path.split('.').reduce((obj, key) => obj?.[key], system as any);
};

export default system;
