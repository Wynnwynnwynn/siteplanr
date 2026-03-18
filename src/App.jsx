import React, { useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import './index.css';
import { Scene } from './scene/Scene.jsx';
import { Sidebar } from './ui/Sidebar.jsx';
import { Toolbar } from './ui/Toolbar.jsx';
import { CartModal } from './ui/CartModal.jsx';
import { useStore } from './store.js';

export default function App() {
  const placingType = useStore(s => s.placingType);

  useEffect(() => {
    const rev = THREE.REVISION;
    if (Number.isNaN(parseInt(rev, 10))) {
      console.warn('THREE.REVISION not found; ensure single installation of `three`');
    }
  }, []);

  return (
    <div className="fixed inset-0 flex bg-zinc-900">
      {/* Main 3D viewport */}
      <div className={`flex-1 relative ${placingType ? 'cursor-crosshair' : ''}`}>
        <Canvas
          shadows
          camera={{ position: [30, 30, 30], fov: 45, near: 0.1, far: 1000 }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }}
        >
          <Scene />
        </Canvas>
        <Toolbar />
      </div>

      {/* Right sidebar */}
      <Sidebar />

      {/* Cart modal */}
      <CartModal />
    </div>
  );
}
