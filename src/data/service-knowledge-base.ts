/**
 * Secure Vista service knowledge base — verified fields only from INITIAL_SERVICES.
 * Do NOT invent cable diameters, load ratings, warranties, prices, or certifications.
 */
import {
  getPublishedServices,
  SERVICE_CATEGORIES,
  getServiceBySlug,
} from "@/data/initial-services";
import type { Service } from "@/types/service";

export type ServiceKnowledge = {
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  category: string;
  definition: string;
  purpose: string;
  howItWorks: string[];
  components: string[];
  materials: string[];
  technicalSpecifications: string[];
  installationMethod: string[];
  applications: string[];
  buildingTypes: string[];
  useCases: string[];
  safetyConsiderations: string[];
  maintenance: string[];
  advantages: string[];
  limitations: string[];
  selectionFactors: string[];
  commonMistakes: string[];
  costFactors: string[];
  customerQuestions: string[];
  comparisonNotes: string[];
};

const CATEGORY_NAME = new Map(SERVICE_CATEGORIES.map((c) => [c.id, c.name]));

/** Honest limitations — not marketing spinning. */
const LIMITATIONS_BY_SLUG: Record<string, string[]> = {
  "invisible-grills": [
    "Does not replace responsible adult supervision of children near openings",
    "Requires sound fixing points suited to the balcony or window structure",
    "Cable spacing must be planned for the household risk profile",
    "Not a burglar-proofing system by itself",
  ],
  "balcony-safety-nets": [
    "Mesh appearance is more visible than cable systems",
    "Requires secure anchoring along the opening perimeter",
    "UV exposure and tension should be checked periodically",
  ],
  "children-safety-nets": [
    "Spacing and anchorage must match toddler fall-risk needs",
    "Does not remove the need for household safety routines",
  ],
  "pet-safety-nets": [
    "Mesh size and strength must match pet size and behaviour",
    "Chewing or clawing can damage mesh over time",
  ],
  "mosquito-nets": [
    "Frames and mesh must suit the opening type",
    "Torn mesh reduces insect protection immediately",
  ],
  "bird-spikes": [
    "Effective for landing-edge deterrence, not full enclosure",
    "Mounting surface must be clean and sound",
  ],
  "cloth-hangers": [
    "Ceiling strength and mounting points must be assessed",
    "Load limits depend on the installed system and structure",
  ],
  "cricket-nets": [
    "Requires adequate space and secure perimeter fixing",
    "Outdoor UV and weather exposure affect lifespan",
  ],
};

const COMPARISON_BY_SLUG: Record<string, string[]> = {
  "invisible-grills": [
    "Compared with conventional iron grills: better view and light retention, different visual language",
    "Compared with safety nets: cables are less visually dense; nets may suit different risk or budget cases",
  ],
  "balcony-safety-nets": [
    "Compared with invisible grills: more visible mesh, often faster coverage of wide openings",
    "Compared with solid barriers: lighter appearance and better ventilation when designed correctly",
  ],
  "bird-spikes": [
    "Compared with bird nets: spikes deter landing on edges; nets enclose larger volumes",
  ],
  "children-safety-nets": [
    "Compared with invisible grills: mesh can cover larger openings quickly; cables suit view-sensitive balconies",
  ],
  "pet-safety-nets": [
    "Compared with child safety nets: mesh and anchorage chosen for pet behaviour and opening use",
  ],
  "mosquito-nets": [
    "Compared with sealed windows: allows ventilation while reducing insect entry when mesh is intact",
  ],
  "cloth-hangers": [
    "Compared with floor drying stands: ceiling systems free balcony floor space when structure allows",
  ],
  "cricket-nets": [
    "Compared with open practice areas: contains balls within a defined enclosure when correctly fixed",
  ],
};

function buildKnowledge(service: Service): ServiceKnowledge {
  const category =
    CATEGORY_NAME.get(service.categoryId as (typeof SERVICE_CATEGORIES)[number]["id"]) ??
    "Home Safety";
  return {
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceName: service.name,
    category,
    definition: service.introduction,
    purpose: service.summary,
    howItWorks: service.installationSteps,
    components: [...service.materials, ...service.features],
    materials: service.materials,
    technicalSpecifications: service.specifications,
    installationMethod: service.installationSteps,
    applications: service.applications,
    buildingTypes: service.suitablePropertyTypes,
    useCases: service.customerProblems,
    safetyConsiderations: service.safetyInformation,
    maintenance: service.maintenanceTips,
    advantages: service.benefits,
    limitations: LIMITATIONS_BY_SLUG[service.slug] ?? [
      "Suitability depends on opening type, structure and household needs",
      "On-site assessment is required before a written quotation",
    ],
    selectionFactors: service.pricingFactors,
    commonMistakes: [
      "Confirming price from photos alone without measurement",
      "Ignoring floor access, society rules or fixing-point condition",
      "Choosing materials without matching exposure and household risk",
      "Skipping post-install inspection of tension, alignment and finish",
    ],
    costFactors: service.pricingFactors,
    customerQuestions: service.customerQuestions,
    comparisonNotes: COMPARISON_BY_SLUG[service.slug] ?? [],
  };
}

let cache: Map<string, ServiceKnowledge> | null = null;

export function getServiceKnowledgeBase(): ServiceKnowledge[] {
  if (!cache) {
    cache = new Map(
      getPublishedServices().map((service) => [service.slug, buildKnowledge(service)]),
    );
  }
  return [...cache.values()];
}

export function getServiceKnowledge(slug: string): ServiceKnowledge | undefined {
  getServiceKnowledgeBase();
  return cache?.get(slug) ?? (getServiceBySlug(slug) ? buildKnowledge(getServiceBySlug(slug)!) : undefined);
}
