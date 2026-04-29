export type ComponentType =
  | 'button'
  | 'badge'
  | 'input'
  | 'card'
  | 'alert'
  | 'header'
  | 'footer'
  | 'carousel';

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg';

export interface ButtonStyle {
  type: 'button';
  text: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  fontWeight: number;
  shadow: ShadowLevel;
  hoverBgColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  hoverTranslateY: number;
  hoverScale: number;
  hoverShadow: ShadowLevel;
  transitionDuration: number;
  transitionEasing: string;
}

export interface BadgeStyle {
  type: 'badge';
  text: string;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  fontWeight: number;
  uppercase: boolean;
  letterSpacing: number;
}

export interface InputStyle {
  type: 'input';
  placeholder: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  focusBorderColor: string;
  focusBgColor: string;
  focusRingColor: string;
  focusRingWidth: number;
  transitionDuration: number;
}

export interface CardStyle {
  type: 'card';
  title: string;
  description: string;
  bgColor: string;
  titleColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding: number;
  shadow: ShadowLevel;
  showButton: boolean;
  buttonText: string;
  buttonBgColor: string;
  buttonTextColor: string;
  hoverShadow: ShadowLevel;
  hoverTranslateY: number;
  transitionDuration: number;
}

export interface AlertStyle {
  type: 'alert';
  title: string;
  message: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  accentColor: string;
  accentWidth: number;
}

export interface HeaderStyle {
  type: 'header';
  brand: string;
  links: string;
  ctaText: string;
  bgColor: string;
  textColor: string;
  linkColor: string;
  linkHoverColor: string;
  ctaBgColor: string;
  ctaTextColor: string;
  paddingX: number;
  paddingY: number;
  borderBottomColor: string;
  borderBottomWidth: number;
  shadow: ShadowLevel;
}

export interface FooterStyle {
  type: 'footer';
  brand: string;
  tagline: string;
  links: string;
  copyright: string;
  bgColor: string;
  textColor: string;
  linkColor: string;
  mutedColor: string;
  paddingX: number;
  paddingY: number;
  borderTopColor: string;
  borderTopWidth: number;
}

export interface CarouselStyle {
  type: 'carousel';
  slide1: string;
  slide2: string;
  slide3: string;
  bgColor: string;
  textColor: string;
  indicatorColor: string;
  indicatorActiveColor: string;
  borderRadius: number;
  height: number;
  autoPlay: boolean;
  interval: number;
  transitionDuration: number;
}

export type ComponentStyle =
  | ButtonStyle
  | BadgeStyle
  | InputStyle
  | CardStyle
  | AlertStyle
  | HeaderStyle
  | FooterStyle
  | CarouselStyle;

export const COMPONENT_TYPES: Array<{
  id: ComponentType;
  label: string;
  icon: string;
}> = [
  { id: 'button', label: 'Button', icon: 'Btn' },
  { id: 'badge', label: 'Badge', icon: '◎' },
  { id: 'input', label: 'Input', icon: '▯' },
  { id: 'card', label: 'Card', icon: '▤' },
  { id: 'alert', label: 'Alert', icon: '!' },
  { id: 'header', label: 'Header', icon: '≡' },
  { id: 'footer', label: 'Footer', icon: '_' },
  { id: 'carousel', label: 'Carousel', icon: '⟷' }
];

export const SHADOW_OPTIONS: Array<{ id: ShadowLevel; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'sm', label: 'Small' },
  { id: 'md', label: 'Medium' },
  { id: 'lg', label: 'Large' }
];

export const EASING_OPTIONS: string[] = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
  'cubic-bezier(0.34, 1.56, 0.64, 1)'
];

export function shadowCss(level: ShadowLevel): string {
  switch (level) {
    case 'sm':
      return '0 1px 2px rgba(0, 0, 0, 0.1)';
    case 'md':
      return '0 4px 8px rgba(0, 0, 0, 0.15)';
    case 'lg':
      return '0 10px 20px rgba(0, 0, 0, 0.2)';
    default:
      return 'none';
  }
}

