# Design Guidelines: Family Trust Cultural & Educational Platform

## Design Approach

**Hybrid Approach: Accessibility-First Cultural Platform**

Drawing inspiration from successful cultural institutions and nonprofit platforms (museum websites, educational foundations) while prioritizing accessibility for a 50+ demographic. The design balances visual storytelling with exceptional usability, creating a welcoming digital home for literature, education, and cultural initiatives.

**Core Design Principles:**
1. **Clarity Over Cleverness** - Every interaction should be immediately understood
2. **Generous Space** - Breathing room for comfortable reading and navigation
3. **Cultural Warmth** - Photography and content create emotional connection
4. **Accessibility First** - WCAG 2.1 AA compliance minimum, optimized for older users
5. **Timeless Aesthetics** - Avoid trendy patterns in favor of enduring design

---

## Typography System

**Font Families:**
- **Primary (Latin):** 'Inter' or 'Source Sans Pro' from Google Fonts - excellent readability at all sizes
- **Primary (Devanagari/Hindi):** 'Noto Sans Devanagari' - designed for digital reading with proper conjunct support
- Fallback: System fonts (Arial, sans-serif)

**Type Scale (Desktop):**
- Hero Headlines: text-5xl (48px) / font-bold
- Page Titles: text-4xl (36px) / font-bold
- Section Headers: text-3xl (30px) / font-semibold
- Subsection Headers: text-2xl (24px) / font-semibold
- Body Large: text-xl (20px) / font-normal - **default for main content**
- Body Regular: text-lg (18px) / font-normal - minimum body size
- Metadata/Captions: text-base (16px) / font-normal
- Small Labels: text-sm (14px) / font-medium

**Type Scale (Mobile):**
- Scale down by one step (e.g., text-5xl becomes text-4xl)
- Never go below text-base (16px) for body content

**Line Height:**
- Headlines: leading-tight (1.25)
- Body text: leading-relaxed (1.75) - generous for readability
- Captions: leading-normal (1.5)

**Letter Spacing:**
- Headlines: tracking-tight (-0.025em)
- Body: tracking-normal (0em)
- Buttons/CTAs: tracking-wide (0.025em)

---

## Layout System

**Spacing Primitives:**
Core spacing units using Tailwind: **2, 4, 6, 8, 12, 16, 20, 24**

- Micro spacing (between related elements): space-2, space-4
- Component internal padding: p-6, p-8
- Section vertical spacing: py-16, py-20, py-24
- Container horizontal padding: px-6, px-8, px-12
- Large gaps (between major sections): gap-16, gap-20

**Grid System:**
- Container max-width: max-w-7xl (1280px) for desktop
- Content max-width: max-w-4xl (896px) for articles/blogs
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for cards
- Gap spacing: gap-6 (mobile), gap-8 (desktop)

**Breakpoints Strategy:**
- Mobile-first: Base styles for 320px+
- Tablet: md: (768px+) - two-column layouts
- Desktop: lg: (1024px+) - full multi-column layouts
- Wide: xl: (1280px+) - maximum container width

---

## Component Library

### Navigation

**Primary Header:**
- Height: h-20 (80px) for easy clicking
- Sticky positioning: sticky top-0 with backdrop blur
- Logo: h-12 to h-16 (48-64px) - prominently sized
- Language toggle: Pill-style button with flag icons, positioned top-right
- Main nav links: text-lg with generous px-6 spacing between items
- Mobile: Hamburger menu with full-screen overlay (not slide-out drawer for simplicity)

**Breadcrumbs:**
- Always visible below header on content pages
- text-base with divider icons
- Helps orientation for less tech-savvy users

**Footer:**
- Three-column layout (desktop), stacked (mobile)
- Sections: About the Trust, Quick Links, Contact & Social
- Newsletter signup with generous form inputs
- Trust registration details and credentials

### Hero Sections

**Homepage Hero:**
- **Large hero image**: Full-width, 70vh height showing cultural event or trust activities
- Image overlay with subtle gradient for text readability
- Centered content with max-w-3xl
- Hero headline: text-5xl md:text-6xl with font-bold
- Subheadline: text-xl md:text-2xl with leading-relaxed
- Dual CTAs: Primary ("Explore Initiatives") + Secondary ("Learn About Us")
- Buttons on hero: backdrop-blur-md bg-white/20 treatment for glass effect

**Content Page Heroes:**
- Smaller hero: 40vh height
- Page title with breadcrumb navigation
- Simple image or gradient background

### Content Cards

**Event/Initiative Cards:**
- Vertical card layout with aspect-ratio-4/3 image
- Generous padding: p-6
- Card shadow: shadow-md hover:shadow-xl transition
- Title: text-xl font-semibold
- Date/category badge at top: rounded-full px-4 py-2 text-sm
- Excerpt: text-base with line-clamp-3
- "Read More" link with arrow icon
- Border radius: rounded-xl for modern feel

**Blog/Poetry Cards:**
- Horizontal card on desktop (image left, content right)
- Vertical on mobile
- Image: w-1/3 (desktop), full-width (mobile)
- Author info with small avatar
- Reading time estimate
- Category tags: inline-flex gap-2

### Forms & Inputs

