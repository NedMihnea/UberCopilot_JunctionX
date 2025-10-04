

'use client';
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useState, useRef } from 'react';


export default function Map(){
  const [scale, setScale] = useState(1); // zoom scale
  const containerRef = useRef(null);
  // Cube directions for the 6 sides
 // Directions in cube coordinates (matching your Python version)
const cubeDirections = [
  [1, 0, -1],   // SOUTHEAST
  [0, 1, -1],   // SOUTH
  [-1, 1, 0],   // SOUTHWEST
  [-1, 0, 1],   // NORTHWEST
  [0, -1, 1],   // NORTH
  [1, -1, 0],   // NORTHEAST
];

/**
 * Generate cube coordinates for a hex grid with center and numLayers layers.
 * Equivalent to your Python generate_hexagon_layers_3d function.
 */
function generateHexesForN(n) {
  if (n <= 0) return [];

  const cubeDirections = [
    [1, 0, -1],   // SOUTHEAST
    [0, 1, -1],   // SOUTH
    [-1, 1, 0],   // SOUTHWEST
    [-1, 0, 1],   // NORTHWEST
    [0, -1, 1],   // NORTH
    [1, -1, 0],   // NORTHEAST
  ];

  const hexes = [[0, 0, 0]]; // center
  if (n === 1) return hexes;

  let count = 1; // already added center
  let layer = 1;

  while (count < n) {
    // start at top of layer
    let q = 0, r = -layer, s = layer;

    // max hexes in this layer
    const maxInLayer = 6 * layer;

    // step through each side of hex ring
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

// Example usage
const hexes = generateHexesForN(37);
    return (
        <div className=" flex w-3/4 m-10 h-3/4 rounded-2xl bg-foreground">
        <TransformWrapper>
    <TransformComponent>
        
          <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
        <Layout size={{ x: 5, y: 5 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
          {hexes.map(([q, r, s], index) => (
            <Hexagon key={index} q={q} r={r} s={s}>
              
            </Hexagon>
          ))}
        </Layout>
      </HexGrid>
      
        
        </TransformComponent>
  </TransformWrapper>
  </div>
    )
}