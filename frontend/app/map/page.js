'use client';
import { HexGrid, Layout, Hexagon } from 'react-hexgrid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useMemo, useRef, useState, useEffect } from 'react';
import Papa from 'papaparse';


function CarIcon() {
  return (
    <g transform="translate(-10,-10)">
      <rect x="4" y="4" width="12" height="12" rx="3" fill="#000" />
      <text x="10" y="14" textAnchor="middle" fontSize="8" fill="#fff">🚗</text>
    </g>
  );
}

export default function Map() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  

  const [hexTuples, setHexTuples] = useState([]);

  const [carHexId, setCarHexId] = useState(null);

// useEffect(() => {
//   fetch('/api/car') // returns { carHexId: "89006b0cd89bafa" }
//     .then(res => res.json())
//     .then(data => setCarHexId(data.carHexId));
// }, []);
useEffect(() => {
  // manually set it once when component mounts
  setCarHexId("891242295be19da");
}, []);

  useEffect(() => {
    fetch('/data/heatmap_data.csv') // CSV in public folder
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        const tuples = parsed.data.map(row => [
          Number(row['msg.city_id']),                   // cluster number
          row['msg.predictions.hexagon_id_9'],         // hex id
          Number(row['msg.predictions.predicted_eph']) // estimated value
        ]);
        setHexTuples(tuples);
        console.log(tuples); // optional: inspect in console
      });
  }, []);
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

   // --- Load CSV ---
  useEffect(() => {
    fetch('/data/heatmap_data.csv') // <-- replace with your CSV path
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        // Map CSV rows to hexData
        const data = parsed.data.map(row => ({
          cityId: row['msg.city_id'],
          hexId: row['msg.predictions.hexagon_id_9'],
          value: Number(row['msg.predictions.predicted_eph']) || 0,
        }));
        setHexData(data);
        console.log(tuples);
      });
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
  
  // Define offsets for 5 clusters (spread out nicely)
  const offsets = [
    [0, 0, 0],          // center
    [25, -47, 0],       // top-right
    [-25, 47, 0],       // bottom-left
    [30, 20, -60],     // far-right
    [-25, -25, 47],     // far-left
  ];


  // Generate hexes for a single cluster
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

  // Offset a cluster to a different position
const allHexes = useMemo(() => {
  return offsets.flatMap(([qOff, rOff, sOff], clusterIndex) => {
    const clusterId = clusterIndex + 1; 
    const clusterData = hexTuples.filter(([cityId]) => cityId === clusterId);

    const clusterCoords = generateHexesForN(clusterData.length);

    return clusterCoords.map(([q, r, s], idx) => {
      const data = clusterData[idx] || { hexId: `empty-${clusterId}-${idx}`, value: 0 };
      return {
        q: q + qOff,
        r: r + rOff,
        s: s + sOff,
        hexId: data[1],
        value: data[2],
      };
    });
  });
}, [hexTuples, offsets]);

  const citySize = 1200; // change to 1200 later
  const baseCluster = useMemo(() => generateHexesForN(citySize), []);
  
const [minValue, maxValue] = useMemo(() => {
  if (hexTuples.length === 0) return [0, 1];
  const values = hexTuples.map(([_, __, value]) => value);
  return [Math.min(...values), Math.max(...values)];
}, [hexTuples]);

const getColor = (value) => {
  const t = (value - minValue) / ((maxValue - minValue) || 1); 
  // Lightness: darker (30%) → lighter (70%)
  const lightness = 30 + t * 40; 
  return `hsl(195, 57%, ${lightness}%)`;  
};

  return (
    <div
      ref={containerRef}
      className="flex w-3/4 m-10 h-[80vh] rounded-2xl bg-foreground overflow-hidden"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <TransformWrapper minScale={0.1} maxScale={20}>
          <TransformComponent>
            <HexGrid
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`-${dimensions.width / 2} -${dimensions.height / 2} ${dimensions.width} ${dimensions.height}`}
            >
              <Layout size={{ x: 2, y: 2 }} flat spacing={1.05} origin={{ x: 0, y: 0 }}>
  {allHexes.map(({ q, r, s, hexId, value }) => (
    <Hexagon
      key={hexId}
      q={q}
      r={r}
      s={s}
      style={{
    fill: getColor(value),       // fill color
    stroke: "black",   // outline
    strokeWidth: "0.2"
  }}
    >
 {hexId === carHexId && (
       <g transform="translate(-6,-10)"> {/* adjust to center above hex center */}
    {/* bubble */}
    <circle cx="6" cy="7" r="4" fill="black" />
    {/* tail */}
    <polygon points="4,11 8,11 6,14" fill="black" />
    {/* car emoji */}
    <text x="6" y="8" textAnchor="middle" fontSize="6" fill="white">🚗</text>
  </g>
    )}
    </Hexagon>
  ))}
</Layout>
            </HexGrid>
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
}
