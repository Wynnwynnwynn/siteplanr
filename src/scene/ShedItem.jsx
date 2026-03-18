import React, { useRef, useEffect } from 'react';
import { useStore } from '../store.js';
import { aabbFrom, aabbOverlap, normalizedYaw } from '../utils.js';
import { ITEM_VISUALS } from './itemVisuals.js';

export function ShedItem({ item, isSelected, onRegisterRef }) {
  const meshRef = useRef();
  const items = useStore(s => s.items);
  const setSelectedId = useStore(s => s.setSelectedId);
  const setDraggingId = useStore(s => s.setDraggingId);

  // Register ref for postprocessing Outline selection
  useEffect(() => {
    if (onRegisterRef && meshRef.current) {
      onRegisterRef(item.id, meshRef.current);
    }
    return () => {
      if (onRegisterRef) onRegisterRef(item.id, null);
    };
  }, [item.id, onRegisterRef]);

  const visual = ITEM_VISUALS[item.type] ?? {
    wallColor: '#94a3b8', roofColor: '#475569', metalness: 0.2, roughness: 0.7
  };

  const yaw = normalizedYaw(item.yaw);
  const isQuarter = Math.abs(yaw - Math.PI / 2) < 1e-6 || Math.abs(yaw - 3 * Math.PI / 2) < 1e-6;
  const sx = isQuarter ? item.dims.wid : item.dims.len;
  const sz = isQuarter ? item.dims.len : item.dims.wid;
  const ht = item.dims.ht;

  // Overlap detection
  const myAABB = aabbFrom(item);
  const overlaps = items.some(it => it.id !== item.id && aabbOverlap(myAABB, aabbFrom(it)));

  const wallColor = overlaps ? '#ef4444' : visual.wallColor;

  return (
    <group
      position={item.pos}
      rotation={[0, yaw, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();
        setSelectedId(item.id);
        setDraggingId(item.id);
      }}
    >
      {/* Main body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        position={[0, ht / 2, 0]}
      >
        <boxGeometry args={[sx, ht, sz]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={visual.roughness}
          metalness={visual.metalness}
          emissive={isSelected ? '#1d4ed8' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Roof ridge detail */}
      <mesh castShadow position={[0, ht + 0.05, 0]}>
        <boxGeometry args={[sx + 0.1, 0.1, sz + 0.1]} />
        <meshStandardMaterial
          color={visual.roofColor}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
