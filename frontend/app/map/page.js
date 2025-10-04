'use client';
import { HexGrid, Layout, Hexagon } from 'react-hexgrid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useMemo, useRef, useState, useEffect } from 'react';

export default function Map() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Watch container size
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setDimensions({ width: rect.width, height: rect.height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Directions
  const cubeDirections = [
    [1, 0, -1],
    [0, 1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
    [0, -1, 1],
    [1, -1, 0],
  ];

  // Generate hexes
  function generateHexesForN(n) {
    if (n <= 0) return [];
    const hexes = [[0, 0, 0]];
    if (n === 1) return hexes;

    let count = 1;
    let layer = 1;
    while (count < n) {
      let q = 0, r = -layer, s = layer;
      for (let side = 0; side < 6; side++) {
        const [dq, dr, ds] = cubeDirections[side];
        for (let step = 0; step < layer; step++) {
          if (count >= n) break;
          q += dq;
          r += dr;
          s += ds;
          hexes.push([q, r, s]);
          count++;
        }
        if (count >= n) break;
      }
      layer++;
    }
    return hexes;
  }

  const citySize = 200;
  const baseCluster = useMemo(() => generateHexesForN(citySize), []);

  return (
    <div
      ref={containerRef}
      className="flex w-3/4 m-10 h-[80vh] rounded-2xl bg-foreground overflow-hidden"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <TransformWrapper minScale={0.1} maxScale={3}>
          <TransformComponent>
            <HexGrid
              width={dimensions.width}
              height={dimensions.height}
              // ViewBox = same size as container so it scales nicely
              viewBox={`-${dimensions.width / 2} -${dimensions.height / 2} ${dimensions.width} ${dimensions.height}`}
            >
              <Layout
                size={{ x: 10, y: 10 }}
                flat={true}
                spacing={1.05}
                origin={{ x: 0, y: 0 }}
              >
                {baseCluster.map(([q, r, s], index) => (
                  <Hexagon key={index} q={q} r={r} s={s} />
                ))}
              </Layout>
            </HexGrid>
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
}
