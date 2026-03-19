import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import './index.css';
import { Scene } from './scene/Scene.jsx';
import { CartModal } from './ui/CartModal.jsx';
import { TopBar } from './ui/shell/TopBar.jsx';
import { LeftPanel } from './ui/shell/LeftPanel.jsx';
import { RightPanel } from './ui/shell/RightPanel.jsx';
import { BottomPanel } from './ui/shell/BottomPanel.jsx';
import { useStore } from './store.js';

// Simple media query hook for mobile defaults
function useIsMobile() {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
}

export default function App() {
  const placingType  = useStore(s => s.placingType);
  const setPanelOpen = useStore(s => s.setPanelOpen);
  const isMobile     = useIsMobile();

  // v4 uses panelRef prop for imperative API
  const leftRef   = useRef(null);
  const rightRef  = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const rev = THREE.REVISION;
    if (Number.isNaN(parseInt(rev, 10))) {
      console.warn('THREE.REVISION not found; ensure single installation of `three`');
    }
  }, []);

  // Collapse side panels on mobile on first render
  useEffect(() => {
    if (isMobile) {
      leftRef.current?.collapse();
      rightRef.current?.collapse();
    }
  }, [isMobile]);

  return (
    <div className="fixed inset-0 flex flex-col bg-pf-graphite">
      {/* Fixed top bar */}
      <TopBar leftRef={leftRef} rightRef={rightRef} />

      {/* Vertical panel group: main row + bottom */}
      <PanelGroup direction="vertical" className="flex-1 min-h-0">

        {/* Main row: left | viewport | right */}
        <Panel defaultSize={100} minSize={40}>
          <PanelGroup direction="horizontal" className="h-full">

            {/* Left — Building catalogue (expandable right) */}
            <Panel
              panelRef={leftRef}
              collapsible
              defaultSize={isMobile ? 0 : 22}
              minSize={8}
              maxSize={40}
              onCollapse={() => setPanelOpen('left', false)}
              onExpand={() => setPanelOpen('left', true)}
              className="min-w-0 relative"
            >
              <LeftPanel />
            </Panel>

            {/* Resize handle — left (thicker, more visible) */}
            <PanelResizeHandle className="w-1.5 bg-pf-steel/20 hover:bg-pf-orange transition-all cursor-col-resize" />

            {/* Centre — 3D Viewport */}
            <Panel minSize={25} className="relative min-w-0">
              <div className={`absolute inset-0 ${placingType ? 'cursor-crosshair' : ''}`}>
                <Canvas
                  shadows
                  camera={{ position: [30, 30, 30], fov: 45, near: 0.1, far: 1000 }}
                  onCreated={({ gl }) => {
                    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                  }}
                >
                  <Scene />
                </Canvas>
              </div>
            </Panel>

            {/* Resize handle — right (thicker, more visible) */}
            <PanelResizeHandle className="w-1.5 bg-pf-steel/20 hover:bg-pf-orange transition-all cursor-col-resize" />

            {/* Right — Properties inspector (expandable left) */}
            <Panel
              panelRef={rightRef}
              collapsible
              defaultSize={isMobile ? 0 : 23}
              minSize={8}
              maxSize={40}
              onCollapse={() => setPanelOpen('right', false)}
              onExpand={() => setPanelOpen('right', true)}
              className="min-w-0 relative"
            >
              <RightPanel />
            </Panel>

          </PanelGroup>
        </Panel>

        {/* Resize handle — bottom (thicker, more visible) */}
        <PanelResizeHandle className="h-1.5 bg-pf-steel/20 hover:bg-pf-orange transition-all cursor-row-resize" />

        {/* Bottom — Site summary + quote (expandable up) */}
        <Panel
          panelRef={bottomRef}
          collapsible
          defaultSize={isMobile ? 20 : 18}
          minSize={8}
          maxSize={50}
          onCollapse={() => setPanelOpen('bottom', false)}
          onExpand={() => setPanelOpen('bottom', true)}
          className="min-h-0"
        >
          <BottomPanel panelRef={bottomRef} />
        </Panel>

      </PanelGroup>

      {/* Cart export modal (overlay) */}
      <CartModal />
    </div>
  );
}
