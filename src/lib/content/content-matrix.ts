/**
 * Content matrix — assigns a genuine informational angle per page.
 * Uniqueness comes from angle + service knowledge, not location name swaps.
 */
import { localitySeed } from "@/lib/content/build-unique-locality-copy";

export type ContentAngle = {
  id: string;
  primaryIntent: string;
  application: string;
  buildingType: string;
  technicalAngle: string;
  installationAngle: string;
  maintenanceAngle: string;
  comparisonAngle: string;
  faqAngle: string;
  contentVersion: string;
};

const ANGLES: Omit<ContentAngle, "contentVersion">[] = [
  {
    id: "balcony-planning",
    primaryIntent: "installation-planning",
    application: "balcony openings",
    buildingType: "apartment",
    technicalAngle: "cable or mesh layout for open edges",
    installationAngle: "measurement, fixing points and access",
    maintenanceAngle: "tension checks and seasonal inspection",
    comparisonAngle: "view retention versus conventional barriers",
    faqAngle: "balcony measurement and quotation",
  },
  {
    id: "window-safety",
    primaryIntent: "window-protection",
    application: "windows and French openings",
    buildingType: "apartment",
    technicalAngle: "discreet fixing around frames and sills",
    installationAngle: "sill condition and frame compatibility",
    maintenanceAngle: "cleaning fittings without damaging finishes",
    comparisonAngle: "open view versus heavy iron grill look",
    faqAngle: "window spacing and household risk",
  },
  {
    id: "child-risk",
    primaryIntent: "child-safety",
    application: "family balcony use",
    buildingType: "apartment",
    technicalAngle: "spacing planned for toddler fall-risk reduction",
    installationAngle: "perimeter anchorage and finish checks",
    maintenanceAngle: "impact inspection after knocks or storms",
    comparisonAngle: "supervision still required alongside barriers",
    faqAngle: "child spacing and realistic safety limits",
  },
  {
    id: "pet-risk",
    primaryIntent: "pet-safety",
    application: "pet access near openings",
    buildingType: "apartment",
    technicalAngle: "mesh or cable choice for pet behaviour",
    installationAngle: "secure perimeter without climb gaps",
    maintenanceAngle: "chew, claw and sag inspection",
    comparisonAngle: "pet nets versus general balcony nets",
    faqAngle: "pet size and mesh selection",
  },
  {
    id: "villa-terrace",
    primaryIntent: "villa-terrace",
    application: "terrace and multi-level edges",
    buildingType: "villa",
    technicalAngle: "multi-opening planning and elevation access",
    installationAngle: "scaffold or terrace access planning",
    maintenanceAngle: "exposed-elevation corrosion checks",
    comparisonAngle: "villa multi-opening packages versus single balcony jobs",
    faqAngle: "villa access and timeline",
  },
  {
    id: "materials-selection",
    primaryIntent: "material-selection",
    application: "exposed balconies",
    buildingType: "apartment",
    technicalAngle: "material grade trade-offs for humidity and sun",
    installationAngle: "hardware matching the railing surface",
    maintenanceAngle: "cleaning and early corrosion signs",
    comparisonAngle: "economy versus premium material choices",
    faqAngle: "what to ask vendors about grades",
  },
  {
    id: "maintenance-repair",
    primaryIntent: "maintenance-repair",
    application: "existing installations",
    buildingType: "apartment",
    technicalAngle: "re-tensioning, section repair and upgrades",
    installationAngle: "assessment of existing fixing points",
    maintenanceAngle: "preventive inspection checklist",
    comparisonAngle: "repair versus full replacement",
    faqAngle: "when to repair instead of replace",
  },
  {
    id: "bird-exclusion",
    primaryIntent: "bird-exclusion",
    application: "ledges, AC shelves and parapets",
    buildingType: "apartment",
    technicalAngle: "exclusion versus landing deterrence",
    installationAngle: "surface preparation and coverage continuity",
    maintenanceAngle: "cleaning droppings and checking fixings",
    comparisonAngle: "bird nets versus bird spikes",
    faqAngle: "which bird solution fits which edge",
  },
  {
    id: "high-rise-access",
    primaryIntent: "high-rise-access",
    application: "high-rise balconies",
    buildingType: "apartment",
    technicalAngle: "access planning for upper floors",
    installationAngle: "society permissions and working-hour windows",
    maintenanceAngle: "post-monsoon visual checks",
    comparisonAngle: "DIY kits versus professional tensioning",
    faqAngle: "society access and install scheduling",
  },
  {
    id: "independent-house",
    primaryIntent: "independent-house",
    application: "multi-storey house openings",
    buildingType: "independent-house",
    technicalAngle: "mixed window and balcony specifications",
    installationAngle: "multi-storey sequencing and access",
    maintenanceAngle: "seasonal hardware inspection",
    comparisonAngle: "single opening versus whole-home packages",
    faqAngle: "phased installation planning",
  },
  {
    id: "quotation-scope",
    primaryIntent: "quotation-scope",
    application: "pre-purchase comparison",
    buildingType: "apartment",
    technicalAngle: "what belongs in a written scope",
    installationAngle: "measurement before price confirmation",
    maintenanceAngle: "handover checklist and care tips",
    comparisonAngle: "phone quotes versus measured quotations",
    faqAngle: "how to compare quotations fairly",
  },
  {
    id: "ventilation-view",
    primaryIntent: "ventilation-view",
    application: "view-sensitive openings",
    buildingType: "apartment",
    technicalAngle: "balancing protection with light and airflow",
    installationAngle: "layout choices that preserve outlook",
    maintenanceAngle: "cleaning without dulling finishes",
    comparisonAngle: "dense mesh versus discreet cable systems",
    faqAngle: "visibility and ventilation trade-offs",
  },
];

export function assignContentAngle(input: {
  serviceSlug: string;
  areaSlug?: string;
  pageType?: string;
}): ContentAngle {
  const seed = localitySeed(
    `${input.serviceSlug}:${input.areaSlug ?? "city"}:${input.pageType ?? "page"}`,
  );
  const base = ANGLES[seed % ANGLES.length]!;
  return {
    ...base,
    contentVersion: `kb-v1/${base.id}`,
  };
}

export function describeAngle(angle: ContentAngle): string {
  return `${angle.application}; ${angle.technicalAngle}; ${angle.installationAngle}`;
}
