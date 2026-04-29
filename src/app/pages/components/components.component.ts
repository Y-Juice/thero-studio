import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  ButtonStyle,
  BadgeStyle,
  InputStyle,
  CardStyle,
  AlertStyle,
  HeaderStyle,
  FooterStyle,
  CarouselStyle,
  ComponentStyle,
  ComponentType,
  COMPONENT_TYPES,
  SHADOW_OPTIONS,
  EASING_OPTIONS,
  defaultStyleFor,
  generateCss,
  generateHtml,
  shadowCss
} from './component-types';

export interface SavedComponent {
  id: string;
  name: string;
  type: ComponentType;
  style: ComponentStyle;
  savedAt: string;
}

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase],
  templateUrl: './components.component.html',
  styleUrl: './components.component.css'
})
export class ComponentsComponent implements OnInit, OnDestroy {
  private storageKey = 'thero.componentLibrary';

  componentTypes = COMPONENT_TYPES;
  shadowOptions = SHADOW_OPTIONS;
  easingOptions = EASING_OPTIONS;

  activeType: ComponentType = 'button';
  style: ComponentStyle = defaultStyleFor('button');

  componentName: string = '';
  currentComponentId: string | null = null;
  savedComponents: SavedComponent[] = [];
  cssCopied: boolean = false;

  carouselIndex: number = 0;
  private carouselTimer: any = null;

  ngOnInit(): void {
    this.loadSaved();
    this.startCarouselAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopCarouselAutoPlay();
  }

  get buttonStyle(): ButtonStyle {
    return this.style as ButtonStyle;
  }
  get badgeStyle(): BadgeStyle {
    return this.style as BadgeStyle;
  }
  get inputStyle(): InputStyle {
    return this.style as InputStyle;
  }
  get cardStyle(): CardStyle {
    return this.style as CardStyle;
  }
  get alertStyle(): AlertStyle {
    return this.style as AlertStyle;
  }
  get headerStyle(): HeaderStyle {
    return this.style as HeaderStyle;
  }
  get footerStyle(): FooterStyle {
    return this.style as FooterStyle;
  }
  get carouselData(): CarouselStyle {
    return this.style as CarouselStyle;
  }

  get headerLinks(): string[] {
    return this.splitLinks(this.headerStyle.links);
  }

  get footerLinks(): string[] {
    return this.splitLinks(this.footerStyle.links);
  }

