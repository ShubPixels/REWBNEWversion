import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractLegacyContent } from "./extractLegacyContent";
import {
  type BuildImportPayloadResult,
  type ConflictReportItem,
  LEGACY_REFERENCE_FILES,
  type LegacyExtractionBundle,
  type NormalizedFlexibleBlock,
  type NormalizedGlobalOptionsPayload,
  type NormalizedPagePayload,
  type NormalizedProductPayload,
  type NormalizedTaxonomyPayload,
} from "./types";
import { MISSING_VALUE, slugify, writeJsonFile } from "./utils";

function withFallback(value: string): string {
  return value.trim().length > 0 ? value.trim() : MISSING_VALUE;
}

function buildContactFormBlockData(input: {
  title: string;
  description: string;
  formTitle: string;
  form: {
    labels: Record<string, string>;
    categoryOptions: string[];
    termsLabel: string;
    successMessage: string;
    errorMessage: string;
  };
  sidebar: {
    title: string;
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
  };
}): Record<string, unknown> {
  const nameLabel = input.form.labels.name ?? "";
  const emailLabel = input.form.labels.email ?? "";
  const phoneLabel = input.form.labels.phone ?? "";
  const companyLabel = input.form.labels.company ?? "";
  const categoryLabel = input.form.labels.category ?? "";
  const messageLabel = input.form.labels.message ?? "";

  return {
    title: withFallback(input.title),
    description: withFallback(input.description),
    formTitle: withFallback(input.formTitle),
    submitLabel: "Submit Now",
    submitPendingLabel: "Sending...",
    successMessage: withFallback(input.form.successMessage),
    errorMessage: withFallback(input.form.errorMessage),
    categoryPlaceholder: "Select Category",
    termsLabel: withFallback(input.form.termsLabel),
    categories: input.form.categoryOptions.length > 0 ? input.form.categoryOptions : [MISSING_VALUE],
    labels: {
      name: withFallback(nameLabel),
      email: withFallback(emailLabel),
      phone: withFallback(phoneLabel),
      company: withFallback(companyLabel),
      category: withFallback(categoryLabel),
      message: withFallback(messageLabel),
    },
    sidebar: {
      title: withFallback(input.sidebar.title),
      phoneLabel: "Phone",
      emailLabel: "Email",
      addressLabel: "Address",
      mapButtonLabel: "Get Directions",
    },
    contactEmail: withFallback(input.sidebar.email),
    contactPhone: withFallback(input.sidebar.phone),
    contactAddress: withFallback(input.sidebar.address),
    mapLink: {
      label: "Get Directions",
      url: withFallback(input.sidebar.mapUrl),
      target: "_blank",
    },
  };
}

function buildHomePagePayload(extracted: LegacyExtractionBundle): NormalizedPagePayload {

  const blocks: NormalizedFlexibleBlock[] = [
    {
      blockKey: "hero_showcase",
      data: {
        title: withFallback(extracted.home.heroTitle),
        description: withFallback(extracted.home.heroDescription),
        primaryCta: {
          label: withFallback(extracted.home.heroPrimaryLabel),
          url: withFallback(extracted.home.heroPrimaryUrl),
        },
        secondaryCta: {
          label: withFallback(extracted.home.heroSecondaryLabel),
          url: withFallback(extracted.home.heroSecondaryUrl),
        },
      },
    },
    {
      blockKey: "stats_band",
      data: {
        title: "Operational Impact",
        stats: extracted.home.stats.map((stat) => ({
          label: withFallback(stat.label),
          value: stat.value,
          suffix: stat.suffix,
        })),
      },
    },
    {
      blockKey: "logo_marquee",
      data: {
        title: "Trusted by Industry Leaders",
        logos: extracted.home.partnerLogos.map((logo) => ({
          name: logo.id,
          logo: {
            sourcePath: logo.sourcePath,
          },
        })),
      },
    },
    {
      blockKey: "category_cards_grid",
      data: {
        title: "Our Wide Range of Categories",
        cards: extracted.home.services.map((service) => ({
          title: withFallback(service.title),
          description: withFallback(service.description),
          image: service.image ? { sourcePath: service.image.sourcePath } : { sourcePath: MISSING_VALUE },
          link: {
            label: "More Machines",
            url: `/category-page?category=${encodeURIComponent(service.title)}`,
          },
        })),
      },
    },
    {
      blockKey: "awards_grid",
      data: {
        title: "Our Achievements",
        awards: extracted.home.awards.map((award) => ({
          title: withFallback(award.title),
          image: award.image ? { sourcePath: award.image.sourcePath } : { sourcePath: MISSING_VALUE },
        })),
      },
    },
    {
      blockKey: "testimonials_slider",
      data: {
        title: "Experiences That Matter",
        autoplayMs: 4000,
        testimonials: extracted.home.testimonials.map((testimonial) => ({
          quote: withFallback(testimonial.text),
          author: withFallback(testimonial.name),
          role: withFallback(testimonial.designation),
          company: withFallback(testimonial.company),
          avatar: testimonial.logo ? { sourcePath: testimonial.logo.sourcePath } : null,
        })),
      },
    },
    {
      blockKey: "contact_form_split",
      data: buildContactFormBlockData({
        title: "Connect With Us",
        description: "Send us your project details and our team will respond.",
        formTitle: "Connect With Us",
        form: extracted.home.contactForm,
        sidebar: extracted.home.contactSidebar,
      }),
    },
  ];

  return {
    slug: "home",
    title: "Home",
    uri: "/",
    flexibleBlocks: blocks,
    seo: {
      metaTitle: "Home | Rangani Engineering",
      metaDescription: "Legacy home page content normalized for WordPress flexible content import.",
    },
    sourceFiles: [LEGACY_REFERENCE_FILES.homePage, LEGACY_REFERENCE_FILES.navbar, LEGACY_REFERENCE_FILES.app],
  };
}

