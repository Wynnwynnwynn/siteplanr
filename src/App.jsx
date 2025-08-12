import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { aabbFrom, aabbOverlap, CATALOGUE, createCartPayload, snapVec3, normalizedYaw } from "./utils.js";

// ---- Store (simple React state; could switch to Zustand if you prefer) ----
function useItems() {
  const [items, setItems] = useState([]);
  const add = (type, pos=[0,0,0]) => {
    const def = CATALOGUE[type];
    if (!def) return;
    setItems(prev => [...prev, {
      id: crypto.randomUUID(),
      type,
      color: "#c9d1d9",
      dims: def.dims,
      yaw: 0,
      pos
    }]);
  };
  const update = (id, patch) => setItems(prev => prev.map(it => it.id===id ? {...it, ...patch} : it));
  const remove = (id) => setItems(prev => prev.filter(it => it.id !== id));
  const clear = () => setItems([]);
  return { items, add, update, remove, clear };
}

// ---- Ground + Raycasting drag helpers ----
function useGroundRaycaster() {
  const { camera, gl, scene } = useThree();
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,1,0), 0), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  return useCallback((event) => {
    // Convert pointer to NDC
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    ndc.set(x, y);
    ray.setFromCamera(ndc, camera);
    const hit = new THREE.Vector3();
    ray.ray.intersectPlane(plane, hit);
    return hit; // Vector3
  }, [gl, camera, ray, plane, ndc]);
}

function Ground({ onMiss }) {
  // Large plane that catches clicks
  return (
    <mesh
      rotation-x={-Math.PI/2}
      onPointerDown={(e) => { e.stopPropagation(); if (onMiss) onMiss(e); }}
      receiveShadow>
      <planeGeometry args={[200,200,1,1]} />
      <meshStandardMaterial color="#e5e7eb" />
    </mesh>
  );
}

// ---- Item mesh (no textures; robust) ----
function ItemMesh({ it, selected, onPointerDown, overlaps }) {
  const matRef = useRef();
  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.color.set(overlaps ? "#ef4444" : (selected ? "#60a5fa" : it.color));
  }, [selected, overlaps, it.color]);

  // Box dims adapt to yaw (0/90/180/270)
  const isQuarter = Math.abs(normalizedYaw(it.yaw) - Math.PI/2) < 1e-6 || Math.abs(normalizedYaw(it.yaw) - 3*Math.PI/2) < 1e-6;
  const len = it.dims.len;
  const wid = it.dims.wid;
  const ht  = it.dims.ht;
  const sx = isQuarter ? wid : len;
  const sz = isQuarter ? len : wid;

  return (
    <mesh
      position={it.pos}
      rotation={[0, normalizedYaw(it.yaw), 0]}
      castShadow
      onPointerDown={(e)=>{ e.stopPropagation(); onPointerDown?.(e, it.id); }}>
      <boxGeometry args={[sx, ht, sz]} />
      <meshStandardMaterial ref={matRef} />
    </mesh>
  );
}

