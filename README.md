# Signpost

Autism screening that follows the UK pathway. It walks through the same stages as an NHS referral:

1. **Recognition.** Who the run is about (adult, 12 to 15, 4 to 11, 2½ to 3, or 18 months to 2½) and the NICE checklist a GP or health visitor uses when deciding about referral (CG142 for adults, the CG128 signs tables for children).
2. **Screening.** The AQ-10 (adult, adolescent or child version) or the Q-CHAT-10 for toddlers, scored exactly as published (Allison, Auyeung and Baron-Cohen, 2012).
3. **History.** The areas a UK assessment team works through: the three social communication areas (A1 to A3), the four repetitive, routine, interest and sensory areas (B1 to B4), early development, impact on daily life, masking, and other conditions. A wellbeing question shows help lines straight away if needed.
4. **Results.** A verdict in three bands (talk to your GP about an assessment / worth a conversation / not strongly indicated), the reasons, a profile of the sections, nation-specific next steps (England, Wales, Scotland, Northern Ireland), what to take to the appointment, and a plain-text summary to copy or print.

It is a screening aid, not a diagnosis, and says so throughout. Answers are stored only in the browser (localStorage) on the device.

## Files

- `index.html`, `src/base.css`, `src/data.js` (all questionnaire content and pathway text), `src/score.js` (pure scoring functions), `src/app.js` (the interface).
- `fonts/`: Atkinson Hyperlegible Next and Bitter, latin subsets, served locally so the app works offline.
- `icons/`: rendered from `dev/icon.html` by `dev/make-icons.ps1`.
- `sw.js`: offline cache. Bump `VERSION` when files change. Only `signpost-*` caches are touched, because the other apps share the github.io origin.
- `build.ps1`: writes `dist/signpost.html`, the single-file build for the claude.ai artifact.

## Tests (headless Edge, no Node needed)

- `dev\run-tests.ps1`: scoring (AQ-10 keys, Q-CHAT-10, NICE rules, levels, verdicts, summary text, content sanity).
- `dev\ui-test.ps1`: the full journey through the interface from `index.html` on disk, including validation, skipping, the exclusive checkboxes, restart, the toddler route, and progress surviving a reload. Add `-Shots <folder>` for screenshots.

Read the JS sources as UTF-8 in PowerShell (`-Encoding UTF8`).

## Publishing

Hosted copy: push to `main` of a `signpost` repo on GitHub with Pages enabled, and it appears at `https://domphill.github.io/signpost/`. Artifact copy: run `build.ps1` and republish `dist\signpost.html` to the artifact URL.

## Sources

- NICE CG128 (under-19s, 2011, updated 2017); NICE CG142 (adults, 2012, updated 2021); NICE QS51.
- Allison C, Auyeung B, Baron-Cohen S. J Am Acad Child Adolesc Psychiatry 2012;51(2):202-212 (AQ-10 and Q-CHAT-10, made freely available by the Autism Research Centre, University of Cambridge).
- SIGN 145 (Scotland, 2016). ICD-11 6A02; DSM-5-TR 299.00.
