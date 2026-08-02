import { describe, expect, it } from "vitest";
import {
  createAllPageRecords,
  createLocationPages,
  createServiceInCityPages,
} from "@/lib/publishing/page-factory";
import { getPublishedLocations } from "@/data/initial-locations";
import { parseServiceInCitySlug } from "@/lib/utils/service-in-city-slug";

describe("page factory", () => {
  it("scopes published locations to Hyderabad only", () => {
    const locations = getPublishedLocations();
    expect(locations).toHaveLength(1);
    expect(locations[0]?.slug).toBe("hyderabad");
    expect(createLocationPages().every((page) => page.path.includes("hyderabad"))).toBe(true);
  });

  it("creates service-in-city pages with flat URL pattern", () => {
    const pages = createServiceInCityPages();
    expect(pages.length).toBeGreaterThan(0);
    expect(pages.every((page) => page.path.endsWith("-in-hyderabad/"))).toBe(true);
    expect(pages.some((page) => page.path === "/invisible-grills-in-hyderabad/")).toBe(true);
  });

  it("parses composite service-in-city slugs", () => {
    const parsed = parseServiceInCitySlug("invisible-grills-in-hyderabad");
    expect(parsed).toEqual({ serviceSlug: "invisible-grills", citySlug: "hyderabad" });
  });

  it("creates a manageable initial registry from seed data", () => {
    const pages = createAllPageRecords();
    expect(pages.length).toBeGreaterThan(50);
    expect(pages.some((page) => page.path === "/")).toBe(true);
    expect(pages.some((page) => page.path === "/services/invisible-grills/")).toBe(true);
    expect(pages.some((page) => page.path === "/invisible-grills-in-hyderabad/")).toBe(true);
  });
});
