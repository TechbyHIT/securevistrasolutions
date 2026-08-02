import { describe, expect, it } from "vitest";
import { getServedAreas } from "@/data/initial-areas";
import {
  buildHyderabadAreaLinkGraph,
  buildHomeServiceImageBlocks,
  countHyderabadLinkGraph,
} from "@/lib/internal-links/hyderabad-link-graph";

describe("hyderabad area → service link graph", () => {
  it("covers all served areas with service sub-location links", () => {
    const areaCount = getServedAreas().length;
    const nodes = buildHyderabadAreaLinkGraph();
    const stats = countHyderabadLinkGraph();

    expect(nodes.length).toBe(areaCount);
    expect(stats.areas).toBe(areaCount);
    expect(stats.serviceLinks).toBe(areaCount * 8);
    expect(nodes[0]?.serviceLinks.length).toBe(8);
    expect(nodes[0]?.areaHubHref).toMatch(/^\/locations\/hyderabad\//);
    expect(nodes[0]?.serviceLinks[0]?.href).toMatch(/^\/hyderabad\/[^/]+\/[^/]+\/$/);
    expect(nodes.some((n) => n.slug === "gachibowli")).toBe(true);
  });

  it("builds homepage service image blocks with gallery + area chips", () => {
    const blocks = buildHomeServiceImageBlocks(8);
    expect(blocks.length).toBe(8);
    expect(blocks[0]?.heroImage).toBeTruthy();
    expect(blocks[0]?.sampleAreaLinks.length).toBeGreaterThanOrEqual(4);
    expect(blocks[0]?.cityHref).toContain("-in-hyderabad");
  });
});
