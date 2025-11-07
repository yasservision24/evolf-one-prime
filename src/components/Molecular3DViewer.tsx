import { useEffect, useRef } from 'react';

interface Molecular3DViewerProps {
  data: string;
  format: 'pdb' | 'sdf' | 'mol2' | 'xyz';
  style?: 'cartoon' | 'stick' | 'sphere' | 'line';
  backgroundColor?: string;
  height?: number;
}

declare global {
  interface Window {
    $3Dmol: any;
  }
}

export function Molecular3DViewer({
  data,
  format,
  style = 'stick',
  backgroundColor = '#1a1a1a',
  height = 400,
}: Molecular3DViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load 3Dmol.js script if not already loaded
    if (!window.$3Dmol) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.0/3Dmol-min.js';
      script.async = true;
      script.onload = () => initViewer();
      document.head.appendChild(script);
    } else {
      initViewer();
    }

    return () => {
      if (viewerInstanceRef.current) {
        // Cleanup viewer
        viewerInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (viewerInstanceRef.current && data) {
      updateViewer();
    }
  }, [data, format, style, backgroundColor]);

  const initViewer = () => {
    if (!viewerRef.current || !window.$3Dmol) return;

    const config = { backgroundColor };
    viewerInstanceRef.current = window.$3Dmol.createViewer(viewerRef.current, config);
    
    if (data) {
      updateViewer();
    }
  };

  const updateViewer = () => {
    if (!viewerInstanceRef.current || !data) return;

    const viewer = viewerInstanceRef.current;
    
    // Clear previous models
    viewer.clear();

    try {
      // Add model based on format
      viewer.addModel(data, format);
      
      // Apply style based on format and preference
      if (format === 'pdb' && style === 'cartoon') {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      } else if (style === 'stick') {
        viewer.setStyle({}, { stick: { colorscheme: 'Jmol' } });
      } else if (style === 'sphere') {
        viewer.setStyle({}, { sphere: { colorscheme: 'Jmol' } });
      } else if (style === 'line') {
        viewer.setStyle({}, { line: { colorscheme: 'Jmol' } });
      }

      // Zoom to fit and render
      viewer.zoomTo();
      viewer.render();
    } catch (error) {
      console.error('Error rendering molecular structure:', error);
    }
  };

  if (!data || data === 'N/A') {
    return (
      <div 
        className="flex items-center justify-center text-muted-foreground bg-secondary/20 rounded-lg border border-border"
        style={{ height: `${height}px` }}
      >
        No 3D structure data available
      </div>
    );
  }

  return (
    <div 
      ref={viewerRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`, 
        position: 'relative',
        borderRadius: '0.5rem',
      }}
      className="border border-border"
    />
  );
}