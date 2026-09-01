import { Injectable, inject, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;       // Absolute URL to og:image
  imageAlt?: string;
  type?: 'website' | 'article' | 'product';
  canonical?: string;  // Override canonical URL
  noIndex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);

  private readonly siteUrl = 'https://www.kemetica.com';
  private readonly siteName = 'Kemetica';
  /** Default og:image — the hero background in /public */
  private readonly defaultImage = 'https://www.kemetica.com/bac-img.png';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  // ─────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────

  /**
   * Sets <title>, <meta description>, <meta keywords>,
   * Open Graph tags, and <link rel="canonical"> for the page.
   */
  updateSeo(config: SeoConfig): void {
    const fullTitle = config.title.includes(this.siteName)
      ? config.title
      : `${config.title} — ${this.siteName}`;

    const canonicalUrl = config.canonical
      ? config.canonical
      : `${this.siteUrl}${this.router.url.split('?')[0]}`;

    const ogImage = config.image || this.defaultImage;
    const imageAlt = config.imageAlt || config.title;

    // Title
    this.titleService.setTitle(fullTitle);

    // Primary meta
    this.upsert('name', 'description', config.description);
    this.upsert('name', 'robots', config.noIndex ? 'noindex, nofollow' : 'index, follow');
    if (config.keywords) {
      this.upsert('name', 'keywords', config.keywords);
    }

    // Canonical link
    this.setCanonical(canonicalUrl);

    // Open Graph
    this.upsert('property', 'og:type', config.type || 'website');
    this.upsert('property', 'og:site_name', this.siteName);
    this.upsert('property', 'og:title', fullTitle);
    this.upsert('property', 'og:description', config.description);
    this.upsert('property', 'og:image', ogImage);
    this.upsert('property', 'og:image:width', '1200');
    this.upsert('property', 'og:image:height', '630');
    this.upsert('property', 'og:image:alt', imageAlt);
    this.upsert('property', 'og:url', canonicalUrl);
    this.upsert('property', 'og:locale', 'en_US');
  }

  /**
   * Injects a JSON-LD <script> block into <head>.
   * Removes any previous one to avoid duplicates.
   */
  addJsonLd(schema: object): void {
    this.removeJsonLd();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'kemetica-json-ld';
    script.text = JSON.stringify(schema, null, 2);
    this.document.head.appendChild(script);
  }

  /** Removes the JSON-LD script from <head>. */
  removeJsonLd(): void {
    const existing = this.document.getElementById('kemetica-json-ld');
    if (existing) existing.remove();
  }

  // ─────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────

  private upsert(attr: 'name' | 'property', value: string, content: string): void {
    const selector = `${attr}="${value}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: value, content });
    } else {
      this.meta.addTag({ [attr]: value, content });
    }
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
