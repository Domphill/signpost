# Signpost

Autism, ADHD and narcissism screening that follows the UK pathway. It walks through the same stages as an NHS referral:

1. **Recognition.** Which screening, who the run is about, and the checklist a GP, health visitor, school or clinician uses when deciding what to do next: NICE CG142 for adults and the CG128 signs tables for children on the autism side; the NICE NG87 referral test on the ADHD side; the ICD-11 general criteria for personality disorder ("about me") or the Home Office indicators of controlling or coercive behaviour ("about someone else") on the narcissism side.
2. **Screening.** Autism: the AQ-10 (adult, adolescent or child version) or the Q-CHAT-10 for toddlers (Allison, Auyeung and Baron-Cohen, 2012). ADHD: the WHO adult ASRS v1.1 (Part A screen plus all 18 symptoms) or the 18 ADHD items of the SNAP-IV parent rating with the published parent cut-offs. Narcissism, about me: the NPI-16 (grandiose) and the Hypersensitive Narcissism Scale (vulnerable), both trait measures with no clinical cut-off, banded against published means. All scored exactly as published. The "about someone else" route has no questionnaire on purpose: nobody can be diagnosed by proxy.
3. **History.** The areas a UK assessment works through. Autism: the three social communication areas (A1 to A3), the four repetitive, routine, interest and sensory areas (B1 to B4), early development, impact, masking, other conditions. ADHD: childhood onset, settings (pervasiveness) and the school's view, impact, everyday patterns, other conditions including heart health. Narcissism: the pattern in relationships, how long and where, impact, other conditions; or, about someone else, the effect on you, your situation, who knows, and safety. A wellbeing or safety question shows the right help lines straight away if needed (Samaritans and NHS urgent help, or the domestic abuse helplines for all four nations).
4. **Results.** A verdict in three bands (talk to your GP about an assessment / worth a conversation / not strongly indicated, or for someone else's behaviour: talk to a domestic abuse service / worth talking through / not strongly matching a controlling pattern), the reasons, a profile of the sections, nation-specific next steps (England, Wales, Scotland, Northern Ireland), what to take to the appointment, and a plain-text summary to copy or print.

It is a screening aid, not a diagnosis, and says so throughout. Answers are stored only in the browser (localStorage) on the device.

## Files

- `index.html`, `src/base.css`, `src/data.js` (autism content and pathway text), `src/data-adhd.js` and `src/data-narc.js` (the ADHD and narcissism pathways, merged into the same structure), `src/score.js` (pure scoring functions), `src/app.js` (the interface).
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

- NICE CG128 (under-19s, 2011, updated 2017); NICE CG142 (adults, 2012, updated 2021); NICE QS51; NICE NG87 (ADHD, 2018, updated 2019).
- Allison C, Auyeung B, Baron-Cohen S. J Am Acad Child Adolesc Psychiatry 2012;51(2):202-212 (AQ-10 and Q-CHAT-10, made freely available by the Autism Research Centre, University of Cambridge).
- Kessler RC et al. Psychol Med 2005;35(2):245-256 (ASRS v1.1, World Health Organization). Swanson JM et al. Int J Educ Psychol Assess 2012;10(1):51-70 (SNAP-IV, public domain).
- Ames DR, Rose P, Anderson CP. J Res Pers 2006;40:440-450 (NPI-16). Hendin HM, Cheek JM. J Res Pers 1997;31:588-599 (HSNS). Home Office, Controlling or coercive behaviour: statutory guidance (2023); Serious Crime Act 2015 s76.
- SIGN 145 (Scotland, 2016). ICD-11 6A02, 6A05, 6D10 and 6D11; DSM-5-TR 299.00, 314.01 and 301.81.
