import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store.js';
import { snapVec3, normalizedYaw } from '../utils.js';

export function useSceneInteractions() {
  const { camera, gl } = useThree();
  const store = useStore();

  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  const getGroundHit = useCallback((event) => {
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX ?? event.nativeEvent?.clientX;
    const clientY = event.clientY ?? event.nativeEvent?.clientY;
    if (clientX == null) return null;
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    ndc.set(x, y);
    ray.setFromCamera(ndc, camera);
    const hit = new THREE.Vector3();
    ray.ray.intersectPlane(plane, hit);
    return hit;
  }, [gl, camera, ray, plane, ndc]);

  const onGroundPointerMove = useCallback((e) => {
    const hit = getGroundHit(e.nativeEvent ?? e);
    if (!hit) return;

    const state = useStore.getState();
    if (state.placingType) {
      const snapped = snapVec3([hit.x, 0, hit.z], state.gridStep);
      state.setGhostPos(snapped);
    } else if (state.draggingId) {
      const it = state.items.find(i => i.id === state.draggingId);
      if (!it) return;
      const snapped = snapVec3([hit.x, it.pos[1], hit.z], state.gridStep);
      state.updateItem(state.draggingId, { pos: snapped });
    }
  }, [getGroundHit]);

  const onGroundClick = useCallback((e) => {
    e.stopPropagation();
    const state = useStore.getState();
    if (state.placingType && state.ghostPos) {
      state.addItem(state.placingType, state.ghostPos);
      // Keep placement mode active for rapid placement — Escape to exit
    } else {
      state.setSelectedId(null);
    }
  }, []);

  // Keyboard + pointer-up
  useEffect(() => {
    const onPointerUp = () => useStore.getState().setDraggingId(null);

    const onKey = (e) => {
      const state = useStore.getState();

      if (e.key === 'Escape') {
        state.cancelPlacing();
        return;
      }

      if (state.placingType) {
        if (e.key === 'r' || e.key === 'R') {
          state.setGhostYaw(normalizedYaw(state.ghostYaw + Math.PI / 2));
        }
        return;
      }

      if (!state.selectedId) {
        if (e.key === 'g' || e.key === 'G') state.cycleGridStep();
        return;
      }

      const it = state.items.find(i => i.id === state.selectedId);
      if (!it) return;

      if (e.key === 'r' || e.key === 'R') {
        state.updateItem(state.selectedId, { yaw: normalizedYaw(it.yaw + Math.PI / 2) });
      } else if (e.key === 'c' || e.key === 'C') {
        const offset = Math.max(it.dims.len, it.dims.wid) * 0.5 + 0.5;
        state.addItem(it.type, [it.pos[0] + offset, it.pos[1], it.pos[2] + offset]);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        state.removeItem(state.selectedId);
        state.setSelectedId(null);
      } else if (e.key === 'g' || e.key === 'G') {
        state.cycleGridStep();
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return { onGroundPointerMove, onGroundClick };
}
