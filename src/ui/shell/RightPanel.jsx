import React from 'react';
import { useStore } from '../../store.js';
import { CATALOGUE, normalizedYaw } from '../../utils.js';
import { ITEM_VISUALS } from '../../scene/itemVisuals.js';

function ActionBtn({ label, shortcut, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded text-xs min-w-0
        transition-colors border flex-shrink-0
        ${danger
          ? 'border-red-800/40 text-red-400 hover:bg-red-900/20'
          : 'border-pf-steel/30 text-pf-steel hover:text-pf-sand hover:bg-pf-steel/10'
        }`}
    >
      <span className="font-medium truncate">{label}</span>
      <span className="opacity-50 text-[10px]">{shortcut}</span>
    </button>
  );
}

export function RightPanel() {
  const selectedId  = useStore(s => s.selectedId);
  const items       = useStore(s => s.items);
  const updateItem  = useStore(s => s.updateItem);
  const removeItem  = useStore(s => s.removeItem);
  const setSelectedId = useStore(s => s.setSelectedId);
  const addItem     = useStore(s => s.addItem);

  const item = items.find(i => i.id === selectedId);
  const def  = item ? CATALOGUE[item.type] : null;
  const visual = item ? (ITEM_VISUALS[item.type] ?? {}) : null;

  const rotate = () => item && updateItem(item.id, { yaw: normalizedYaw(item.yaw + Math.PI / 2) });
  const clone  = () => {
    if (!item) return;
    const offset = Math.max(item.dims.len, item.dims.wid) * 0.5 + 0.5;
    addItem(item.type, [item.pos[0] + offset, item.pos[1], item.pos[2] + offset]);
  };
  const del = () => {
    if (!item) return;
    removeItem(item.id);
    setSelectedId(null);
  };

  return (
    <div className="h-full flex flex-col gap-0 bg-pf-graphite border-l border-pf-steel/20">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-pf-steel/20 flex-shrink-0 flex items-center justify-between gap-2">
        <p className="text-pf-sand text-xs font-semibold uppercase tracking-widest">
          Properties
        </p>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {!item ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center gap-2">
            <div className="w-8 h-8 rounded border border-pf-steel/30 flex items-center justify-center flex-shrink-0">
              <span className="text-pf-steel/40 text-lg">□</span>
            </div>
            <p className="text-pf-steel text-xs">Select a building to inspect</p>
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-4">
            {/* Type + colour */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <span
                className="w-4 h-4 rounded-sm border border-black/20 flex-shrink-0"
                style={{ backgroundColor: visual?.wallColor ?? '#4E6E81' }}
              />
              <div className="min-w-0">
                <p className="text-pf-sand text-sm font-semibold truncate">{def?.label}</p>
                <p className="text-pf-steel text-xs truncate">{item.type}</p>
              </div>
            </div>

            {/* Dimensions */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-pf-steel text-xs uppercase tracking-wider">Dimensions</p>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: 'L', val: item.dims.len },
                  { label: 'W', val: item.dims.wid },
                  { label: 'H', val: item.dims.ht },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-pf-navy/50 rounded p-1.5 text-center flex flex-col items-center justify-center min-w-0">
                    <p className="text-pf-steel text-[10px] leading-tight">{label}</p>
                    <p className="text-pf-sand text-xs font-mono">{val}m</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-pf-steel text-xs uppercase tracking-wider">Position</p>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Z', 'Yaw'].map((label, i) => {
                  const val = i === 0 ? item.pos[0].toFixed(1)
                            : i === 1 ? item.pos[2].toFixed(1)
                            : `${Math.round(normalizedYaw(item.yaw) * 180 / Math.PI)}°`;
                  return (
                    <div key={label} className="bg-pf-navy/50 rounded p-1.5 text-center flex flex-col items-center justify-center min-w-0">
                      <p className="text-pf-steel text-[10px] leading-tight">{label}</p>
                      <p className="text-pf-sand text-xs font-mono">{val}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly cost */}
            <div className="flex justify-between items-center py-2 border-t border-pf-steel/20 flex-shrink-0">
              <span className="text-pf-steel text-xs">Weekly hire</span>
              <span className="text-pf-sand text-sm font-bold flex-shrink-0">${def?.weekly}/wk</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-pf-steel text-xs uppercase tracking-wider">Actions</p>
              <div className="flex gap-1.5 min-w-0">
                <ActionBtn label="Rotate" shortcut="R" onClick={rotate} />
                <ActionBtn label="Clone"  shortcut="C" onClick={clone} />
                <ActionBtn label="Delete" shortcut="Del" onClick={del} danger />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