// ---- Scene root with interactions ----
function Scene({ items, add, update, remove }) {
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [gridStep, setGridStep] = useState(1);
  const rayToGround = useGroundRaycaster();

  // Overlap calc
  const overlapsId = useCallback((id) => {
    const a = items.find(i => i.id === id);
    if (!a) return false;
    const A = aabbFrom(a);
    for (const b of items) {
      if (b.id === id) continue;
      if (aabbOverlap(A, aabbFrom(b))) return true;
    }
    return false;
  }, [items]);

  // Dragging
  const onPointerDownItem = useCallback((e, id) => {
    setSelectedId(id);
    setDraggingId(id);
  }, []);
  const onPointerMove = useCallback((e) => {
    if (!draggingId) return;
    const hit = rayToGround(e);
    if (!hit) return;
    const it = items.find(i => i.id === draggingId);
    if (!it) return;
    const [x, y, z] = snapVec3([hit.x, it.pos[1], hit.z], gridStep);
    update(draggingId, { pos: [x, y, z] });
  }, [draggingId, items, gridStep, update, rayToGround]);
  const onPointerUp = useCallback(()=> setDraggingId(null), []);

  // Miss click clears selection
  const onMiss = useCallback(()=> setSelectedId(null), []);

  // Keyboard: R rotate, C clone, Delete remove, G toggle snap size
  useEffect(()=> {
    const onKey = (e) => {
      if (!selectedId) return;
      const it = items.find(i => i.id === selectedId);
      if (!it) return;
      if (e.key === 'r' || e.key === 'R') {
        update(selectedId, { yaw: normalizedYaw(it.yaw + Math.PI/2) });
      } else if (e.key === 'c' || e.key === 'C') {
        const offset = 0.5;
        const newPos = [it.pos[0] + offset, it.pos[1], it.pos[2] + offset];
        const n = { ...it, id: crypto.randomUUID(), pos: newPos };
        // Reuse add/update for immutability
        const copy = { type:n.type, pos:n.pos };
        add(copy.type, copy.pos);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        remove(selectedId);
        setSelectedId(null);
      } else if (e.key === 'g' || e.key === 'G') {
        setGridStep(s => (s===1?0.5: s===0.5?0.25:1));
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerup', onPointerUp);
    return ()=> {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [selectedId, items, add, remove, update, onPointerUp]);

  // Lights, camera controls
  return (
    <>
      <ambientLight intensity={0.5}/>
      <directionalLight position={[10,15,10]} castShadow intensity={0.8}/>
      <gridHelper args={[200, 200]} />
      <Ground onMiss={onMiss} />
      {items.map(it => (
        <ItemMesh
          key={it.id}
          it={it}
          selected={it.id === selectedId}
          overlaps={overlapsId(it.id)}
          onPointerDown={onPointerDownItem}
        />
      ))}
      <OrbitControls makeDefault enablePan enableRotate enableZoom />
      {/* Pointer move on the whole canvas area */}
      <PointerCatcher onPointerMove={onPointerMove} />
    </>
  );
}

// Catch pointer-move at root without touching null refs
function PointerCatcher({ onPointerMove }) {
  const { gl } = useThree();
  useEffect(()=> {
    const el = gl?.domElement;
    if (!el || !onPointerMove) return;
    el.addEventListener('pointermove', onPointerMove, { passive:true });
    return () => el.removeEventListener('pointermove', onPointerMove);
  }, [gl, onPointerMove]);
  return null;
}

// ---- UI overlay (basic, no external UI libs) ----
function UI({ items, add, setCartPreview }) {
  const [sel, setSel] = useState("office6m");
  const [platform, setPlatform] = useState("generic");
  const addAtOrigin = () => add(sel, [0,0,0]);
  const openCart = () => setCartPreview(createCartPayload(items, platform));
  return (
    <div style={{
      position:"absolute", top:12, left:12, padding:12, background:"rgba(255,255,255,0.95)",
      border:"1px solid #e5e7eb", borderRadius:8, fontFamily:"system-ui, sans-serif", fontSize:14
    }}>
      <div style={{marginBottom:8, fontWeight:600}}>Add item</div>
      <select value={sel} onChange={e=>setSel(e.target.value)} style={{marginRight:8}}>
        {Object.entries(CATALOGUE).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
      </select>
      <button onClick={addAtOrigin}>Add</button>
      <div style={{marginTop:12}}>
        <label>Cart platform: </label>
        <select value={platform} onChange={e=>setPlatform(e.target.value)} style={{marginLeft:8}}>
          <option value="generic">Generic</option>
          <option value="shopify">Shopify</option>
          <option value="stripe">Stripe</option>
        </select>
        <button onClick={openCart} style={{marginLeft:8}}>Checkout (preview)</button>
      </div>
      <div style={{marginTop:8, color:"#6b7280"}}>Hotkeys: R rotate, C clone, Del delete, G grid size</div>
    </div>
  );
}

function CartModal({ preview, onClose }) {
  if (!preview) return null;
  return (
    <div style={{
      position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", display:"flex",
      alignItems:"center", justifyContent:"center"
    }}>
      <div style={{ background:"#fff", padding:16, width:420, borderRadius:8, maxHeight:"70vh", overflow:"auto" }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3 style={{margin:0}}>Cart payload</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(preview, null, 2)}</pre>
      </div>
    </div>
  );
}

function App() {
  const { items, add, update, remove, clear } = useItems();
  const [cartPreview, setCartPreview] = useState(null);

  // One-time self-check for library versions (helps catch duplicate 'three')
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const rev = THREE.REVISION;
    if (Number.isNaN(parseInt(rev,10))) {
      console.warn("THREE.REVISION not found; ensure single installation of `three`");
    }
  }, []);

  return (
    <div style={{position:"fixed", inset:0}}>
      <Canvas
        shadows
        onCreated={({ gl }) => {
          // Nothing fancy: ensure WebGL context is stable before interactions
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}>
        <Scene items={items} add={add} update={update} remove={remove}/>
      </Canvas>
      <UI items={items} add={add} setCartPreview={setCartPreview}/>
      <CartModal preview={cartPreview} onClose={()=>setCartPreview(null)}/>
      {/* bottom-right clear scene */}
      <div style={{position:"absolute", right:12, bottom:12}}>
        <button onClick={clear}>Clear scene</button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
