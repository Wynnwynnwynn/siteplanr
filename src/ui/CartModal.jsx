import React from 'react';
import { useStore } from '../store.js';

export function CartModal() {
  const cartPreview = useStore(s => s.cartPreview);
  const closeCart = useStore(s => s.closeCart);

  if (!cartPreview) return null;

  const lines = cartPreview.lines ?? cartPreview.items ?? cartPreview.line_items;
  const isGeneric = Array.isArray(cartPreview.lines);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={closeCart}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl w-[480px] max-h-[80vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <h2 className="text-white font-bold text-lg">Quote Summary</h2>
          <button
            onClick={closeCart}
            className="text-zinc-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </header>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          {isGeneric && cartPreview.lines?.map(line => (
            <div key={line.sku} className="flex justify-between py-2.5 border-b border-zinc-800 text-sm">
              <span className="text-zinc-300">
                {line.label} × {line.qty}
              </span>
              <span className="text-green-400 font-medium">
                ${line.weekly * line.qty}/wk
              </span>
            </div>
          ))}

          {!isGeneric && (
            <pre className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(cartPreview, null, 2)}
            </pre>
          )}

          {isGeneric && cartPreview.lines?.length > 0 && (
            <div className="flex justify-between pt-3 text-sm font-semibold">
              <span className="text-zinc-300">Total</span>
              <span className="text-green-400">
                ${cartPreview.lines.reduce((s, l) => s + l.weekly * l.qty, 0)}/wk
              </span>
            </div>
          )}
        </div>

        <footer className="px-5 py-4 border-t border-zinc-700 text-xs text-zinc-500">
          Currency: {cartPreview.currency ?? 'AUD'}
        </footer>
      </div>
    </div>
  );
}
