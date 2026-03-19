import React from 'react';
import { useStore } from '../../store.js';
import { CATALOGUE, createCartPayload } from '../../utils.js';
import { Dropdown } from './Dropdown.jsx';
import { MenuItem, MenuDivider, MenuLabel } from './MenuItem.jsx';

export function MenuBar({ leftRef, rightRef, bottomRef }) {
  const placingType = useStore(s => s.placingType);
  const cancelPlacing = useStore(s => s.cancelPlacing);
  const selectedId = useStore(s => s.selectedId);
  const items = useStore(s => s.items);
  const gridStep = useStore(s => s.gridStep);
  const cycleGridStep = useStore(s => s.cycleGridStep);
  const panels = useStore(s => s.panels);
  const setPanelOpen = useStore(s => s.setPanelOpen);
  const clearItems = useStore(s => s.clearItems);
  const cartPlatform = useStore(s => s.cartPlatform);
  const setCartPlatform = useStore(s => s.setCartPlatform);
  const setCartPreview = useStore(s => s.setCartPreview);

  const selectedItem = items.find(i => i.id === selectedId);
  const totalWeekly = items.reduce((s, it) => s + (CATALOGUE[it.type]?.weekly ?? 0), 0);

  const toggleLeft = () => {
    if (panels.left) leftRef.current?.collapse();
    else leftRef.current?.expand();
  };

  const toggleRight = () => {
    if (panels.right) rightRef.current?.collapse();
    else rightRef.current?.expand();
  };

  const toggleBottom = () => {
    if (panels.bottom) bottomRef.current?.collapse();
    else bottomRef.current?.expand();
  };

  const openQuote = () => {
    setCartPreview(createCartPayload(items, cartPlatform));
  };

  return (
    <header className="flex-shrink-0 flex flex-col bg-pf-navy border-b border-pf-steel/30 z-30 select-none">
      {/* Top row: menus + branding */}
      <div className="h-11 flex items-center px-3 gap-2">
        {/* File menu */}
        <Dropdown trigger="File">
          <MenuLabel>Project</MenuLabel>
          <MenuItem
            label="Clear all items"
            subtitle={`${items.length} placed`}
            onClick={clearItems}
            disabled={items.length === 0}
          />
          <MenuDivider />
          <MenuItem label="Export" onClick={openQuote} disabled={items.length === 0} />
          <MenuItem label="Settings" onClick={() => {}} />
        </Dropdown>

        {/* View menu */}
        <Dropdown trigger="View">
          <MenuLabel>Panels</MenuLabel>
          <MenuItem
            label={`${panels.left ? '✓' : '  '} Catalogue`}
            onClick={toggleLeft}
          />
          <MenuItem
            label={`${panels.right ? '✓' : '  '} Properties`}
            onClick={toggleRight}
          />
          <MenuItem
            label={`${panels.bottom ? '✓' : '  '} Summary`}
            onClick={toggleBottom}
          />
          <MenuDivider />
          <MenuLabel>Grid</MenuLabel>
          <MenuItem
            label={`Grid step: ${gridStep}m`}
            subtitle="Press G to cycle"
            onClick={cycleGridStep}
          />
        </Dropdown>

        {/* Help menu */}
        <Dropdown trigger="Help">
          <MenuLabel>Shortcuts</MenuLabel>
          <div className="px-3 py-2 space-y-1 text-xs text-pf-steel">
            <div><span className="font-medium text-pf-sand">Click</span> to place/select</div>
            <div><span className="font-medium text-pf-sand">R</span> Rotate</div>
            <div><span className="font-medium text-pf-sand">C</span> Clone</div>
            <div><span className="font-medium text-pf-sand">Del</span> Delete</div>
            <div><span className="font-medium text-pf-sand">G</span> Cycle grid</div>
            <div><span className="font-medium text-pf-sand">Esc</span> Cancel placing</div>
          </div>
        </Dropdown>

        {/* Brand */}
        <div className="flex items-center gap-1.5 ml-2 mr-auto pl-2 border-l border-pf-steel/20">
          <span className="w-2 h-2 rounded-full bg-pf-orange flex-shrink-0" />
          <span className="text-pf-sand font-bold text-sm tracking-widest uppercase">
            PanelFab
          </span>
          <span className="text-pf-steel/60 text-xs font-light ml-1 hidden sm:inline">
            SitePlanr
          </span>
        </div>

        {/* Status/Context (centre-right) */}
        <div className="flex items-center gap-2">
          {placingType ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-pf-orange animate-pulse flex-shrink-0" />
              <span className="text-pf-sand text-xs font-medium hidden sm:inline">
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
              <span className="text-pf-sand/80 text-xs hidden sm:inline truncate">
                <strong className="text-pf-sand">{CATALOGUE[selectedItem.type]?.label}</strong>
              </span>
            </>
          ) : null}
        </div>

        {/* Stats (right side) */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-3 pl-3 border-l border-pf-steel/20">
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
                       text-white transition-all flex-shrink-0"
          >
            Quote
          </button>
        </div>
      </div>
    </header>
  );
}