  private splitLinks(raw: string): string[] {
    return raw
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  selectType(type: ComponentType): void {
    if (this.activeType === type) return;
    this.activeType = type;
    this.style = defaultStyleFor(type);
    this.currentComponentId = null;
    this.componentName = '';
    this.carouselIndex = 0;
    this.restartCarouselAutoPlay();
  }

  get className(): string {
    const slug = (this.componentName || 'my-' + this.activeType)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'my-' + this.activeType;
  }

  get generatedCss(): string {
    return generateCss(this.style, this.className);
  }

  get generatedHtml(): string {
    return generateHtml(this.style, this.className);
  }

  copyCss(): void {
    try {
      navigator.clipboard.writeText(this.generatedCss);
      this.cssCopied = true;
      setTimeout(() => (this.cssCopied = false), 1500);
    } catch (e) {
      // clipboard may not be available
    }
  }

  get previewVars(): { [k: string]: string } {
    switch (this.style.type) {
      case 'button':
        return this.buttonVars(this.style);
      case 'badge':
        return this.badgeVars(this.style);
      case 'input':
        return this.inputVars(this.style);
      case 'card':
        return this.cardVars(this.style);
      case 'alert':
        return this.alertVars(this.style);
      case 'header':
        return this.headerVars(this.style);
      case 'footer':
        return this.footerVars(this.style);
      case 'carousel':
        return this.carouselVars(this.style);
    }
  }

  private buttonVars(s: ButtonStyle): { [k: string]: string } {
    return {
      '--btn-bg': s.bgColor,
      '--btn-text': s.textColor,
      '--btn-border': s.borderColor,
      '--btn-border-width': s.borderWidth + 'px',
      '--btn-radius': s.borderRadius + 'px',
      '--btn-padding': s.paddingY + 'px ' + s.paddingX + 'px',
      '--btn-font-size': s.fontSize + 'px',
      '--btn-font-weight': String(s.fontWeight),
      '--btn-shadow': shadowCss(s.shadow),
      '--btn-hover-bg': s.hoverBgColor,
      '--btn-hover-text': s.hoverTextColor,
      '--btn-hover-border': s.hoverBorderColor,
      '--btn-hover-translate-y': s.hoverTranslateY + 'px',
      '--btn-hover-scale': String(s.hoverScale),
      '--btn-hover-shadow': shadowCss(s.hoverShadow),
      '--btn-duration': s.transitionDuration + 'ms',
      '--btn-easing': s.transitionEasing
    };
  }

  private badgeVars(s: BadgeStyle): { [k: string]: string } {
    return {
      '--badge-bg': s.bgColor,
      '--badge-text': s.textColor,
      '--badge-radius': s.borderRadius + 'px',
      '--badge-padding': s.paddingY + 'px ' + s.paddingX + 'px',
      '--badge-font-size': s.fontSize + 'px',
      '--badge-font-weight': String(s.fontWeight),
      '--badge-transform': s.uppercase ? 'uppercase' : 'none',
      '--badge-letter-spacing': (s.letterSpacing / 100).toFixed(2) + 'em'
    };
  }

  private inputVars(s: InputStyle): { [k: string]: string } {
    return {
      '--input-bg': s.bgColor,
      '--input-text': s.textColor,
      '--input-border': s.borderColor,
      '--input-border-width': s.borderWidth + 'px',
      '--input-radius': s.borderRadius + 'px',
      '--input-padding': s.paddingY + 'px ' + s.paddingX + 'px',
      '--input-font-size': s.fontSize + 'px',
      '--input-focus-border': s.focusBorderColor,
      '--input-focus-bg': s.focusBgColor,
      '--input-focus-ring': s.focusRingColor,
      '--input-focus-ring-width': s.focusRingWidth + 'px',
      '--input-duration': s.transitionDuration + 'ms'
    };
  }

  private cardVars(s: CardStyle): { [k: string]: string } {
    return {
      '--card-bg': s.bgColor,
      '--card-title-color': s.titleColor,
      '--card-text-color': s.textColor,
      '--card-border': s.borderColor,
      '--card-border-width': s.borderWidth + 'px',
      '--card-radius': s.borderRadius + 'px',
      '--card-padding': s.padding + 'px',
      '--card-shadow': shadowCss(s.shadow),
      '--card-hover-shadow': shadowCss(s.hoverShadow),
      '--card-hover-translate-y': s.hoverTranslateY + 'px',
      '--card-duration': s.transitionDuration + 'ms',
      '--card-btn-bg': s.buttonBgColor,
      '--card-btn-text': s.buttonTextColor
    };
  }

  private alertVars(s: AlertStyle): { [k: string]: string } {
    return {
      '--alert-bg': s.bgColor,
      '--alert-text': s.textColor,
      '--alert-border': s.borderColor,
      '--alert-border-width': s.borderWidth + 'px',
      '--alert-radius': s.borderRadius + 'px',
      '--alert-padding': s.paddingY + 'px ' + s.paddingX + 'px',
      '--alert-font-size': s.fontSize + 'px',
      '--alert-accent': s.accentColor,
      '--alert-accent-width': s.accentWidth + 'px'
    };
  }

  private headerVars(s: HeaderStyle): { [k: string]: string } {
    return {
      '--hdr-bg': s.bgColor,
      '--hdr-text': s.textColor,
      '--hdr-link': s.linkColor,
      '--hdr-link-hover': s.linkHoverColor,
      '--hdr-cta-bg': s.ctaBgColor,
      '--hdr-cta-text': s.ctaTextColor,
      '--hdr-padding': s.paddingY + 'px ' + s.paddingX + 'px',
      '--hdr-border-color': s.borderBottomColor,
      '--hdr-border-width': s.borderBottomWidth + 'px',
      '--hdr-shadow': shadowCss(s.shadow)
    };
  }

  private footerVars(s: FooterStyle): { [k: string]: string } {
    return {
      '--ftr-bg': s.bgColor,
      '--ftr-text': s.textColor,
      '--ftr-link': s.linkColor,
      '--ftr-muted': s.mutedColor,
      '--ftr-padding': s.paddingY + 'px ' + s.paddingX + 'px',
      '--ftr-border-color': s.borderTopColor,
      '--ftr-border-width': s.borderTopWidth + 'px'
    };
  }

  private carouselVars(s: CarouselStyle): { [k: string]: string } {
    return {
      '--car-bg': s.bgColor,
      '--car-text': s.textColor,
      '--car-dot': s.indicatorColor,
      '--car-dot-active': s.indicatorActiveColor,
      '--car-radius': s.borderRadius + 'px',
      '--car-height': s.height + 'px',
      '--car-duration': s.transitionDuration + 'ms',
      '--car-track-translate': 'translateX(-' + this.carouselIndex * 100 + '%)'
    };
  }

  nextSlide(): void {
    this.carouselIndex = (this.carouselIndex + 1) % 3;
  }

  prevSlide(): void {
    this.carouselIndex = (this.carouselIndex + 2) % 3;
  }

  goToSlide(index: number): void {
    this.carouselIndex = index;
    this.restartCarouselAutoPlay();
  }

  onCarouselAutoPlayChange(): void {
    this.restartCarouselAutoPlay();
  }

  onCarouselIntervalChange(): void {
    this.restartCarouselAutoPlay();
  }

  private startCarouselAutoPlay(): void {
    this.stopCarouselAutoPlay();
    if (this.activeType !== 'carousel') return;
    const s = this.carouselData;
    if (!s.autoPlay) return;
    const interval = Math.max(500, s.interval || 3000);
    this.carouselTimer = setInterval(() => this.nextSlide(), interval);
  }

  private stopCarouselAutoPlay(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = null;
    }
  }

