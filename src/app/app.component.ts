import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgStyle, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Thero Studio';

  isControlsOpen = true; // panel open by default

  toggleControls() {
    this.isControlsOpen = !this.isControlsOpen;
  }

  stylePresets = [
    {
      id: 'modern-rounded',
      label: 'Modern rounded',
      changes: {
        borderRadius: 12,
        spacingUnit: 10,
        fontFamilyHeading: '"Inter", system-ui, sans-serif'
      }
    },
    {
      id: 'minimal-sharp',
      label: 'Minimal sharp',
      changes: {
        borderRadius: 2,
        spacingUnit: 8,
        fontFamilyHeading: '"Roboto", system-ui, sans-serif'
      }
    },
    {
      id: 'editorial-soft',
      label: 'Editorial soft',
      changes: {
        borderRadius: 16,
        spacingUnit: 12,
        fontFamilyHeading: '"Georgia", "Times New Roman", serif'
      }
    }
  ];

  currentStyle = this.stylePresets[0].id;

  design = {
    primaryColor: '#4f46e5',
    secondaryColor: '#ec4899',
    accentColor: '#f59e0b',
    successColor: '#22c55e',
    errorColor: '#ef4444',
    warningColor: '#eab308',
    backgroundColor: '#f9fafb',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    mutedTextColor: '#6b7280',
    fontFamilyBody:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontFamilyHeading: '"Georgia", "Times New Roman", serif',
    baseFontSize: 16,
    spacingUnit: 8,
    borderRadius: 8
  };

  // store the raw Google font family name(s) (e.g. Inter, Roboto Slab)
  googleFontBody = '';
  googleFontHeading = '';

  // Google Fonts searcher state
  googleApiKey = ''; // optional — if provided will query Google Fonts Developer API
  fontSearchTerm = '';
  fontResults: Array<{ family: string; category?: string; variants?: string[] }> = [];
  loadingFonts = false;
  // user-selected variants per family (e.g. ['400','700'])
  selectedVariants: { [family: string]: string[] } = {};
  // small fallback catalog when no API key is provided (popular fonts)
  private fallbackFonts = [
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Source Sans Pro',
    'Poppins',
    'Nunito',
    'Merriweather',
    'Playfair Display',
    'Oswald',
    'Raleway',
    'PT Sans',
    'Bebas Neue',
    'Roboto Slab',
    'Cormorant Garamond',
    'Dancing Script',
    'Inconsolata',
    'Fira Sans',
    'Quicksand',
    'Nunito Sans',
    'Work Sans',
    'Inter',
    'Josefin Sans',
    'Anton',
    'Cabin',
    'Arimo'
  ];
  private googleFontsCatalog: Array<{ family: string; category?: string; variants?: string[] }> | null = null;
  private searchTimer: any = null;

  locks: { [key: string]: boolean } = {
    primaryColor: false,
    secondaryColor: false,
    accentColor: false,
    successColor: false,
    errorColor: false,
    warningColor: false,
    textColor: false,
    mutedTextColor: false
  };

  get previewStyles() {
    return {
      '--primary-color': this.design.primaryColor,
      '--secondary-color': this.design.secondaryColor,
      '--accent-color': this.design.accentColor,
      '--success-color': this.design.successColor,
      '--error-color': this.design.errorColor,
      '--warning-color': this.design.warningColor,
      '--background-color': this.design.backgroundColor,
      '--surface-color': this.design.surfaceColor,
      '--text-color': this.design.textColor,
      '--muted-text-color': this.design.mutedTextColor,
      '--font-body': this.design.fontFamilyBody,
      '--font-heading': this.design.fontFamilyHeading,
      '--base-font-size': this.design.baseFontSize + 'px',
      '--spacing-unit': this.design.spacingUnit + 'px',
      '--border-radius': this.design.borderRadius + 'px'
    } as { [key: string]: string };
  }

  applyStylePreset(presetId: string) {
    this.currentStyle = presetId;
    const preset = this.stylePresets.find((p) => p.id === presetId);
    if (!preset) {
      return;
    }

    this.design = {
      ...this.design,
      ...preset.changes
    };
  }

  ngOnInit(): void {
    // load persisted Google font selections
    try {
      const savedBody = localStorage.getItem('thero.googleFontBody');
      const savedHeading = localStorage.getItem('thero.googleFontHeading');
      if (savedBody) {
        this.googleFontBody = savedBody;
        this.loadGoogleFont(savedBody, 'body');
      }
      if (savedHeading) {
        this.googleFontHeading = savedHeading;
        this.loadGoogleFont(savedHeading, 'heading');
      }
    } catch (e) {
      // ignore storage errors
    }
    // Load saved API key if present
    try {
      const savedKey = localStorage.getItem('thero.googleApiKey');
      if (savedKey) {
        this.googleApiKey = savedKey;
      }
    } catch (e) {}
  }

  randomizeColors() {
    const keys = [
      'primaryColor',
      'secondaryColor',
      'accentColor',
      'successColor',
      'errorColor',
      'warningColor',
      'textColor',
      'mutedTextColor'
    ] as const;

    keys.forEach((key) => {
      if (!this.locks[key]) {
        (this.design as any)[key] = this.randomHexColor();
      }
    });
  }

  toggleLock(key: string) {
    this.locks[key] = !this.locks[key];
  }

  private randomHexColor(): string {
    const value = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
    return `#${value}`;
  }

  /**
   * Load a Google Font by family name and update the corresponding design token.
   * family: e.g. "Inter" or "Roboto Slab" or "Roboto:wght@400;700"
   */
  loadGoogleFont(family: string, target: 'body' | 'heading') {
    if (!family || family.trim() === '') {
      return;
    }

    // Build a safe family parameter for Google Fonts URL
    const familyParam = encodeURIComponent(family.replace(/\s+/g, '+'));
    const href = `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;
    const id = `thero-google-${target}`;

    // Remove existing link if present
    const existing = document.getElementById(id) as HTMLLinkElement | null;
    if (existing) {
      if (existing.getAttribute('href') === href) {
        // already loaded
      } else {
        existing.setAttribute('href', href);
      }
    } else {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }

    // update design token to use the loaded font with sensible fallbacks
    if (target === 'body') {
      this.design.fontFamilyBody = `"${family.split(':')[0]}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      try {
        localStorage.setItem('thero.googleFontBody', family);
      } catch (e) {}
    } else {
      this.design.fontFamilyHeading = `"${family.split(':')[0]}", "Times New Roman", serif`;
      try {
        localStorage.setItem('thero.googleFontHeading', family);
      } catch (e) {}
    }
  }

  /** Save API key to localStorage so searches persist */
  saveApiKey() {
    try {
      if (this.googleApiKey && this.googleApiKey.trim() !== '') {
        localStorage.setItem('thero.googleApiKey', this.googleApiKey.trim());
      } else {
        localStorage.removeItem('thero.googleApiKey');
      }
    } catch (e) {}
  }

  /** Search fonts — if an API key is configured we'll fetch the full Google Fonts list once and filter; otherwise use the bundled fallback list. */
  async searchFonts() {
    const q = (this.fontSearchTerm || '').trim().toLowerCase();
    if (!q) {
      this.fontResults = [];
      return;
    }

    this.loadingFonts = true;
    try {
      if (this.googleApiKey && this.googleApiKey.trim() !== '') {
        // fetch catalog if not already
        if (!this.googleFontsCatalog) {
          const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(
            this.googleApiKey.trim()
          )}&sort=popularity`;
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error('Failed to fetch Google Fonts catalog: ' + res.statusText);
          }
          const json = await res.json();
          this.googleFontsCatalog = (json.items || []).map((it: any) => ({
            family: it.family,
            category: it.category,
            variants: it.variants || []
          }));
        }

        this.fontResults = (this.googleFontsCatalog || [])
          .filter((f) => f.family.toLowerCase().includes(q))
          .map((f) => ({ family: f.family, category: f.category, variants: f.variants } as any));
      } else {
        // fallback: filter the bundled list
        this.fontResults = this.fallbackFonts
          .filter((f) => f.toLowerCase().includes(q))
          .map((f) => ({ family: f, variants: ['regular', '700'] }));
      }
    } catch (e) {
      // on error fallback to bundled list
      this.fontResults = this.fallbackFonts
        .filter((f) => f.toLowerCase().includes(q))
        .map((f) => ({ family: f, variants: ['regular', '700'] }));
    } finally {
      this.loadingFonts = false;
    }
  }

  /** Select a font from the search results and load it for body or heading */
  selectFontFromSearch(family: string, target: 'body' | 'heading') {
    this.fontSearchTerm = '';
    this.fontResults = [];
    const variants = this.selectedVariants[family] || [];
    // build family spec with weights if available (supports numeric weights)
    const weights = variants
      .map((v) => {
        if (v === 'regular') return '400';
        const m = v.match(/(\d+)/);
        return m ? m[0] : null;
      })
      .filter(Boolean) as string[];

    let familySpec = family;
    if (weights.length > 0) {
      familySpec = `${family}:wght@${weights.join(';')}`;
    }

    if (target === 'body') {
      this.googleFontBody = familySpec;
    } else {
      this.googleFontHeading = familySpec;
    }
    this.loadGoogleFont(familySpec, target);
  }

  /** Toggle selection of a variant/weight for a given family */
  toggleVariant(family: string, variant: string, checked: boolean) {
    const arr = this.selectedVariants[family] || [];
    if (checked) {
      if (!arr.includes(variant)) arr.push(variant);
    } else {
      const i = arr.indexOf(variant);
      if (i >= 0) arr.splice(i, 1);
    }
    this.selectedVariants[family] = arr;
  }

  /** Debounced search input handler */
  onSearchInput(value: string) {
    this.fontSearchTerm = value;
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.searchFonts(), 300);
  }

  /** Load a temporary preview font when hovering in results. Does not persist selection. */
  previewFont(family: string, variants?: string[]) {
    if (!family) return;
    // Build family param including weights if provided
    let familyParam = family;
    const weights = (variants || [])
      .map((v) => {
        if (v === 'regular') return '400';
        const m = v.match(/(\d+)/);
        return m ? m[0] : null;
      })
      .filter(Boolean) as string[];
    if (weights.length > 0) {
      familyParam = `${family}:wght@${weights.join(';')}`;
    }

    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      familyParam.replace(/\s+/g, '+')
    )}&display=swap`;
    const id = `thero-preview-${family.replace(/\s+/g, '-').toLowerCase()}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  downloadCss() {
    const css = this.generateCss();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'styleguide.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private generateCss(): string {
    const d = this.design;
    const importLines: string[] = [];
    // If we loaded Google Fonts via the document, include import lines for export
    const bodySaved = localStorage.getItem?.('thero.googleFontBody');
    const headingSaved = localStorage.getItem?.('thero.googleFontHeading');
    if (bodySaved) {
      const fam = encodeURIComponent(bodySaved.replace(/\s+/g, '+'));
      importLines.push(`@import url('https://fonts.googleapis.com/css2?family=${fam}&display=swap');`);
    }
    if (headingSaved && headingSaved !== bodySaved) {
      const fam = encodeURIComponent(headingSaved.replace(/\s+/g, '+'));
      importLines.push(`@import url('https://fonts.googleapis.com/css2?family=${fam}&display=swap');`);
    }

    return [
      '/* Generated by Thero Studio */',
      ...importLines,
      ':root {',
      `  --primary-color: ${d.primaryColor};`,
      `  --secondary-color: ${d.secondaryColor};`,
       `  --accent-color: ${d.accentColor};`,
       `  --success-color: ${d.successColor};`,
       `  --error-color: ${d.errorColor};`,
       `  --warning-color: ${d.warningColor};`,
      `  --background-color: ${d.backgroundColor};`,
      `  --surface-color: ${d.surfaceColor};`,
      `  --text-color: ${d.textColor};`,
      `  --muted-text-color: ${d.mutedTextColor};`,
      `  --font-body: ${d.fontFamilyBody};`,
      `  --font-heading: ${d.fontFamilyHeading};`,
      `  --base-font-size: ${d.baseFontSize}px;`,
      `  --spacing-unit: ${d.spacingUnit}px;`,
      `  --border-radius: ${d.borderRadius}px;`,
      '}',
      '',
      'body {',
      '  font-family: var(--font-body);',
      '  font-size: var(--base-font-size);',
      '  color: var(--text-color);',
      '  background-color: var(--background-color);',
      '}',
      '',
      '.btn-primary {',
      '  background-color: var(--primary-color);',
      '  color: #ffffff;',
      '  border-radius: var(--border-radius);',
      '  padding: calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5);',
      '}',
      '',
      '.card {',
      '  background-color: var(--surface-color);',
      '  border-radius: var(--border-radius);',
      '  padding: calc(var(--spacing-unit) * 2);',
      '  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);',
      '}',
      '',
      '.badge-accent {',
      '  background-color: var(--accent-color);',
      '  color: #ffffff;',
      '  border-radius: 999px;',
      '  padding: 0.25rem 0.75rem;',
      '}',
      '',
      '.text-success {',
      '  color: var(--success-color);',
      '}',
      '',
      '.text-error {',
      '  color: var(--error-color);',
      '}',
      '',
      '.text-warning {',
      '  color: var(--warning-color);',
      '}',
      ''
    ].join('\n');
  }
}
