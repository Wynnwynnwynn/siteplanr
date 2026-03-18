import React, { useRef, useState, useCallback } from 'react';
import { OrbitControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, Outline } from '@react-three/postprocessing';
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

  // Track mesh refs for Outline selection
  const meshMapRef = useRef(new Map());
  const [selectedMeshes, setSelectedMeshes] = useState([]);

  const handleRegisterRef = useCallback((id, mesh) => {
    if (mesh) {
      meshMapRef.current.set(id, mesh);
    } else {
      meshMapRef.current.delete(id);
    }
    // Update selected meshes when ref changes for the selected item
    if (id === selectedId) {
      setSelectedMeshes(mesh ? [mesh] : []);
    }
  }, [selectedId]);

  // Update selected meshes when selection changes
  const prevSelectedIdRef = useRef(null);
  if (prevSelectedIdRef.current !== selectedId) {
    prevSelectedIdRef.current = selectedId;
    const mesh = selectedId ? meshMapRef.current.get(selectedId) : null;
    // Defer to avoid render-phase setState
    setTimeout(() => setSelectedMeshes(mesh ? [mesh] : []), 0);
  }

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
        cellColor="#374151"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#1d4ed8"
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
          onRegisterRef={handleRegisterRef}
        />
      ))}

      {/* Ghost preview */}
      {placingType && <GhostItem />}

      {/* Post-processing outline for selection */}
      {selectedMeshes.length > 0 && (
        <EffectComposer>
          <Outline
            selection={selectedMeshes}
            edgeStrength={5}
            pulseSpeed={0}
            visibleEdgeColor={0x60a5fa}
            hiddenEdgeColor={0x1d4ed8}
          />
        </EffectComposer>
      )}

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
