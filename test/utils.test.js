import { describe, it, expect } from "vitest";
import { snap, snapVec3, normalizedYaw, dimsForYaw, aabbFrom, aabbOverlap, CATALOGUE, createCartPayload } from "../src/utils.js";

describe("grid snapping", () => {
  it("snap() rounds to nearest step", () => {
    expect(snap(0.49, 1)).toBe(0);
    expect(snap(0.51, 1)).toBe(1);
    expect(snap(1.24, 0.5)).toBe(1.0);
    expect(snap(1.26, 0.5)).toBe(1.5);
  });
  it("snapVec3 snaps x/z and keeps y", () => {
    expect(snapVec3([1.26, 2, -0.74], 0.5)).toEqual([1.5, 2, -0.5]);
  });
});

describe("rotation normalization", () => {
  it("normalizedYaw snaps to quarter turns", () => {
    const q = Math.PI/2;
    expect(normalizedYaw(0.01)).toBe(0);
    expect(normalizedYaw(0.49*q)).toBe(0);
    expect(normalizedYaw(0.51*q)).toBe(q);
  });
});

describe("dims & AABB", () => {
  const dims = { len: 6, wid: 3, ht: 2.7 };
  it("dims swap on 90° and 270°", () => {
    const q = Math.PI/2;
    expect(dimsForYaw(dims, 0)).toEqual({len:6, wid:3, ht:2.7});
    expect(dimsForYaw(dims, q)).toEqual({len:3, wid:6, ht:2.7});
    expect(dimsForYaw(dims, 2*q)).toEqual({len:6, wid:3, ht:2.7});
  });
  it("aabbOverlap detects simple intersection", () => {
    const a = { id:"a", yaw:0, dims, pos:[0,0,0] };
    const b = { id:"b", yaw:0, dims, pos:[2.9,0,0] }; // touching almost
    const A = aabbFrom(a); const B = aabbFrom(b);
    expect(aabbOverlap(A,B)).toBe(true);
  const c = { id:"c", yaw:0, dims, pos:[6,0,0] };
    expect(aabbOverlap(A, aabbFrom(c))).toBe(false);
  });
});

describe("cart payload", () => {
  const items = [
    { type:"office6m" }, { type:"office6m" }, { type:"toilet" }
  ];
  it("generic payload aggregates qty & weekly", () => {
    const p = createCartPayload(items, "generic");
    expect(p.currency).toBe("AUD");
    const off = p.lines.find(l => l.sku === CATALOGUE.office6m.sku);
    const toi = p.lines.find(l => l.sku === CATALOGUE.toilet.sku);
    expect(off.qty).toBe(2);
    expect(off.weekly).toBe(CATALOGUE.office6m.weekly);
    expect(toi.qty).toBe(1);
  });
  it("shopify payload keeps sku for later mapping", () => {
    const p = createCartPayload(items, "shopify");
    expect(p.items.some(i => i.sku === CATALOGUE.office6m.sku && i.quantity === 2)).toBe(true);
  });
  it("stripe payload constructs price_data with AUD cents", () => {
    const p = createCartPayload(items, "stripe");
    const line = p.line_items.find(li => li.price_data.product_data.metadata.sku === CATALOGUE.toilet.sku);
    expect(line.quantity).toBe(1);
    expect(line.price_data.currency).toBe("aud");
    expect(line.price_data.unit_amount).toBe(CATALOGUE.toilet.weekly * 100);
  });
});
