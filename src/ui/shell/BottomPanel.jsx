import React, { useState } from 'react';
import { useStore } from '../../store.js';
import { CATALOGUE, createCartPayload } from '../../utils.js';

const TABS = ['Items', 'Quote'];

function ItemsTab({ items }) {
  // Group by type
  const grouped = {};
  for (const it of items) {
    grouped[it.type] = (grouped[it.type] ?? 0) + 1;
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-pf-steel text-xs">
        No items placed yet — click a building in the catalogue to start
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-pf-steel/20">
            <th className="text-left px-4 py-2 text-pf-steel font-semibold uppercase tracking-wider">Building</th>
            <th className="text-center px-2 py-2 text-pf-steel font-semibold uppercase tracking-wider">Qty</th>
            <th className="text-right px-4 py-2 text-pf-steel font-semibold uppercase tracking-wider">Cost/wk</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([type, qty]) => {
            const def = CATALOGUE[type];
            return (
              <tr key={type} className="border-b border-pf-steel/10 hover:bg-pf-steel/5">
                <td className="px-4 py-1.5 text-pf-sand">{def?.label ?? type}</td>
                <td className="px-2 py-1.5 text-center text-pf-steel">{qty}</td>
                <td className="px-4 py-1.5 text-right text-pf-sand">${(def?.weekly ?? 0) * qty}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function QuoteTab({ items }) {
  const cartPlatform   = useStore(s => s.cartPlatform);
  const setCartPlatform = useStore(s => s.setCartPlatform);
  const setCartPreview  = useStore(s => s.setCartPreview);

  const payload = createCartPayload(items, cartPlatform);
  const lines   = payload.lines ?? [];
  const total   = lines.reduce((s, l) => s + l.weekly * l.qty, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {lines.length === 0 ? (
          <p className="text-pf-steel text-xs text-center mt-4">No items placed</p>
        ) : lines.map(line => (
          <div key={line.sku} className="flex justify-between py-1.5 border-b border-pf-steel/10 text-xs">
            <span className="text-pf-sand/80">{line.label} × {line.qty}</span>
            <span className="text-pf-sand">${line.weekly * line.qty}/wk</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-t border-pf-steel/20 flex-shrink-0">
        <select
          value={cartPlatform}
          onChange={e => setCartPlatform(e.target.value)}
          className="bg-pf-navy text-pf-steel border border-pf-steel/30 rounded px-2 py-1 text-xs"
        >
          <option value="generic">Generic</option>
          <option value="shopify">Shopify</option>
          <option value="stripe">Stripe</option>
        </select>

        {total > 0 && (
          <span className="text-pf-sand text-sm font-bold ml-auto mr-3">
            ${total}<span className="text-pf-steel text-xs font-normal">/wk</span>
          </span>
        )}

        <button
          onClick={() => setCartPreview(payload)}
          disabled={items.length === 0}
          className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide
                     bg-pf-orange hover:brightness-110 disabled:opacity-30
                     text-white transition-all"
        >
          Export
        </button>
      </div>
    </div>
  );
}

export function BottomPanel({ panelRef }) {
  const [tab, setTab] = useState('Items');
  const items = useStore(s => s.items);
  const panels = useStore(s => s.panels);
  const setPanelOpen = useStore(s => s.setPanelOpen);

  const totalWeekly = items.reduce((s, it) => s + (CATALOGUE[it.type]?.weekly ?? 0), 0);

  return (
    <div className="h-full flex flex-col bg-pf-navy border-t border-pf-steel/30 overflow-hidden">
      {/* Tab bar with header info */}
      <div className="flex items-center justify-between border-b border-pf-steel/20 flex-shrink-0 px-3">
        <div className="flex items-center gap-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px
                ${tab === t
                  ? 'text-pf-sand border-pf-orange'
                  : 'text-pf-steel border-transparent hover:text-pf-sand hover:border-pf-steel/40'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {totalWeekly > 0 && (
            <span className="text-pf-steel text-xs">
              Total <strong className="text-pf-sand">${totalWeekly}/wk</strong>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {tab === 'Items' ? <ItemsTab items={items} /> : <QuoteTab items={items} />}
      </div>
    </div>
  );
}
