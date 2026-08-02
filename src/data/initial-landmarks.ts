import type { Landmark } from "@/types/location";

export const INITIAL_LANDMARKS: Landmark[] = [
  {
    id: "lm-hitech-city",
    slug: "hitech-city",
    name: "Hitech City",
    locationId: "loc-hyderabad",
    description: "Major IT and residential corridor in western Hyderabad.",
    verified: true,
  },
  {
    id: "lm-gachibowli",
    slug: "gachibowli",
    name: "Gachibowli",
    locationId: "loc-hyderabad",
    description: "Apartment and gated-community corridor in Hyderabad.",
    verified: true,
  },
  {
    id: "lm-charminar-area",
    slug: "charminar-area",
    name: "Charminar Area",
    locationId: "loc-hyderabad",
    description: "Historic central Hyderabad reference area used only as a city landmark context.",
    verified: true,
  },
];

export function getLandmarksByLocation(locationId: string): Landmark[] {
  return INITIAL_LANDMARKS.filter(
    (landmark) => landmark.locationId === locationId && landmark.verified,
  );
}
