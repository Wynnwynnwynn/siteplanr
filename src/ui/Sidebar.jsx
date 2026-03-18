import React from 'react';
import { useStore } from '../store.js';
import { CATALOGUE, createCartPayload } from '../utils.js';
import { ITEM_VISUALS } from '../scene/itemVisuals.js';

const CATEGORIES = [
  { label: 'Offices', items: ['office6m', 'office12m'] },
  { label: 'Welfare', items: ['toilet', 'ablution', 'lunch'] },
  { label: 'Storage', items: ['cont20', 'cont40'] },
];

export function Sidebar() {
  const placingType = useStore(s => s.placingType);
  const setPlacingType = useStore(s => s.setPlacingType);
  const cancelPlacing = useStore(s => s.cancelPlacing);
  const items = useStore(s => s.items);
  const clearItems = useStore(s => s.clearItems);
  const cartPlatform = useStore(s => s.cartPlatform);
  const setCartPlatform = useStore(s => s.setCartPlatform);
  const setCartPreview = useStore(s => s.setCartPreview);

  const totalWeekly = items.reduce((sum, it) => sum + (CATALOGUE[it.type]?.weekly ?? 0), 0);

  const openCart = () => {
    const payload = createCartPayload(items, cartPlatform);
    setCartPreview(payload);
  };

  return (
    <aside className="w-64 bg-zinc-900 border-l border-zinc-700 flex flex-col">
      <header className="p-4 border-b border-zinc-700">
        <h1 className="text-white font-bold text-lg tracking-wide">SitePlanr</h1>
        <p className="text-zinc-400 text-xs mt-1">
          {items.length} item{items.length !== 1 ? 's' : ''} placed
          {totalWeekly > 0 && (
            <span className="text-green-400 ml-2">${totalWeekly}/wk</span>
          )}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {CATEGORIES.map(cat => (
          <div key={cat.label}>
            <h2 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
              {cat.label}
            </h2>
            <div className="space-y-1">
              {cat.items.map(typeKey => {
                const def = CATALOGUE[typeKey];
                const visual = ITEM_VISUALS[typeKey];
                const isActive = placingType === typeKey;
                return (
                  <button
                    key={typeKey}
                    onClick={() => isActive ? cancelPlacing() : setPlacingType(typeKey)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors
                      ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                      }`}
                  >
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: visual?.wallColor ?? '#94a3b8' }}
                    />
                    <span className="text-sm font-medium">{def?.label}</span>
                    <span className="ml-auto text-xs text-zinc-500">
                      ${def?.weekly}/wk
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <footer className="p-3 border-t border-zinc-700 space-y-2">
        <div className="flex gap-2">
          <select
            value={cartPlatform}
            onChange={e => setCartPlatform(e.target.value)}
            className="flex-1 bg-zinc-800 text-zinc-300 border border-zinc-600 rounded px-2 py-1.5 text-sm"
          >
            <option value="generic">Generic</option>
            <option value="shopify">Shopify</option>
            <option value="stripe">Stripe</option>
          </select>
          <button
            onClick={openCart}
            disabled={items.length === 0}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors"
          >
            Quote
          </button>
        </div>
        <button
          onClick={clearItems}
          className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-1"
        >
          Clear scene
        </button>
        <p className="text-zinc-600 text-xs">
          R rotate · C clone · Del delete · G grid
        </p>
      </footer>
    </aside>
  );
}