export function defaultStyleFor(type: ComponentType): ComponentStyle {
  switch (type) {
    case 'button':
      return {
        type: 'button',
        text: 'Click me',
        bgColor: '#6366f1',
        textColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 0,
        borderRadius: 8,
        paddingX: 20,
        paddingY: 10,
        fontSize: 14,
        fontWeight: 600,
        shadow: 'sm',
        hoverBgColor: '#4f46e5',
        hoverTextColor: '#ffffff',
        hoverBorderColor: '#4f46e5',
        hoverTranslateY: -2,
        hoverScale: 1.02,
        hoverShadow: 'md',
        transitionDuration: 200,
        transitionEasing: 'ease'
      };
    case 'badge':
      return {
        type: 'badge',
        text: 'NEW',
        bgColor: '#f59e0b',
        textColor: '#ffffff',
        borderRadius: 999,
        paddingX: 10,
        paddingY: 4,
        fontSize: 12,
        fontWeight: 700,
        uppercase: true,
        letterSpacing: 4
      };
    case 'input':
      return {
        type: 'input',
        placeholder: 'Type something...',
        bgColor: '#ffffff',
        textColor: '#111827',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingX: 12,
        paddingY: 10,
        fontSize: 14,
        focusBorderColor: '#6366f1',
        focusBgColor: '#ffffff',
        focusRingColor: 'rgba(99, 102, 241, 0.25)',
        focusRingWidth: 3,
        transitionDuration: 150
      };
    case 'card':
      return {
        type: 'card',
        title: 'Card title',
        description:
          'A short description that explains what this card is about.',
        bgColor: '#ffffff',
        titleColor: '#111827',
        textColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 12,
        padding: 20,
        shadow: 'sm',
        showButton: true,
        buttonText: 'Learn more',
        buttonBgColor: '#6366f1',
        buttonTextColor: '#ffffff',
        hoverShadow: 'md',
        hoverTranslateY: -4,
        transitionDuration: 200
      };
    case 'alert':
      return {
        type: 'alert',
        title: 'Heads up!',
        message: 'This is an informational message.',
        bgColor: '#eff6ff',
        textColor: '#1e3a8a',
        borderColor: '#bfdbfe',
        borderWidth: 1,
        borderRadius: 10,
        paddingX: 16,
        paddingY: 12,
        fontSize: 14,
        accentColor: '#3b82f6',
        accentWidth: 4
      };
    case 'header':
      return {
        type: 'header',
        brand: 'BrandName',
        links: 'Home, About, Services, Contact',
        ctaText: 'Get Started',
        bgColor: '#ffffff',
        textColor: '#111827',
        linkColor: '#4b5563',
        linkHoverColor: '#6366f1',
        ctaBgColor: '#6366f1',
        ctaTextColor: '#ffffff',
        paddingX: 24,
        paddingY: 14,
        borderBottomColor: '#e5e7eb',
        borderBottomWidth: 1,
        shadow: 'none'
      };
    case 'footer':
      return {
        type: 'footer',
        brand: 'BrandName',
        tagline: 'Build something great.',
        links: 'About, Blog, Contact, Privacy',
        copyright: '© 2026 BrandName. All rights reserved.',
        bgColor: '#111827',
        textColor: '#f9fafb',
        linkColor: '#d1d5db',
        mutedColor: '#9ca3af',
        paddingX: 32,
        paddingY: 32,
        borderTopColor: '#1f2937',
        borderTopWidth: 1
      };
    case 'carousel':
      return {
        type: 'carousel',
        slide1: 'Welcome to slide one',
        slide2: 'Here is slide two',
        slide3: 'And finally slide three',
        bgColor: '#6366f1',
        textColor: '#ffffff',
        indicatorColor: 'rgba(255, 255, 255, 0.4)',
        indicatorActiveColor: '#ffffff',
        borderRadius: 12,
        height: 220,
        autoPlay: true,
        interval: 3000,
        transitionDuration: 400
      };
  }
}

