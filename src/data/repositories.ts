// Repository data for 3D model discovery
// This is a curated, editable list - not scraped data

export interface TopDesigner {
  name: string;
  profileUrl: string;
  specialty: string;
  isEditablePick?: boolean; // True if we're not 100% sure these are "top" designers
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  modelCountLabel: string;
  about: string;
  tags: string[];
  licenseNotes: string;
  safeContentNotes: string;
  topDesigners: TopDesigner[];
  searchUrlTemplate?: string; // e.g., "https://example.com/search?q={query}"
}

export interface RepositoryCategory {
  id: string;
  name: string;
  description: string;
  repositories: Repository[];
}

export const REPOSITORY_CATEGORIES: RepositoryCategory[] = [
  {
    id: "featured",
    name: "Featured",
    description: "Top-tier platforms with curated, high-quality models",
    repositories: [
      {
        id: "printables",
        name: "Printables",
        url: "https://www.printables.com",
        modelCountLabel: "~1M+",
        about: "Prusa's curated platform with community-tested models. Strong focus on quality and printability with excellent documentation and print settings.",
        tags: ["Curated", "Community", "Print Settings"],
        licenseNotes: "Various CC licenses, check per model",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://www.printables.com/search/models?q={query}",
        topDesigners: [
          { name: "Maker's Muse", profileUrl: "https://www.printables.com/@MakersMuse", specialty: "Functional prints & tools" },
          { name: "3D Printing Nerd", profileUrl: "https://www.printables.com/@3DPrintingNerd", specialty: "Fun & practical models" },
          { name: "Zack Freedman", profileUrl: "https://www.printables.com/@ZackFreedman", specialty: "Gridfinity & organization" },
        ],
      },
      {
        id: "thangs",
        name: "Thangs",
        url: "https://thangs.com",
        modelCountLabel: "20M+",
        about: "Powerful geometric search engine indexing 20M+ models across the web. Find similar shapes and discover models you didn't know existed.",
        tags: ["Search Engine", "Aggregator", "AI-Powered"],
        licenseNotes: "Links to original sources with their licenses",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://thangs.com/search/{query}",
        topDesigners: [
          { name: "Thangs Featured", profileUrl: "https://thangs.com/designers", specialty: "Top leaderboard creators", isEditablePick: true },
          { name: "Clockspring3D", profileUrl: "https://thangs.com/designer/Clockspring3D", specialty: "Mechanical & articulated" },
          { name: "Pretzelmaker", profileUrl: "https://thangs.com/designer/Pretzelmaker", specialty: "Print-in-place designs" },
        ],
      },
      {
        id: "makerworld",
        name: "MakerWorld",
        url: "https://makerworld.com",
        modelCountLabel: "1M+",
        about: "Bambu Lab's platform specializing in multi-color and AMS-ready models. Excellent for users with multi-material printers.",
        tags: ["Multi-Color", "Bambu", "AMS-Ready"],
        licenseNotes: "Various licenses, many exclusive to Bambu ecosystem",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://makerworld.com/en/search/models?keyword={query}",
        topDesigners: [
          { name: "Featured Creators", profileUrl: "https://makerworld.com/en/creators", specialty: "Multi-color specialists", isEditablePick: true },
          { name: "Bambu Lab", profileUrl: "https://makerworld.com/en/@BambuLab", specialty: "Official models & accessories" },
          { name: "3DPrintBunny", profileUrl: "https://makerworld.com/en/@3DPrintBunny", specialty: "Cute & colorful designs" },
        ],
      },
    ],
  },
  {
    id: "mainstream",
    name: "Mainstream Collections",
    description: "Established platforms with massive libraries",
    repositories: [
      {
        id: "thingiverse",
        name: "Thingiverse",
        url: "https://www.thingiverse.com",
        modelCountLabel: "Millions",
        about: "The original 3D printing repository. Massive library of community-created models spanning all categories. Historic but still relevant.",
        tags: ["Classic", "Massive Library", "Community"],
        licenseNotes: "Various CC licenses, check per model",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://www.thingiverse.com/search?q={query}",
        topDesigners: [
          { name: "Thingiverse Featured", profileUrl: "https://www.thingiverse.com/featured", specialty: "Staff picks", isEditablePick: true },
          { name: "LoboCNC", profileUrl: "https://www.thingiverse.com/lobocnc", specialty: "CNC & mechanical" },
          { name: "CreativeTools", profileUrl: "https://www.thingiverse.com/CreativeTools", specialty: "Practical tools" },
        ],
      },
      {
        id: "cults3d",
        name: "Cults3D",
        url: "https://cults3d.com",
        modelCountLabel: "500K+",
        about: "Marketplace with both free and paid models. Strong designer community with revenue sharing. Good for unique, artistic designs.",
        tags: ["Marketplace", "Free & Paid", "Artistic"],
        licenseNotes: "Mixed: free downloads and paid models with various licenses",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://cults3d.com/en/search?q={query}",
        topDesigners: [
          { name: "Cults Featured", profileUrl: "https://cults3d.com/en/users", specialty: "Top sellers", isEditablePick: true },
          { name: "Wekster", profileUrl: "https://cults3d.com/en/users/Wekster", specialty: "Low-poly art" },
          { name: "Cre8iveDesign", profileUrl: "https://cults3d.com/en/users/Cre8iveDesign", specialty: "Home decor" },
        ],
      },
      {
        id: "myminifactory",
        name: "MyMiniFactory",
        url: "https://www.myminifactory.com",
        modelCountLabel: "200K+",
        about: "Curated marketplace with test-printed guarantee. Strong focus on tabletop gaming, miniatures, and artistic models.",
        tags: ["Curated", "Test-Printed", "Miniatures"],
        licenseNotes: "Various licenses, many paid/commercial",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://www.myminifactory.com/search/?query={query}",
        topDesigners: [
          { name: "Loot Studios", profileUrl: "https://www.myminifactory.com/users/Loot", specialty: "Tabletop miniatures" },
          { name: "Fotis Mint", profileUrl: "https://www.myminifactory.com/users/Fotis%20Mint", specialty: "Articulated dragons" },
          { name: "Titan Forge", profileUrl: "https://www.myminifactory.com/users/TitanForgeMiniatures", specialty: "Fantasy armies" },
        ],
      },
      {
        id: "cgtrader",
        name: "CGTrader",
        url: "https://www.cgtrader.com/3d-print-models",
        modelCountLabel: "300K+",
        about: "Professional marketplace for 3D assets including printable models. Higher-end designs often from professional artists.",
        tags: ["Professional", "Marketplace", "High-Quality"],
        licenseNotes: "Commercial licenses available, varies by model",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://www.cgtrader.com/3d-print-models?keywords={query}",
        topDesigners: [
          { name: "CGTrader Top", profileUrl: "https://www.cgtrader.com/3d-designers", specialty: "Pro designers", isEditablePick: true },
          { name: "3DRT", profileUrl: "https://www.cgtrader.com/3drt", specialty: "Game assets" },
          { name: "CGAxis", profileUrl: "https://www.cgtrader.com/cgaxis", specialty: "Architectural" },
        ],
      },
    ],
  },
  {
    id: "aggregators",
    name: "Aggregators",
    description: "Search engines that index multiple repositories",
    repositories: [
      {
        id: "yeggi",
        name: "Yeggi",
        url: "https://www.yeggi.com",
        modelCountLabel: "4M+ indexed",
        about: "Meta-search engine for 3D printable models. Searches across multiple repositories simultaneously to find the best results.",
        tags: ["Meta-Search", "Multi-Source", "Free"],
        licenseNotes: "Links to original sources, check each for license",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://www.yeggi.com/q/{query}/",
        topDesigners: [
          { name: "N/A - Search Engine", profileUrl: "https://www.yeggi.com", specialty: "Aggregates from all platforms", isEditablePick: true },
        ],
      },
      {
        id: "stlfinder",
        name: "STLFinder",
        url: "https://www.stlfinder.com",
        modelCountLabel: "3M+ indexed",
        about: "Another powerful meta-search engine with advanced filtering. Good for finding obscure models across the web.",
        tags: ["Meta-Search", "Advanced Filters", "Free"],
        licenseNotes: "Links to original sources, check each for license",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://www.stlfinder.com/model/{query}/",
        topDesigners: [
          { name: "N/A - Search Engine", profileUrl: "https://www.stlfinder.com", specialty: "Aggregates from all platforms", isEditablePick: true },
        ],
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering & Industrial",
    description: "CAD models and technical parts",
    repositories: [
      {
        id: "grabcad",
        name: "GrabCAD",
        url: "https://grabcad.com/library",
        modelCountLabel: "4M+ CAD files",
        about: "Community library of CAD files from engineers worldwide. Excellent for mechanical parts, assemblies, and reference designs.",
        tags: ["CAD", "Engineering", "Mechanical"],
        licenseNotes: "Varies, many for personal/educational use",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://grabcad.com/library?query={query}",
        topDesigners: [
          { name: "GrabCAD Engineers", profileUrl: "https://grabcad.com/engineers", specialty: "Pro engineers", isEditablePick: true },
          { name: "Christoph Roser", profileUrl: "https://grabcad.com/christoph.roser-1", specialty: "Mechanical assemblies" },
          { name: "Mike L", profileUrl: "https://grabcad.com/mike.l-8", specialty: "Industrial parts" },
        ],
      },
      {
        id: "traceparts",
        name: "TraceParts",
        url: "https://www.traceparts.com",
        modelCountLabel: "100M+ parts",
        about: "Industrial parts library with CAD models from thousands of manufacturers. Perfect for finding exact replacement parts or components.",
        tags: ["Industrial", "Manufacturer Parts", "CAD"],
        licenseNotes: "Manufacturer-provided, usually for design reference",
        safeContentNotes: "Professional industrial content only",
        searchUrlTemplate: "https://www.traceparts.com/en/search?CadModelFilter={query}",
        topDesigners: [
          { name: "Manufacturer Catalogs", profileUrl: "https://www.traceparts.com/en/product/catalogs", specialty: "Official parts", isEditablePick: true },
        ],
      },
    ],
  },
  {
    id: "museums",
    name: "Museums & Cultural",
    description: "3D scans of historical artifacts and cultural objects",
    repositories: [
      {
        id: "scantheworld",
        name: "Scan The World",
        url: "https://www.myminifactory.com/scantheworld/",
        modelCountLabel: "25K+ scans",
        about: "Community initiative to scan and preserve cultural artifacts. Museum-quality 3D scans of sculptures, artifacts, and historical objects.",
        tags: ["Cultural", "Museum Scans", "Preservation"],
        licenseNotes: "CC licenses for cultural preservation",
        safeContentNotes: "Cultural/educational content from museums worldwide",
        topDesigners: [
          { name: "Scan The World Team", profileUrl: "https://www.myminifactory.com/users/Scan%20The%20World", specialty: "Museum partnerships" },
          { name: "Community Scanners", profileUrl: "https://www.myminifactory.com/scantheworld/", specialty: "Global contributors", isEditablePick: true },
        ],
      },
      {
        id: "smithsonian3d",
        name: "Smithsonian 3D",
        url: "https://3d.si.edu",
        modelCountLabel: "5K+ objects",
        about: "Official Smithsonian Institution 3D digitization program. High-quality scans of artifacts from America's national museums.",
        tags: ["Official", "Museum Quality", "Historical"],
        licenseNotes: "Various, many CC0 for educational use",
        safeContentNotes: "Educational content from Smithsonian collections",
        searchUrlTemplate: "https://3d.si.edu/explore?search={query}",
        topDesigners: [
          { name: "Smithsonian Team", profileUrl: "https://3d.si.edu", specialty: "Official digitization", isEditablePick: true },
        ],
      },
      {
        id: "nasa3d",
        name: "NASA 3D Resources",
        url: "https://nasa3d.arc.nasa.gov",
        modelCountLabel: "500+ models",
        about: "Official NASA collection of spacecraft, satellites, terrain data, and space exploration assets. Perfect for educational projects.",
        tags: ["Space", "NASA Official", "Educational"],
        licenseNotes: "Public domain for most NASA content",
        safeContentNotes: "Official NASA educational resources",
        searchUrlTemplate: "https://nasa3d.arc.nasa.gov/search/",
        topDesigners: [
          { name: "NASA 3D Team", profileUrl: "https://nasa3d.arc.nasa.gov", specialty: "Space exploration", isEditablePick: true },
        ],
      },
    ],
  },
  {
    id: "scientific",
    name: "Scientific & Medical",
    description: "Anatomical models, fossils, and scientific data",
    repositories: [
      {
        id: "embodi3d",
        name: "Embodi3D",
        url: "https://www.embodi3d.com",
        modelCountLabel: "10K+ medical",
        about: "Medical 3D printing community with anatomical models generated from CT/MRI scans. Valuable for medical education and surgical planning.",
        tags: ["Medical", "Anatomical", "CT/MRI"],
        licenseNotes: "Various, check per model for medical use restrictions",
        safeContentNotes: "Medical/anatomical educational content",
        searchUrlTemplate: "https://www.embodi3d.com/files/?search={query}",
        topDesigners: [
          { name: "Medical Creators", profileUrl: "https://www.embodi3d.com/files/", specialty: "Anatomical models", isEditablePick: true },
        ],
      },
      {
        id: "nih3d",
        name: "NIH 3D Print Exchange",
        url: "https://3dprint.nih.gov",
        modelCountLabel: "10K+ scientific",
        about: "NIH's collection of scientifically accurate 3D models. Molecular structures, anatomical models, and lab equipment.",
        tags: ["NIH", "Molecular", "Scientific"],
        licenseNotes: "Public domain for NIH-created content",
        safeContentNotes: "Scientific/medical educational resources",
        searchUrlTemplate: "https://3dprint.nih.gov/discover?search={query}",
        topDesigners: [
          { name: "NIH Contributors", profileUrl: "https://3dprint.nih.gov", specialty: "Molecular biology", isEditablePick: true },
        ],
      },
      {
        id: "morphosource",
        name: "MorphoSource",
        url: "https://www.morphosource.org",
        modelCountLabel: "100K+ specimens",
        about: "Duke University's repository for 3D morphology data. CT scans of biological specimens, fossils, and comparative anatomy.",
        tags: ["Academic", "Fossils", "Biology"],
        licenseNotes: "Academic use, check individual specimens",
        safeContentNotes: "Scientific specimen data for research",
        searchUrlTemplate: "https://www.morphosource.org/catalog/media?search={query}",
        topDesigners: [
          { name: "Research Institutions", profileUrl: "https://www.morphosource.org", specialty: "Academic scans", isEditablePick: true },
        ],
      },
      {
        id: "africanfossils",
        name: "African Fossils",
        url: "https://africanfossils.org",
        modelCountLabel: "500+ fossils",
        about: "3D scans of African fossil specimens including important hominid finds. Excellent for paleontology education.",
        tags: ["Fossils", "Paleontology", "Educational"],
        licenseNotes: "Educational use, attribution required",
        safeContentNotes: "Paleontological educational content",
        topDesigners: [
          { name: "Turkana Basin Institute", profileUrl: "https://africanfossils.org", specialty: "Fossil preservation", isEditablePick: true },
        ],
      },
      {
        id: "phenome10k",
        name: "Phenome10K",
        url: "https://www.phenome10k.org",
        modelCountLabel: "10K+ scans",
        about: "High-resolution CT scans of vertebrate specimens. Academic resource for comparative anatomy and evolutionary biology.",
        tags: ["Academic", "CT Scans", "Vertebrates"],
        licenseNotes: "Academic/research use",
        safeContentNotes: "Scientific specimen data",
        topDesigners: [
          { name: "Academic Contributors", profileUrl: "https://www.phenome10k.org", specialty: "Vertebrate anatomy", isEditablePick: true },
        ],
      },
    ],
  },
  {
    id: "manufacturers",
    name: "Manufacturers",
    description: "Official model libraries from printer manufacturers",
    repositories: [
      {
        id: "crealitycloud",
        name: "Creality Cloud",
        url: "https://www.crealitycloud.com",
        modelCountLabel: "100K+",
        about: "Creality's official platform with models optimized for their printers. Includes remote printing and community features.",
        tags: ["Creality", "Official", "Remote Print"],
        licenseNotes: "Various, platform-specific terms",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        searchUrlTemplate: "https://www.crealitycloud.com/model-detail?keyword={query}",
        topDesigners: [
          { name: "Creality Official", profileUrl: "https://www.crealitycloud.com", specialty: "Optimized for Creality", isEditablePick: true },
        ],
      },
      {
        id: "anycubic",
        name: "Anycubic Makeronline",
        url: "https://www.anycubic.com/pages/anycubic-community",
        modelCountLabel: "50K+",
        about: "Anycubic's community and model platform. Models tested and optimized for Anycubic printers.",
        tags: ["Anycubic", "Community", "Official"],
        licenseNotes: "Platform-specific terms",
        safeContentNotes: "No weapons/illicit content; user must comply with local laws",
        topDesigners: [
          { name: "Anycubic Community", profileUrl: "https://www.anycubic.com/pages/anycubic-community", specialty: "Anycubic-optimized", isEditablePick: true },
        ],
      },
      {
        id: "zortrax",
        name: "Zortrax Library",
        url: "https://library.zortrax.com",
        modelCountLabel: "5K+",
        about: "Zortrax's curated library of models tested for their professional-grade printers. High-quality, reliable prints.",
        tags: ["Zortrax", "Professional", "Tested"],
        licenseNotes: "Zortrax platform terms",
        safeContentNotes: "Professional/commercial quality content",
        searchUrlTemplate: "https://library.zortrax.com/?q={query}",
        topDesigners: [
          { name: "Zortrax Team", profileUrl: "https://library.zortrax.com", specialty: "Professional prints", isEditablePick: true },
        ],
      },
    ],
  },
  {
    id: "hidden-gems",
    name: "Hidden Gems",
    description: "Lesser-known but valuable legal resources",
    repositories: [
      {
        id: "sketchfab",
        name: "Sketchfab",
        url: "https://sketchfab.com/3d-models?features=downloadable&licenses=cc",
        modelCountLabel: "500K+ downloadable",
        about: "3D model platform with downloadable CC-licensed scans and models. Filter by license for free, legal downloads.",
        tags: ["CC Licensed", "Scans", "Free Downloads"],
        licenseNotes: "Filter by Creative Commons licenses",
        safeContentNotes: "Filter for CC-licensed content only",
        searchUrlTemplate: "https://sketchfab.com/search?features=downloadable&licenses=cc&q={query}&type=models",
        topDesigners: [
          { name: "Sketchfab Staff Picks", profileUrl: "https://sketchfab.com/3d-models/staffpicks", specialty: "Curated quality", isEditablePick: true },
          { name: "Thomas Flynn", profileUrl: "https://sketchfab.com/nebulousflynn", specialty: "Cultural heritage" },
          { name: "Artec 3D", profileUrl: "https://sketchfab.com/artec3d", specialty: "Professional scans" },
        ],
      },
      {
        id: "internetarchive3d",
        name: "Internet Archive 3D",
        url: "https://archive.org/details/3dmodels",
        modelCountLabel: "10K+",
        about: "The Internet Archive's collection of 3D objects. Historic and preserved models from various sources.",
        tags: ["Archive", "Preservation", "Historic"],
        licenseNotes: "Various, many public domain",
        safeContentNotes: "Archived/preserved content",
        topDesigners: [
          { name: "Archive Contributors", profileUrl: "https://archive.org/details/3dmodels", specialty: "Digital preservation", isEditablePick: true },
        ],
      },
      {
        id: "openscan",
        name: "OpenScan",
        url: "https://www.openscan.eu/library",
        modelCountLabel: "1K+ scans",
        about: "Open-source photogrammetry community. High-quality 3D scans created with affordable scanning setups.",
        tags: ["Photogrammetry", "Open Source", "Community"],
        licenseNotes: "CC licenses, community-contributed",
        safeContentNotes: "Community-created scans",
        topDesigners: [
          { name: "OpenScan Community", profileUrl: "https://www.openscan.eu", specialty: "DIY scanning", isEditablePick: true },
        ],
      },
      {
        id: "libre3d",
        name: "Libre3D",
        url: "https://libre3d.com",
        modelCountLabel: "5K+",
        about: "Open-source focused repository for libre-licensed 3D models. All models freely usable and modifiable.",
        tags: ["Open Source", "Libre", "Free"],
        licenseNotes: "Open-source/libre licenses",
        safeContentNotes: "Open-source community content",
        topDesigners: [
          { name: "Libre Contributors", profileUrl: "https://libre3d.com", specialty: "Open hardware", isEditablePick: true },
        ],
      },
      {
        id: "prusa-printables-community",
        name: "Prusa Community Forum",
        url: "https://forum.prusa3d.com/forum/user-mods-modifications-and-customizations/",
        modelCountLabel: "Varies",
        about: "Prusa's official forum with user modifications and customizations. Great for printer upgrades and community innovations.",
        tags: ["Community", "Mods", "Prusa"],
        licenseNotes: "Community-shared, typically open",
        safeContentNotes: "Printer modifications and upgrades",
        topDesigners: [
          { name: "Forum Community", profileUrl: "https://forum.prusa3d.com", specialty: "Printer mods", isEditablePick: true },
        ],
      },
    ],
  },
];

// Flatten all repositories for search
export const getAllRepositories = (): Repository[] => {
  return REPOSITORY_CATEGORIES.flatMap(cat => cat.repositories);
};

// Search repositories by name or tags
export const searchRepositories = (query: string): Repository[] => {
  const lowerQuery = query.toLowerCase();
  return getAllRepositories().filter(repo => 
    repo.name.toLowerCase().includes(lowerQuery) ||
    repo.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    repo.about.toLowerCase().includes(lowerQuery)
  );
};
