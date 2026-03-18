import React from 'react';
import { OrbitControls, Grid, ContactShadows } from '@react-three/drei';
import { useStore } from '../store.js';
import { ShedItem } from './ShedItem.jsx';
import { GhostItem } from './GhostItem.jsx';
import { GroundPlane } from './GroundPlane.jsx';
import { useSceneInteractions } from '../hooks/useSceneInteractions.js';

export function Scene() {
  const items = useStore(s => s.items);
  const selectedId = useStore(s => s.selectedId);
  const placingType = useStore(s => s.placingType);
  const { onGroundPointerMove, onGroundClick } = useSceneInteractions();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[20, 30, 15]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} color="#6080ff" />

      {/* Ground */}
      <GroundPlane onPointerMove={onGroundPointerMove} onClick={onGroundClick} />

      {/* Grid */}
      <Grid
        args={[200, 200]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1F2933"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#4E6E81"
        fadeDistance={80}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {/* Soft shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={100}
        blur={2}
        far={10}
        frames={1}
      />

      {/* Items */}
      {items.map(it => (
        <ShedItem
          key={it.id}
          item={it}
          isSelected={it.id === selectedId}
        />
      ))}

      {/* Ghost preview */}
      {placingType && <GhostItem />}

      <OrbitControls
        makeDefault
        enablePan
        enableRotate
        enableZoom
        dampingFactor={0.05}
      />
    </>
  );
}
