import type { PublicationStatus } from "./business";

export type LocationType =
  | "state"
  | "district"
  | "city"
  | "town"
  | "area"
  | "locality";

export type Location = {
  id: string;
  slug: string;
  name: string;
  locationType: LocationType;
  parentId?: string;
  state: string;
  district?: string;
  publicationStatus: PublicationStatus;
  allowIndexing: boolean;
  isServed: boolean;
  introduction: string;
  localDescription: string;
  nearbyLocationIds: string[];
  landmarkIds: string[];
  propertyTypes: string[];
  localCharacteristics: string[];
  serviceDemandNotes: string[];
  verifiedLocalFacts: string[];
  latitude?: number;
  longitude?: number;
  localDataVerified: boolean;
  contentReviewed: boolean;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
};

export type Area = Location & {
  locationType: "area" | "locality";
  parentId: string;
};

export type Landmark = {
  id: string;
  slug: string;
  name: string;
  locationId: string;
  description: string;
  verified: boolean;
};
