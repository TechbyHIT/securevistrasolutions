import { describe, expect, it } from "vitest";
import { generateCanonical, normalizePath } from "@/lib/seo/generate-canonical";

describe("canonical helpers", () => {
  it("normalizes trailing slashes", () => {
    expect(normalizePath("/hyderabad/invisible-grills")).toBe("/hyderabad/invisible-grills/");
  });

  it("builds absolute canonical URLs", () => {
    const canonical = generateCanonical("/locations/hyderabad/");
    expect(canonical.endsWith("/locations/hyderabad/")).toBe(true);
    expect(canonical.startsWith("http")).toBe(true);
  });
});