function buildAboutPagePayload(extracted: LegacyExtractionBundle): NormalizedPagePayload {
  const storyDescription = extracted.about.storyParagraphs[0] ?? MISSING_VALUE;
  const storyBody = extracted.about.storyParagraphs[1] ?? MISSING_VALUE;

  const blocks: NormalizedFlexibleBlock[] = [
    {
      blockKey: "page_intro",
      data: {
        title: withFallback(extracted.about.heroTitle),
        description: "Legacy About content normalized from CRA source.",
      },
    },
    {
      blockKey: "split_content_media",
      data: {
        title: withFallback(extracted.about.storyHeading),
        description: withFallback(storyDescription),
        body: withFallback(storyBody),
        media: extracted.about.storyImage ? { sourcePath: extracted.about.storyImage.sourcePath } : { sourcePath: MISSING_VALUE },
      },
    },
    {
      blockKey: "feature_cards_grid",
      data: {
        title: "Why Choose Us",
        cards: extracted.about.featureCards.map((feature) => ({
          title: withFallback(feature.title),
          description: withFallback(feature.description),
          icon: withFallback(feature.iconHint),
        })),
      },
    },
    {
      blockKey: "service_rows_alternating",
      data: {
        title: "What We Do",
        rows: extracted.about.services.map((service) => ({
          title: withFallback(service.title),
          description: withFallback(service.description),
          image: service.image ? { sourcePath: service.image.sourcePath } : { sourcePath: MISSING_VALUE },
        })),
      },
    },
    {
      blockKey: "awards_grid",
      data: {
        title: "Our Achievements",
        awards: extracted.about.awards.map((award) => ({
          title: withFallback(award.title),
          image: award.image ? { sourcePath: award.image.sourcePath } : { sourcePath: MISSING_VALUE },
        })),
      },
    },
    {
      blockKey: "cta_banner",
      data: {
        title: withFallback(extracted.about.ctaTitle),
        description: withFallback(extracted.about.ctaDescription),
        primaryCta: {
          label: withFallback(extracted.about.ctaPrimaryLabel),
          url: withFallback(extracted.about.ctaPrimaryUrl),
        },
      },
    },
  ];

  return {
    slug: "about",
    title: "About Us",
    uri: "/about",
    flexibleBlocks: blocks,
    seo: {
      metaTitle: "About | Rangani Engineering",
      metaDescription: "Legacy About page content normalized for WordPress flexible content import.",
    },
    sourceFiles: [LEGACY_REFERENCE_FILES.aboutPage],
  };
}

function buildContactPagePayload(extracted: LegacyExtractionBundle): NormalizedPagePayload {
  const blocks: NormalizedFlexibleBlock[] = [
    {
      blockKey: "page_intro",
      data: {
        title: withFallback(extracted.contact.pageHeading),
        description: "Reach out for technical support and sales inquiries.",
      },
    },
    {
      blockKey: "contact_form_split",
      data: buildContactFormBlockData({
        title: withFallback(extracted.contact.pageHeading),
        description: withFallback(extracted.contact.sidebar.description),
        formTitle: withFallback(extracted.contact.pageHeading),
        form: extracted.contact.form,
        sidebar: extracted.contact.sidebar,
      }),
    },
  ];

  return {
    slug: "contact",
    title: "Contact",
    uri: "/contact",
    flexibleBlocks: blocks,
    seo: {
      metaTitle: "Contact | Rangani Engineering",
      metaDescription: "Legacy Contact page content normalized for WordPress flexible content import.",
    },
    sourceFiles: [LEGACY_REFERENCE_FILES.contactPage],
  };
}

