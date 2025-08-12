// --- Grid & math helpers ---
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const snap = (v, step) => Math.round(v / step) * step;

// Snap Vec3 (x,z on grid). y stays the same.
export function snapVec3([x,y,z], step=1) {
  return [snap(x, step), y, snap(z, step)];
}

// Only support 0/90/180/270 for simple AABB (swap w/h on 90/270)
export function normalizedYaw(yawRad) {
  const tau = Math.PI * 2;
  let a = ((yawRad % tau) + tau) % tau; // 0..2π
  // snap to quarter-turns
  const q = Math.round(a / (Math.PI/2)) % 4;
  return q * (Math.PI/2);
}

export function dimsForYaw(dims, yawRad) {
  const a = normalizedYaw(yawRad);
  const swap = (a === Math.PI/2 || a === 3*Math.PI/2);
  const { len, wid, ht } = dims;
  return { len: swap ? wid : len, wid: swap ? len : wid, ht };
}

// --- AABB helpers (XZ plane, y ignored for placement) ---
export function aabbFrom(item) {
  const { pos, yaw, dims } = item; // pos [x,y,z]
  const d = dimsForYaw(dims, yaw);
  const hx = d.len / 2;
  const hz = d.wid / 2;
  return {
    min: [pos[0] - hx, pos[2] - hz],
    max: [pos[0] + hx, pos[2] + hz]
  };
}

export function aabbOverlap(a, b) {
  return !(
    a.max[0] <= b.min[0] ||
    a.min[0] >= b.max[0] ||
    a.max[1] <= b.min[1] ||
    a.min[1] >= b.max[1]
  );
}

// --- Catalogue & cart ---
export const CATALOGUE = {
  office6m:   { sku: "OFF-6",  label: "Office 6m",        dims:{len:6,  wid:3,  ht:2.7}, weekly: 210 },
  office12m:  { sku: "OFF-12", label: "Office 12m",       dims:{len:12, wid:3,  ht:2.7}, weekly: 380 },
  toilet:     { sku: "TOI-2",  label: "Toilet (2 pan)",   dims:{len:2.4,wid:1.4,ht:2.7}, weekly: 120 },
  ablution:   { sku: "ABL-6",  label: "Ablution 6m",      dims:{len:6,  wid:3,  ht:2.7}, weekly: 260 },
  lunch:      { sku: "LUN-6",  label: "Lunchroom 6m",     dims:{len:6,  wid:3,  ht:2.7}, weekly: 230 },
  cont20:     { sku: "CON-20", label: "Container 20ft",   dims:{len:6.06,wid:2.44,ht:2.59}, weekly: 75 },
  cont40:     { sku: "CON-40", label: "Container 40ft",   dims:{len:12.19,wid:2.44,ht:2.59}, weekly: 120 }
};

export function createCartPayload(items, platform="generic") {
  // Consolidate by SKU
  const agg = new Map();
  for (const it of items) {
    const def = CATALOGUE[it.type];
    if (!def) continue;
    const key = def.sku;
    const prev = agg.get(key) || { sku:def.sku, label:def.label, qty:0, weekly:def.weekly };
    prev.qty += 1;
    agg.set(key, prev);
  }
  const lines = [...agg.values()];
  if (platform === "generic") {
    return { currency:"AUD", lines };
  }
  if (platform === "shopify") {
    // Expect you to map sku -> variantId elsewhere; keep sku for now.
    return { items: lines.map(l => ({ sku:l.sku, quantity:l.qty })) };
  }
  if (platform === "stripe") {
    // Expect you to map sku -> priceId elsewhere; keep sku as metadata.
    return {
      line_items: lines.map(l => ({ quantity:l.qty, price_data:{ currency:"aud", unit_amount: l.weekly*100, product_data:{ name:l.label, metadata:{ sku:l.sku } } } }))
    };
  }
  return { currency:"AUD", lines };
}
