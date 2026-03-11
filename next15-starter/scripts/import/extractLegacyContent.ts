import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type ConflictReportItem,
  LEGACY_REFERENCE_FILES,
  type LegacyAboutPayload,
  type LegacyAppPayload,
  type LegacyCategoryPayload,
  type LegacyContactPayload,
  type LegacyExtractionBundle,
  type LegacyFormPayload,
  type LegacyHomePayload,
  type LegacyMediaReference,
  type LegacyNavbarPayload,
  type LegacyProductPayload,
  type LegacyReferenceFilePath,
  type LegacyServicePayload,
} from "./types";
import {
  MISSING_VALUE,
  asString,
  collectMatches,
  evaluateConstLiteral,
  extractImportMap,
  firstMatch,
  normalizeApplications,
  normalizeSpecRows,
  prettifyIdentifier,
  readLegacyReferenceFile,
  sanitizeText,
  slugify,
  toMediaReference,
  toStringArray,
  uniqueStrings,
  writeJsonFile,
} from "./utils";

interface ExtractLegacyContentOptions {
  writeSnapshot?: boolean;
}

interface RawServiceRecord {
  title?: string;
  description?: string;
  image?: unknown;
}

interface RawAwardRecord {
  title?: string;
  image?: unknown;
}

interface RawTestimonialRecord {
  name?: string;
  company?: string;
  designation?: string;
  logo?: unknown;
  text?: string;
}

function normalizeServiceTitle(value: unknown): string {
  if (typeof value === "string") {
    return sanitizeText(value);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return MISSING_VALUE;
  }

  const record = value as Record<string, unknown>;
  const parts = [record.highlight1, record.normal, record.highlight2, record.ending]
    .map((part) => sanitizeText(part))
    .filter((part) => part.length > 0);

  return parts.length > 0 ? parts.join(" ") : MISSING_VALUE;
}

function mapMediaValue(
  value: unknown,
  fallbackId: string,
  contextImports: Record<string, string>,
): LegacyMediaReference | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return toMediaReference(fallbackId, value.trim());
  }

  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim().length > 0) {
    return toMediaReference(fallbackId, value[0].trim());
  }

  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    const sourcePath = asString(record.sourcePath);
    if (sourcePath) {
      return toMediaReference(fallbackId, sourcePath);
    }
  }

  const maybeImport = asString(value);
  if (maybeImport && contextImports[maybeImport]) {
    return toMediaReference(fallbackId, contextImports[maybeImport]);
  }

  return null;
}

function extractUseStateObject(content: string, variableName: string): Record<string, unknown> {
  const pattern = new RegExp(
    String.raw`const\s+\[${variableName}\s*,\s*set[A-Za-z0-9_]+\]\s*=\s*useState\(\s*(\{[\s\S]*?\})\s*\);`,
    "m",
  );
  const match = content.match(pattern);
  if (!match?.[1]) {
    return {};
  }

  return evaluateConstLiteral<Record<string, unknown>>(`const tmp = ${match[1]};`, "tmp") ?? {};
}

function normalizeInitialValues(raw: Record<string, unknown>): Record<string, string | boolean> {
  const normalized: Record<string, string | boolean> = {};
  Object.entries(raw).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "boolean") {
      normalized[key] = value;
      return;
    }

    normalized[key] = value === null || value === undefined ? "" : String(value);
  });
  return normalized;
}