  private restartCarouselAutoPlay(): void {
    this.startCarouselAutoPlay();
  }

  private loadSaved(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.savedComponents = JSON.parse(raw) || [];
      }
    } catch (e) {
      this.savedComponents = [];
    }
  }

  private persistSaved(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.savedComponents));
    } catch (e) {
      // ignore
    }
  }

  saveComponent(): void {
    const name = this.componentName.trim();
    if (!name) {
      alert('Please enter a name for the component.');
      return;
    }
    const savedAt = new Date().toLocaleString();

    if (this.currentComponentId) {
      const existing = this.savedComponents.find(c => c.id === this.currentComponentId);
      if (existing) {
        existing.name = name;
        existing.type = this.activeType;
        existing.style = JSON.parse(JSON.stringify(this.style));
        existing.savedAt = savedAt;
      }
    } else {
      const newComp: SavedComponent = {
        id: 'comp-' + Date.now(),
        name,
        type: this.activeType,
        style: JSON.parse(JSON.stringify(this.style)),
        savedAt
      };
      this.savedComponents.push(newComp);
      this.currentComponentId = newComp.id;
    }

    this.persistSaved();
  }

  loadComponent(comp: SavedComponent): void {
    this.activeType = comp.type;
    this.style = JSON.parse(JSON.stringify(comp.style));
    this.componentName = comp.name;
    this.currentComponentId = comp.id;
    this.carouselIndex = 0;
    this.restartCarouselAutoPlay();
  }

  newComponent(): void {
    this.style = defaultStyleFor(this.activeType);
    this.componentName = '';
    this.currentComponentId = null;
    this.carouselIndex = 0;
    this.restartCarouselAutoPlay();
  }

  deleteSaved(comp: SavedComponent, event: MouseEvent): void {
    event.stopPropagation();
    if (!confirm('Delete component "' + comp.name + '"?')) return;
    this.savedComponents = this.savedComponents.filter(c => c.id !== comp.id);
    if (this.currentComponentId === comp.id) {
      this.newComponent();
    }
    this.persistSaved();
  }
}
