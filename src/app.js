/* Signpost - the interface. A small state machine over DATA (content) and Score (numbers).
   State is saved to localStorage after every answer, so a half-finished run survives closing the tab. */
(() => {
  const KEY = 'signpost-v1';
  /* Hosted at github.io, opened from disk, or served locally: full features (print, download, offline).
     Anywhere else (the claude.ai artifact) the frame blocks printing and downloads, so those buttons are hidden. */
  const FULL = location.protocol === 'file:' || /(^|\.)github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
  const STAGES = ['Recognition', 'Screening', 'History', 'Results'];
  const app = document.getElementById('app');
  let state = load() || fresh();
  let confirmClear = false;

  /* ---------- state ---------- */
  function fresh() {
    return { v: 1, view: 'home', condition: null, route: null, nation: 'england', name: '', pos: 0, answers: {}, skipped: {}, started: null, finished: null };
  }
  function cond() {
    const r = route();
    const id = r ? r.condition : state.condition;
    return DATA.conditions[id] || null;
  }
  function condRoutes(id) {
    return DATA.routes.filter((r) => r.condition === id);
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || s.v !== 1) return null;
      return Object.assign(fresh(), s);
    } catch (e) {
      return null;
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* private window or storage blocked: the run still works for this page view */
    }
  }
  function hasProgress() {
    return !!state.route && (Object.keys(state.answers).length > 0 || state.pos > 0);
  }
  function route() {
    return DATA.routes.filter((r) => r.id === state.route)[0] || null;
  }
  function screens() {
    const r = route();
    const list = [{ id: 'who', stage: 1 }];
    if (!r) return list;
    list.push({ id: 'signs', stage: 1 });
    if (r.screener) list.push({ id: 'screener', stage: 2 });
    DATA.history[r.history].forEach((s) => list.push({ id: 'history', section: s, stage: 3 }));
    list.push({ id: 'results', stage: 4 });
    return list;
  }
  function answersFor(screen) {
    return state.answers[screen] || {};
  }

  /* ---------- helpers ---------- */
  const esc = (s) =>
    String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const logo = (size) =>
    '<svg class="logo" viewBox="0 0 32 32" width="' + (size || 28) + '" height="' + (size || 28) + '" aria-hidden="true">' +
    '<rect x="15" y="3" width="2.4" height="26" rx="1.2" class="post"/>' +
    '<path d="M8 7h14.5l3.5 3.75L22.5 14.5H8z" class="arm-a"/>' +
    '<path d="M24.5 16.5H10l-3.5 3.75L10 24h14.5z" class="arm-b"/>' +
    '<rect x="10.5" y="28" width="11.4" height="2.4" rx="1.2" class="post"/>' +
    '</svg>';

  function optionsHtml(screen, itemId, options, values, current, cls) {
    return (
      '<div class="opts ' + (cls || '') + '">' +
      options
        .map((label, i) => {
          const v = values ? values[i] : i;
          const isNum = typeof v === 'number';
          const checked = current === v ? ' checked' : '';
          return (
            '<label class="opt"><input type="radio" name="' + esc(screen + '__' + itemId) + '" value="' + esc(v) + '" data-screen="' + esc(screen) + '" data-item="' + esc(itemId) + '" data-type="' + (isNum ? 'num' : 'str') + '"' + checked + ' /><span>' + esc(label) + '</span></label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function questionHtml(screen, item, n, optsHtml, extraClass) {
    const a = answersFor(screen);
    const answered = a[item.id] !== undefined && a[item.id] !== null;
    return (
      '<fieldset class="q' + (answered ? ' answered' : '') + (extraClass ? ' ' + extraClass : '') + '" id="q-' + esc(screen) + '-' + esc(item.id) + '">' +
      '<legend><span class="q-num">' + n + '</span><span class="q-text">' + esc(item.text) + '</span></legend>' +
      optsHtml +
      '</fieldset>'
    );
  }

  function checkHtml(screen, part, items) {
    const a = answersFor(screen);
    return (
      '<div class="checks">' +
      items
        .map(
          (it) =>
            '<label class="check"><input type="checkbox" data-screen="' + esc(screen) + '" data-item="' + esc(it.id) + '" data-part="' + esc(part) + '"' + (it.exclusive ? ' data-exclusive="1"' : '') + (a[it.id] ? ' checked' : '') + ' /><span>' + esc(it.text) + '</span></label>'
        )
        .join('') +
      '</div>'
    );
  }

  function supportHtml(kind) {
    const lines = DATA.support[kind] || DATA.support.self;
    const heads = {
      self: ['You don’t have to wait for an assessment to get help', 'Thoughts like these are common when life has been hard for a long time, and they are worth telling someone about today. Please mention them to your GP too.'],
      parent: ['Help you can reach now', 'Please tell your GP or health visitor how things are at home. These lines can help straight away.'],
      abuse: ['People who can help now, free and in confidence', 'Fear, threats or being stopped from leaving are the things domestic abuse services respond to straight away, whatever else is or is not true about this person. You do not need to have decided anything to call.']
    };
    const h = heads[kind] || heads.self;
    return (
      '<aside class="support" role="region" aria-label="Where to get help now">' +
      '<h3>' + h[0] + '</h3>' +
      '<p>' + h[1] + '</p>' +
      '<ul>' + lines.map((l) => '<li><b>' + esc(l.name) + '.</b> ' + esc(l.detail) + '</li>').join('') + '</ul>' +
      '</aside>'
    );
  }

  function navHtml(opts) {
    const o = opts || {};
    return (
      '<div class="msg" id="msg" role="alert" aria-live="assertive"></div>' +
      '<div class="nav">' +
      '<div class="nav-left">' + (o.back === false ? '<button class="btn" data-go="home">Home</button>' : '<button class="btn" data-go="back">Back</button>') + '</div>' +
      '<div class="nav-right">' +
      (o.skip ? '<button class="btn quiet" data-go="skip">Skip this section</button>' : '') +
      '<button class="btn primary" data-go="next">' + esc(o.next || 'Continue') + '</button>' +
      '</div></div>'
    );
  }

  /* ---------- views ---------- */
  function viewHome() {
    const progress = hasProgress();
    const c = cond();
    return (
      '<header class="hero">' +
      '<div class="brand big">' + logo(40) + '<span>Signpost</span></div>' +
      '<h1>Autism, ADHD and narcissism screening, the way the UK pathway does it</h1>' +
      '<p class="lede">Signpost takes you through the same stages as an NHS referral: the signs professionals are told to look for, the questionnaires they use, and the history an assessment takes. At the end you get a profile, a plain-English reading of it, and a summary to take with you.</p>' +
      '<div class="cta">' +
      (progress
        ? '<button class="btn primary" data-go="resume">Continue the ' + esc(c ? c.label.toLowerCase() : '') + ' screening</button><button class="btn" data-go="restart">' + (confirmClear ? 'Tap again to clear your answers' : 'Start again') + '</button>'
        : '<button class="btn primary" data-go="start:autism">Autism screening</button><button class="btn primary" data-go="start:adhd">ADHD screening</button><button class="btn primary" data-go="start:narcissism">Narcissism check</button>') +
      '</div>' +
      '<p class="note">Signpost does not diagnose anything. Only a qualified clinician can do that, and they use interviews and observation as well as questionnaires. Your answers stay on this device.</p>' +
      '</header>' +
      '<section class="card"><h2>What you will do</h2><ol class="stages">' +
      '<li><b>Recognition.</b> Who this is about, then the checklist a GP, health visitor, school or clinician uses when deciding what to do next. About three minutes.</li>' +
      '<li><b>Screening.</b> Autism: the AQ-10 or the Q-CHAT-10. ADHD: the adult ASRS v1.1 or the SNAP-IV parent rating. Narcissism: the NPI-16 and the Hypersensitive Narcissism Scale. All scored exactly as published. Three to five minutes.</li>' +
      '<li><b>History.</b> The areas an assessment works through: the core features, when it started, where it shows up, impact on daily life, and other conditions. Ten to fifteen minutes. You can stop and come back.</li>' +
      '<li><b>Results.</b> A profile of the answers, what it does and does not mean, what happens next where you live, and a summary you can copy.</li>' +
      '</ol></section>' +
      Object.keys(DATA.conditions)
        .map((id, i) => {
          const k = DATA.conditions[id];
          const what = id === 'adhd' ? 'an ADHD diagnosis' : id === 'narcissism' ? 'a narcissism concern' : 'an autism diagnosis';
          return '<details class="card"' + (i === 0 ? ' open' : '') + '><summary>How ' + what + ' is handled in the UK</summary><ol class="pathway">' + k.pathway.map((p) => '<li><b>' + esc(p.title) + '</b><span>' + esc(p.text) + '</span></li>').join('') + '</ol></details>';
        })
        .join('') +
      '<footer class="foot"><button class="link" data-go="about">Sources, privacy and about</button></footer>'
    );
  }

  function viewAbout() {
    return (
      '<div class="topbar"><div class="brand"><button class="link brand-btn" data-go="home">' + logo(24) + '<span>Signpost</span></button></div></div>' +
      '<main class="flow">' +
      '<h1>About Signpost</h1>' +
      '<section class="card"><h2>What it is</h2>' +
      '<p>A screening aid built around the NICE guidelines that shape diagnosis in the UK: CG128 and CG142 for autism, NG87 for ADHD. It reproduces the questionnaires used in primary care and specialist services, lists the signs NICE tells professionals to look for, and then asks about the same areas an assessment team explores, so that a GP conversation starts from evidence rather than a vague worry.</p>' +
      '<p>It is not a diagnostic tool. A UK diagnosis rests on a specialist team’s interviews and observation (for autism, tools such as ADI-R, ADOS-2, DISCO and 3Di; for ADHD, structured interviews such as the DIVA-5 or ACE+), information from other settings, and clinical judgement against the ICD-11 or DSM-5 criteria. No questionnaire can replace that.</p></section>' +
      '<section class="card"><h2>Privacy</h2><p>Everything you enter is stored only in this browser, on this device. Nothing is sent anywhere. Clearing your browser data, or using the button below, removes it.</p>' +
      '<div><button class="btn" data-go="restart">' + (confirmClear ? 'Tap again to delete everything' : 'Delete my answers') + '</button></div></section>' +
      '<section class="card"><h2>Sources</h2><ul class="refs">' + Object.keys(DATA.conditions).map((id) => DATA.conditions[id].references.map((r) => '<li>' + esc(r) + '</li>').join('')).join('') + '</ul>' +
      '<p class="muted">The AQ-10 and Q-CHAT-10 items are reproduced as published by the Autism Research Centre, University of Cambridge, which makes them freely available for screening. The ASRS v1.1 is freely available from the World Health Organization; the SNAP-IV is in the public domain. The structured history sections are Signpost’s own plain-English mapping of the diagnostic criteria and are not a validated instrument.</p></section>' +
      '<section class="card"><h2>Organisations</h2><ul class="orgs">' + Object.keys(DATA.conditions).map((id) => DATA.conditions[id].organisations.map((o) => '<li><a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + esc(o.name) + '</a><span>' + esc(o.detail) + '</span></li>').join('')).join('') + '</ul></section>' +
      '<div class="nav"><button class="btn" data-go="home">Back to the start</button></div>' +
      '</main>'
    );
  }

  function topbar(list, pos) {
    const stage = list[pos].stage;
    const pct = Math.round((pos / (list.length - 1)) * 100);
    return (
      '<div class="topbar">' +
      '<div class="topbar-row"><div class="brand"><button class="link brand-btn" data-go="home">' + logo(24) + '<span>Signpost</span></button></div>' +
      '<span class="step muted">Step ' + (pos + 1) + ' of ' + list.length + '</span></div>' +
      '<div class="stages-row" aria-label="Stages">' + STAGES.map((s, i) => '<span class="stage-chip' + (i + 1 === stage ? ' on' : i + 1 < stage ? ' done' : '') + '">' + (i + 1) + ' ' + s + '</span>').join('') + '</div>' +
      '<div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>' +
      '</div>'
    );
  }

  function viewFlow() {
    const list = screens();
    if (state.pos > list.length - 1) state.pos = list.length - 1;
    const scr = list[state.pos];
    let body = '';
    if (scr.id === 'who') body = screenWho();
    else if (scr.id === 'signs') body = screenSigns();
    else if (scr.id === 'screener') body = screenScreener();
    else if (scr.id === 'history') body = screenHistory(scr.section);
    else body = screenResults();
    return topbar(list, state.pos) + '<main class="flow">' + body + '</main>';
  }

  function screenWho() {
    const r = route();
    const c = DATA.conditions[state.condition] || DATA.conditions.autism;
    return (
      '<span class="eyebrow">Stage 1 · Recognition</span>' +
      '<h1>Who is this about?</h1>' +
      '<h2 class="sub">Screening for</h2>' +
      '<div class="pills">' +
      Object.keys(DATA.conditions).map((id) => '<label class="pill"><input type="radio" name="condition" value="' + id + '" data-field="condition"' + (state.condition === id ? ' checked' : '') + ' /><span>' + esc(DATA.conditions[id].label) + '</span></label>').join('') +
      '</div>' +
      '<p class="muted small">' + esc(c.lede) + ' Autism and ADHD often occur together; you can run the other screening afterwards.</p>' +
      '<h2 class="sub">Age group</h2>' +
      '<p>' + esc(c.whoIntro) + '</p>' +
      '<div class="choices">' +
      condRoutes(c.id)
        .map(
          (rt) =>
            '<label class="choice"><input type="radio" name="route" value="' + rt.id + '" data-field="route"' + (state.route === rt.id ? ' checked' : '') + ' /><span class="c-title">' + esc(rt.label) + '</span><span class="c-sub">' + esc(rt.sub) + '</span></label>'
        )
        .join('') +
      '</div>' +
      '<p class="muted small">' + esc(c.underAgeNote) + '</p>' +
      (r
        ? '<div class="plan"><b>Your route:</b> ' + esc(r.guideline) + ' signs → ' + (r.screener ? esc(DATA.screeners[r.screener].short) + ' → ' : '') + (r.history === 'toddler' ? 'developmental history' : 'assessment-style history') + ' → results</div>'
        : '') +
      '<h2 class="sub">Where do you live?</h2>' +
      '<p class="muted small">The route to assessment differs across the four nations. This only changes the advice at the end.</p>' +
      '<div class="pills">' +
      DATA.nations.map((n) => '<label class="pill"><input type="radio" name="nation" value="' + n.id + '" data-field="nation"' + (state.nation === n.id ? ' checked' : '') + ' /><span>' + esc(n.label) + '</span></label>').join('') +
      '</div>' +
      '<h2 class="sub"><label for="name">Name or initials <span class="muted">(optional, for the summary)</span></label></h2>' +
      '<input class="text" id="name" type="text" maxlength="60" autocomplete="off" data-field="name" value="' + esc(state.name) + '" />' +
      navHtml({ back: false })
    );
  }

  function screenSigns() {
    const r = route();
    const def = DATA.signs[r.signs];
    return (
      '<span class="eyebrow">Stage 1 · Recognition · ' + esc(r.guideline) + '</span>' +
      '<h1>' + esc(def.title) + '</h1>' +
      '<p>' + esc(def.intro) + '</p>' +
      def.groups.map((g) => '<h2 class="sub">' + esc(g.title) + '</h2>' + checkHtml('signs', g.id, g.items)).join('') +
      navHtml({})
    );
  }

  function screenScreener() {
    const r = route();
    const def = DATA.screeners[r.screener];
    const a = answersFor('screener');
    let items;
    if (def.type === 'qchat' || def.type === 'npi') {
      /* forced-choice pairs have no stem of their own */
      items = def.items.map((it, i) => questionHtml('screener', def.type === 'npi' ? Object.assign({}, it, { text: 'Which is closer to you?' }) : it, i + 1, optionsHtml('screener', it.id, it.options, null, a[it.id], 'v')));
    }
    else if (def.type === 'asrs') {
      items = [];
      def.items.forEach((it, i) => {
        if (i === 0) items.push('<h2 class="sub">Part A</h2>');
        if (i === 6) items.push('<h2 class="sub">Part B</h2>');
        items.push(questionHtml('screener', it, i + 1, optionsHtml('screener', it.id, def.options, null, a[it.id], 'n5')));
      });
    } else items = def.items.map((it, i) => questionHtml('screener', it, i + 1, optionsHtml('screener', it.id, def.options, null, a[it.id], 'n4')));
    const credit = def.type === 'asrs' ? 'ASRS v1.1 Symptom Checklist, World Health Organization; Kessler et al. (2005).' : def.type === 'snap' ? 'SNAP-IV rating scale (Swanson), ADHD items; public domain.' : def.type === 'npi' ? 'NPI-16, Ames, Rose and Anderson (2006), Journal of Research in Personality.' : 'Items reproduced from Allison, Auyeung and Baron-Cohen (2012), Autism Research Centre, University of Cambridge.';
    return (
      '<span class="eyebrow">Stage 2 · Screening</span>' +
      '<h1>' + esc(def.title) + '</h1>' +
      '<p>' + esc(def.about) + '</p>' +
      '<p class="instr">' + esc(def.instructions) + ' All ' + def.items.length + ' questions are needed for a score.</p>' +
      '<div class="qs">' + items.join('') + '</div>' +
      '<p class="muted small">' + esc(credit) + '</p>' +
      navHtml({})
    );
  }

  function partHtml(section, p) {
    const screen = section.id;
    const a = answersFor(screen);
    let html = '<h2 class="sub prompt">' + esc(p.prompt) + '</h2>';
    if (p.type === 'rating') {
      const sc = DATA.scales.rating;
      html += '<div class="qs">' + p.items.map((it, i) => questionHtml(screen, it, i + 1, optionsHtml(screen, it.id, sc.options, sc.values, a[it.id], 'n4'))).join('') + '</div>';
    } else if (p.type === 'yesno') {
      const sc = DATA.scales.yesno;
      html += '<div class="qs">' + p.items.map((it, i) => questionHtml(screen, it, i + 1, optionsHtml(screen, it.id, sc.options, sc.values, a[it.id], 'n3'))).join('') + '</div>';
    } else if (p.type === 'check') {
      html += checkHtml(screen, p.id, p.items);
    } else if (p.type === 'single') {
      html += '<div class="qs">' + p.items.map((it, i) => questionHtml(screen, it, i + 1, optionsHtml(screen, it.id, it.options, null, a[it.id], p.layout || (it.options.length > 3 ? 'v' : 'n3')))).join('') + '</div>';
      if (p.risk) {
        const res = Score.part(a, p);
        if (res.flagged) html += supportHtml(p.support || route().respondent);
      }
    }
    return html;
  }

  function screenHistory(section) {
    const r = route();
    const list = DATA.history[r.history];
    const idx = list.indexOf(section);
    return (
      '<span class="eyebrow">Stage 3 · History · ' + esc(section.stage) + ' · section ' + (idx + 1) + ' of ' + list.length + '</span>' +
      '<h1>' + esc(section.title) + '</h1>' +
      '<p>' + esc(section.intro) + '</p>' +
      section.parts.map((p) => partHtml(section, p)).join('') +
      navHtml({ skip: true, next: idx === list.length - 1 ? 'See results' : 'Continue' })
    );
  }

  /* ---------- results ---------- */
  function barHtml(id, title, m, skipped) {
    if (!m || m.type !== 'rating') return '';
    const ok = m.enough;
    const pct = ok ? Math.round((m.mean / 3) * 100) : 0;
    return (
      '<div class="bar-row">' +
      '<div class="bar-label"><span class="bar-id">' + esc(id) + '</span>' + esc(title) + '</div>' +
      '<div class="bar-track" aria-hidden="true"><div class="bar-fill lvl-' + (ok ? m.level.key : 'none') + '" style="width:' + pct + '%"></div></div>' +
      '<div class="bar-val">' + (ok ? Score.fmt(m.mean) + ' · ' + m.level.label : skipped ? 'skipped' : 'not enough answers') + '</div>' +
      '</div>'
    );
  }

  function screenResults() {
    if (!state.finished) {
      state.finished = new Date().toISOString();
      save();
    }
    const res = Score.summarise(state, DATA);
    const r = res.route;
    const v = res.verdict;
    const self = r.respondent === 'self';
    const c = DATA.conditions[r.condition];
    const adhd = r.condition === 'adhd';
    const ct = c.text || {};
    const nation = c.nationNotes[res.nation] || c.nationNotes.england;
    const text = Score.summaryText(res, DATA);
    let html = '<span class="eyebrow">Stage 4 · Results · ' + esc(r.ageText) + '</span>';
    html += '<h1>What your answers show</h1>';

    /* headline */
    html += '<section class="verdict ' + v.key + '"><h2>' + esc(v.title) + '</h2><p>' + esc(v.body) + '</p>';
    if (v.reasons.length) html += '<p class="vlab">Pointing towards an assessment</p><ul>' + v.reasons.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
    if (v.notes.length) html += '<p class="vlab">Also worth mentioning</p><ul>' + v.notes.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
    if (v.maskingNote) html += '<p class="callout">' + esc(v.maskingNote) + '</p>';
    html += '</section>';

    if (res.risk) html += supportHtml(res.riskKind);

    /* screener */
    if (res.screener && res.screener.type === 'npi') {
      const s = res.screener;
      html += '<section class="card"><h2>' + esc(s.def.title) + '</h2>';
      html += '<div class="score"><span class="score-num">' + s.score + '<small>/16</small></span><span class="score-txt">' + (s.complete ? 'Grandiose narcissism ' + s.band.label + '. Typical adult scores are around 4 to 6; 9 or more is higher than most people, 12 or more much higher.' : 'Only ' + s.answered + ' of 16 answered, so there is no valid score.') + '</span></div>';
      html += '<p class="muted small">The NPI measures a trait on a continuum. It has no clinical cut-off, high scorers are often confident and outgoing rather than unwell, and it says nothing on its own about a personality disorder. Which is why the sections below matter more.</p>';
      html += '</section>';
      if (res.hsns) {
        const h = res.hsns;
        html += '<section class="card"><h2>Hypersensitive Narcissism Scale</h2>';
        html += '<div class="score"><span class="score-num">' + h.score + '<small>/50</small></span><span class="score-txt">' + (h.complete ? 'Vulnerable narcissism ' + h.band.label + '. Typical adult scores are around 25 to 35; 36 or more is higher than most people, 42 or more much higher.' : 'Only ' + h.answered + ' of 10 answered, so there is no valid score.') + '</span></div>';
        html += '<p class="muted small">This is the quieter shape: easily wounded, self-absorbed, resentful of demands. It overlaps a great deal with social anxiety, low self-esteem and depression, which are treatable in their own right.</p>';
        html += '</section>';
      }
    } else if (res.screener && res.screener.type === 'asrs') {
      const s = res.screener;
      html += '<section class="card"><h2>' + esc(s.def.title) + '</h2>';
      html += '<div class="score"><span class="score-num">' + s.score + '<small>/6</small></span><span class="score-txt"><b>Part A.</b> ' + (s.partAComplete ? (s.flagged ? 'At or above the screening cut-off of ' + s.threshold + '. Adult ADHD services treat this as a positive screen.' : 'Below the screening cut-off of ' + s.threshold + '.') : 'Not all six Part A questions were answered, so there is no valid screen.') + '</span></div>';
      html += '<p><b>All 18 symptoms.</b> ' + s.inCount + ' of 9 inattention and ' + s.hypCount + ' of 9 hyperactive-impulsive items reached the symptom level' + (s.complete ? '' : ' (' + s.answered + ' of 18 answered)') + '. The adult criteria need five or more in one domain, present since childhood.</p>';
      html += '<p class="muted small">The ASRS Part A picks up most adults with ADHD but also flags some people whose difficulties come from anxiety, depression, poor sleep or a very demanding life, so a positive screen is a reason for an assessment, not a diagnosis. A negative screen does not rule ADHD out, particularly the mainly inattentive kind.</p>';
      html += '</section>';
    } else if (res.screener && res.screener.type === 'snap') {
      const s = res.screener;
      html += '<section class="card"><h2>' + esc(s.def.title) + '</h2>';
      html += '<div class="bars">';
      html += '<div class="bar-row"><div class="bar-label">Inattention</div><div class="bar-track" aria-hidden="true"><div class="bar-fill lvl-' + (s.inMean === null ? 'none' : s.inFlag ? 'high' : 'some') + '" style="width:' + (s.inMean === null ? 0 : Math.round((s.inMean / 3) * 100)) + '%"></div></div><div class="bar-val">' + Score.fmt(s.inMean) + ' · cut-off ' + s.cutoffs.in + '</div></div>';
      html += '<div class="bar-row"><div class="bar-label">Hyperactivity and impulsivity</div><div class="bar-track" aria-hidden="true"><div class="bar-fill lvl-' + (s.hypMean === null ? 'none' : s.hypFlag ? 'high' : 'some') + '" style="width:' + (s.hypMean === null ? 0 : Math.round((s.hypMean / 3) * 100)) + '%"></div></div><div class="bar-val">' + Score.fmt(s.hypMean) + ' · cut-off ' + s.cutoffs.hyp + '</div></div>';
      html += '</div>';
      html += '<p>' + (s.complete ? (s.flagged ? 'At or above the parent cut-off in ' + (s.inFlag && s.hypFlag ? 'both areas' : s.inFlag ? 'inattention' : 'hyperactivity and impulsivity') + '. That is the level at which a referral is usually considered.' : 'Below the parent cut-offs in both areas.') : 'Only ' + s.answered + ' of 18 answered, so the averages are not reliable.') + ' Items rated “quite a bit” or “very much”: ' + s.inCount + ' of 9 inattention, ' + s.hypCount + ' of 9 hyperactive-impulsive. The childhood criteria need six or more in one domain.</p>';
      html += '<p class="muted small">Cut-offs are the published parent norms (95th percentile). Teachers have their own, higher cut-offs, and NICE needs the school’s rating as well as yours before a diagnosis.</p>';
      html += '</section>';
    } else if (res.screener) {
      const s = res.screener;
      html += '<section class="card"><h2>' + esc(s.def.title) + '</h2>';
      html += '<div class="score"><span class="score-num">' + s.score + '<small>/' + s.total + '</small></span><span class="score-txt">' + (s.complete ? (s.flagged ? 'At or above the cut-off of ' + s.threshold + '. NICE advises considering referral for a specialist assessment.' : 'Below the cut-off of ' + s.threshold + '.') : 'Only ' + s.answered + ' of ' + s.total + ' answered, so there is no valid score.') + '</span></div>';
      html += '<p class="muted small">' + (s.type === 'aq10' ? 'The AQ-10 identifies most autistic adults in research samples but misses some, particularly women and people who mask, and some non-autistic people score highly, for example with social anxiety. The published cut-off is 6 or more; the printed form says “more than 6”. Signpost uses 6, which favours picking people up.' : 'The Q-CHAT-10 flags toddlers who need a closer look; many flagged children turn out not to be autistic, and some autistic children are missed. The published cut-off is 3 or more; the printed form says “more than 3”. Signpost uses 3, which favours picking children up.') + '</p>';
      html += '</section>';
    }

    /* signs */
    const g = res.signs;
    html += '<section class="card"><h2>' + esc(g.rule === 'nice-adult' ? 'The NICE test for adults' : g.rule === 'nice-adhd' ? 'The NICE referral test' : g.rule === 'core-all' ? 'The ICD-11 pattern' : g.def.summaryLabel ? 'The behaviour pattern' : 'Signs NICE lists for this age') + '</h2>';
    if (g.rule === 'nice-adult') html += '<p>' + g.core + ' of 3 core signs and ' + g.context + ' of 4 life factors ticked. ' + (g.meets ? 'That meets the NICE test: a GP should consider an assessment.' : 'The NICE test needs at least one of each. On the checklist alone, a GP would not be prompted to refer, but the rest of your answers still count.') + '</p>';
    else if (g.rule === 'nice-adhd') html += '<p>' + g.core + ' of 3 symptom patterns and ' + g.context + ' of ' + g.contextTotal + ' of the persistence, settings and impact conditions ticked. ' + (g.meets ? 'That meets the NICE test: a GP should refer for an assessment.' : 'NICE needs a pattern plus all three conditions. On the checklist alone, a GP would not be prompted to refer, but the rest of your answers still count.') + '</p>';
    else if (g.rule === 'core-all') html += '<p>' + g.core + ' of 2 core problems and ' + g.context + ' of ' + g.contextTotal + ' of long-standing, everywhere and costly ticked. ' + (g.meets ? 'That is the general shape of a personality disorder in ICD-11, whatever traits colour it. It is the first thing a clinician checks, and it is present.' : 'A personality disorder needs a core problem plus all three of the second group. On this checklist the full shape is not present; traits without that shape are common and are not an illness.') + '</p>';
    else if (g.def.summaryLabel) html += '<p>' + g.checked + ' of ' + g.total + ' behaviours ticked' + (g.groups.fear ? ', ' + g.groups.fear.checked + ' of them in the fear group' : '') + '. ' + (g.meets ? 'Several together is the pattern the statutory guidance describes as controlling or coercive behaviour. It is a criminal offence in the UK, and no diagnosis of the other person is needed for services to help.' : g.checked > 0 ? 'A few of these on their own can be ordinary conflict or a bad patch; the pattern matters more than any single item. Fear, at any level, is never ordinary.' : 'None ticked.') + '</p>';
    else html += '<p>' + g.checked + ' of ' + g.total + ' signs ticked. ' + (g.meets ? 'Several signs together are what NICE tells professionals to act on.' : g.checked > 0 ? 'NICE does not set a number; even one sign is worth mentioning, and several together are what professionals act on.' : 'None ticked.') + '</p>';
    if (g.labels.length) html += '<details><summary>What was ticked</summary><ul class="plain">' + g.labels.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul></details>';
    html += '</section>';

    /* profile */
    const ratingSections = res.sections.filter((s) => s.main.type === 'rating');
    if (ratingSections.length) {
      html += '<section class="card"><h2>Profile</h2>';
      if (ct.profile) html += '<p class="muted small">' + esc(ct.profile) + '</p>';
      else if (adhd) html += '<p class="muted small">Each bar is the average of your 0 to 3 answers in that section. “Marked” is 1.5 or more. The symptoms themselves are counted in the questionnaire above; these bars show impact and the everyday patterns clinics ask about.</p>';
      else {
        html += '<p class="muted small">Each bar is the average of your 0 to 3 answers in that section. A diagnosis needs difficulties in all three social communication areas (A) and at least two of the four repetitive, routine, interest and sensory areas (B), present from early childhood and affecting daily life. “Marked” is 1.5 or more.</p>';
        html += '<p><b>Social communication and interaction:</b> ' + res.aMarked + ' of ' + res.aTotal + ' areas marked' + (res.aAnswered < res.aTotal ? ' (' + (res.aTotal - res.aAnswered) + ' not answered)' : '') + '. <b>Repetitive, routine, interest and sensory:</b> ' + res.bMarked + ' of ' + res.bTotal + ' areas marked' + (res.bAnswered < res.bTotal ? ' (' + (res.bTotal - res.bAnswered) + ' not answered)' : '') + '.</p>';
      }
      html += '<div class="bars">' + ratingSections.map((s) => barHtml(s.def.id, s.def.title, s.main, s.skipped)).join('') + '</div>';
      const highs = ratingSections.filter((s) => s.main.enough && s.main.high.length);
      if (highs.length) html += '<details><summary>The statements rated “quite a lot” or “very much”</summary>' + highs.map((s) => '<h3>' + esc(s.def.id + ' ' + s.def.title) + '</h3><ul class="plain">' + s.main.high.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>').join('') + '</details>';
      html += '</section>';
    }

    /* early development */
    if (res.early) {
      html += '<section class="card"><h2>' + esc(ct.early || (adhd ? 'Childhood and onset' : 'Early development')) + '</h2><p>' + res.early.yes + ' of ' + res.early.total + ' answered yes' + (res.early.unsure ? ', ' + res.early.unsure + ' not sure' : '') + '. ' + (ct.earlyNote ? esc(ct.earlyNote) : res.early.yes >= 3 ? 'Features going back to childhood are part of what a team needs to see.' : res.early.unsure >= 3 ? 'Several “not sure” answers: a parent, older relative, or old school reports could fill the gaps before an assessment.' : (adhd ? 'ADHD' : 'Autism') + ' starts in childhood, so a team will look hard at the early years; if the difficulties started later, they will consider other explanations.') + '</p>';
      if (res.early.yesItems.length) html += '<ul class="plain">' + res.early.yesItems.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
      if (res.hearing && res.hearing.values.h1) html += '<p class="muted small">Hearing: ' + esc(res.hearing.values.h1.label) + (res.hearing.values.h1.index > 0 ? '. A hearing test is a standard early step; ask your GP or health visitor.' : '.') + '</p>';
      html += '</section>';
    }
    if (res.dev) {
      html += '<section class="card"><h2>Communication and play</h2><p>' + res.dev.yes + ' of ' + res.dev.total + ' concerns ticked' + (res.dev.unsure ? ', ' + res.dev.unsure + ' not sure' : '') + '.</p>';
      if (res.dev.yesItems.length) html += '<ul class="plain">' + res.dev.yesItems.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
      if (res.milestones) {
        const m = res.milestones;
        html += '<h3>Milestones</h3><ul class="plain">' + res.byId.C.def.parts[0].items.map((it) => '<li>' + esc(it.text) + ': <b>' + esc(m.values[it.id] ? m.values[it.id].label : 'not answered') + '</b></li>').join('') + '</ul>';
        if (res.lostSkills) html += '<p class="callout">Loss of words or skills at any age should be raised with a GP promptly, whatever else is going on.</p>';
      }
      html += '</section>';
    }

    /* ADHD: settings and the school's view */
    if (res.settings) {
      html += '<section class="card"><h2>Where it shows up</h2><p>' + (res.settingsCount ? res.settingsCount + ' setting' + (res.settingsCount === 1 ? '' : 's') + ': ' + esc(res.settings.labels.filter((t) => !/^None/.test(t)).join('; ')) + '.' : 'No settings ticked.') + ' ' + (res.settingsCount >= 2 ? 'NICE needs two or more, so that condition is met.' : 'NICE needs two or more settings before a referral.') + '</p>';
      if (res.school && res.school.values.t1) html += '<p><b>The school’s view:</b> ' + esc(res.school.values.t1.label) + '.' + (res.school.flagged ? ' Ask the teacher to complete the SNAP-IV too; a referral usually needs it.' : '') + '</p>';
      html += '</section>';
    }

    /* narcissism, about someone else: the situation */
    if (res.situation) {
      html += '<section class="card"><h2>Your situation</h2><p>' + (res.situation.labels.length ? esc(res.situation.labels.join('; ')) + '.' : 'Nothing ticked.') + '</p>';
      if (res.safety && res.safety.values.s1) html += '<p><b>Safety:</b> ' + esc(res.safety.values.s1.label) + '.' + (res.safety.flagged ? ' That, on its own, is a reason to talk to a domestic abuse service, whatever else is true.' : '') + '</p>';
      html += '</section>';
    }

    /* other conditions and support */
    if (res.conditions || res.supportSoFar || res.raised) {
      html += '<section class="card"><h2>' + (res.conditions ? 'Other things to raise' : 'Who knows so far') + '</h2>';
      if (res.conditions) html += '<p><b>Conditions diagnosed or suspected:</b> ' + (res.conditions.labels.length ? esc(res.conditions.labels.join('; ')) : 'none ticked') + '.</p>' + (res.conditions.labels.length && !res.conditions.none ? '<p class="muted small">' + (ct.condNote ? esc(ct.condNote) : adhd ? 'The team will weigh these up: some can look like ADHD (anxiety, low mood, poor sleep, thyroid problems, the effects of trauma), many occur alongside it, and anything about the heart or blood pressure matters before medication. Mention them all.' : 'The team will weigh these up: some can look like autism (social anxiety, ADHD, language disorder, the effects of trauma), and many occur alongside it. Mention them all.') + '</p>' : '');
      if (res.raised) html += '<p><b>Concerns raised so far by:</b> ' + (res.raised.labels.length ? esc(res.raised.labels.join('; ')) : 'nobody yet') + '.</p>';
      if (res.supportSoFar) html += '<p><b>' + (r.condition === 'narcissism' ? 'Talked to so far:' : 'Already involved:') + '</b> ' + (res.supportSoFar.labels.length ? esc(res.supportSoFar.labels.join('; ')) : 'nobody yet') + '.</p>';
      html += '</section>';
    }

    /* next steps */
    html += '<section class="card"><h2>' + esc(nation.title) + ', what happens next</h2><ul class="plain spaced">' + nation.points.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
    html += '<h3>The stages after referral</h3><ol class="pathway compact">' + c.pathway.slice(2).map((p) => '<li><b>' + esc(p.title) + '</b><span>' + esc(p.text) + '</span></li>').join('') + '</ol></section>';

    html += '<section class="card"><h2>' + (r.bringKey === 'other' ? 'If you talk to a service' : 'What to take to the appointment') + '</h2><ul class="plain spaced">' + c.bring[r.bringKey || (self ? 'self' : 'parent')].map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul></section>';

    /* actions */
    html += '<section class="card actions"><h2>Your summary</h2><p class="muted small">Plain text, ready to paste into a message to your GP surgery or to print.</p>';
    html += '<div class="btns"><button class="btn primary" data-go="copy">Copy summary</button>' + (FULL ? '<button class="btn" data-go="print">Print or save as PDF</button><button class="btn" data-go="download">Download answers (JSON)</button>' : '') + '</div>';
    html += '<textarea class="summary" id="summary" readonly rows="14" aria-label="Summary text">' + esc(text) + '</textarea>';
    html += '</section>';

    html += '<section class="card"><h2>Organisations that can help</h2><ul class="orgs">' + c.organisations.map((o) => '<li><a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + esc(o.name) + '</a><span>' + esc(o.detail) + '</span></li>').join('') + '</ul></section>';

    html += '<p class="muted small">' + (ct.footer ? esc(ct.footer) : 'Signpost is a screening aid, not a diagnosis. ' + (adhd ? 'A real assessment is a structured interview by a specialist who also weighs your history and other explanations.' : 'It cannot see how you or your child actually interact, which is the heart of a real assessment.') + (adhd ? ' Autism and ADHD often occur together; the autism screening is on the home page.' : ' Autism and ADHD often occur together; the ADHD screening is on the home page.')) + '</p>';
    html += '<div class="nav"><button class="btn" data-go="back">Back</button><div class="nav-right"><button class="btn" data-go="home">Home</button><button class="btn quiet" data-go="restart">' + (confirmClear ? 'Tap again to clear everything' : 'Start again') + '</button></div></div>';
    return html;
  }

  /* ---------- render ---------- */
  function render(opts) {
    const o = opts || {};
    const y = window.scrollY;
    let html;
    if (state.view === 'home') html = viewHome();
    else if (state.view === 'about') html = viewAbout();
    else html = viewFlow();
    app.innerHTML = html;
    if (o.keepScroll) window.scrollTo(0, y);
    else window.scrollTo(0, 0);
    if (o.msg) message(o.msg);
    document.title = 'Signpost';
  }

  function message(text) {
    const m = document.getElementById('msg');
    if (m) {
      m.textContent = text;
      m.classList.add('show');
    }
  }

  let toastTimer = null;
  function toast(text) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- navigation ---------- */
  function go(action) {
    const list = screens();
    const scr = list[Math.min(state.pos, list.length - 1)];
    if (action !== 'restart') confirmClear = false;

    if (action === 'start' || action.indexOf('start:') === 0) {
      state = fresh();
      state.view = 'flow';
      state.condition = action.indexOf(':') !== -1 ? action.split(':')[1] : 'autism';
      if (!DATA.conditions[state.condition]) state.condition = 'autism';
      state.started = new Date().toISOString();
      save();
      render();
    } else if (action === 'resume') {
      state.view = 'flow';
      save();
      render();
    } else if (action === 'home') {
      state.view = 'home';
      save();
      render();
    } else if (action === 'about') {
      state.view = 'about';
      save();
      render();
    } else if (action === 'restart') {
      if (!confirmClear) {
        confirmClear = true;
        render({ keepScroll: true });
        return;
      }
      confirmClear = false;
      const view = state.view;
      state = fresh();
      try {
        localStorage.removeItem(KEY);
      } catch (e) {
        /* nothing to remove */
      }
      if (view === 'flow') {
        state.view = 'flow';
        state.started = new Date().toISOString();
        save();
      }
      render();
      toast('Answers cleared');
    } else if (action === 'back') {
      if (state.view !== 'flow') return;
      if (state.pos === 0) {
        state.view = 'home';
      } else state.pos--;
      save();
      render();
    } else if (action === 'skip') {
      if (scr.id === 'history') {
        state.skipped[scr.section.id] = true;
        delete state.answers[scr.section.id];
        state.pos++;
        save();
        render();
      }
    } else if (action === 'next') {
      if (scr.id === 'who' && !state.route) {
        message('Choose an age group to continue.');
        return;
      }
      if (scr.id === 'screener') {
        const def = DATA.screeners[route().screener];
        const r = Score.screener(answersFor('screener'), def);
        if (!r.complete) {
          const missing = def.items.filter((it) => answersFor('screener')[it.id] === undefined);
          missing.forEach((it) => {
            const el = document.getElementById('q-screener-' + it.id);
            if (el) el.classList.add('missing');
          });
          message('Please answer all ' + def.items.length + ' questions; ' + missing.length + ' left. They are marked in red.');
          const first = document.getElementById('q-screener-' + missing[0].id);
          if (first) first.scrollIntoView({ block: 'center' });
          return;
        }
      }
      if (scr.id === 'history') delete state.skipped[scr.section.id];
      if (state.pos < list.length - 1) state.pos++;
      save();
      render();
    } else if (action === 'copy') {
      const ta = document.getElementById('summary');
      const text = ta ? ta.value : '';
      const fallback = () => {
        if (ta) {
          ta.focus();
          ta.select();
          try {
            document.execCommand('copy');
            toast('Copied. Paste it into a message or a document.');
          } catch (e) {
            toast('Select the text below and copy it.');
          }
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast('Copied. Paste it into a message or a document.'), fallback);
      else fallback();
    } else if (action === 'print') {
      Array.prototype.forEach.call(document.querySelectorAll('details'), (d) => {
        d.open = true;
      });
      window.print();
    } else if (action === 'download') {
      const res = Score.summarise(state, DATA);
      const payload = { app: 'Signpost', version: DATA.version, exported: new Date().toISOString(), route: state.route, nation: state.nation, name: state.name, answers: state.answers, skipped: state.skipped, verdict: res.verdict, summary: Score.summaryText(res, DATA) };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'signpost-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1000);
    }
  }

  /* ---------- events ---------- */
  app.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-go]');
    if (!btn) return;
    e.preventDefault();
    go(btn.getAttribute('data-go'));
  });

  app.addEventListener('change', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLInputElement)) return;
    const field = el.getAttribute('data-field');
    if (field === 'condition') {
      if (state.condition !== el.value) {
        const had = Object.keys(state.answers).length > 0;
        state.condition = el.value;
        state.route = null;
        state.answers = {};
        state.skipped = {};
        state.finished = null;
        save();
        render({ keepScroll: true, msg: had ? 'Screening changed, so earlier answers were cleared.' : '' });
      }
      return;
    }
    if (field === 'route') {
      if (state.route !== el.value) {
        const had = Object.keys(state.answers).length > 0;
        state.route = el.value;
        state.answers = {};
        state.skipped = {};
        state.finished = null;
        save();
        render({ keepScroll: true, msg: had ? 'Age group changed, so earlier answers were cleared.' : '' });
      }
      return;
    }
    if (field === 'nation') {
      state.nation = el.value;
      save();
      return;
    }
    const screen = el.getAttribute('data-screen');
    const item = el.getAttribute('data-item');
    if (!screen || !item) return;
    state.answers[screen] = state.answers[screen] || {};
    const a = state.answers[screen];
    if (el.type === 'checkbox') {
      a[item] = el.checked;
      const part = el.getAttribute('data-part');
      const siblings = Array.prototype.slice.call(app.querySelectorAll('input[type=checkbox][data-screen="' + screen + '"][data-part="' + part + '"]'));
      if (el.checked && el.hasAttribute('data-exclusive')) {
        siblings.forEach((s) => {
          if (s !== el) {
            s.checked = false;
            a[s.getAttribute('data-item')] = false;
          }
        });
      } else if (el.checked) {
        siblings.forEach((s) => {
          if (s.hasAttribute('data-exclusive')) {
            s.checked = false;
            a[s.getAttribute('data-item')] = false;
          }
        });
      }
    } else {
      a[item] = el.getAttribute('data-type') === 'num' ? Number(el.value) : el.value;
      const fs = el.closest('.q');
      if (fs) {
        fs.classList.add('answered');
        fs.classList.remove('missing');
      }
      const m = document.getElementById('msg');
      if (m && !app.querySelector('.q.missing')) m.classList.remove('show');
    }
    state.finished = null;
    save();
    /* the wellbeing questions show help as soon as they are answered */
    const scr = screens()[Math.min(state.pos, screens().length - 1)];
    if (scr && scr.id === 'history' && scr.section.parts.some((p) => p.risk && p.items.some((it) => it.id === item))) render({ keepScroll: true });
  });

  app.addEventListener('input', (e) => {
    const el = e.target;
    if (el instanceof HTMLInputElement && el.getAttribute('data-field') === 'name') {
      state.name = el.value;
      save();
    }
  });

  /* ---------- boot ---------- */
  if (!state.condition) state.condition = route() ? route().condition : 'autism';
  if (state.view === 'flow' && !state.route && state.pos > 0) state.view = 'home';
  render();

  if (FULL && location.protocol !== 'file:' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  /* exposed for the tests */
  window.Signpost = {
    getState: () => state,
    setState: (s) => {
      state = Object.assign(fresh(), s);
      save();
      render();
    },
    go,
    render,
    screens
  };
})();
