import { describe, expect, it } from "vitest";
import type { ResizeState, WindowResizeDirection } from "../types";
import { calculateResizedWindow } from "./windowGeometry";

const limits = {
  bottomLimit: 58,
  margin: 8,
  minimumHeight: 300,
  minimumWidth: 400,
  topLimit: 42,
  viewportHeight: 900,
  viewportWidth: 1400,
};

function resize(direction: WindowResizeDirection, x: number, y: number) {
  const state: ResizeState = {
    direction,
    height: 500,
    id: "profile",
    pointerX: 500,
    pointerY: 400,
    width: 600,
    x: 300,
    y: 150,
  };
  return calculateResizedWindow(state, { x, y }, limits);
}

describe("desktop window resizing", () => {
  it("resizes from every edge while anchoring the opposite edge", () => {
    expect(resize("e", 600, 400)).toEqual({ x: 300, y: 150, width: 700, height: 500 });
    expect(resize("w", 400, 400)).toEqual({ x: 200, y: 150, width: 700, height: 500 });
    expect(resize("s", 500, 500)).toEqual({ x: 300, y: 150, width: 600, height: 600 });
    expect(resize("n", 500, 300)).toEqual({ x: 300, y: 50, width: 600, height: 600 });
  });

  it("resizes corners on both axes", () => {
    expect(resize("nw", 400, 300)).toEqual({ x: 200, y: 50, width: 700, height: 600 });
    expect(resize("se", 600, 500)).toEqual({ x: 300, y: 150, width: 700, height: 600 });
  });

  it("enforces minimum size and desktop work-area bounds", () => {
    expect(resize("nw", 1000, 1000)).toEqual({ x: 500, y: 350, width: 400, height: 300 });
    expect(resize("se", 2000, 2000)).toEqual({ x: 300, y: 150, width: 1092, height: 692 });
  });
});
