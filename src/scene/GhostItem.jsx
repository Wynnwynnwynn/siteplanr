import React from 'react';
import { useStore } from '../store.js';
import { CATALOGUE, aabbFrom, aabbOverlap } from '../utils.js';
import { ITEM_VISUALS } from './itemVisuals.js';

export function GhostItem() {
  const placingType = useStore(s => s.placingType);
  const ghostPos = useStore(s => s.ghostPos);
  const ghostYaw = useStore(s => s.ghostYaw);
  const items = useStore(s => s.items);

  if (!placingType || !ghostPos) return null;

  const def = CATALOGUE[placingType];
  if (!def) return null;

  const visual = ITEM_VISUALS[placingType] ?? { wallColor: '#60a5fa', roofColor: '#2563eb' };

  // Check overlap at ghost position
  const ghostItem = {
    pos: ghostPos,
    yaw: ghostYaw,
    dims: def.dims,
    id: '__ghost__',
  };
  const ghostAABB = aabbFrom(ghostItem);
  const hasOverlap = items.some(it => aabbOverlap(ghostAABB, aabbFrom(it)));

  const color = hasOverlap ? '#ef4444' : '#60a5fa';
  const ht = def.dims.ht;
  const len = def.dims.len;
  const wid = def.dims.wid;

  return (
    <group position={ghostPos} rotation={[0, ghostYaw, 0]} renderOrder={999}>
      <mesh position={[0, ht / 2, 0]}>
        <boxGeometry args={[len, ht, wid]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, ht + 0.05, 0]}>
        <boxGeometry args={[len + 0.1, 0.1, wid + 0.1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