function splitLinks(raw: string): string[] {
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function linksHtml(raw: string, linkClass: string): string {
  return splitLinks(raw)
    .map(l => `    <a href="#" class="${linkClass}">${l}</a>`)
    .join('\n');
}

export function generateCss(style: ComponentStyle, cls: string): string {
  switch (style.type) {
    case 'button':
      return buttonCss(style, cls);
    case 'badge':
      return badgeCss(style, cls);
    case 'input':
      return inputCss(style, cls);
    case 'card':
      return cardCss(style, cls);
    case 'alert':
      return alertCss(style, cls);
    case 'header':
      return headerCss(style, cls);
    case 'footer':
      return footerCss(style, cls);
    case 'carousel':
      return carouselCss(style, cls);
  }
}

export function generateHtml(style: ComponentStyle, cls: string): string {
  switch (style.type) {
    case 'button':
      return `<button class="${cls}">${style.text}</button>`;
    case 'badge':
      return `<span class="${cls}">${style.text}</span>`;
    case 'input':
      return `<input type="text" class="${cls}" placeholder="${style.placeholder}" />`;
    case 'card':
      return cardHtml(style, cls);
    case 'alert':
      return alertHtml(style, cls);
    case 'header':
      return headerHtml(style, cls);
    case 'footer':
      return footerHtml(style, cls);
    case 'carousel':
      return carouselHtml(style, cls);
  }
}

function buttonCss(s: ButtonStyle, cls: string): string {
  return `.${cls} {
  background-color: ${s.bgColor};
  color: ${s.textColor};
  border: ${s.borderWidth}px solid ${s.borderColor};
  padding: ${s.paddingY}px ${s.paddingX}px;
  border-radius: ${s.borderRadius}px;
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  box-shadow: ${shadowCss(s.shadow)};
  cursor: pointer;
  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}

.${cls}:hover {
  background-color: ${s.hoverBgColor};
  color: ${s.hoverTextColor};
  border-color: ${s.hoverBorderColor};
  transform: translateY(${s.hoverTranslateY}px) scale(${s.hoverScale});
  box-shadow: ${shadowCss(s.hoverShadow)};
}`;
}

function badgeCss(s: BadgeStyle, cls: string): string {
  return `.${cls} {
  display: inline-block;
  background-color: ${s.bgColor};
  color: ${s.textColor};
  padding: ${s.paddingY}px ${s.paddingX}px;
  border-radius: ${s.borderRadius}px;
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  text-transform: ${s.uppercase ? 'uppercase' : 'none'};
  letter-spacing: ${(s.letterSpacing / 100).toFixed(2)}em;
}`;
}

function inputCss(s: InputStyle, cls: string): string {
  return `.${cls} {
  background-color: ${s.bgColor};
  color: ${s.textColor};
  border: ${s.borderWidth}px solid ${s.borderColor};
  padding: ${s.paddingY}px ${s.paddingX}px;
  border-radius: ${s.borderRadius}px;
  font-size: ${s.fontSize}px;
  outline: none;
  transition: border-color ${s.transitionDuration}ms ease,
              background-color ${s.transitionDuration}ms ease,
              box-shadow ${s.transitionDuration}ms ease;
}

.${cls}:focus {
  background-color: ${s.focusBgColor};
  border-color: ${s.focusBorderColor};
  box-shadow: 0 0 0 ${s.focusRingWidth}px ${s.focusRingColor};
}`;
}

function cardCss(s: CardStyle, cls: string): string {
  let css = `.${cls} {
  background-color: ${s.bgColor};
  border: ${s.borderWidth}px solid ${s.borderColor};
  border-radius: ${s.borderRadius}px;
  padding: ${s.padding}px;
  box-shadow: ${shadowCss(s.shadow)};
  transition: transform ${s.transitionDuration}ms ease,
              box-shadow ${s.transitionDuration}ms ease;
}

.${cls}:hover {
  transform: translateY(${s.hoverTranslateY}px);
  box-shadow: ${shadowCss(s.hoverShadow)};
}

.${cls}__title {
  margin: 0 0 8px;
  color: ${s.titleColor};
  font-size: 18px;
  font-weight: 600;
}

.${cls}__text {
  margin: 0 0 16px;
  color: ${s.textColor};
  font-size: 14px;
  line-height: 1.5;
}`;

  if (s.showButton) {
    css += `

.${cls}__btn {
  background-color: ${s.buttonBgColor};
  color: ${s.buttonTextColor};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}`;
  }
  return css;
}

function cardHtml(s: CardStyle, cls: string): string {
  const btn = s.showButton
    ? `\n  <button class="${cls}__btn">${s.buttonText}</button>`
    : '';
  return `<div class="${cls}">
  <h3 class="${cls}__title">${s.title}</h3>
  <p class="${cls}__text">${s.description}</p>${btn}
</div>`;
}

function alertCss(s: AlertStyle, cls: string): string {
  return `.${cls} {
  background-color: ${s.bgColor};
  color: ${s.textColor};
  border: ${s.borderWidth}px solid ${s.borderColor};
  border-left: ${s.accentWidth}px solid ${s.accentColor};
  border-radius: ${s.borderRadius}px;
  padding: ${s.paddingY}px ${s.paddingX}px;
  font-size: ${s.fontSize}px;
}

.${cls}__title {
  margin: 0 0 4px;
  font-weight: 600;
}

.${cls}__message {
  margin: 0;
}`;
}

function alertHtml(s: AlertStyle, cls: string): string {
  return `<div class="${cls}" role="alert">
  <p class="${cls}__title">${s.title}</p>
  <p class="${cls}__message">${s.message}</p>
</div>`;
}

function headerCss(s: HeaderStyle, cls: string): string {
  return `.${cls} {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${s.paddingY}px ${s.paddingX}px;
  background-color: ${s.bgColor};
  color: ${s.textColor};
  border-bottom: ${s.borderBottomWidth}px solid ${s.borderBottomColor};
  box-shadow: ${shadowCss(s.shadow)};
}

.${cls}__brand {
  font-size: 18px;
  font-weight: 700;
  color: ${s.textColor};
}

.${cls}__nav {
  display: flex;
  gap: 20px;
}

.${cls}__link {
  color: ${s.linkColor};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 150ms ease;
}

.${cls}__link:hover {
  color: ${s.linkHoverColor};
}

.${cls}__cta {
  background-color: ${s.ctaBgColor};
  color: ${s.ctaTextColor};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}`;
}

function headerHtml(s: HeaderStyle, cls: string): string {
  return `<header class="${cls}">
  <div class="${cls}__brand">${s.brand}</div>
  <nav class="${cls}__nav">
${linksHtml(s.links, cls + '__link')}
  </nav>
  <button class="${cls}__cta">${s.ctaText}</button>
</header>`;
}

function footerCss(s: FooterStyle, cls: string): string {
  return `.${cls} {
  background-color: ${s.bgColor};
  color: ${s.textColor};
  padding: ${s.paddingY}px ${s.paddingX}px;
  border-top: ${s.borderTopWidth}px solid ${s.borderTopColor};
}

.${cls}__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.${cls}__brand {
  font-size: 16px;
  font-weight: 700;
}

.${cls}__tagline {
  margin: 4px 0 0;
  color: ${s.mutedColor};
  font-size: 13px;
}

.${cls}__links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.${cls}__link {
  color: ${s.linkColor};
  text-decoration: none;
  font-size: 13px;
}

.${cls}__link:hover {
  text-decoration: underline;
}

.${cls}__copy {
  color: ${s.mutedColor};
  font-size: 12px;
  text-align: center;
}`;
}

function footerHtml(s: FooterStyle, cls: string): string {
  return `<footer class="${cls}">
  <div class="${cls}__top">
    <div>
      <div class="${cls}__brand">${s.brand}</div>
      <p class="${cls}__tagline">${s.tagline}</p>
    </div>
    <nav class="${cls}__links">
${linksHtml(s.links, cls + '__link')}
    </nav>
  </div>
  <p class="${cls}__copy">${s.copyright}</p>
</footer>`;
}

function carouselCss(s: CarouselStyle, cls: string): string {
  return `.${cls} {
  position: relative;
  background-color: ${s.bgColor};
  color: ${s.textColor};
  border-radius: ${s.borderRadius}px;
  height: ${s.height}px;
  overflow: hidden;
}

.${cls}__track {
  display: flex;
  height: 100%;
  transition: transform ${s.transitionDuration}ms ease;
}

.${cls}__slide {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  padding: 20px;
  text-align: center;
}

.${cls}__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.25);
  color: ${s.textColor};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.${cls}__btn--prev { left: 12px; }
.${cls}__btn--next { right: 12px; }

.${cls}__dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.${cls}__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${s.indicatorColor};
  border: none;
  cursor: pointer;
  padding: 0;
}

.${cls}__dot--active {
  background-color: ${s.indicatorActiveColor};
}`;
}

function carouselHtml(s: CarouselStyle, cls: string): string {
  return `<div class="${cls}">
  <div class="${cls}__track">
    <div class="${cls}__slide">${s.slide1}</div>
    <div class="${cls}__slide">${s.slide2}</div>
    <div class="${cls}__slide">${s.slide3}</div>
  </div>
  <button class="${cls}__btn ${cls}__btn--prev" type="button">‹</button>
  <button class="${cls}__btn ${cls}__btn--next" type="button">›</button>
  <div class="${cls}__dots">
    <button class="${cls}__dot ${cls}__dot--active" type="button"></button>
    <button class="${cls}__dot" type="button"></button>
    <button class="${cls}__dot" type="button"></button>
  </div>
</div>`;
}
