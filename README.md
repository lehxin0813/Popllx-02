# PropX Apple UI kit

The secondary design direction: Apple.com marketing style. Inter Tight (loaded webfont, used everywhere for consistency), clean white/grey, system blue accent, large animated hero with JB skyline parallax, spring-physics interactions, and reveal-on-scroll animations.

## Files

- `index.html` — full interactive page; search the hero, click a project card to see the detail view, click persona cards to activate
- `apple.css` — self-contained Apple palette + all component classes
- `imagery.js` — inline SVG generators: `AplImg.jbSkyline()` (hero backdrop), `AplImg.projectPhoto(slug)` (per-project abstract image)
- `components.jsx` — `AppleNav`, `AppleFooter`, `FeatCard`, `PersonaCard`, `useSkyline`, `useReveal`, plus project data
- `app.jsx` — `HeroSection`, `StatsSection`, `FeaturedSection`, `PersonasSection`, `CTASection`, `ProjectDetail`, and root `App`

## Interactions

- Hero search navigates to a project detail card
- Project cards in the horizontal scroll rail open a full detail view
- Persona cards toggle highlight state (ring border)
- Skyline parallax scrolls on every page

## Design rules

- Always use `--sf` font stack — Inter Tight leads (loaded from Google Fonts), with `-apple-system`/`system-ui` only as generic fallbacks. No SF Pro by name, so nothing renders as a missing font off-Apple.
- Hero h1 uses `.apl-h1-xl` with the gradient `.accent` span for the value word
- Cards hover `translateY(-6px)` with `--apl-spring` easing
- Nav is `0.5px` border, `saturate(180%) blur(20px)` glass — never opaque
- The blue→purple gradient (`linear-gradient(135deg, #0071e3, #5e5ce6)`) is used once per page max (anchor KPI card)
