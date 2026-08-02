import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("creates lowercase hyphenated slugs", () => {
    expect(slugify("Invisible Grills")).toBe("invisible-grills");
    expect(slugify("Hitech City")).toBe("hitech-city");
  });

  it("removes invalid characters", () => {
    expect(slugify("Child's Safety!")).toBe("childs-safety");
  });
});