**Form Design:**
- Large touch targets: min-h-12 (48px) for all inputs
- Labels: text-lg font-medium, mb-2
- Input fields: p-4 text-lg border-2 rounded-lg
- Focus states: Prominent focus ring (ring-4 ring-offset-2)
- Error messages: text-base in error color below input
- Helper text: text-sm text-gray-600

**Buttons:**
- Primary CTA: px-8 py-4 text-lg font-semibold rounded-lg
- Secondary: Same size, outlined variant
- Icon buttons: min-w-12 min-h-12 for touch
- Loading states: Spinner icon with disabled opacity

**Language Switcher:**
- Toggle button showing current language
- Dropdown or pill selector with language names in their native script
- "English" and "हिंदी" clearly labeled
- Persistent across all pages in top-right header

### Media Galleries

**Photo Galleries:**
- Masonry grid layout (Pinterest-style) for events
- Lightbox modal for full-size viewing with keyboard navigation
- Captions: text-base with event context
- Image aspect ratios: Flexible, not forced square

**Video Embeds:**
- 16:9 aspect ratio containers
- Thumbnail with play button overlay
- YouTube/Vimeo embed support

### Rich Text Content

**Blog/Article Layout:**
- Max-width: max-w-4xl (896px) centered
- Generous line-height: leading-relaxed
- Paragraph spacing: space-y-6
- Pullquotes: text-2xl italic with border-l-4 and pl-6
- Images: Full-width within content container with captions
- Table of contents for long articles (sticky sidebar on desktop)

**Poetry Display:**
- Centered layout with max-w-2xl
- Preserved line breaks
- Text alignment options: Left-aligned or centered per poem
- Verse spacing: space-y-4 between stanzas
- Author attribution: text-lg italic at end

### Admin Portal

**Admin Aesthetic:**
- Distinct from public site (utilitarian design system)
- Sidebar navigation: w-64 fixed
- Data tables: Zebra striping for row clarity
- Action buttons: Smaller than public site (px-4 py-2)
- Form layouts: Two-column grid for efficiency
- Rich text editor: WYSIWYG with toolbar

### Interactive Elements

**Loading States:**
- Skeleton screens for content loading (pulse animation)
- Spinner for actions
- Progress bars for uploads

**Empty States:**
- Illustration or icon (text-6xl size)
- Helpful message: text-xl
- Action button to resolve (e.g., "Add Your First Event")

**Notifications/Alerts:**
- Toast position: top-right
- Generous padding: p-4
- Close button: Large X (w-6 h-6)
- Auto-dismiss after 5 seconds

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column layouts
- Hamburger menu navigation
- Stacked cards
- Full-width images
- Touch-optimized spacing (min 48px touch targets)

**Tablet (768px - 1024px):**
- Two-column grids for cards
- Collapsible sidebar for content browsing
- Hybrid navigation (some items in header, overflow in menu)

**Desktop (1024px+):**
- Multi-column layouts (3-4 columns for event grids)
- Persistent navigation
- Sidebar content organization
- Hover states active

---

## Accessibility Enhancements

**Visual Accessibility:**
- High contrast ratios (4.5:1 minimum for text)
- Clear focus indicators: ring-4 ring-offset-2
- No reliance on color alone for information
- Skip navigation link at top of page

**Interaction Accessibility:**
- Keyboard navigation for all interactions
- ARIA labels on icon-only buttons
- Form validation with clear error messages
- Sufficient time for reading (no auto-advancing carousels)

**Language Accessibility:**
- lang attribute switching (en/hi)
- RTL support preparation (Hindi is LTR, but infrastructure ready)

---

## Images

**Hero Section Image:**
- Full-width hero image showing a vibrant cultural event (Kavi Sammelan, community gathering, or trust initiative)
- Image should convey warmth, community, and cultural richness
- Dimensions: 1920x1080px minimum
- Overlay: Subtle dark gradient (top to bottom or center-out) for text readability

**Event/Initiative Cards:**
- 800x600px images showing event moments, beneficiaries, or cultural activities
- Each card should have a unique, high-quality photograph

**Blog/Article Headers:**
- 1200x600px banner images related to article topic
- For poetry: Abstract cultural imagery, traditional patterns, or author photos

**About Section:**
- Photos of trust founders, team members
- Candid shots from trust activities
- Location: In dedicated "About Us" section and footer

**Gallery Pages:**
- Mixed aspect ratios for authenticity
- Minimum 1024px on longest edge
- Compressed for web performance but high visual quality

---

## Animation & Interactions

**Use Sparingly:**
- Card hover: Subtle lift (translateY(-4px)) with shadow increase
- Button hover: Slight scale (scale-105) or background shift
- Page transitions: Simple fade (300ms)
- Loading: Pulse animation on skeletons

**No Distracting Animations:**
- Avoid parallax scrolling
- No auto-playing videos with sound
- No animated backgrounds
- No carousel auto-advance

---

## PWA Specific Design

**Installability:**
- Install prompt with clear benefit explanation
- Custom icon: 512x512px with trust logo/branding
- Splash screen: Brand identity with loading indicator

**Offline Experience:**
- Graceful offline message
- Cached content available indicator
- "You're offline" banner (not blocking)

This design system prioritizes **clarity, accessibility, and cultural warmth** to create a digital home for the trust's initiatives that welcomes users of all technical abilities and ages.