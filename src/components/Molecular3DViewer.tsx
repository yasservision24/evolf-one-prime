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
  const viewer = useRef<any>(null);
  const model = useRef<any>(null);

  // Create viewer ONCE
  useEffect(() => {
    if (!viewerRef.current || !window.$3Dmol) return;

    viewer.current = window.$3Dmol.createViewer(viewerRef.current, {
      backgroundColor,
    });

    renderModel();
  }, []);

  // Re-render model only when DATA or FORMAT changes
  useEffect(() => {
    renderModel();
  }, [data, format]);

  // Change style WITHOUT reloading model
  useEffect(() => {
    if (!viewer.current) return;

    applyStyle();
    viewer.current.render();
  }, [style]);

  const renderModel = () => {
    if (!viewer.current || !data) return;

    viewer.current.clear();

    model.current = viewer.current.addModel(data, format);

    applyStyle();

    viewer.current.zoomTo();
    viewer.current.render();
  };

  const applyStyle = () => {
    if (!viewer.current || !model.current) return;

    viewer.current.setStyle({}, {});

    const styleMap: Record<string, any> = {
      cartoon: { cartoon: { color: 'spectrum' } },
      stick: { stick: { colorscheme: 'Jmol' } },
      sphere: { sphere: { colorscheme: 'Jmol' } },
      line: { line: { colorscheme: 'Jmol' } },
    };

    viewer.current.setStyle({}, styleMap[style]);
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
