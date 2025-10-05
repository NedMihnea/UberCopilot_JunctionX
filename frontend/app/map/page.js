'use client';
import { HexGrid, Layout, Hexagon, } from 'react-hexgrid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useMemo, useRef, useState, useEffect } from 'react';
import Papa from 'papaparse';


function CarIcon() {
  return (
    <g>
      <circle cx={0} cy={0} r={4} fill="black" />
      <text x={0} y={2} textAnchor="middle" fontSize="100" fill="white">🚗</text>
    </g>
  );
}

export default function Map({ earnerId, hex_id_send }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const transformWrapperRef = useRef(null);


  const [hexTuples, setHexTuples] = useState([]);

  const [carHexId, setCarHexId] = useState(0);


  async function getJSON(url) {
     const r = await fetch(url);
     if (!r.ok) throw new Error(await r.text());
     return r.json();
    }

    const getRegions = async () => {
    try {
      const hour = new Date().getHours();

      console.log("Fetching regions for:", { earnerId, hour }); // ✅ log before call

      const res = await fetch(
        `http://127.0.0.1:8000/regions/hexes?earner_id=${earnerId}&hour=${hour}`
      );
      const data = await res.json();

      const extracted = data.hexes.map(({ hex_id, efficiency_score }) => ({
        hex_id,
        efficiency_score
      }));

      console.log("Extracted hex data:", extracted);
      setHexTuples(extracted);
      console.log(hexTuples)
    } catch (err) {
      console.error("Error fetching regions:", err);
    }
  };

  useEffect(() => {
    if (earnerId) {
      getRegions();
    }
  }, [earnerId]);

// useEffect(() => {
//   fetch('/api/car') // returns { carHexId: "89006b0cd89bafa" }
//     .then(res => res.json())
//     .then(data => setCarHexId(data.carHexId));
// }, []);


 
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
    if (dimensions.width > 0 && dimensions.height > 0 && transformWrapperRef.current) {
      const timer = setTimeout(() => {
        const wrapper = transformWrapperRef.current;
        const hexGridElement = document.getElementById('hex-grid-container');
        if (wrapper && hexGridElement) {
          wrapper.zoomToElement(hexGridElement, 2.5, 500);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [dimensions]);


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
   
  ];


  // Generate hexes for a single cluster
  function generateHexesForN(n) {
    if (n <= 0) return [];
    const hexes = [[0, 0, 0]];
    if (n === 1) return hexes;

    let count = 1;
    let layer = 1;
    while (count < n) {
      let q = 0,
        r = -layer,
        s = layer;
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
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const allHexes = useMemo(() => {
  const [qOff, rOff, sOff] = offsets[0]; // only one cluster
  const clusterData = shuffleArray(hexTuples); // shuffle to randomize positions
  const clusterCoords = generateHexesForN(clusterData.length);

  return clusterCoords.map(([q, r, s], idx) => {
    const data = clusterData[idx] || { hex_id: `empty-${idx}`, efficiency_score: 0 };
    return {
      q: q + qOff,
      r: r + rOff,
      s: s + sOff,
      hexId: data.hex_id,
      value: data.efficiency_score,
    };
  });
}, [hexTuples, offsets]);
  const citySize = 1200;
  const baseCluster = useMemo(() => generateHexesForN(citySize), []);
  
const [minValue, maxValue] = useMemo(() => {
  if (hexTuples.length === 0) return [0, 1];
  const values = hexTuples.map(h=>h.efficiency_score);
  return [Math.min(...values), Math.max(...values)];
}, [hexTuples]);


const getColor = (value) => {
    
  const t = (value - minValue) / ((maxValue - minValue) || 1); 
  // Lightness: darker (30%) → lighter (70%)
  const lightness = 30 + t * 40; 
 
  return `hsl(195, 57%, ${lightness}%)`;  
};


useEffect(() => {
  if (hex_id_send) {
    setCarHexId(hex_id_send);
    console.log("🚗 Car hex updated:", hex_id_send);
  }
}, [hex_id_send]);


  return (
    <div
      ref={containerRef}
      className="flex w-3/4 m-10 h-[80vh] rounded-2xl bg-foreground overflow-hidden"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <TransformWrapper minScale={0.1} maxScale={20} ref={transformWrapperRef}>
          <TransformComponent>
            <HexGrid
              id="hex-grid-container"
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`-${dimensions.width / 2} -${dimensions.height / 2} ${dimensions.width} ${dimensions.height}`}>

              <Layout size={{ x: 2, y: 2 }} flat spacing={1.15} origin={{ x: 0, y: 0 }}>
  {allHexes.map(({ q, r, s, hexId, value }) => (
    <Hexagon
      key={hexId}
      q={q}
      r={r}
      s={s}
      style={{
    fill: getColor(value),       
    stroke: "black",   
    strokeWidth: "0.2",
    pointerEvents: "none"   
  }}
    >
     {hexId === carHexId && (
      <>
       
        <g transform="translate(-6,-10)">
          
          
          <text x="6" y="8" textAnchor="middle" fontSize="12" fill="white" >🚗</text>
        </g>
      </>
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