function buildGlobalOptionsPayload(extracted: LegacyExtractionBundle): NormalizedGlobalOptionsPayload {
  const manualReviewFields: string[] = ["footer_options.links", "seo_defaults", "promo_modal.slides[*].cta_url"];

  return {
    site_name: "RANGANI ENGINEERING PVT LTD",
    site_tagline: withFallback(extracted.home.heroDescription),
    header_options: {
      logo_path: withFallback(extracted.navbar.logoPath),
      links: extracted.navbar.navLinks,
    },
    footer_options: {
      links: [
        {
          label: MISSING_VALUE,
          url: MISSING_VALUE,
        },
      ],
    },
    contact_social_options: {
      contact_email: withFallback(extracted.contact.sidebar.email || extracted.navbar.contactEmail),
      contact_phone: withFallback(extracted.contact.sidebar.phone || extracted.navbar.contactPhone),
      contact_address: withFallback(extracted.contact.sidebar.address),
      social_links: extracted.navbar.socialLinks.map((social) => ({
        label: withFallback(social.label),
        url: withFallback(social.url),
      })),
    },
    brochure_download_links: [
      {
        label: withFallback(extracted.navbar.brochureLabel),
        url: withFallback(extracted.navbar.brochureUrl),
      },
    ],
    promo_modal: {
      enabled: extracted.app.promoImages.length > 0,
      delay_ms: extracted.app.promoDelayMs,
      auto_rotate_ms: extracted.app.promoAutoRotateMs,
      slides: extracted.app.promoImages.map((image, index) => ({
        image: withFallback(image.sourcePath),
        heading: `Promo Slide ${index + 1}`,
        description: MISSING_VALUE,
        cta_label: MISSING_VALUE,
        cta_url: MISSING_VALUE,
      })),
    },
    shared_credibility: {
      awards: extracted.home.awards.map((award) => ({
        title: withFallback(award.title),
        image: award.image?.sourcePath ?? MISSING_VALUE,
      })),
      client_logos: extracted.home.partnerLogos.map((logo) => ({
        name: withFallback(logo.id),
        image: withFallback(logo.sourcePath),
      })),
    },
    seo_defaults: {
      meta_title: MISSING_VALUE,
      meta_description: MISSING_VALUE,
    },
    source_files: [
      LEGACY_REFERENCE_FILES.navbar,
      LEGACY_REFERENCE_FILES.contactPage,
      LEGACY_REFERENCE_FILES.homePage,
      LEGACY_REFERENCE_FILES.app,
    ],
    manual_review_fields: manualReviewFields,
  };
}

