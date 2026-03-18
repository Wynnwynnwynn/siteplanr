import React from 'react';
import { useStore } from '../store.js';

export function CartModal() {
  const cartPreview = useStore(s => s.cartPreview);
  const closeCart   = useStore(s => s.closeCart);

  if (!cartPreview) return null;

  const isGeneric = Array.isArray(cartPreview.lines);
  const total = isGeneric
    ? cartPreview.lines.reduce((s, l) => s + l.weekly * l.qty, 0)
    : 0;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={closeCart}
    >
      <div
        className="bg-pf-navy border border-pf-steel/30 rounded-lg w-[480px] max-h-[80vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-pf-steel/20">
          <div>
            <h2 className="text-pf-sand font-bold text-base tracking-wide">Quote Export</h2>
            <p className="text-pf-steel text-xs mt-0.5">PANELFAB SitePlanr</p>
          </div>
          <button
            onClick={closeCart}
            className="text-pf-steel hover:text-pf-sand text-lg transition-colors w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {isGeneric && cartPreview.lines?.map(line => (
            <div key={line.sku} className="flex justify-between py-2.5 border-b border-pf-steel/10 text-sm">
              <span className="text-pf-sand/80">{line.label} × {line.qty}</span>
              <span className="text-pf-sand font-medium">${line.weekly * line.qty}/wk</span>
            </div>
          ))}

          {!isGeneric && (
            <pre className="text-xs text-pf-steel whitespace-pre-wrap leading-relaxed font-mono">
              {JSON.stringify(cartPreview, null, 2)}
            </pre>
          )}

          {isGeneric && total > 0 && (
            <div className="flex justify-between pt-3 text-sm font-bold border-t border-pf-steel/20 mt-1">
              <span className="text-pf-sand">Total</span>
              <span className="text-pf-orange">${total}/wk</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-5 py-3 border-t border-pf-steel/20 flex items-center gap-2">
          <span className="text-pf-steel text-xs">Currency: {cartPreview.currency ?? 'AUD'}</span>
          <button
            onClick={closeCart}
            className="ml-auto px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide
                       bg-pf-orange hover:brightness-110 text-white transition-all"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
