# Nonviolent Communication — Sli.dev deck

Converted from the Google Slides deck "[TW] Nonviolence Communication" (68 slides).

```bash
npm install
npm run dev      # present at http://localhost:3030
npm run build    # static site in dist/
npm run export   # PDF (needs playwright-chromium)
```

- `slides.md` — every slide, in original order, marked `<!-- Slide N -->`. Speaker notes are the last `<!-- -->` comment on each slide.
- Slides that were **skipped** in Google Slides (5, 13–17, 28, 36, 44–46, 56) have `hide: true`. Set it to `false` to show them.
- `components/SignalFlow.vue` — animated "Send signal → Receive signal" diagram (slides 2–4, 37–38, 57–58).
- `components/NvcCycle.vue` — animated Observations → Feelings → Needs → Requests cycle (slide 54).
- `public/images/` — all images from the original deck.
- `original/` — PNG snapshot of every original slide, for comparison.
- `preview/` — rendered contact sheets of this Sli.dev version.
