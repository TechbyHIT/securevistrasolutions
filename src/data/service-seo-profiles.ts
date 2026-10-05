export type ServiceSeoProfile = {
  serviceSlug: string;
  headlineSuffix: string;
  problemStatement: string;
  climateNote: string;
  subServices: { title: string; description: string }[];
  materials: { name: string; description: string }[];
  priceRanges: { label: string; range: string; bestFor: string }[];
  priceDisclaimer: string;
  whyChooseUs: { title: string; description: string }[];
  processSteps: { title: string; description: string }[];
  trustedBrands: string[];
  warrantyYears: string;
};

export const SERVICE_SEO_PROFILES: ServiceSeoProfile[] = [
  {
    serviceSlug: "invisible-grills",
    headlineSuffix: "balconies, windows and open edges",
    problemStatement:
      "Open balconies and large window openings in high-rise apartments create fall-risk concerns for children, pets and elderly residents while many households still want unobstructed views and natural light.",
    climateNote:
      "Hyderabad's dry summers and monsoon humidity make corrosion-resistant stainless steel cables and secure frame fixing especially important for long-term performance.",
    subServices: [
      { title: "Balcony invisible grills", description: "Discreet cable grills for apartment and villa balconies without blocking the view." },
      { title: "Window invisible grills", description: "Compact installations for ventilated windows and sliding door openings." },
      { title: "Child safety invisible grills", description: "Custom cable spacing planned for households with toddlers and young children." },
      { title: "Pet-safe balcony grills", description: "Tensioned cable layouts that reduce pet access through railing gaps." },
      { title: "Terrace edge protection", description: "Measured grill layouts for selected terrace and duplex openings." },
      { title: "316-grade stainless options", description: "Premium corrosion resistance for coastal exposure and long warranty expectations." },
    ],
    materials: [
      { name: "316 stainless steel cables", description: "High tensile strength with superior rust resistance for Hyderabad weather." },
      { name: "304 stainless steel cables", description: "Reliable option for standard residential balcony and window applications." },
      { name: "Powder-coated frames", description: "Neat finish options that blend with balcony railings and window frames." },
      { name: "Corrosion-resistant fasteners", description: "Secure end fittings and anchors selected for the fixing surface." },
    ],
    priceRanges: [
      { label: "Standard SS cable grill", range: "₹180 – ₹250 / sq ft", bestFor: "Apartment balconies and standard windows" },
      { label: "Premium 316 SS grill", range: "₹250 – ₹350 / sq ft", bestFor: "High-rise homes and premium finish requirements" },
      { label: "Custom spacing / complex openings", range: "Quote after site visit", bestFor: "Irregular balconies and multi-side coverage" },
    ],
    priceDisclaimer:
      "Prices are indicative ranges for Hyderabad installations and include measurement, material and professional fitting where quoted. Final cost depends on opening size, floor height, frame type and total quantity.",
    whyChooseUs: [
      { title: "Free site inspection", description: "We measure your openings on-site and recommend spacing before quoting." },
      { title: "View-friendly layouts", description: "Cable spacing is planned to protect without creating a heavy visual block." },
      { title: "Professional installation", description: "Trained technicians handle fixing, tensioning and finish checks." },
      { title: "Hyderabad-wide coverage", description: "Service teams support apartments and villas across local residential areas." },
      { title: "Written quotations", description: "Clear scope, material grade and installation notes before work begins." },
      { title: "After-installation support", description: "Guidance on inspection intervals and tension maintenance." },
    ],
    processSteps: [
      { title: "Call or WhatsApp", description: "Share your area, property type and opening photos if available." },
      { title: "Free site inspection", description: "Our team visits, measures and assesses fixing points." },
      { title: "Material and spacing plan", description: "We recommend cable grade, spacing and frame approach." },
      { title: "Professional installation", description: "Secure fixing, tensioning and neat finishing on agreed date." },
      { title: "Final safety check", description: "We inspect end fittings, spacing and handover maintenance tips." },
    ],
    trustedBrands: ["Premium SS cable suppliers", "Corrosion-resistant hardware", "Powder-coat frame systems"],
    warrantyYears: "3–5 years",
  },
  {
    serviceSlug: "balcony-safety-nets",
    headlineSuffix: "balconies, terraces and open areas",
    problemStatement:
      "Families in Hyderabad apartments frequently need practical fall protection for balconies and utility openings without closing off ventilation or natural light.",
    climateNote:
      "UV-stabilised HDPE and nylon nets perform better through Hyderabad's intense summer sun and seasonal rains when border rope and hooks are installed correctly.",
    subServices: [
      { title: "Balcony safety nets", description: "Primary fall-protection layer for apartment balcony edges." },
      { title: "Terrace safety nets", description: "Coverage for open terrace sections and utility areas." },
      { title: "Duct area safety nets", description: "Protection for service ducts and vertical openings." },
      { title: "Staircase safety nets", description: "Useful for duplex homes and internal void openings." },
      { title: "Building safety nets", description: "Society and multi-unit common-area coverage." },
      { title: "Bird protection nets", description: "Mesh solutions that reduce pigeon roosting and droppings." },
    ],
    materials: [
      { name: "HDPE Garware-grade nets", description: "UV-stabilised mesh with strong border reinforcement." },
      { name: "Nylon knotless nets", description: "Popular for child-focused balcony protection." },
      { name: "Knotted safety nets", description: "Economical option for selected utility applications." },
      { name: "Stainless steel hooks", description: "Secure fixing for long-term tension performance." },
    ],
    priceRanges: [
      { label: "Standard polyethylene net", range: "₹35 – ₹50 / sq ft", bestFor: "Budget-conscious balcony coverage" },
      { label: "HDPE UV-stabilised net", range: "₹45 – ₹60 / sq ft", bestFor: "Longer life in sun-exposed balconies" },
      { label: "Nylon knotless net", range: "₹50 – ₹65 / sq ft", bestFor: "Child and pet safety priorities" },
    ],
    priceDisclaimer:
      "Indicative Hyderabad pricing includes material and installation for standard balcony sizes. Exact safety net cost depends on mesh type, area, height and fixing complexity.",
    whyChooseUs: [
      { title: "ISI-grade materials", description: "We use branded HDPE and nylon options suited to local climate exposure." },
      { title: "Child-safe mesh options", description: "Spacing recommendations based on household safety needs." },
      { title: "Same-week installation", description: "Many apartment balconies can be completed in a single visit." },
      { title: "Free measurement visit", description: "No obligation site inspection before quotation." },
      { title: "Neat finishing", description: "Border rope, hook placement and tension checks for a clean look." },
      { title: "Local team availability", description: "Hyderabad residential areas supported with scheduled site visits." },
    ],
    processSteps: [
      { title: "Book free inspection", description: "Contact us with your locality and balcony dimensions if known." },
      { title: "Mesh recommendation", description: "We suggest HDPE, nylon or knotted options for your use case." },
      { title: "Custom cutting and border", description: "Nets are prepared for your opening shape and size." },
      { title: "On-site installation", description: "Hooks and tension are set for secure everyday use." },
      { title: "Quality inspection", description: "Edge checks and maintenance guidance before handover." },
    ],
    trustedBrands: ["Garware", "Tuff", "Champion-grade mesh suppliers"],
    warrantyYears: "3–6 years",
  },
  {
    serviceSlug: "children-safety-nets",
    headlineSuffix: "children, balconies and stair openings",
    problemStatement:
      "Parents in Hyderabad frequently search for child safety nets when toddlers begin using balconies, windows and open stair areas in apartments and duplex homes.",
    climateNote:
      "Mesh selection and fixing height should account for Hyderabad humidity and the need for durable border reinforcement in family-used spaces.",
    subServices: [
      { title: "Child balcony nets", description: "Mesh barriers for apartment balconies used by young children." },
      { title: "Stair opening nets", description: "Coverage for internal stair voids in duplex layouts." },
      { title: "Window safety nets", description: "Additional layer for low or wide window openings." },
      { title: "Play area nets", description: "Selected indoor and terrace play-space protection." },
    ],
    materials: [
      { name: "Child-safe knotless mesh", description: "Smaller mesh sizes suitable for toddler safety needs." },
      { name: "Reinforced border rope", description: "Helps maintain tension in active household spaces." },
      { name: "Secure hook systems", description: "Fixing planned for repeated daily use and inspection." },
    ],
    priceRanges: [
      { label: "Balcony child safety net", range: "₹50 – ₹65 / sq ft", bestFor: "Standard apartment balconies" },
      { label: "Stair / void coverage", range: "₹45 – ₹60 / sq ft", bestFor: "Duplex and internal openings" },
      { label: "Multi-opening package", range: "Quote after inspection", bestFor: "Whole-home childproofing" },
    ],
    priceDisclaimer:
      "Final child safety net pricing depends on mesh size, number of openings, access conditions and total coverage area in your Hyderabad home.",
    whyChooseUs: [
      { title: "Child-focused planning", description: "We assess how your family uses each opening before recommending mesh." },
      { title: "Strong fixing methods", description: "Hooks and borders selected for long-term tension." },
      { title: "Clear safety guidance", description: "We explain inspection intervals and supervision expectations." },
      { title: "Apartment-friendly finish", description: "Installations planned to suit society and rental requirements." },
    ],
    processSteps: [
      { title: "Safety assessment", description: "Identify high-risk openings used by children." },
      { title: "Mesh selection", description: "Recommend child-appropriate mesh size and coverage height." },
      { title: "Installation", description: "Secure fixing with tension and edge checks." },
      { title: "Parent handover", description: "Maintenance tips and inspection schedule shared." },
    ],
    trustedBrands: ["Garware", "Premium knotless mesh"],
    warrantyYears: "3–5 years",
  },
  {
    serviceSlug: "pet-safety-nets",
    headlineSuffix: "cats, dogs and balcony openings",
    problemStatement:
      "Pet owners in Hyderabad apartments often need netting that prevents cats and dogs from slipping through balcony railings while keeping outdoor access practical.",
    climateNote:
      "Pet-safe nets in Hyderabad should resist claw contact and remain tensioned through heat and monsoon cycles.",
    subServices: [
      { title: "Cat balcony nets", description: "Fine mesh options for curious cats near railing gaps." },
      { title: "Dog safety nets", description: "Stronger mesh layouts for medium-sized dogs at balcony edges." },
      { title: "Window pet nets", description: "Compact protection for pet-accessible window openings." },
    ],
    materials: [
      { name: "Pet-resistant mesh", description: "Durable netting suited to claw and push pressure." },
      { name: "Heavy-duty border rope", description: "Maintains shape in active pet households." },
      { name: "Corrosion-resistant hooks", description: "Secure fixing for long-term outdoor exposure." },
    ],
    priceRanges: [
      { label: "Cat balcony net", range: "₹45 – ₹60 / sq ft", bestFor: "Apartment balconies" },
      { label: "Dog balcony net", range: "₹50 – ₹65 / sq ft", bestFor: "Larger openings and stronger mesh" },
    ],
    priceDisclaimer:
      "Pet safety net cost varies by pet size, opening width, mesh specification and installation height in Hyderabad.",
    whyChooseUs: [
      { title: "Pet behaviour review", description: "We discuss climbing and jumping patterns before recommending mesh." },
      { title: "Durable materials", description: "Mesh and borders selected for active pets." },
      { title: "Quick local support", description: "Hyderabad site visits and repair guidance available." },
    ],
    processSteps: [
      { title: "Consultation", description: "Understand pet type, behaviour and opening layout." },
      { title: "Measurement", description: "Measure balcony or window edges on-site." },
      { title: "Installation", description: "Fit mesh with secure tension and finish." },
      { title: "Inspection guidance", description: "Tips for checking mesh after pet activity." },
    ],
    trustedBrands: ["HDPE and nylon pet-safe mesh"],
    warrantyYears: "2–4 years",
  },
  {
    serviceSlug: "cloth-hangers",
    headlineSuffix: "balconies and utility spaces",
    problemStatement:
      "Apartment residents in Hyderabad often need space-saving drying solutions for utility balconies and wash areas without cluttering floor space.",
    climateNote:
      "Ceiling and wall-mounted systems should use corrosion-resistant components suitable for humid wash areas and outdoor balcony exposure.",
    subServices: [
      { title: "Ceiling cloth hangers", description: "Pulley and fixed rod systems for utility balconies." },
      { title: "Balcony cloth hangers", description: "Space-efficient drying for apartment balconies." },
      { title: "Wall-mounted hangers", description: "Compact options for narrow utility areas." },
      { title: "Cloth drying hangers", description: "Multi-rod arrangements for family laundry loads." },
    ],
    materials: [
      { name: "Stainless steel rods", description: "Rust-resistant drying rails for humid spaces." },
      { name: "Powder-coated systems", description: "Durable finish for ceiling-mounted setups." },
      { name: "Heavy-duty anchors", description: "Fixing matched to ceiling or wall structure." },
    ],
    priceRanges: [
      { label: "Basic ceiling hanger (2–3 rods)", range: "₹1,500 – ₹3,500", bestFor: "Small utility balconies" },
      { label: "Premium pulley system", range: "₹3,500 – ₹8,000", bestFor: "Family apartments and larger balconies" },
      { label: "Custom multi-rod setup", range: "Quote after inspection", bestFor: "Irregular or large utility spaces" },
    ],
    priceDisclaimer:
      "Cloth hanger pricing depends on rod count, mounting surface, pulley type and installation complexity in your Hyderabad home.",
    whyChooseUs: [
      { title: "Structural assessment", description: "We confirm ceiling or wall strength before mounting." },
      { title: "Space-saving designs", description: "Layouts planned for narrow apartment balconies." },
      { title: "Neat installation", description: "Aligned rods and smooth pulley operation." },
    ],
    processSteps: [
      { title: "Site assessment", description: "Check mounting points and available space." },
      { title: "System selection", description: "Choose ceiling, wall or pulley arrangement." },
      { title: "Installation", description: "Secure mounting and load testing." },
      { title: "Usage demo", description: "Show smooth operation and care tips." },
    ],
    trustedBrands: ["SS rod systems", "Powder-coat ceiling kits"],
    warrantyYears: "1–3 years",
  },
  {
    serviceSlug: "cricket-nets",
    headlineSuffix: "practice areas and society grounds",
    problemStatement:
      "Residential societies and private homes in Hyderabad increasingly need contained cricket practice spaces that reduce ball damage and improve safety.",
    climateNote:
      "Sports netting in Hyderabad should use UV-treated mesh and strong pole or frame support for outdoor exposure.",
    subServices: [
      { title: "Cricket practice nets", description: "Enclosed batting and bowling practice spaces." },
      { title: "Box cricket nets", description: "Compact nets for limited ground areas." },
      { title: "Society sports nets", description: "Larger enclosures for community play areas." },
    ],
    materials: [
      { name: "UV-treated sports netting", description: "Designed for repeated ball impact and sun exposure." },
      { name: "Galvanised support poles", description: "Stable framing for outdoor installations." },
      { name: "Reinforced borders", description: "Extra stitching at high-impact zones." },
    ],
    priceRanges: [
      { label: "Residential practice net", range: "₹25,000 – ₹80,000", bestFor: "Home and small society grounds" },
      { label: "Box cricket setup", range: "₹40,000 – ₹1,20,000", bestFor: "Compact enclosed practice areas" },
      { label: "Large society enclosure", range: "Quote after site survey", bestFor: "Community sports zones" },
    ],
    priceDisclaimer:
      "Sports net pricing depends on enclosure size, height, pole structure and ground conditions in Hyderabad.",
    whyChooseUs: [
      { title: "Custom enclosure planning", description: "Layouts based on available ground and usage intensity." },
      { title: "Durable sports mesh", description: "Netting selected for cricket ball impact." },
      { title: "Professional setup", description: "Pole, tension and safety checks included." },
    ],
    processSteps: [
      { title: "Ground survey", description: "Measure area and discuss usage requirements." },
      { title: "Design proposal", description: "Height, mesh and support structure plan." },
      { title: "Installation", description: "Erect supports and tension sports netting." },
      { title: "Handover", description: "Impact inspection and maintenance guidance." },
    ],
    trustedBrands: ["Sports-grade UV netting", "Galvanised pole systems"],
    warrantyYears: "1–2 years",
  },
  {
    serviceSlug: "bird-spikes",
    headlineSuffix: "ledges, AC units and parapets",
    problemStatement:
      "Pigeon and bird roosting on balcony ledges, parapets and AC outdoor units is a common hygiene and maintenance issue in Hyderabad apartments.",
    climateNote:
      "Bird spike installations should use weather-resistant bases and adhesives that hold through Hyderabad heat and monsoon moisture.",
    subServices: [
      { title: "Balcony bird spikes", description: "Discourage roosting on balcony ledges and rails." },
      { title: "AC ledge spikes", description: "Protect outdoor unit ledges from nesting." },
      { title: "Window sill spikes", description: "Low-profile coverage for narrow sills." },
      { title: "Pigeon control spikes", description: "Continuous ledge protection for bird-heavy zones." },
    ],
    materials: [
      { name: "Polycarbonate bird spikes", description: "Humane roosting deterrent for narrow ledges." },
      { name: "Stainless steel spikes", description: "Long-life option for exposed parapets." },
      { name: "Industrial adhesive / fasteners", description: "Selected based on surface type and exposure." },
    ],
    priceRanges: [
      { label: "Standard polycarbonate spikes", range: "₹80 – ₹120 / running ft", bestFor: "Balcony and window ledges" },
      { label: "SS spike strips", range: "₹120 – ₹180 / running ft", bestFor: "Parapets and exposed terraces" },
    ],
    priceDisclaimer:
      "Bird spike cost depends on ledge length, surface condition, access height and total coverage required.",
    whyChooseUs: [
      { title: "Humane bird control", description: "Spikes deter roosting without harming birds when installed correctly." },
      { title: "Complete ledge coverage", description: "We plan continuous strips to avoid gap roosting." },
      { title: "Clean surface prep", description: "Proper cleaning before adhesive or mechanical fixing." },
    ],
    processSteps: [
      { title: "Roosting inspection", description: "Identify active bird zones and ledge widths." },
      { title: "Surface preparation", description: "Clean and prepare ledge for fixing." },
      { title: "Spike installation", description: "Continuous coverage with secure bonding." },
      { title: "Final check", description: "Verify gaps and advise on debris clearing." },
    ],
    trustedBrands: ["Polycarbonate spike systems", "SS spike strips"],
    warrantyYears: "2–3 years",
  },
  {
    serviceSlug: "mosquito-nets",
    headlineSuffix: "windows and doors",
    problemStatement:
      "Hyderabad households often need mosquito nets that allow ventilation while reducing insect entry, especially in bedrooms and living areas.",
    climateNote:
      "Fine mesh panels should remain intact through humidity and regular cleaning cycles common in Hyderabad homes.",
    subServices: [
      { title: "Window mosquito nets", description: "Fixed, sliding or roll-up options for windows." },
      { title: "Door mosquito nets", description: "Single and double door mesh systems." },
      { title: "Magnetic mosquito nets", description: "Easy-access mesh for frequently used doors." },
    ],
    materials: [
      { name: "Fiberglass mesh", description: "Durable fine mesh for insect protection." },
      { name: "Aluminium frames", description: "Neat finish for sliding and fixed systems." },
      { name: "Magnetic strip systems", description: "Convenient access for door openings." },
    ],
    priceRanges: [
      { label: "Window mesh panel", range: "₹350 – ₹800 / sq ft", bestFor: "Bedroom and living windows" },
      { label: "Sliding door system", range: "₹500 – ₹1,200 / sq ft", bestFor: "Balcony and main door openings" },
    ],
    priceDisclaimer:
      "Mosquito net pricing varies by system type, frame finish, mesh density and number of openings.",
    whyChooseUs: [
      { title: "Custom sizing", description: "Panels measured for each window and door opening." },
      { title: "Multiple system types", description: "Fixed, sliding and magnetic options available." },
      { title: "Neat finishing", description: "Frames aligned for everyday opening and closing." },
    ],
    processSteps: [
      { title: "Opening measurement", description: "Accurate sizing for each window or door." },
      { title: "System selection", description: "Choose fixed, sliding or magnetic approach." },
      { title: "Fabrication and fit", description: "Install mesh and test smooth operation." },
    ],
    trustedBrands: ["Fiberglass mesh suppliers", "Aluminium frame systems"],
    warrantyYears: "1–2 years",
  },
];

const profileBySlug = new Map(SERVICE_SEO_PROFILES.map((profile) => [profile.serviceSlug, profile]));

export function getServiceSeoProfile(serviceSlug: string): ServiceSeoProfile {
  return (
    profileBySlug.get(serviceSlug) ??
    profileBySlug.get("balcony-safety-nets")!
  );
}

export const TRUST_STATS = [
  { value: "Free", label: "Site inspection" },
  { value: "Written", label: "Quotation" },
  { value: "SS / Net", label: "Quality materials" },
  { value: "Local", label: "Hyderabad coverage" },
] as const;
