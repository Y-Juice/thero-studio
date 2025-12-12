import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { NgStyle, NgFor, NgIf } from '@angular/common';
import JSZip from 'jszip';

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
  activeSection: string | null = null; // null = main menu, or 'colors', 'typography', 'spacing', 'components', 'preview', 'export'
  isDarkMode = false;
  exportType: 'css' | 'angular' | 'react' = 'css'; // export format selection

  toggleControls() {
    this.isControlsOpen = !this.isControlsOpen;
  }

  openSection(section: string) {
    this.activeSection = section;
  }

  goBackToMenu() {
    this.activeSection = null;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.design.backgroundColor = '#1a1a2e';
      this.design.surfaceColor = '#16213e';
      this.design.textColor = '#eaeaea';
      this.design.mutedTextColor = '#a0a0a0';
    } else {
      this.design.backgroundColor = '#f9fafb';
      this.design.surfaceColor = '#ffffff';
      this.design.textColor = '#111827';
      this.design.mutedTextColor = '#6b7280';
    }
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
  // API key is read from `src/environments/environment.ts` so sensitive keys
  // can be placed into a local file (gitignored) during development.
  googleApiKey = environment.googleFontsApiKey || ''; // optional — if provided will query Google Fonts Developer API
  fontSearchTerm = '';
  fontResults: Array<{ family: string; category?: string; variants?: string[] }> = [];
  loadingFonts = false;
  // user-selected variants per family (e.g. ['400','700'])
  selectedVariants: { [family: string]: string[] } = {};

  // Typography panel state
  allFonts: Array<{ family: string; category?: string; variants?: string[] }> = [];
  fontsLoaded = false;
  
  // Text types with their individual settings
  textTypes: Array<{
    id: string;
    name: string;
    fontFamily: string;
    fontWeight: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    fontSize: number;
    isCustom: boolean;
  }> = [
    { id: 'title', name: 'Title', fontFamily: 'Open Sans', fontWeight: '700', isBold: false, isItalic: false, isUnderline: false, fontSize: 28, isCustom: false },
    { id: 'subtitle', name: 'Subtitle', fontFamily: 'Open Sans', fontWeight: '500', isBold: false, isItalic: false, isUnderline: false, fontSize: 18, isCustom: false },
    { id: 'paragraph', name: 'Paragraph', fontFamily: 'Open Sans', fontWeight: '400', isBold: false, isItalic: false, isUnderline: false, fontSize: 14, isCustom: false }
  ];
  
  selectedTextTypeId: string = 'title';
  newTextTypeName: string = '';
  showAddTextType: boolean = false;

  // Spacing variables organized by category
  spacingCategories: Array<{
    id: string;
    name: string;
    isExpanded: boolean;
    variables: Array<{ id: string; name: string; value: number }>;
  }> = [
    {
      id: 'margins',
      name: 'Margins',
      isExpanded: true,
      variables: [
        { id: 'side', name: 'Side', value: 16 },
        { id: 'vertical', name: 'Vertical', value: 6 },
        { id: 'small', name: 'Small', value: 10 }
      ]
    },
    {
      id: 'padding',
      name: 'Padding',
      isExpanded: false,
      variables: [
        { id: 'container', name: 'Container', value: 24 },
        { id: 'card', name: 'Card', value: 16 },
        { id: 'button', name: 'Button', value: 12 }
      ]
    }
  ];
  
  newSpacingName: string = '';
  showAddSpacing: { [categoryId: string]: boolean } = {};
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
    backgroundColor: false,
    surfaceColor: false,
    textColor: false,
    mutedTextColor: false
  };

  get previewStyles() {
    const titleType = this.textTypes.find(t => t.id === 'title') || this.textTypes[0];
    const subtitleType = this.textTypes.find(t => t.id === 'subtitle') || this.textTypes[1];
    const paragraphType = this.textTypes.find(t => t.id === 'paragraph') || this.textTypes[2];
    
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
      '--border-radius': this.design.borderRadius + 'px',
      // Title text type
      '--title-font': `"${titleType.fontFamily}", system-ui, sans-serif`,
      '--title-weight': titleType.isBold ? '700' : titleType.fontWeight,
      '--title-style': titleType.isItalic ? 'italic' : 'normal',
      '--title-decoration': titleType.isUnderline ? 'underline' : 'none',
      '--title-size': titleType.fontSize + 'px',
      // Subtitle text type
      '--subtitle-font': `"${subtitleType.fontFamily}", system-ui, sans-serif`,
      '--subtitle-weight': subtitleType.isBold ? '700' : subtitleType.fontWeight,
      '--subtitle-style': subtitleType.isItalic ? 'italic' : 'normal',
      '--subtitle-decoration': subtitleType.isUnderline ? 'underline' : 'none',
      '--subtitle-size': subtitleType.fontSize + 'px',
      // Paragraph text type
      '--paragraph-font': `"${paragraphType.fontFamily}", system-ui, sans-serif`,
      '--paragraph-weight': paragraphType.isBold ? '700' : paragraphType.fontWeight,
      '--paragraph-style': paragraphType.isItalic ? 'italic' : 'normal',
      '--paragraph-decoration': paragraphType.isUnderline ? 'underline' : 'none',
      '--paragraph-size': paragraphType.fontSize + 'px'
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
    // If no saved key existed, persist the pre-populated key so searches work immediately
    try {
      const existing = localStorage.getItem('thero.googleApiKey');
      if (!existing && this.googleApiKey) {
        this.saveApiKey();
      }
    } catch (e) {}
    
    // Load all Google Fonts for the typography panel
    this.loadAllFonts();
    
    // Load fonts for default text types
    this.loadAllTextTypeFonts();
  }

  /** Load all fonts from Google Fonts API */
  async loadAllFonts() {
    if (this.fontsLoaded) return;
    
    this.loadingFonts = true;
    try {
      if (this.googleApiKey && this.googleApiKey.trim() !== '') {
        const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(
          this.googleApiKey.trim()
        )}&sort=popularity`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch Google Fonts catalog');
        }
        const json = await res.json();
        this.allFonts = (json.items || []).map((it: any) => ({
          family: it.family,
          category: it.category,
          variants: it.variants || []
        }));
        this.fontsLoaded = true;
      } else {
        // Use fallback fonts if no API key
        this.allFonts = this.fallbackFonts.map(f => ({ 
          family: f, 
          category: 'sans-serif',
          variants: ['regular', '700'] 
        }));
        this.fontsLoaded = true;
      }
    } catch (e) {
      // Fallback to bundled list on error
      this.allFonts = this.fallbackFonts.map(f => ({ 
        family: f, 
        category: 'sans-serif',
        variants: ['regular', '700'] 
      }));
      this.fontsLoaded = true;
    } finally {
      this.loadingFonts = false;
    }
  }

  /** Get the currently selected text type */
  get selectedTextType() {
    return this.textTypes.find(t => t.id === this.selectedTextTypeId) || this.textTypes[0];
  }

  /** Select a text type to edit */
  selectTextType(id: string) {
    this.selectedTextTypeId = id;
  }

  /** Select a font from the list */
  selectFont(family: string) {
    const textType = this.selectedTextType;
    if (textType) {
      textType.fontFamily = family;
      this.loadFontForTextType(textType);
    }
  }

  /** Load font for a specific text type */
  loadFontForTextType(textType: { fontFamily: string; fontWeight: string }) {
    const family = textType.fontFamily;
    const weight = textType.fontWeight || '400';
    
    // Build Google Fonts URL
    const familyParam = encodeURIComponent(`${family}:wght@${weight}`.replace(/\s+/g, '+'));
    const href = `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;
    const id = `thero-font-${family.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Check if already loaded
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  /** Called when font weight input changes */
  onFontWeightChange() {
    const textType = this.selectedTextType;
    if (textType) {
      this.loadFontForTextType(textType);
    }
  }

  /** Load all text type fonts on init */
  loadAllTextTypeFonts() {
    this.textTypes.forEach(textType => {
      this.loadFontForTextType(textType);
    });
  }

  /** Toggle bold for selected text type */
  toggleBold() {
    const textType = this.selectedTextType;
    if (textType) {
      textType.isBold = !textType.isBold;
    }
  }

  /** Toggle italic for selected text type */
  toggleItalic() {
    const textType = this.selectedTextType;
    if (textType) {
      textType.isItalic = !textType.isItalic;
    }
  }

  /** Toggle underline for selected text type */
  toggleUnderline() {
    const textType = this.selectedTextType;
    if (textType) {
      textType.isUnderline = !textType.isUnderline;
    }
  }

  /** Get styles for a specific text type */
  getTextTypeStyles(textType: { fontFamily: string; fontWeight: string; isBold: boolean; isItalic: boolean; isUnderline: boolean; fontSize: number }) {
    return {
      'font-family': `"${textType.fontFamily}", system-ui, sans-serif`,
      'font-weight': textType.isBold ? '700' : textType.fontWeight,
      'font-style': textType.isItalic ? 'italic' : 'normal',
      'text-decoration': textType.isUnderline ? 'underline' : 'none',
      'font-size': textType.fontSize + 'px'
    };
  }

  /** Toggle show add text type input */
  toggleAddTextType() {
    this.showAddTextType = !this.showAddTextType;
    this.newTextTypeName = '';
  }

  /** Add a new custom text type */
  addCustomTextType() {
    if (!this.newTextTypeName.trim()) return;
    
    const id = 'custom-' + Date.now();
    const newTextType = {
      id,
      name: this.newTextTypeName.trim(),
      fontFamily: 'Open Sans',
      fontWeight: '400',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      isCustom: true
    };
    
    this.textTypes.push(newTextType);
    this.loadFontForTextType(newTextType);
    
    this.selectedTextTypeId = id;
    this.newTextTypeName = '';
    this.showAddTextType = false;
  }

  /** Remove a custom text type */
  removeTextType(id: string) {
    const index = this.textTypes.findIndex(t => t.id === id);
    if (index > -1 && this.textTypes[index].isCustom) {
      this.textTypes.splice(index, 1);
      if (this.selectedTextTypeId === id) {
        this.selectedTextTypeId = this.textTypes[0]?.id || 'title';
      }
    }
  }

  /** Toggle spacing category expand/collapse */
  toggleSpacingCategory(categoryId: string) {
    const category = this.spacingCategories.find(c => c.id === categoryId);
    if (category) {
      category.isExpanded = !category.isExpanded;
    }
  }

  /** Show add spacing input for a category */
  showAddSpacingInput(categoryId: string) {
    this.showAddSpacing[categoryId] = true;
    this.newSpacingName = '';
  }

  /** Hide add spacing input */
  hideAddSpacingInput(categoryId: string) {
    this.showAddSpacing[categoryId] = false;
    this.newSpacingName = '';
  }

  /** Add a new spacing variable to a category */
  addSpacingVariable(categoryId: string) {
    if (!this.newSpacingName.trim()) return;
    
    const category = this.spacingCategories.find(c => c.id === categoryId);
    if (category) {
      const id = 'spacing-' + Date.now();
      category.variables.push({
        id,
        name: this.newSpacingName.trim(),
        value: 8
      });
      this.hideAddSpacingInput(categoryId);
    }
  }

  /** Remove a spacing variable */
  removeSpacingVariable(categoryId: string, variableId: string) {
    const category = this.spacingCategories.find(c => c.id === categoryId);
    if (category) {
      const index = category.variables.findIndex(v => v.id === variableId);
      if (index > -1) {
        category.variables.splice(index, 1);
      }
    }
  }

  randomizeColors() {
    // Vibrant theme colors
    if (!this.locks['primaryColor']) {
      this.design.primaryColor = this.randomVibrantColor();
    }
    if (!this.locks['secondaryColor']) {
      this.design.secondaryColor = this.randomVibrantColor();
    }
    if (!this.locks['accentColor']) {
      this.design.accentColor = this.randomVibrantColor();
    }
    
    // Semantic colors with appropriate hue ranges
    if (!this.locks['successColor']) {
      this.design.successColor = this.randomHueColor(100, 150); // Greens
    }
    if (!this.locks['errorColor']) {
      this.design.errorColor = this.randomHueColor(0, 20); // Reds
    }
    if (!this.locks['warningColor']) {
      this.design.warningColor = this.randomHueColor(35, 55); // Yellows/Oranges
    }
    
    // Background - light or dark depending on mode
    if (!this.locks['backgroundColor']) {
      this.design.backgroundColor = this.isDarkMode 
        ? this.randomDarkBackground() 
        : this.randomLightNeutral();
    }
    
    // Surface - slightly different from background
    if (!this.locks['surfaceColor']) {
      this.design.surfaceColor = this.isDarkMode 
        ? this.randomDarkSurface() 
        : this.randomSurfaceColor();
    }
    
    // Text - contrasting color for readability
    if (!this.locks['textColor']) {
      this.design.textColor = this.isDarkMode 
        ? this.randomLightText() 
        : this.randomDarkColor();
    }
    
    // Muted text - medium tones
    if (!this.locks['mutedTextColor']) {
      this.design.mutedTextColor = this.isDarkMode 
        ? this.randomDarkMutedColor() 
        : this.randomMutedColor();
    }
  }

  toggleLock(key: string) {
    this.locks[key] = !this.locks[key];
  }

  // Vibrant, saturated colors for theme
  private randomVibrantColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 30); // 60-90%
    const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
    return this.hslToHex(hue, saturation, lightness);
  }

  // Color within a specific hue range
  private randomHueColor(minHue: number, maxHue: number): string {
    const hue = minHue + Math.floor(Math.random() * (maxHue - minHue));
    const saturation = 60 + Math.floor(Math.random() * 25); // 60-85%
    const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
    return this.hslToHex(hue, saturation, lightness);
  }

  // Light, neutral background colors
  private randomLightNeutral(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 15); // 0-15% (very desaturated)
    const lightness = 95 + Math.floor(Math.random() * 4); // 95-98% (very light)
    return this.hslToHex(hue, saturation, lightness);
  }

  // Surface colors - white or very light
  private randomSurfaceColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 10); // 0-10%
    const lightness = 98 + Math.floor(Math.random() * 2); // 98-100%
    return this.hslToHex(hue, saturation, lightness);
  }

  // Dark text colors
  private randomDarkColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 20); // 0-20% (mostly gray)
    const lightness = 8 + Math.floor(Math.random() * 12); // 8-20% (dark)
    return this.hslToHex(hue, saturation, lightness);
  }

  // Muted gray colors for secondary text
  private randomMutedColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 15); // 0-15%
    const lightness = 40 + Math.floor(Math.random() * 20); // 40-60% (medium gray)
    return this.hslToHex(hue, saturation, lightness);
  }

  // Dark background colors for dark mode
  private randomDarkBackground(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 10 + Math.floor(Math.random() * 20); // 10-30% (slightly saturated)
    const lightness = 8 + Math.floor(Math.random() * 8); // 8-16% (very dark)
    return this.hslToHex(hue, saturation, lightness);
  }

  // Dark surface colors for dark mode (slightly lighter than background)
  private randomDarkSurface(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 10 + Math.floor(Math.random() * 15); // 10-25%
    const lightness = 14 + Math.floor(Math.random() * 8); // 14-22%
    return this.hslToHex(hue, saturation, lightness);
  }

  // Light text colors for dark mode
  private randomLightText(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 10); // 0-10%
    const lightness = 88 + Math.floor(Math.random() * 10); // 88-98% (very light)
    return this.hslToHex(hue, saturation, lightness);
  }

  // Muted text for dark mode (lighter gray)
  private randomDarkMutedColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 15); // 0-15%
    const lightness = 55 + Math.floor(Math.random() * 15); // 55-70% (lighter muted)
    return this.hslToHex(hue, saturation, lightness);
  }

  // Convert HSL to Hex
  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
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

  /** Remove a preview font link injected by previewFont */
  removePreviewFont(family: string) {
    if (!family) return;
    const id = `thero-preview-${family.replace(/\s+/g, '-').toLowerCase()}`;
    const el = document.getElementById(id);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
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

  /** Export based on selected type */
  async exportProject() {
    switch (this.exportType) {
      case 'css':
        this.downloadCss();
        break;
      case 'angular':
        await this.downloadAngularStarter();
        break;
      case 'react':
        await this.downloadReactStarter();
        break;
    }
  }

  /** Download Angular starter project with CSS */
  async downloadAngularStarter() {
    const zip = new JSZip();
    const css = this.generateCss();

    // Create Angular project structure
    const projectName = 'my-angular-app';
    const folder = zip.folder(projectName);
    if (!folder) return;

    // package.json
    folder.file('package.json', JSON.stringify({
      name: projectName,
      version: '0.0.0',
      scripts: {
        ng: 'ng',
        start: 'ng serve',
        build: 'ng build',
        watch: 'ng build --watch --configuration development',
        test: 'ng test'
      },
      private: true,
      dependencies: {
        '@angular/animations': '^17.3.0',
        '@angular/common': '^17.3.0',
        '@angular/compiler': '^17.3.0',
        '@angular/core': '^17.3.0',
        '@angular/forms': '^17.3.0',
        '@angular/platform-browser': '^17.3.0',
        '@angular/platform-browser-dynamic': '^17.3.0',
        '@angular/router': '^17.3.0',
        'rxjs': '~7.8.0',
        'tslib': '^2.3.0',
        'zone.js': '~0.14.3'
      },
      devDependencies: {
        '@angular-devkit/build-angular': '^17.3.0',
        '@angular/cli': '^17.3.0',
        '@angular/compiler-cli': '^17.3.0',
        'typescript': '~5.4.2'
      }
    }, null, 2));

    // angular.json
    folder.file('angular.json', JSON.stringify({
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: 'projects',
      projects: {
        [projectName]: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular-devkit/build-angular:application',
              options: {
                outputPath: 'dist/' + projectName,
                index: 'src/index.html',
                browser: 'src/main.ts',
                polyfills: ['zone.js'],
                tsConfig: 'tsconfig.app.json',
                styles: ['src/styles.css'],
                scripts: []
              },
              configurations: {
                production: {
                  optimization: {
                    fonts: false
                  }
                },
                development: {
                  optimization: false
                }
              },
              defaultConfiguration: 'development'
            },
            serve: {
              builder: '@angular-devkit/build-angular:dev-server',
              configurations: {
                development: { buildTarget: projectName + ':build:development' }
              },
              defaultConfiguration: 'development'
            }
          }
        }
      }
    }, null, 2));

    // tsconfig.json
    folder.file('tsconfig.json', JSON.stringify({
      compileOnSave: false,
      compilerOptions: {
        outDir: './dist/out-tsc',
        strict: true,
        noImplicitOverride: true,
        noPropertyAccessFromIndexSignature: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        skipLibCheck: true,
        esModuleInterop: true,
        sourceMap: true,
        declaration: false,
        experimentalDecorators: true,
        moduleResolution: 'bundler',
        importHelpers: true,
        target: 'ES2022',
        module: 'ES2022',
        lib: ['ES2022', 'dom']
      },
      angularCompilerOptions: {
        enableI18nLegacyMessageIdFormat: false,
        strictInjectionParameters: true,
        strictInputAccessModifiers: true,
        strictTemplates: true
      }
    }, null, 2));

    // tsconfig.app.json
    folder.file('tsconfig.app.json', JSON.stringify({
      extends: './tsconfig.json',
      compilerOptions: {
        outDir: './out-tsc/app',
        types: []
      },
      files: ['src/main.ts'],
      include: ['src/**/*.d.ts']
    }, null, 2));

    // src folder
    const srcFolder = folder.folder('src');
    if (!srcFolder) return;

    // src/styles.css - the generated CSS
    srcFolder.file('styles.css', css);

    // src/index.html
    srcFolder.file('index.html', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Angular App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`);

    // src/main.ts
    srcFolder.file('main.ts', `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
  .catch((err) => console.error(err));`);

    // src/app folder
    const appFolder = srcFolder.folder('app');
    if (!appFolder) return;

    // src/app/app.component.ts
    appFolder.file('app.component.ts', `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My Angular App';
}`);

    // src/app/app.component.html
    appFolder.file('app.component.html', `<main>
  <h1>Welcome to {{ title }}</h1>
  <p>Your design tokens are ready to use!</p>
  
  <section class="demo-section">
    <h2>Button Examples</h2>
    <button class="btn-primary">Primary Button</button>
    <button class="btn-secondary">Secondary Button</button>
  </section>

  <section class="demo-section">
    <div class="card">
      <h3>Example Card</h3>
      <p>This card uses your custom design tokens for styling.</p>
      <span class="badge-accent">Accent Badge</span>
    </div>
  </section>

  <section class="demo-section">
    <h2>Status Colors</h2>
    <p class="text-success">Success message</p>
    <p class="text-warning">Warning message</p>
    <p class="text-error">Error message</p>
  </section>
</main>`);

    // src/app/app.component.css
    appFolder.file('app.component.css', `main {
  max-width: 800px;
  margin: 0 auto;
  padding: calc(var(--spacing-unit) * 3);
}

h1 {
  font-family: var(--font-heading);
  color: var(--primary-color);
}

.demo-section {
  margin: calc(var(--spacing-unit) * 3) 0;
}

.demo-section h2 {
  font-family: var(--font-heading);
  margin-bottom: calc(var(--spacing-unit) * 2);
}

button {
  margin-right: calc(var(--spacing-unit));
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background-color: transparent;
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5);
}`);

    // README.md
    folder.file('README.md', `# My Angular App

This Angular project was generated with design tokens from Thero Studio.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npm start
   \`\`\`

3. Open your browser to \`http://localhost:4200\`

## Design Tokens

Your design tokens are in \`src/styles.css\`. You can use CSS variables like:
- \`var(--primary-color)\`
- \`var(--secondary-color)\`
- \`var(--font-body)\`
- \`var(--spacing-unit)\`
- \`var(--border-radius)\`
`);

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    this.downloadBlob(content, 'angular-starter.zip');
  }

  /** Download React starter project with CSS */
  async downloadReactStarter() {
    const zip = new JSZip();
    const css = this.generateCss();

    // Create React project structure
    const projectName = 'my-react-app';
    const folder = zip.folder(projectName);
    if (!folder) return;

    // package.json
    folder.file('package.json', JSON.stringify({
      name: projectName,
      version: '0.1.0',
      private: true,
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'react-scripts': '5.0.1'
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject'
      },
      browserslist: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
      }
    }, null, 2));

    // public folder
    const publicFolder = folder.folder('public');
    if (!publicFolder) return;

    publicFolder.file('index.html', `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="React app with Thero Studio design tokens" />
    <title>My React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`);

    // src folder
    const srcFolder = folder.folder('src');
    if (!srcFolder) return;

    // src/index.css - the generated CSS
    srcFolder.file('index.css', css);

    // src/index.js
    srcFolder.file('index.js', `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

    // src/App.js
    srcFolder.file('App.js', `import './App.css';

function App() {
  return (
    <main className="App">
      <h1>Welcome to My React App</h1>
      <p>Your design tokens are ready to use!</p>

      <section className="demo-section">
        <h2>Button Examples</h2>
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
      </section>

      <section className="demo-section">
        <div className="card">
          <h3>Example Card</h3>
          <p>This card uses your custom design tokens for styling.</p>
          <span className="badge-accent">Accent Badge</span>
        </div>
      </section>

      <section className="demo-section">
        <h2>Status Colors</h2>
        <p className="text-success">Success message</p>
        <p className="text-warning">Warning message</p>
        <p className="text-error">Error message</p>
      </section>
    </main>
  );
}

export default App;`);

    // src/App.css
    srcFolder.file('App.css', `.App {
  max-width: 800px;
  margin: 0 auto;
  padding: calc(var(--spacing-unit) * 3);
}

h1 {
  font-family: var(--font-heading);
  color: var(--primary-color);
}

.demo-section {
  margin: calc(var(--spacing-unit) * 3) 0;
}

.demo-section h2 {
  font-family: var(--font-heading);
  margin-bottom: calc(var(--spacing-unit) * 2);
}

button {
  margin-right: calc(var(--spacing-unit));
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background-color: transparent;
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5);
}`);

    // README.md
    folder.file('README.md', `# My React App

This React project was generated with design tokens from Thero Studio.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npm start
   \`\`\`

3. Open your browser to \`http://localhost:3000\`

## Design Tokens

Your design tokens are in \`src/index.css\`. You can use CSS variables like:
- \`var(--primary-color)\`
- \`var(--secondary-color)\`
- \`var(--font-body)\`
- \`var(--spacing-unit)\`
- \`var(--border-radius)\`
`);

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    this.downloadBlob(content, 'react-starter.zip');
  }

  /** Helper to download a blob */
  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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
      // Only replace spaces with +, don't encode special chars like : and @
      const fam = bodySaved.replace(/\s+/g, '+');
      importLines.push(`@import url('https://fonts.googleapis.com/css2?family=${fam}&display=swap');`);
    }
    if (headingSaved && headingSaved !== bodySaved) {
      const fam = headingSaved.replace(/\s+/g, '+');
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
      '',
      '  /* Custom Spacing Variables */',
      ...this.spacingCategories.flatMap(cat => 
        cat.variables.map(v => `  --${cat.id}-${v.id}: ${v.value}px;`)
      ),
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
