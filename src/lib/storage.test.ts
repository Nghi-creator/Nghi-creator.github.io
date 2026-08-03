import { describe, expect, it, vi } from "vitest";
import { safeStorageSet } from "./storage";

describe("safeStorageSet", () => {
  it("returns false instead of crashing when browser storage rejects a write", () => {
    const setItem = vi
      .spyOn(window.localStorage, "setItem")
      .mockImplementationOnce(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

    expect(safeStorageSet("portfolio-test", "value")).toBe(false);
    setItem.mockRestore();
  });
});