function extractHomePayload(content: string): LegacyHomePayload {
  const imports = extractImportMap(content);
  const servicesRaw = evaluateConstLiteral<RawServiceRecord[]>(content, "services", imports) ?? [];
  const awardsRaw = evaluateConstLiteral<RawAwardRecord[]>(content, "awardsHome", imports) ?? [];
  const testimonialsRaw = evaluateConstLiteral<RawTestimonialRecord[]>(content, "testimonials", imports) ?? [];
  const partnerLogosRaw = evaluateConstLiteral<string[]>(content, "partnerLogos", imports) ?? [];

  const statsMatches = [...content.matchAll(/const\s+\[(\w+),[^\]]*\]\s*=\s*useCountUp\(\s*0\s*,\s*(\d+)/g)];
  const stats = statsMatches.map((match) => {
    const statKey = match[1] ?? "";
    const value = Number.parseInt(match[2] ?? "0", 10);
    const labelMap: Record<string, string> = {
      clients: "Unique Clients",
      countries: "Countries Served",
      years: "Years of Experience",
    };
    return {
      key: statKey,
      label: labelMap[statKey] ?? prettifyIdentifier(statKey),
      value: Number.isFinite(value) ? value : 0,
      suffix: "+",
    };
  });

  const homeFormInitial = normalizeInitialValues(extractUseStateObject(content, "formData"));
  const categoryOptions = uniqueStrings(collectMatches(content, /<option>([^<]+)<\/option>/g)).filter(
    (value) => value.toLowerCase() !== "select category",
  );

  const services: LegacyServicePayload[] = servicesRaw.map((service, index) => ({
    title: normalizeServiceTitle(service.title),
    description: sanitizeText(service.description ?? MISSING_VALUE),
    image: mapMediaValue(service.image, `home-service-${index + 1}`, imports),
  }));

  const awards = awardsRaw.map((award, index) => ({
    title: sanitizeText(award.title ?? MISSING_VALUE),
    image: mapMediaValue(award.image, `home-award-${index + 1}`, imports),
  }));

  const testimonials = testimonialsRaw.map((testimonial, index) => ({
    name: sanitizeText(testimonial.name ?? MISSING_VALUE),
    company: sanitizeText(testimonial.company ?? MISSING_VALUE),
    designation: sanitizeText(testimonial.designation ?? ""),
    text: sanitizeText(testimonial.text ?? ""),
    logo: mapMediaValue(testimonial.logo, `home-testimonial-${index + 1}`, imports),
  }));

  const partnerLogos = partnerLogosRaw
    .map((entry, index) => {
      const sourcePath = imports[entry] ?? entry;
      if (!sourcePath) {
        return null;
      }
      return toMediaReference(`home-partner-logo-${index + 1}`, sourcePath);
    })
    .filter((entry): entry is LegacyMediaReference => entry !== null);

  return {
    heroTitle: content.includes("REIMAGINING WASTE")
      ? "REIMAGINING WASTE, REENGINEERING THE FUTURE"
      : MISSING_VALUE,
    heroDescription: firstMatch(content, /(Empowering Industries with Advanced Engineering Solutions)/),
    heroPrimaryLabel: "Our Machines",
    heroPrimaryUrl: "/category-page",
    heroSecondaryLabel: "Watch Video",
    heroSecondaryUrl: "https://www.youtube.com/@RanganiEngineeringPvtLtd",
    stats,
    partnerLogos,
    services,
    awards,
    testimonials,
    contactForm: {
      initialValues: homeFormInitial,
      requiredFields: ["name", "email", "company", "country", "state", "city"],
      categoryOptions,
      labels: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        company: "Company Name",
        country: "Country",
        state: "State",
        city: "City",
        category: "Category",
        message: "Your Message",
      },
      termsLabel: firstMatch(content, /(Agree to our terms and conditions)/) || MISSING_VALUE,
      successMessage: firstMatch(content, /setFormSuccess\("([^"]+)"\)/),
      errorMessage: firstMatch(content, /setFormError\("([^"]+)"\)/),
    },
    contactSidebar: {
      title: firstMatch(content, /<h3[^>]*>([^<]*Happy to Help[^<]*)<\/h3>/) || "Happy to Help",
      description:
        firstMatch(content, /(24\/7 service support and technical assistance[^<.]*\.)/) || MISSING_VALUE,
      email: firstMatch(content, /(mail@ranganiindia\.com)/),
      phone: firstMatch(content, /(Mobile:\s*\+91-8000920222[^<"]*)/),
      address: firstMatch(content, /(Survey No\. 258[\s\S]*?India\.)/),
      mapUrl: firstMatch(content, /href="(https:\/\/maps\.app\.goo\.gl\/[^"]+)"/),
    },
  };
}

function extractAboutPayload(content: string): LegacyAboutPayload {
  const imports = extractImportMap(content);
  const servicesRaw = evaluateConstLiteral<RawServiceRecord[]>(content, "services", imports) ?? [];
  const awardsRaw = evaluateConstLiteral<RawAwardRecord[]>(content, "awards", imports) ?? [];
  const foundingYears = collectMatches(content, /Established in\s+(\d{4})/g).map((value) =>
    Number.parseInt(value, 10),
  );

  const services: LegacyServicePayload[] = servicesRaw.map((service, index) => ({
    title: normalizeServiceTitle(service.title),
    description: sanitizeText(service.description ?? MISSING_VALUE),
    image: mapMediaValue(service.image, `about-service-${index + 1}`, imports),
  }));

  const awards = awardsRaw.map((award, index) => ({
    title: sanitizeText(award.title ?? MISSING_VALUE),
    image: mapMediaValue(award.image, `about-award-${index + 1}`, imports),
  }));

  const storyParagraphOne = firstMatch(content, /(Established in 1981[\s\S]*?durability\.)/);
  const storyParagraphTwo = firstMatch(content, /(Our offerings encompass[\s\S]*?expectations\.)/);

  const featureCards = [
    {
      title: "Our Vision",
      description: firstMatch(content, /(To be the world's leading provider of advanced engineering solutions[^"]+)/),
      iconHint: "vision",
    },
    {
      title: "Our Mission",
      description: firstMatch(content, /(To engineer innovative and sustainable solutions[^"]+)/),
      iconHint: "mission",
    },
    {
      title: "Quality and Sustainability",
      description: firstMatch(content, /(Our Philosophy is simple:[^"]+)/),
      iconHint: "quality",
    },
  ];

  return {
    heroTitle:
      firstMatch(content, /(Leading the Future:[\s\S]*?Greener World\.)/) ||
      "Leading the Future: Innovating Sustainability for a Cleaner, Greener World.",
    storyHeading: "Our Story",
    storyParagraphs: [storyParagraphOne, storyParagraphTwo].filter((paragraph) => paragraph.length > 0),
    storyImage: imports.ourstoryimg ? toMediaReference("about-story-image", imports.ourstoryimg) : null,
    featureCards,
    services,
    awards,
    ctaTitle: firstMatch(content, /(Build\s*Beyond\s*Ordinary)/) || "Build Beyond Ordinary",
    ctaDescription:
      firstMatch(content, /(At Rangani Engineering, we engineer legacies[^<.]*\.)/) || MISSING_VALUE,
    ctaPrimaryLabel: "Email Us",
    ctaPrimaryUrl: "/contact",
    foundingYears: foundingYears.filter((year) => Number.isFinite(year)),
  };
}

function extractContactPayload(content: string): LegacyContactPayload {
  const initialValues = normalizeInitialValues(extractUseStateObject(content, "formData"));
  const categoryOptions = uniqueStrings(collectMatches(content, /<option>([^<]+)<\/option>/g)).filter(
    (value) => value.toLowerCase() !== "select category",
  );

  const labels = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    country: "Country",
    state: "State",
    city: "City",
    category: "Category",
    message: "Your Message",
  };

  return {
    pageHeading: firstMatch(content, /Connect\s*<span[^>]*>With Us<\/span>/) || "Connect With Us",
    form: {
      initialValues,
      requiredFields: ["name", "email", "company", "country", "state", "city"],
      categoryOptions,
      labels,
      termsLabel:
        firstMatch(content, /(I agree to the terms and conditions)/) || "I agree to the terms and conditions",
      successMessage: firstMatch(content, /setFormSuccess\("([^"]+)"\)/),
      errorMessage: firstMatch(content, /setFormError\("([^"]+)"\)/),
    },
    sidebar: {
      title: firstMatch(content, /<h3[^>]*>([^<]*Happy to Help[^<]*)<\/h3>/) || "Happy to Help",
      description:
        firstMatch(content, /(24\/7 service support and technical assistance[^<.]*\.)/) || MISSING_VALUE,
      email: firstMatch(content, /(mail@ranganiindia\.com)/),
      phone: firstMatch(content, /(Mobile:\s*\+91-8000920222[^<"]*)/),
      address: firstMatch(content, /(Survey No\. 258[\s\S]*?India\.)/),
      mapUrl: firstMatch(content, /href="(https:\/\/maps\.app\.goo\.gl\/[^"]+)"/),
    },
  };
}

function extractCategoriesPayload(content: string): LegacyCategoryPayload[] {
  const imports = extractImportMap(content);
  const categoriesRaw =
    evaluateConstLiteral<
      Array<{ id?: number; name?: string; description?: string; image?: unknown; productSlugs?: unknown }>
    >(content, "CATEGORY_LIST", imports) ?? [];

  return categoriesRaw.map((category, index) => ({
    id: typeof category.id === "number" ? category.id : index,
    name: sanitizeText(category.name ?? MISSING_VALUE),
    slug: slugify(category.name ?? ""),
    description: sanitizeText(category.description ?? ""),
    image: mapMediaValue(category.image, `category-${index + 1}`, imports),
    productSlugs: toStringArray(category.productSlugs),
  }));
}

function extractProductsPayload(content: string): LegacyProductPayload[] {
  const imports = extractImportMap(content);
  const productsRaw =
    evaluateConstLiteral<Record<string, Record<string, unknown>>>(content, "productsData", imports) ?? {};

  return Object.entries(productsRaw).map(([slug, productRecord]) => {
    const benefits = toStringArray(productRecord.benefits);
    const legacyBenifits = toStringArray(productRecord.benifits);

    const applications = normalizeApplications(productRecord.applications);
    const galleryValues = Array.isArray(productRecord.image)
      ? productRecord.image
      : typeof productRecord.image === "string"
        ? [productRecord.image]
        : [];

    const gallery = galleryValues
      .map((entry, index) => {
        if (typeof entry !== "string") {
          return null;
        }
        return toMediaReference(`${slug}-gallery-${index + 1}`, entry);
      })
      .filter((entry): entry is LegacyMediaReference => entry !== null);

    return {
      slug,
      title: asString(productRecord.name) || MISSING_VALUE,
      categoryName: asString(productRecord.category) || MISSING_VALUE,
      categorySlug: slugify(asString(productRecord.category)),
      tagline: asString(productRecord.tagline),
      introDescription: asString(productRecord.description),
      videoUrl: asString(productRecord.videoUrl),
      gallery,
      benefits,
      legacyBenifits,
      specRows: normalizeSpecRows(productRecord.specifications),
      applicationMaterials: applications.materials,
      applicationIndustries: applications.industries,
    };
  });
}

function extractNavbarPayload(content: string): LegacyNavbarPayload {
  const imports = extractImportMap(content);
  const socialRaw =
    evaluateConstLiteral<Array<{ alt?: string; url?: string; icon?: unknown }>>(content, "socialMediaLinks", imports) ??
    [];

  const navLinks = collectMatches(content, /<li><Link to="([^"]+)"/g).map((url) => {
    const label = url === "/" ? "Home" : url.replace("/", "").replace(/-/g, " ");
    return {
      label: prettifyIdentifier(label),
      url,
    };
  });

  const socialLinks = socialRaw.map((socialItem) => ({
    label: asString(socialItem.alt) || "Social",
    url: asString(socialItem.url) || MISSING_VALUE,
    iconPath: typeof socialItem.icon === "string" ? socialItem.icon : MISSING_VALUE,
  }));

  return {
    logoPath: imports.rewblogo ?? MISSING_VALUE,
    navLinks,
    socialLinks,
    contactPhone: firstMatch(content, /(\+91\s*8000920222)/),
    contactEmail: firstMatch(content, /(mail@ranganiindia\.com)/),
    brochureLabel: firstMatch(content, /(Get Brochure)/) || "Get Brochure",
    brochureUrl: firstMatch(content, /href="([^"]*Rangani Brochure\.pdf)"/),
  };
}

function extractAppPayload(content: string): LegacyAppPayload {
  const imports = extractImportMap(content);
  const promoDelayMs = Number.parseInt(firstMatch(content, /setTimeout\([^,]+,\s*(\d+)\)/), 10);
  const promoAutoRotateMs = Number.parseInt(firstMatch(content, /setInterval\([^,]+,\s*(\d+)\)/), 10);
  const images = evaluateConstLiteral<string[]>(content, "images", imports) ?? [];

  const promoImages = images.map((imagePath, index) =>
    toMediaReference(`promo-image-${index + 1}`, imagePath || MISSING_VALUE),
  );

  return {
    promoDelayMs: Number.isFinite(promoDelayMs) ? promoDelayMs : 5000,
    promoAutoRotateMs: Number.isFinite(promoAutoRotateMs) ? promoAutoRotateMs : 3000,
    promoImages,
  };
}

function buildExtractionConflicts(bundle: {
  about: LegacyAboutPayload;
  categories: LegacyCategoryPayload[];
  navbar: LegacyNavbarPayload;
  products: LegacyProductPayload[];
}): ConflictReportItem[] {
  const conflicts: ConflictReportItem[] = [];
  const pushConflict = (conflict: Omit<ConflictReportItem, "id">): void => {
    conflicts.push({ ...conflict, id: `extract-${conflicts.length + 1}` });
  };

  const foundingYears = uniqueStrings(bundle.about.foundingYears.map((year) => String(year)));
  if (foundingYears.length > 1) {
    pushConflict({
      severity: "warning",
      title: "About page founding year conflict",
      description: `Found multiple founding years in About content: ${foundingYears.join(", ")}.`,
      sourceFiles: [LEGACY_REFERENCE_FILES.aboutPage],
      fieldPaths: ["about.storyParagraphs"],
      suggestedAction: "Confirm a single canonical founding year before importing page content.",
    });
  }

  const categoriesFromPage = new Set(bundle.categories.map((category) => category.slug));
  const categoriesFromProducts = new Set(
    bundle.products.map((product) => product.categorySlug).filter((slug) => slug.length > 0),
  );

  const missingInCategoriesPage = [...categoriesFromProducts].filter((slug) => !categoriesFromPage.has(slug));
  if (missingInCategoriesPage.length > 0) {
    pushConflict({
      severity: "warning",
      title: "Category structure mismatch",
      description: `Product data references category slugs missing from CategoriesPage: ${missingInCategoriesPage.join(
        ", ",
      )}.`,
      sourceFiles: [LEGACY_REFERENCE_FILES.categoriesPage, LEGACY_REFERENCE_FILES.productData],
      fieldPaths: ["categories", "products.category"],
      suggestedAction: "Add taxonomy records for missing slugs or remap product categories before import.",
    });
  }

  const legacyBenifitsProducts = bundle.products.filter((product) => product.legacyBenifits.length > 0);
  if (legacyBenifitsProducts.length > 0) {
    pushConflict({
      severity: "warning",
      title: "Malformed product field name",
      description: `${legacyBenifitsProducts.length} products use legacy field "benifits" instead of "benefits".`,
      sourceFiles: [LEGACY_REFERENCE_FILES.productData],
      fieldPaths: ["products[*].benifits"],
      suggestedAction: "Validate normalized benefits arrays for all affected products before import.",
    });
  }

  pushConflict({
    severity: "info",
    title: "Missing footer source detail",
    description: "Footer content source was not included in the approved legacy input scope.",
    sourceFiles: [LEGACY_REFERENCE_FILES.navbar],
    fieldPaths: ["global.footer"],
    suggestedAction: "Provide footer source file or define footer options manually in WordPress.",
  });

  pushConflict({
    severity: "warning",
    title: "Duplicated contact form logic",
    description: "Contact form implementation exists in both HomePage and ContactUs legacy files.",
    sourceFiles: [LEGACY_REFERENCE_FILES.homePage, LEGACY_REFERENCE_FILES.contactPage],
    fieldPaths: ["home.contactForm", "contact.form"],
    suggestedAction: "Merge to a single canonical form model before import.",
  });

  if (bundle.navbar.socialLinks.length === 0) {
    pushConflict({
      severity: "warning",
      title: "Missing social link payload",
      description: "No social links were extracted from Navbar social media configuration.",
      sourceFiles: [LEGACY_REFERENCE_FILES.navbar],
      fieldPaths: ["global.socialLinks"],
      suggestedAction: "Populate social links manually before import.",
    });
  }

  return conflicts;
}

export function extractLegacyContent(options: ExtractLegacyContentOptions = {}): LegacyExtractionBundle {
  const generatedAt = new Date().toISOString();

  const homeContent = readLegacyReferenceFile(LEGACY_REFERENCE_FILES.homePage);
  const aboutContent = readLegacyReferenceFile(LEGACY_REFERENCE_FILES.aboutPage);
  const contactContent = readLegacyReferenceFile(LEGACY_REFERENCE_FILES.contactPage);
  const categoriesContent = readLegacyReferenceFile(LEGACY_REFERENCE_FILES.categoriesPage);
  const productDataContent = readLegacyReferenceFile(LEGACY_REFERENCE_FILES.productData);
  const navbarContent = readLegacyReferenceFile(LEGACY_REFERENCE_FILES.navbar);
  const appContent = readLegacyReferenceFile(LEGACY_REFERENCE_FILES.app);

  const home = extractHomePayload(homeContent);
  const about = extractAboutPayload(aboutContent);
  const contact = extractContactPayload(contactContent);
  const categories = extractCategoriesPayload(categoriesContent);
  const products = extractProductsPayload(productDataContent);
  const navbar = extractNavbarPayload(navbarContent);
  const app = extractAppPayload(appContent);

  const conflicts = buildExtractionConflicts({ about, categories, navbar, products });

  const bundle: LegacyExtractionBundle = {
    generatedAt,
    home,
    about,
    contact,
    categories,
    products,
    navbar,
    app,
    conflicts,
  };

  if (options.writeSnapshot) {
    const outputPath = path.resolve(process.cwd(), "scripts/import/output/legacy-extracted.json");
    writeJsonFile(outputPath, bundle);
  }

  return bundle;
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const bundle = extractLegacyContent({ writeSnapshot: true });
  console.log(`[import:extract] extracted home services: ${bundle.home.services.length}`);
  console.log(`[import:extract] extracted about services: ${bundle.about.services.length}`);
  console.log(`[import:extract] extracted categories: ${bundle.categories.length}`);
  console.log(`[import:extract] extracted products: ${bundle.products.length}`);
  console.log(`[import:extract] extracted conflicts: ${bundle.conflicts.length}`);
  console.log("[import:extract] wrote scripts/import/output/legacy-extracted.json");
}
