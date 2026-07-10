# Kairo Editorial Redesign

## Objective

Redesign the Kairo landing page so it makes an immediate, professional impression during live sales demos while remaining credible and understandable when shared as a portfolio link.

## Audience And Context

- Primary use: live presentations to prospective business clients.
- Secondary use: self-guided exploration from the ClaveAI portfolio.
- Success signal: the first viewport feels like a polished, commercially viable automation product rather than a generic template.

## Creative Direction

Use an editorial executive visual language: warm ivory backgrounds, deep green structural sections, coral accents, contemporary sans-serif typography paired with an elegant serif, and documentary-style photography of real teams collaborating.

The page should feel warm, strategic, and premium. It should avoid generic SaaS cards, excessive rounded containers, decorative gradients, floating blobs, emoji-led UI, and anonymous office stock imagery.

## Page Structure

1. Fixed navigation with Kairo branding, focused section links, and one primary demo CTA.
2. Asymmetric hero with a short commercial message, primary CTA, supporting CTA, and an editorial photo collage.
3. Compact social-proof strip with customer names and operational results.
4. Product narrative showing how Kairo turns an incoming request into an automated action.
5. Three-step process section supported by relevant photography.
6. Deep-green results band with animated metrics.
7. Editorial customer stories with portraits and concise quotes.
8. Restrained pricing comparison with clear hierarchy and one recommended plan.
9. Full-width photographic closing CTA and a concise footer.

## Imagery

Use high-quality photographs showing collaboration, operations, and decision-making in natural environments. Images must be sharp, well-lit, and specific enough to communicate real work. The hero collage should combine one dominant team image with one secondary operational detail and a compact metric panel.

All images need meaningful alternative text unless they are strictly decorative. Remote images should use explicit dimensions or stable aspect ratios so layout does not shift while loading.

## Typography And Color

- Display sans: Manrope or a similarly refined geometric family.
- Editorial accent: a readable serif used selectively in major headings.
- Body: a neutral humanist sans-serif with strong Spanish-language readability.
- Warm ivory: primary page background.
- Deep green: authority, results, and contrast sections.
- Coral: calls to action and small emphasis only.
- Ink: primary text and navigation.

Letter spacing remains neutral. Hero-scale typography is reserved for the hero; section headings use restrained responsive sizes.

## Motion And Interaction

- Orchestrated hero entrance with staggered text and image reveals.
- Subtle image parallax driven by scroll position.
- Intersection-based section reveals with short, consistent timing.
- Count-up animation for outcome metrics.
- Image zoom and directional underline on meaningful hover states.
- Compact mobile navigation with an accessible toggle.
- Respect `prefers-reduced-motion` by disabling transforms, count animations, and smooth scrolling.

Motion must reinforce hierarchy and pacing. No continuous decorative motion should compete with the presentation.

## Responsive Behavior

Desktop uses asymmetric grids and controlled overlaps. Tablet reduces overlaps and keeps two-column product sections where space permits. Mobile becomes a single readable column, preserves image hierarchy, uses stable media aspect ratios, and exposes all navigation and CTAs without clipping or overlap.

## Technical Scope

- Preserve the existing static, single-file architecture in `demos-ia/sitios/kairo/index.html`.
- Use semantic HTML, CSS, and small dependency-free JavaScript enhancements.
- Retain useful commercial content while rewriting only where necessary for hierarchy and clarity.
- Keep current portfolio routing intact.
- No backend, form submission, authentication, or new persistent data.

## Validation

- Confirm the page loads through the existing local server and repository route.
- Verify desktop and mobile layouts for overflow, overlap, image framing, navigation access, and readable text.
- Verify keyboard access to navigation, CTAs, carousel controls, FAQ controls, and the mobile menu.
- Verify that reduced-motion mode remains usable.
- Check browser console output for runtime errors.