function buildProductCategoriesPayload(extracted: LegacyExtractionBundle): NormalizedTaxonomyPayload[] {
  const categoriesBySlug = new Map<string, NormalizedTaxonomyPayload>();

  extracted.categories.forEach((category) => {
    const slug = slugify(category.slug || category.name);
    const relatedLegacyProductSlugs = new Set<string>(category.productSlugs);
    extracted.products
      .filter((product) => product.categorySlug === slug)
      .forEach((product) => relatedLegacyProductSlugs.add(product.slug));

    const isServiceCategory =
      category.productSlugs.length === 0 || category.name.toLowerCase().includes("service");
    const manualReviewFields: string[] = [];
    if (!category.image?.sourcePath) {
      manualReviewFields.push("card_image");
    }
    manualReviewFields.push("archive_hero_image");
    manualReviewFields.push("cta_url");

    categoriesBySlug.set(slug, {
      slug,
      name: withFallback(category.name),
      short_description: withFallback(category.description),
      card_image: category.image?.sourcePath ?? MISSING_VALUE,
      archive_hero_image: MISSING_VALUE,
      cta_label: isServiceCategory ? "Discuss Your Project" : "Explore Category",
      cta_url: isServiceCategory ? "/contact" : MISSING_VALUE,
      is_service_category: isServiceCategory,
      empty_state_heading: isServiceCategory ? "Service Category" : MISSING_VALUE,
      empty_state_text: isServiceCategory
        ? "This category is service-led and does not currently expose product cards."
        : MISSING_VALUE,
      related_legacy_product_slugs: [...relatedLegacyProductSlugs],
      source_files: [LEGACY_REFERENCE_FILES.categoriesPage, LEGACY_REFERENCE_FILES.productData],
      manual_review_fields: manualReviewFields,
    });
  });

  extracted.products.forEach((product) => {
    if (!product.categorySlug || categoriesBySlug.has(product.categorySlug)) {
      return;
    }

    categoriesBySlug.set(product.categorySlug, {
      slug: product.categorySlug,
      name: withFallback(product.categoryName),
      short_description: MISSING_VALUE,
      card_image: MISSING_VALUE,
      archive_hero_image: MISSING_VALUE,
      cta_label: "Explore Category",
      cta_url: MISSING_VALUE,
      is_service_category: false,
      empty_state_heading: MISSING_VALUE,
      empty_state_text: MISSING_VALUE,
      related_legacy_product_slugs: [product.slug],
      source_files: [LEGACY_REFERENCE_FILES.productData],
      manual_review_fields: ["short_description", "card_image", "archive_hero_image", "cta_url"],
    });
  });

  return [...categoriesBySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

function buildProductsPayload(
  extracted: LegacyExtractionBundle,
  categories: NormalizedTaxonomyPayload[],
): NormalizedProductPayload[] {
  const knownCategorySlugs = new Set(categories.map((category) => category.slug));

  return extracted.products
    .map((product) => {
      const benefits = product.benefits.length > 0 ? product.benefits : product.legacyBenifits;
      const manualReviewFields: string[] = [];

      if (product.legacyBenifits.length > 0 && product.benefits.length === 0) {
        manualReviewFields.push("benefits");
      }
      if (!product.tagline) {
        manualReviewFields.push("tagline");
      }
      if (!product.videoUrl) {
        manualReviewFields.push("video_url");
      }
      if (product.specRows.length === 0) {
        manualReviewFields.push("spec_rows");
      }
      manualReviewFields.push("cta_label", "cta_url", "related_product_override");

      const normalizedCategorySlug = product.categorySlug || slugify(product.categoryName);
      if (!knownCategorySlugs.has(normalizedCategorySlug)) {
        manualReviewFields.push("category_slugs");
      }

      return {
        slug: withFallback(product.slug),
        title: withFallback(product.title),
        category_slugs: normalizedCategorySlug ? [normalizedCategorySlug] : [MISSING_VALUE],
        tagline: withFallback(product.tagline),
        intro_description: withFallback(product.introDescription),
        video_url: withFallback(product.videoUrl),
        gallery: product.gallery.length > 0 ? product.gallery.map((media) => media.sourcePath) : [MISSING_VALUE],
        benefits: benefits.length > 0 ? benefits : [MISSING_VALUE],
        spec_rows:
          product.specRows.length > 0
            ? product.specRows.map((row) => ({
                spec_label: row.specLabel || MISSING_VALUE,
                spec_value: row.specValue || MISSING_VALUE,
              }))
            : [{ spec_label: MISSING_VALUE, spec_value: MISSING_VALUE }],
        application_materials:
          product.applicationMaterials.length > 0 ? product.applicationMaterials : [MISSING_VALUE],
        application_industries:
          product.applicationIndustries.length > 0 ? product.applicationIndustries : [MISSING_VALUE],
        cta_label: MISSING_VALUE,
        cta_url: MISSING_VALUE,
        related_product_override_slugs: [],
        source_files: [LEGACY_REFERENCE_FILES.productData],
        manual_review_fields: Array.from(new Set(manualReviewFields)),
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function buildConflictReport(
  extracted: LegacyExtractionBundle,
  categories: NormalizedTaxonomyPayload[],
  products: NormalizedProductPayload[],
): ConflictReportItem[] {
  const conflicts = [...extracted.conflicts];
  const pushConflict = (conflict: Omit<ConflictReportItem, "id">): void => {
    conflicts.push({
      ...conflict,
      id: `build-${conflicts.length + 1}`,
    });
  };

  const categoriesMissingHero = categories.filter((category) => category.archive_hero_image === MISSING_VALUE);
  if (categoriesMissingHero.length > 0) {
    pushConflict({
      severity: "warning",
      title: "Missing category archive hero images",
      description: `${categoriesMissingHero.length} categories require archive hero image mapping.`,
      sourceFiles: [LEGACY_REFERENCE_FILES.categoriesPage],
      fieldPaths: ["product-categories[*].archive_hero_image"],
      suggestedAction: "Assign archive hero media before importing taxonomy content.",
    });
  }

  const productsWithPlaceholderCta = products.filter(
    (product) => product.cta_label === MISSING_VALUE || product.cta_url === MISSING_VALUE,
  );
  if (productsWithPlaceholderCta.length > 0) {
    pushConflict({
      severity: "info",
      title: "Product CTA placeholders remain",
      description: `${productsWithPlaceholderCta.length} products have placeholder CTA fields.`,
      sourceFiles: [LEGACY_REFERENCE_FILES.productData],
      fieldPaths: ["products[*].cta_label", "products[*].cta_url"],
      suggestedAction: "Set product-level CTA label and URL values before publish.",
    });
  }

  const productsMissingIndustryData = products.filter((product) =>
    product.application_industries.includes(MISSING_VALUE),
  );
  if (productsMissingIndustryData.length > 0) {
    pushConflict({
      severity: "info",
      title: "Application industry data incomplete",
      description: `${productsMissingIndustryData.length} products are missing application industry mappings.`,
      sourceFiles: [LEGACY_REFERENCE_FILES.productData],
      fieldPaths: ["products[*].application_industries"],
      suggestedAction: "Populate missing application industries before import.",
    });
  }

  const categoriesWithoutProducts = categories.filter(
    (category) => !category.is_service_category && category.related_legacy_product_slugs.length === 0,
  );
  if (categoriesWithoutProducts.length > 0) {
    pushConflict({
      severity: "warning",
      title: "Category structure mismatch",
      description: `${categoriesWithoutProducts.length} non-service categories have no mapped legacy products.`,
      sourceFiles: [LEGACY_REFERENCE_FILES.categoriesPage, LEGACY_REFERENCE_FILES.productData],
      fieldPaths: ["product-categories[*].related_legacy_product_slugs", "products[*].category_slugs"],
      suggestedAction: "Review category-to-product assignments before import.",
    });
  }

  const serviceOnlyCategories = categories.filter(
    (category) => category.is_service_category && category.related_legacy_product_slugs.length === 0,
  );
  if (serviceOnlyCategories.length > 0) {
    const noun = serviceOnlyCategories.length === 1 ? "category" : "categories";
    pushConflict({
      severity: "info",
      title: "Category structure mismatch",
      description: `${serviceOnlyCategories.length} service ${noun} contain no products and rely on empty-state taxonomy rendering.`,
      sourceFiles: [LEGACY_REFERENCE_FILES.categoriesPage, LEGACY_REFERENCE_FILES.productData],
      fieldPaths: ["product-categories[*].is_service_category", "product-categories[*].empty_state_heading"],
      suggestedAction: "Review service-only category settings and confirm empty-state copy before import.",
    });
  }

  return conflicts;
}

export function buildImportPayloads(): BuildImportPayloadResult {
  const generatedAt = new Date().toISOString();
  const extracted = extractLegacyContent();
  const pagesHome = buildHomePagePayload(extracted);
  const pagesAbout = buildAboutPagePayload(extracted);
  const pagesContact = buildContactPagePayload(extracted);
  const globalOptions = buildGlobalOptionsPayload(extracted);
  const productCategories = buildProductCategoriesPayload(extracted);
  const products = buildProductsPayload(extracted, productCategories);
  const conflicts = buildConflictReport(extracted, productCategories, products);

  return {
    generatedAt,
    pagesHome,
    pagesAbout,
    pagesContact,
    globalOptions,
    productCategories,
    products,
    conflicts,
    summary: {
      categories: productCategories.length,
      products: products.length,
      conflicts: conflicts.length,
    },
  };
}

function writeImportOutputs(result: BuildImportPayloadResult): void {
  const outputDirectory = path.resolve(process.cwd(), "scripts/import/output");
  writeJsonFile(path.join(outputDirectory, "pages-home.json"), result.pagesHome);
  writeJsonFile(path.join(outputDirectory, "pages-about.json"), result.pagesAbout);
  writeJsonFile(path.join(outputDirectory, "pages-contact.json"), result.pagesContact);
  writeJsonFile(path.join(outputDirectory, "global-options.json"), result.globalOptions);
  writeJsonFile(path.join(outputDirectory, "product-categories.json"), result.productCategories);
  writeJsonFile(path.join(outputDirectory, "products.json"), result.products);
  writeJsonFile(
    path.join(outputDirectory, "content-conflicts.json"),
    {
      generatedAt: result.generatedAt,
      conflicts: result.conflicts,
      summary: result.summary,
    },
  );
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const result = buildImportPayloads();
  writeImportOutputs(result);
  console.log(`[import:build] pages: 3`);
  console.log(`[import:build] categories: ${result.summary.categories}`);
  console.log(`[import:build] products: ${result.summary.products}`);
  console.log(`[import:build] conflicts: ${result.summary.conflicts}`);
  console.log("[import:build] wrote JSON files to scripts/import/output/");
}
