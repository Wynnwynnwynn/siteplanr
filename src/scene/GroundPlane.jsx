import React from 'react';

export function GroundPlane({ onPointerMove, onClick }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onPointerMove={onPointerMove}
      onClick={onClick}
    >
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#1a1f2e" roughness={0.9} metalness={0} />
    </mesh>
  );
}
