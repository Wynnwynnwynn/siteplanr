import React from 'react';
import { useStore } from '../../store.js';
import { CATALOGUE, createCartPayload } from '../../utils.js';

export function TopBar({ leftRef, rightRef }) {
  const placingType  = useStore(s => s.placingType);
  const cancelPlacing = useStore(s => s.cancelPlacing);
  const selectedId   = useStore(s => s.selectedId);
  const items        = useStore(s => s.items);
  const gridStep     = useStore(s => s.gridStep);
  const panels       = useStore(s => s.panels);
  const setPanelOpen = useStore(s => s.setPanelOpen);
  const cartPlatform = useStore(s => s.cartPlatform);
  const setCartPreview = useStore(s => s.setCartPreview);

  const selectedItem = items.find(i => i.id === selectedId);
  const totalWeekly  = items.reduce((s, it) => s + (CATALOGUE[it.type]?.weekly ?? 0), 0);

  const toggleLeft = () => {
    if (panels.left) { leftRef.current?.collapse(); }
    else             { leftRef.current?.expand(); }
  };
  const toggleRight = () => {
    if (panels.right) { rightRef.current?.collapse(); }
    else              { rightRef.current?.expand(); }
  };

  const openQuote = () => {
    setCartPreview(createCartPayload(items, cartPlatform));
  };

  return (
    <header className="h-11 flex-shrink-0 flex items-center px-3 gap-3
                       bg-pf-navy border-b border-pf-steel/30 z-30 select-none">

      {/* Left toggle */}
      <button
        onClick={toggleLeft}
        title={panels.left ? 'Hide catalogue' : 'Show catalogue'}
        className="w-7 h-7 flex items-center justify-center rounded
                   text-pf-steel hover:text-pf-sand hover:bg-pf-steel/20 transition-colors text-sm"
      >
        {panels.left ? '◧' : '▣'}
      </button>

      {/* Brand wordmark */}
      <div className="flex items-center gap-1.5 mr-2">
        <span className="w-2 h-2 rounded-full bg-pf-orange flex-shrink-0" />
        <span className="text-pf-sand font-bold text-sm tracking-widest uppercase">
          PanelFab
        </span>
        <span className="text-pf-steel/60 text-xs font-light ml-1 hidden sm:inline">
          SitePlanr
        </span>
      </div>

      {/* Centre — context status */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {placingType ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-pf-orange animate-pulse flex-shrink-0" />
            <span className="text-pf-sand text-xs font-medium truncate">
              Placing: <strong>{CATALOGUE[placingType]?.label}</strong>
            </span>
            <button
              onClick={cancelPlacing}
              className="text-xs text-pf-steel hover:text-pf-sand px-2 py-0.5 rounded
                         border border-pf-steel/40 hover:border-pf-steel transition-colors flex-shrink-0"
            >
              Esc
            </button>
          </>
        ) : selectedItem ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-pf-steel flex-shrink-0" />
            <span className="text-pf-sand/80 text-xs truncate">
              <strong className="text-pf-sand">{CATALOGUE[selectedItem.type]?.label}</strong>
              <span className="text-pf-steel ml-2 hidden sm:inline">R rotate · C clone · Del delete</span>
            </span>
          </>
        ) : (
          <span className="text-pf-steel text-xs hidden sm:inline">
            Select a building · Drag to move
          </span>
        )}
      </div>

      {/* Right — stats + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-pf-steel text-xs hidden md:inline">
          Grid <strong className="text-pf-sand">{gridStep}m</strong>
        </span>
        <span className="text-pf-steel text-xs hidden sm:inline">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
        {totalWeekly > 0 && (
          <span className="text-pf-sand text-xs font-semibold hidden sm:inline">
            ${totalWeekly}<span className="text-pf-steel font-normal">/wk</span>
          </span>
        )}
        <button
          onClick={openQuote}
          disabled={items.length === 0}
          className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wide
                     bg-pf-orange hover:brightness-110 disabled:opacity-30
                     text-white transition-all"
        >
          Quote
        </button>
      </div>

      {/* Right toggle */}
      <button
        onClick={toggleRight}
        title={panels.right ? 'Hide properties' : 'Show properties'}
        className="w-7 h-7 flex items-center justify-center rounded
                   text-pf-steel hover:text-pf-sand hover:bg-pf-steel/20 transition-colors text-sm"
      >
        {panels.right ? '◨' : '▣'}
      </button>
    </header>
  );
}
