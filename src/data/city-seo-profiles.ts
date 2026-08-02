export type CitySeoProfile = {
  citySlug: string;
  state: string;
  climate: string;
  buildingTypes: string[];
  popularApartments: string[];
  popularLocalities: string[];
  landmarks: string[];
  commonCustomerProblems: string[];
  nearbyZones: string[];
  nearbyCities: string[];
  /** City-specific narrative hook — unique opening angle, not reused across cities. */
  localNarrativeHook: string;
  /** EEAT: verified local expertise statement. */
  localExpertiseNote: string;
};

export const CITY_SEO_PROFILES: CitySeoProfile[] = [
  {
    citySlug: "hyderabad",
    state: "Telangana",
    climate:
      "Hyderabad experiences intense summer heat from March through June, followed by monsoon humidity between July and September and relatively mild winters. Balcony cables, safety nets and fixing hardware on west-facing openings endure prolonged UV exposure, while monsoon winds test tension systems — which is why we specify corrosion-resistant stainless steel and UV-stabilised mesh for outdoor installations across the city.",
    buildingTypes: [
      "High-rise gated apartment communities along the IT corridor",
      "Independent villas in Jubilee Hills, Banjara Hills and Kokapet",
      "Mid-rise apartment blocks in Kukatpally and Miyapur",
      "Commercial towers in Hitech City and Financial District",
      "Duplex and row-house units in Secunderabad and Alwal",
    ],
    popularApartments: [
      "Aparna Sarovar Grande", "My Home Bhooja", "Prestige High Fields",
      "Brigade Gateway", "Aliens Space Station", "Lodha Bellezza",
      "Rain Tree Park", "SMR Vinay Harmony County", "Aparna CyberZon",
    ],
    popularLocalities: [
      "Gachibowli", "Kondapur", "Hitech City", "Madhapur", "Jubilee Hills",
      "Banjara Hills", "Kukatpally", "Miyapur", "Secunderabad", "Financial District",
      "Manikonda", "Narsingi", "Kokapet", "Uppal", "LB Nagar", "Kompally",
    ],
    landmarks: [
      "Hitech City", "Gachibowli Financial District", "Charminar (Old City reference)",
      "Hussain Sagar Lake", "Shilparamam", "Durgam Cheruvu", "IKEA Hyderabad corridor",
    ],
    commonCustomerProblems: [
      "Families in Gachibowli and Madhapur high-rises need child-safe balcony edges without blocking skyline views",
      "Pigeon nesting on duct areas and window ledges across apartment towers near Kondapur and Financial District",
      "Pet owners in Manikonda and Narsingi villas require railing-gap protection on open terraces",
      "Monsoon-season wind load on loosely fitted nets in east Hyderabad localities like Uppal and LB Nagar",
      "Limited drying space in compact apartments driving demand for ceiling cloth hangers in Kukatpally and Miyapur",
    ],
    nearbyZones: [
      "West Hyderabad — Gachibowli, Financial District, Kokapet, Narsingi",
      "Central Hyderabad — Jubilee Hills, Banjara Hills, Ameerpet, Somajiguda",
      "North & Secunderabad — Secunderabad, Kompally, Malkajgiri, Alwal",
      "East Hyderabad — Uppal, LB Nagar, Dilsukhnagar, Nagole",
      "South Hyderabad — Manikonda, Attapur, Rajendranagar, Shamshabad corridor",
    ],
    nearbyCities: [
      "Secunderabad (twin city)", "Cyberabad corridor", "Shamshabad",
      "Patancheru", "Medchal", "Warangal (referral enquiries)", "Vijayawada (project enquiries)",
    ],
    localNarrativeHook:
      "From the glass-fronted towers near Durgam Cheruvu to family apartments around Charminar's wider neighbourhoods, Hyderabad homes share one practical need: safety solutions that respect how people actually live — with open balconies, active children and a strong preference for keeping views and ventilation intact.",
    localExpertiseNote:
      "Our installation teams work daily across Hyderabad's western IT corridor, central premium residential pockets and growing suburban townships. Recommendations are based on measured openings and verified fixing conditions — not generic catalogue sizes.",
  },
];

const profileBySlug = new Map(CITY_SEO_PROFILES.map((profile) => [profile.citySlug, profile]));

export function getCitySeoProfile(citySlug: string): CitySeoProfile {
  const fallbackName = citySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    profileBySlug.get(citySlug) ?? {
      citySlug,
      state: "India",
      climate: `${fallbackName} climate patterns — including seasonal heat, rain and humidity — influence how outdoor safety materials perform over time. We select mesh grades, cable types and fixing hardware based on local exposure at your specific property.`,
      buildingTypes: [
        "Apartment communities and gated societies",
        "Independent villas and duplex homes",
        "Commercial and mixed-use buildings",
      ],
      popularApartments: [
        "Gated residential towers",
        "Premium apartment projects",
        "Mid-rise family communities",
      ],
      popularLocalities: [
        "Central residential areas",
        "Suburban growth corridors",
        "Established neighbourhood pockets",
      ],
      landmarks: [`${fallbackName} city centre`, `${fallbackName} residential districts`],
      commonCustomerProblems: [
        `Balcony and window safety concerns in ${fallbackName} apartments`,
        `Bird and pigeon nuisance on window ledges`,
        `Child and pet fall protection in multi-storey homes`,
      ],
      nearbyZones: [
        `Central ${fallbackName}`,
        `${fallbackName} suburban areas`,
        `${fallbackName} residential corridors`,
      ],
      nearbyCities: [`Areas surrounding ${fallbackName}`],
      localNarrativeHook: `${fallbackName} homeowners increasingly expect safety installations that look neat, last through local weather and are planned around real household use — not one-size-fits-all catalogue sizes.`,
      localExpertiseNote: `We serve ${fallbackName} with measurement-led site visits, written quotations and installation teams experienced in local property types.`,
    }
  );
}
