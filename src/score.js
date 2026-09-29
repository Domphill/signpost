/* Signpost - scoring. Pure functions over the saved answers; no DOM. dev/tests.js exercises these directly.

   Screeners follow the published keys exactly (AQ-10: 1 point per item in the keyed direction, cut-off 6 of 10;
   Q-CHAT-10: 1 point per item, cut-off 3 of 10). The published papers found the best cut-points at "6 or more" and
   "3 or more"; the printed forms say "more than 6" and "more than 3". Signpost uses the research cut-points, which favour
   sensitivity, and says so on the results page.

   The structured history is scored only as a profile: the mean of each section's 0-3 ratings, banded into four levels.
   "Marked" (mean 1.5 or more) is the working line for "this area is prominent". None of this is a diagnosis. */

const Score = (() => {
  const LEVELS = [
    { key: 'low', label: 'little or none', max: 0.75 },
    { key: 'some', label: 'some', max: 1.5 },
    { key: 'marked', label: 'marked', max: 2.25 },
    { key: 'high', label: 'very marked', max: Infinity }
  ];
  const MARKED = 1.5;

  function level(mean) {
    if (mean === null || mean === undefined || isNaN(mean)) return null;
    return LEVELS.find((l) => mean < l.max) || LEVELS[LEVELS.length - 1];
  }

  function isNum(v) {
    return typeof v === 'number' && !isNaN(v);
  }

  /* ----- validated screeners ----- */
  function aq10(answers, def) {
    const a = answers || {};
    let score = 0;
    let answered = 0;
    def.items.forEach((it) => {
      const v = a[it.id];
      if (!isNum(v)) return;
      answered++;
      const agree = v <= 1; /* 0 definitely agree, 1 slightly agree, 2 slightly disagree, 3 definitely disagree */
      if ((it.key === 'agree' && agree) || (it.key === 'disagree' && !agree)) score++;
    });
    const complete = answered === def.items.length;
    return { id: def.id, type: 'aq10', score, answered, total: def.items.length, threshold: def.threshold, complete, flagged: complete && score >= def.threshold };
  }

  function qchat(answers, def) {
    const a = answers || {};
    let score = 0;
    let answered = 0;
    def.items.forEach((it) => {
      const v = a[it.id];
      if (!isNum(v)) return;
      answered++;
      if (it.scoreIf.indexOf(v) !== -1) score++;
    });
    const complete = answered === def.items.length;
    return { id: def.id, type: 'qchat', score, answered, total: def.items.length, threshold: def.threshold, complete, flagged: complete && score >= def.threshold };
  }

  /* ASRS v1.1: an item counts when it reaches its own shaded threshold ("Sometimes" or "Often"). Part A screens positive at 4 of 6.
     The 18 items map onto the 18 diagnostic symptoms, so the per-domain counts are reported too (adults need 5 in a domain). */
  function asrs(answers, def) {
    const a = answers || {};
    let partA = 0;
    let partB = 0;
    let answered = 0;
    const domains = { in: 0, hyp: 0 };
    def.items.forEach((it) => {
      const v = a[it.id];
      if (!isNum(v)) return;
      answered++;
      if (v >= it.min) {
        if (it.part === 'A') partA++;
        else partB++;
        domains[it.domain]++;
      }
    });
    const complete = answered === def.items.length;
    const partAComplete = def.items.filter((it) => it.part === 'A').every((it) => isNum(a[it.id]));
    return { id: def.id, type: 'asrs', score: partA, partB, inCount: domains.in, hypCount: domains.hyp, answered, total: def.items.length, threshold: def.threshold, complete, partAComplete, flagged: partAComplete && partA >= def.threshold };
  }

  /* SNAP-IV: mean of each nine-item subscale against the published parent cut-offs; items rated 2 or 3 count as symptoms present. */
  function snap(answers, def) {
    const a = answers || {};
    const sums = { in: 0, hyp: 0 };
    const ns = { in: 0, hyp: 0 };
    const counts = { in: 0, hyp: 0 };
    let answered = 0;
    def.items.forEach((it) => {
      const v = a[it.id];
      if (!isNum(v)) return;
      answered++;
      sums[it.domain] += v;
      ns[it.domain]++;
      if (v >= 2) counts[it.domain]++;
    });
    const complete = answered === def.items.length;
    const inMean = ns.in ? sums.in / ns.in : null;
    const hypMean = ns.hyp ? sums.hyp / ns.hyp : null;
    const inFlag = complete && inMean >= def.cutoffs.in;
    const hypFlag = complete && hypMean >= def.cutoffs.hyp;
    return { id: def.id, type: 'snap', inMean, hypMean, inCount: counts.in, hypCount: counts.hyp, inFlag, hypFlag, answered, total: def.items.length, cutoffs: def.cutoffs, complete, flagged: inFlag || hypFlag };
  }

  /* NPI-16: one point for each pair where the narcissism-consistent statement is chosen. A trait measure with no clinical
     cut-off; the bands are roughly one and two standard deviations above the published adult mean (about 5, SD about 3). */
  function npi(answers, def) {
    const a = answers || {};
    let score = 0;
    let answered = 0;
    def.items.forEach((it) => {
      const v = a[it.id];
      if (!isNum(v)) return;
      answered++;
      if (v === it.key) score++;
    });
    const complete = answered === def.items.length;
    const band = score >= 12 ? { key: 'high', label: 'much higher than most people' } : score >= 9 ? { key: 'marked', label: 'higher than most people' } : { key: 'low', label: 'in the typical range' };
    return { id: def.id, type: 'npi', score, answered, total: def.items.length, complete, band, flagged: false };
  }

  /* HSNS: sum of ten 1-to-5 ratings (10 to 50). Published adult mean about 29, SD about 6; bands at one and two SDs above. */
  function hsns(part) {
    if (!part || part.type !== 'single') return null;
    let sum = 0;
    let answered = 0;
    Object.keys(part.values).forEach((id) => {
      sum += part.values[id].index + 1;
      answered++;
    });
    const complete = answered === part.total;
    const band = !complete ? null : sum >= 42 ? { key: 'high', label: 'much higher than most people' } : sum >= 36 ? { key: 'marked', label: 'higher than most people' } : { key: 'low', label: 'in the typical range' };
    return { score: sum, answered, total: part.total, complete, band };
  }

  function screener(answers, def) {
    if (def.type === 'aq10') return aq10(answers, def);
    if (def.type === 'qchat') return qchat(answers, def);
    if (def.type === 'asrs') return asrs(answers, def);
    if (def.type === 'npi') return npi(answers, def);
    return snap(answers, def);
  }

  /* ----- NICE recognition checklists ----- */
  function signs(answers, def) {
    const a = answers || {};
    const groups = {};
    let total = 0;
    let checked = 0;
    const labels = [];
    def.groups.forEach((g) => {
      let n = 0;
      g.items.forEach((it) => {
        total++;
        if (a[it.id]) {
          checked++;
          n++;
          labels.push(it.text);
        }
      });
      groups[g.id] = { checked: n, total: g.items.length, title: g.title };
    });
    const r = { rule: def.rule, checked, total, groups, labels };
    if (def.rule === 'nice-adult') {
      r.core = groups.core ? groups.core.checked : 0;
      r.context = groups.context ? groups.context.checked : 0;
      r.meets = r.core >= 1 && r.context >= 1;
    } else if (def.rule === 'nice-adhd' || def.rule === 'core-all') {
      /* A pattern (at least one core item) that is persistent, pervasive and impairing, so every context item is needed.
         NG87 for ADHD; the ICD-11 general criteria for personality disorder. */
      r.core = groups.core ? groups.core.checked : 0;
      r.context = groups.context ? groups.context.checked : 0;
      r.contextTotal = groups.context ? groups.context.total : 0;
      r.meets = r.core >= 1 && r.context === r.contextTotal;
    } else {
      /* NICE sets no number for children. Three or more signs is Signpost's working line for "several together";
         a checklist can set its own line with meetsAt. */
      r.meetsAt = def.meetsAt || 3;
      r.meets = checked >= r.meetsAt;
    }
    return r;
  }

  /* ----- structured history ----- */
  function part(answers, p) {
    const a = answers || {};
    if (p.type === 'rating') {
      let sum = 0;
      let n = 0;
      const high = [];
      p.items.forEach((it) => {
        const v = a[it.id];
        if (!isNum(v)) return;
        sum += v;
        n++;
        if (v >= 2) high.push(it.text);
      });
      const mean = n ? sum / n : null;
      return { type: 'rating', answered: n, total: p.items.length, mean, level: level(mean), enough: n >= Math.ceil(p.items.length / 2), high };
    }
    if (p.type === 'yesno') {
      let yes = 0;
      let no = 0;
      let unsure = 0;
      const yesItems = [];
      p.items.forEach((it) => {
        const v = a[it.id];
        if (v === 'yes') {
          yes++;
          yesItems.push(it.text);
        } else if (v === 'no') no++;
        else if (v === 'unsure') unsure++;
      });
      return { type: 'yesno', yes, no, unsure, answered: yes + no + unsure, total: p.items.length, yesItems };
    }
    if (p.type === 'check') {
      const selected = [];
      const labels = [];
      p.items.forEach((it) => {
        if (a[it.id]) {
          selected.push(it.id);
          labels.push(it.text);
        }
      });
      const none = p.items.some((it) => it.exclusive && a[it.id]);
      return { type: 'check', selected, labels, none, answered: selected.length };
    }
    if (p.type === 'single') {
      const values = {};
      const flags = [];
      let answered = 0;
      p.items.forEach((it) => {
        const v = a[it.id];
        if (!isNum(v)) return;
        answered++;
        values[it.id] = { index: v, label: it.options[v] };
        if (it.flagIf && it.flagIf.indexOf(v) !== -1) flags.push({ id: it.id, text: it.text, label: it.options[v] });
      });
      return { type: 'single', values, flags, flagged: flags.length > 0, answered, total: p.items.length };
    }
    return { type: p.type, answered: 0, total: 0 };
  }

  function section(answers, s) {
    const parts = {};
    s.parts.forEach((p) => {
      parts[p.id] = part(answers, p);
    });
    return { parts, main: parts.main || parts[s.parts[0].id] };
  }

  /* ----- the whole picture ----- */
  function summarise(state, data) {
    const route = data.routes.filter((r) => r.id === state.route)[0];
    if (!route) return null;
    const answers = state.answers || {};
    const res = { route, respondent: route.respondent, nation: state.nation || 'england', name: state.name || '', date: state.finished || null };

    res.screener = route.screener ? Object.assign({ def: data.screeners[route.screener] }, screener(answers.screener, data.screeners[route.screener])) : null;
    res.signs = Object.assign({ def: data.signs[route.signs] }, signs(answers.signs, data.signs[route.signs]));
    res.sections = data.history[route.history].map((s) => Object.assign({ def: s, skipped: !!(state.skipped && state.skipped[s.id]) }, section(answers[s.id], s)));

    const byId = {};
    res.sections.forEach((s) => {
      byId[s.def.id] = s;
    });
    res.byId = byId;

    const marked = (s) => s && s.main && s.main.type === 'rating' && s.main.mean !== null && s.main.enough && s.main.mean >= MARKED;
    const A = res.sections.filter((s) => s.def.domain === 'A');
    const B = res.sections.filter((s) => s.def.domain === 'B');
    res.aTotal = A.length;
    res.bTotal = B.length;
    res.aMarked = A.filter(marked).length;
    res.bMarked = B.filter(marked).length;
    res.aAnswered = A.filter((s) => s.main.enough).length;
    res.bAnswered = B.filter((s) => s.main.enough).length;

    const mean = (id) => (byId[id] && byId[id].main.type === 'rating' && byId[id].main.enough ? byId[id].main.mean : null);
    res.impact = mean('D');
    res.masking = mean('M');

    /* early development */
    if (byId.C && byId.C.main.type === 'yesno') res.early = byId.C.main;
    else res.early = null;
    if (byId.DEV) res.dev = byId.DEV.main;
    else res.dev = null;
    res.milestones = byId.C && byId.C.parts.main && byId.C.parts.main.type === 'single' ? byId.C.parts.main : null;
    res.hearing = byId.C && byId.C.parts.hear ? byId.C.parts.hear : null;
    /* Loss of skills: the toddler milestones question, or the child route's regression item (C i2). The adult C i2 is a different question. */
    const cAns = answers.C || {};
    res.lostSkills = !!(res.milestones && res.milestones.values.loss && res.milestones.values.loss.index === 1) || (route.history === 'child' && cAns.i2 === 'yes');

    /* ADHD: settings (pervasiveness), the school's view, and the everyday-patterns section */
    res.settings = route.condition === 'adhd' && byId.S && byId.S.parts.main && byId.S.parts.main.type === 'check' ? byId.S.parts.main : null;
    res.settingsCount = res.settings ? res.settings.selected.filter((id) => id !== 'set_none').length : 0;
    res.school = byId.S && byId.S.parts.school ? byId.S.parts.school : null;
    res.patterns = mean('E');

    /* narcissism: the vulnerable scale, the relationship pattern, and the effect on someone else */
    res.hsns = byId.V ? hsns(byId.V.parts.main) : null;
    res.functioning = mean('F');
    res.effects = mean('X');
    res.situation = byId.S && byId.S.parts.main && byId.S.parts.main.type === 'check' && route.condition === 'narcissism' ? byId.S.parts.main : null;

    /* other conditions, support, wellbeing */
    const O = byId.O;
    res.conditions = O && O.parts.cond ? O.parts.cond : null;
    res.supportSoFar = O && O.parts.support ? O.parts.support : byId.T && byId.T.parts.support ? byId.T.parts.support : null;
    res.raised = O && O.parts.raised ? O.parts.raised : null;
    res.wellbeing = O && O.parts.well ? O.parts.well : null;

    /* any risk-flagged part anywhere sets the risk flag; the support panel shown is the flagged part's own (abuse before self) */
    res.riskParts = [];
    res.sections.forEach((s) => {
      s.def.parts.forEach((p) => {
        if (p.risk && s.parts[p.id] && s.parts[p.id].flagged) res.riskParts.push({ section: s.def.id, part: p.id, kind: p.support || route.respondent });
      });
    });
    res.risk = res.riskParts.length > 0;
    res.riskKind = res.riskParts.some((p) => p.kind === 'abuse') ? 'abuse' : res.riskParts.length ? res.riskParts[0].kind : route.respondent;
    res.safety = byId.T && byId.T.parts.safety ? byId.T.parts.safety : null;

    res.verdict = verdict(res);
    return res;
  }

  function verdict(res) {
    if (res.route.condition === 'adhd') return verdictAdhd(res);
    if (res.route.condition === 'narcissism') return res.route.id === 'narc-other' ? verdictOther(res) : verdictNarc(res);
    const r = res.route;
    const reasons = [];
    const notes = [];
    const sc = res.screener;
    const parentWord = r.respondent === 'self' ? 'your' : 'your child’s';

    if (sc && sc.complete && sc.flagged) reasons.push(sc.def.short + ' score of ' + sc.score + ' out of 10 is at or above the referral cut-off of ' + sc.threshold);
    if (sc && sc.complete && !sc.flagged && sc.score >= sc.threshold - 1) notes.push(sc.def.short + ' score of ' + sc.score + ' is just below the cut-off of ' + sc.threshold);

    if (res.signs.rule === 'nice-adult') {
      if (res.signs.meets) reasons.push('the NICE test for adults is met: ' + res.signs.core + ' of 3 core signs and ' + res.signs.context + ' of 4 life factors');
      else if (res.signs.checked > 0) notes.push(res.signs.core + ' core sign' + (res.signs.core === 1 ? '' : 's') + ' and ' + res.signs.context + ' life factor' + (res.signs.context === 1 ? '' : 's') + ' ticked, which does not yet meet the NICE test of at least one of each');
    } else if (res.signs.meets) reasons.push(res.signs.checked + ' of the ' + res.signs.total + ' signs NICE lists for this age were ticked');
    else if (res.signs.checked > 0) notes.push(res.signs.checked + ' of the ' + res.signs.total + ' signs NICE lists for this age were ticked');

    let strong = false;
    let some = false;

    if (r.history === 'toddler') {
      const devYes = res.dev ? res.dev.yes : 0;
      const mil = res.milestones ? res.milestones.flags.length : 0;
      if (devYes >= 4) reasons.push(devYes + ' of ' + res.dev.total + ' social communication concerns were ticked');
      else if (devYes > 0) notes.push(devYes + ' of ' + res.dev.total + ' social communication concerns were ticked');
      if (res.lostSkills) reasons.push('loss of words or skills was reported, which NICE says should always be discussed promptly');
      if (mil > 0) notes.push('milestones or hearing to discuss: ' + res.milestones.flags.map((f) => f.text.toLowerCase() + ' (' + f.label.toLowerCase() + ')').join(', '));
      strong = !!(sc && sc.flagged) || res.signs.meets || devYes >= 4 || res.lostSkills;
      some = devYes >= 2 || mil > 0 || res.signs.checked > 0 || !!(sc && sc.score >= 1);
    } else {
      if (res.aMarked >= 2 && res.bMarked >= 1) reasons.push('marked features in ' + res.aMarked + ' of 3 social communication areas and ' + res.bMarked + ' of 4 repetitive, routine, interest or sensory areas');
      else if (res.aMarked + res.bMarked > 0) notes.push('marked features in ' + res.aMarked + ' of 3 social communication areas and ' + res.bMarked + ' of 4 repetitive, routine, interest or sensory areas');
      if (res.early && res.early.yes >= 3) reasons.push('features going back to early childhood (' + res.early.yes + ' of ' + res.early.total + ' early-development questions answered yes)');
      else if (res.early && res.early.yes > 0) notes.push(res.early.yes + ' of ' + res.early.total + ' early-development questions answered yes');
      if (res.impact !== null && res.impact >= MARKED) reasons.push('a marked effect on daily life');
      if (res.masking !== null && res.masking >= MARKED) notes.push('high masking, which can keep ' + parentWord + ' questionnaire scores low even when the difficulties are real');
      if (res.lostSkills) reasons.push('loss of words or skills was reported, which NICE says should always be discussed promptly');
      strong = !!(sc && sc.flagged) || res.signs.meets || (res.aMarked >= 2 && res.bMarked >= 1) || res.lostSkills;
      some = res.aMarked + res.bMarked > 0 || (res.masking !== null && res.masking >= MARKED) || (res.impact !== null && res.impact >= MARKED) || res.signs.checked > 0 || !!(sc && sc.complete && sc.score >= sc.threshold - 2) || !!(res.early && res.early.yes >= 2);
    }

    const key = strong ? 'refer' : some ? 'discuss' : 'low';
    const who = r.history === 'toddler' ? 'your health visitor or GP' : r.respondent === 'self' ? 'your GP' : 'your GP or your child’s school';
    const titles = {
      refer: 'Talk to ' + who + ' about an autism assessment',
      discuss: 'Worth a conversation with ' + who,
      low: 'These answers don’t point strongly towards autism'
    };
    const bodies = {
      refer: r.respondent === 'self'
        ? 'Your answers include the things a GP looks for before referring. Signpost cannot diagnose autism. Only a specialist team can, using interviews and observation as well as questionnaires. But there is enough here to ask for that assessment, and the summary below will help you make the case.'
        : 'Your answers include the things a GP, health visitor or school looks for before referring. Signpost cannot diagnose autism. Only a specialist team can, using interviews, observation and information from nursery or school. But there is enough here to ask for that assessment, and the summary below will help you make the case.',
      discuss: r.respondent === 'self'
        ? 'Some of your answers point towards autistic traits, but not the full pattern a GP would need to refer on this evidence alone. That does not rule autism out. Screening questionnaires miss people, especially those who mask. Take this summary to your GP, talk through the areas below, and ask what the local route to assessment is.'
        : 'Some of your answers point towards autistic traits, but not the full pattern a professional would need to refer on this evidence alone. That does not rule autism out; young children in particular vary a lot in how and where they show difficulties. Take this summary to your GP or health visitor, and ask nursery or school what they see.',
      low: r.respondent === 'self'
        ? 'On these answers, the pattern a UK team looks for (difficulties across social communication, plus repetitive or sensory features, from early childhood, with an effect on daily life) is not strongly present. If you still have real concerns, or things change, talk to your GP. A difficulty in one area may have a different explanation that deserves its own attention.'
        : 'On these answers, the pattern a UK team looks for (difficulties across social communication, plus repetitive or sensory features, from early on, with an effect on daily life) is not strongly present. Keep watching, and if you still have concerns, or things change, talk to your health visitor, GP or school. A difficulty in one area may have a different explanation that deserves its own attention.'
    };
    const v = { key, title: titles[key], body: bodies[key], reasons, notes };
    if (sc && sc.complete && !sc.flagged && res.masking !== null && res.masking >= MARKED) {
      v.maskingNote = (r.respondent === 'self' ? 'Your ' : 'Your child’s ') + sc.def.short + ' score is below the cut-off, but the masking answers are high. The ' + sc.def.short + ' is known to miss people who camouflage their traits, so the profile below matters more than the score here.';
    }
    return v;
  }

  function verdictAdhd(res) {
    const r = res.route;
    const self = r.respondent === 'self';
    const reasons = [];
    const notes = [];
    const sc = res.screener;
    const g = res.signs;
    const onset = res.early ? res.early.yes : 0;
    const onsetBefore12 = !!(res.early && res.early.yesItems.some((t) => /before/.test(t)));
    let symptomLevel = false;

    if (sc && sc.type === 'asrs') {
      if (sc.partAComplete && sc.flagged) reasons.push('ASRS Part A score of ' + sc.score + ' out of 6 is at or above the screening cut-off of ' + sc.threshold);
      else if (sc.partAComplete && sc.score >= 2) notes.push('ASRS Part A score of ' + sc.score + ' out of 6, below the cut-off of ' + sc.threshold);
      if (sc.complete && (sc.inCount >= 5 || sc.hypCount >= 5)) {
        symptomLevel = true;
        reasons.push('symptom count at the adult diagnostic level: ' + sc.inCount + ' of 9 inattention and ' + sc.hypCount + ' of 9 hyperactive-impulsive items');
      } else if (sc.complete && sc.inCount + sc.hypCount >= 3) notes.push(sc.inCount + ' of 9 inattention and ' + sc.hypCount + ' of 9 hyperactive-impulsive items reached the symptom level (adults need 5 in one domain)');
    }
    if (sc && sc.type === 'snap') {
      if (sc.complete && sc.inFlag) reasons.push('SNAP-IV inattention average of ' + fmt(sc.inMean) + ' is at or above the parent cut-off of ' + sc.cutoffs.in);
      if (sc.complete && sc.hypFlag) reasons.push('SNAP-IV hyperactivity-impulsivity average of ' + fmt(sc.hypMean) + ' is at or above the parent cut-off of ' + sc.cutoffs.hyp);
      if (sc.complete && (sc.inCount >= 6 || sc.hypCount >= 6)) {
        symptomLevel = true;
        reasons.push('symptom count at the childhood diagnostic level: ' + sc.inCount + ' of 9 inattention and ' + sc.hypCount + ' of 9 hyperactive-impulsive items rated “quite a bit” or “very much”');
      } else if (sc.complete && sc.inCount + sc.hypCount >= 3) notes.push(sc.inCount + ' of 9 inattention and ' + sc.hypCount + ' of 9 hyperactive-impulsive items rated “quite a bit” or “very much” (children need 6 in one domain)');
    }

    if (g.meets) reasons.push('the NICE referral test is met: a clear pattern that is persistent, seen in more than one setting, and impairing');
    else if (g.checked > 0) notes.push(g.core + ' of 3 pattern' + (g.core === 1 ? '' : 's') + ' and ' + g.context + ' of ' + g.contextTotal + ' of the persistence, settings and impact conditions ticked; NICE needs all three of those');

    if (onset >= 3) reasons.push('difficulties going back to childhood (' + onset + ' of ' + res.early.total + ' onset questions answered yes)');
    else if (res.early && res.early.yes > 0) notes.push(onset + ' of ' + res.early.total + ' onset questions answered yes; evidence from before age 12 is something the team will need');
    if (res.settingsCount >= 2) reasons.push('difficulties in ' + res.settingsCount + ' settings');
    else if (res.settings && res.settingsCount === 1) notes.push('difficulties reported in one setting only; NICE needs two or more');
    if (res.impact !== null && res.impact >= MARKED) reasons.push('a marked effect on daily life');
    if (res.school && res.school.flagged) notes.push('the school’s view is missing or does not match: ' + res.school.values.t1.label.toLowerCase() + '. A teacher rating is usually needed before a referral goes ahead');
    if (res.patterns !== null && res.patterns >= MARKED) notes.push('strong everyday patterns (emotions, time, sleep, hyperfocus) that are common in ADHD though not part of the criteria');

    const strong = !!(sc && sc.flagged) || g.meets || (symptomLevel && (onsetBefore12 || onset >= 2));
    const some = !!(sc && sc.type === 'asrs' && sc.partAComplete && sc.score >= 2) || !!(sc && sc.type === 'snap' && sc.complete && (sc.inMean >= 1 || sc.hypMean >= 1)) || !!(sc && sc.complete && sc.inCount + sc.hypCount >= 3) || symptomLevel || g.checked > 0 || (res.impact !== null && res.impact >= MARKED) || res.settingsCount >= 2;

    const key = strong ? 'refer' : some ? 'discuss' : 'low';
    const who = self ? 'your GP' : 'your GP or your child’s school';
    const titles = {
      refer: 'Talk to ' + who + ' about an ADHD assessment',
      discuss: 'Worth a conversation with ' + who,
      low: 'These answers don’t point strongly towards ADHD'
    };
    const bodies = {
      refer: self
        ? 'Your answers include what a GP checks before referring for ADHD. Signpost cannot diagnose ADHD; only a specialist can, after a structured interview and a look at your history and at other explanations. But there is enough here to ask for that assessment, and the summary below will help you make the case.'
        : 'Your answers include what a GP or school checks before referring for ADHD. Signpost cannot diagnose ADHD; only a paediatrician or CAMHS can, with information from school as well as home. But there is enough here to ask for that assessment, and the summary below will help you make the case.',
      discuss: self
        ? 'Some of your answers point towards ADHD, but not the full pattern a GP would need to refer on this evidence alone. That does not rule it out; adults with mainly inattentive ADHD often score modestly on screeners. Take this summary to your GP, talk through the areas below, and ask what the local route to assessment is.'
        : 'Some of your answers point towards ADHD, but not the full pattern a professional would need to refer on this evidence alone. That does not rule it out. Ask the teacher to complete the same rating scale, keep a note of examples for a few weeks, and take this summary to your GP.',
      low: self
        ? 'On these answers, the pattern a UK clinic looks for (five or more symptoms in a domain, present since childhood, in two or more settings, with real impairment) is not strongly present. If you still have real concerns, or things change, talk to your GP. Attention problems can also come from sleep, anxiety, low mood or thyroid problems, which deserve their own look.'
        : 'On these answers, the pattern a UK clinic looks for (six or more symptoms in a domain, lasting six months or more, in two or more settings, with real impairment) is not strongly present. Keep watching, ask the teacher what they see, and if concerns continue talk to your GP. Attention and behaviour problems can also come from sleep, hearing, anxiety or difficult experiences, which deserve their own look.'
    };
    return { key, title: titles[key], body: bodies[key], reasons, notes };
  }

  function verdictNarc(res) {
    const reasons = [];
    const notes = [];
    const sc = res.screener;
    const g = res.signs;
    const F = res.functioning;
    const D = res.impact;
    const h = res.hsns;
    const condSel = res.conditions ? res.conditions.selected : [];

    if (sc && sc.complete && sc.band.key !== 'low') notes.push('NPI-16 score of ' + sc.score + ' out of 16, ' + sc.band.label + ' (a trait, not a diagnosis)');
    else if (sc && sc.complete) notes.push('NPI-16 score of ' + sc.score + ' out of 16, in the typical range');
    if (h && h.complete && h.band.key !== 'low') notes.push('HSNS score of ' + h.score + ' out of 50, ' + h.band.label + ' (the vulnerable, easily wounded shape)');
    if (g.meets) reasons.push('the ICD-11 pattern is present: a problem in how you see yourself or relate to others that is long-standing, shows up everywhere, and has cost you');
    else if (g.core >= 1 && g.context >= 1) notes.push('some of the ICD-11 pattern is ticked (' + g.core + ' of 2 core problems, ' + g.context + ' of 3 of long-standing, everywhere, costly), but a clinician needs all three of the second group');
    if (F !== null && F >= MARKED) reasons.push('a marked pattern in relationships: needing admiration, difficulty feeling what others feel, reacting to criticism with anger or contempt');
    else if (F !== null && F >= 0.75) notes.push('some of the relationship pattern is present');
    if (res.early && res.early.yesItems.some((t) => /teens/.test(t)) && res.early.yesItems.some((t) => /every part/.test(t))) reasons.push('long-standing and present across every part of life');
    if (res.early && res.early.yesItems.some((t) => /long periods/.test(t))) notes.push('there have been long periods when none of this was a problem, which points a clinician away from a personality disorder and towards mood, circumstances or a particular relationship');
    if (D !== null && D >= MARKED) reasons.push('a marked effect on relationships, work or wellbeing');
    if (res.early && res.early.yesItems.some((t) => /called me a narcissist/.test(t))) notes.push('this started with an accusation or a break-up; that is worth talking about in its own right, whatever the scores say');
    if (h && h.complete && h.band.key !== 'low' && (condSel.indexOf('dep') !== -1 || condSel.indexOf('anx') !== -1 || res.risk)) notes.push('a high HSNS score alongside low mood or anxiety: this shape overlaps heavily with depression and social anxiety, and treating those often changes the picture');

    const strong = g.meets && ((F !== null && F >= MARKED) || (D !== null && D >= MARKED));
    const some = (F !== null && F >= 0.75) || g.core >= 1 || !!(sc && sc.complete && sc.band.key !== 'low') || !!(h && h.complete && h.band.key !== 'low') || (D !== null && D >= MARKED);
    const key = strong ? 'refer' : some ? 'discuss' : 'low';
    const titles = {
      refer: 'Talk to your GP about a personality assessment',
      discuss: 'Worth a conversation with your GP or a therapist',
      low: 'These answers don’t point strongly towards a narcissistic pattern'
    };
    const bodies = {
      refer: 'Your answers describe a long-standing pattern in how you see yourself and relate to others that is causing real harm. Signpost cannot diagnose a personality disorder; only a psychiatrist or clinical psychologist can, after a detailed interview. But the pattern you describe is what that assessment is for, and asking the question is a sign of exactly the self-awareness that makes therapy work.',
      discuss: 'Your answers show some narcissistic traits, or some strain in relationships, but not the pervasive, long-standing, harmful pattern that defines a personality disorder. Traits like these are common and are not an illness. If they are causing you or the people around you difficulty, a therapist can help, and your GP is a reasonable first step, particularly if low mood or anxiety are part of the picture.',
      low: 'On these answers, narcissistic traits are within the ordinary range and the pattern a clinician looks for is not present. People who worry that they might be narcissists are, as a rule, not the ones clinicians worry about. If the question came from someone else’s accusation, or from low self-worth, those are worth talking about in their own right.'
    };
    return { key, title: titles[key], body: bodies[key], reasons, notes };
  }

  function verdictOther(res) {
    const reasons = [];
    const notes = [];
    const g = res.signs;
    const X = res.effects;
    const safety = !!(res.safety && res.safety.flagged);
    const sit = res.situation ? res.situation.selected : [];

    if (safety) reasons.push('you are afraid of this person, or there has been violence, threats or being stopped from leaving');
    if (g.checked >= g.meetsAt) reasons.push(g.checked + ' of the ' + g.total + ' controlling or coercive behaviours were ticked' + (g.groups.fear && g.groups.fear.checked ? ', including ' + g.groups.fear.checked + ' in the fear group' : ''));
    else if (g.checked > 0) notes.push(g.checked + ' of the ' + g.total + ' controlling or coercive behaviours were ticked');
    if (X !== null && X >= MARKED) reasons.push('a marked effect on you: eggshells, lost confidence, dread, doubting yourself');
    else if (X !== null && X >= 0.75) notes.push('some effect on you');
    if (sit.indexOf('children') !== -1) notes.push('children are involved, which every service will ask about first and which changes the options');
    if (sit.indexOf('money') !== -1 || sit.indexOf('live') !== -1) notes.push('living together or depending on them financially makes practical advice from a service more useful than any label');
    if (sit.indexOf('workplace') !== -1) notes.push('for a colleague or manager, the same pattern is dealt with through your employer, ACAS or a union rather than domestic abuse services');
    if (res.supportSoFar && res.supportSoFar.none) notes.push('nobody knows yet');

    const strong = safety || g.checked >= 5 || (g.checked >= g.meetsAt && X !== null && X >= MARKED);
    const some = g.checked >= 2 || (X !== null && X >= MARKED) || (g.checked >= 1 && X !== null && X >= 0.75);
    const key = strong ? 'refer' : some ? 'discuss' : 'low';
    const titles = {
      refer: 'Talk to a domestic abuse service: this is the pattern they deal with every day',
      discuss: 'Worth talking it through with someone outside the relationship',
      low: 'What you describe doesn’t strongly match a controlling pattern'
    };
    const bodies = {
      refer: 'What you have described is not about whether this person has a diagnosis. It is a pattern of control, contempt or fear, and in the UK that pattern is what services and the law respond to, with or without a label. No questionnaire can diagnose someone who is not in the room, and you do not need one to get help. The helplines below are free, confidential, and used to hearing exactly this.',
      discuss: 'Some of what you describe is the kind of behaviour that wears people down, but not the full pattern of control that domestic abuse services look for. That does not make it fine. Talking to a counsellor, your GP, or a helpline can help you see the pattern more clearly. Whether this person “is a narcissist” matters much less than whether the relationship is safe and good for you.',
      low: 'Most of the behaviours that mark a controlling or abusive relationship are not present in your answers. Ordinary conflict, selfishness, or a bad patch can feel awful without being abuse, and only you can judge the relationship as a whole. If things change, or you ever feel afraid, the helplines below are there.'
    };
    return { key, title: titles[key], body: bodies[key], reasons, notes };
  }

  /* ----- plain-text summary to take to the GP ----- */
  function fmt(n) {
    return n === null || n === undefined ? '–' : (Math.round(n * 10) / 10).toFixed(1);
  }

  function summaryText(res, data) {
    const L = [];
    const nation = data.nations.filter((n) => n.id === res.nation)[0];
    L.push('SIGNPOST SUMMARY (screening, not a diagnosis)');
    L.push('Date: ' + (res.date ? res.date.slice(0, 10) : new Date().toISOString().slice(0, 10)) + (res.name ? ' | About: ' + res.name : '') + ' | Age group: ' + res.route.ageText + ' | Answered by: ' + (res.respondent === 'self' ? 'the person themselves' : 'a parent or carer') + ' | ' + (nation ? nation.label : ''));
    L.push('');
    L.push('Overall: ' + res.verdict.title);
    res.verdict.reasons.forEach((t) => L.push('  + ' + t));
    res.verdict.notes.forEach((t) => L.push('  - ' + t));
    if (res.verdict.maskingNote) L.push('  ! ' + res.verdict.maskingNote);
    L.push('');
    if (res.screener) {
      const s = res.screener;
      if (s.type === 'asrs') L.push('Screening questionnaire: ' + s.def.title + ' Part A ' + s.score + '/6 (cut-off ' + s.threshold + ', ' + (s.partAComplete ? (s.flagged ? 'screen positive' : 'screen negative') : 'incomplete') + ') | Part B ' + s.partB + '/12 | symptom-level items: inattention ' + s.inCount + '/9, hyperactive-impulsive ' + s.hypCount + '/9' + (s.complete ? '' : ' (' + s.answered + ' of ' + s.total + ' answered)'));
      else if (s.type === 'snap') L.push('Screening questionnaire: ' + s.def.title + ' inattention mean ' + fmt(s.inMean) + ' (parent cut-off ' + s.cutoffs.in + (s.inFlag ? ', at or above' : ', below') + ') | hyperactivity-impulsivity mean ' + fmt(s.hypMean) + ' (cut-off ' + s.cutoffs.hyp + (s.hypFlag ? ', at or above' : ', below') + ') | items rated quite a bit or very much: inattention ' + s.inCount + '/9, hyperactive-impulsive ' + s.hypCount + '/9' + (s.complete ? '' : ' (' + s.answered + ' of ' + s.total + ' answered)'));
      else if (s.type === 'npi') L.push('Trait scale: ' + s.def.title + ' score ' + s.score + '/16 (no clinical cut-off; typical adult range up to about 8) | ' + (s.complete ? s.band.label : 'incomplete, ' + s.answered + ' of 16 answered'));
      else L.push('Screening questionnaire: ' + s.def.title + ' score ' + s.score + '/' + s.total + (s.complete ? '' : ' (' + s.answered + ' of ' + s.total + ' answered)') + ' | cut-off ' + s.threshold + ' | ' + (s.complete ? (s.flagged ? 'at or above the cut-off: consider referral for assessment' : 'below the cut-off') : 'incomplete'));
    }
    if (res.hsns) L.push('Trait scale: Hypersensitive Narcissism Scale ' + res.hsns.score + '/50 (typical adult range about 25 to 35) | ' + (res.hsns.complete ? res.hsns.band.label : 'incomplete, ' + res.hsns.answered + ' of 10 answered'));
    const g = res.signs;
    if (g.rule === 'nice-adult') L.push('NICE CG142 identification: ' + g.core + '/3 core signs, ' + g.context + '/4 life factors | ' + (g.meets ? 'meets the "consider assessment" test' : 'does not meet the "consider assessment" test'));
    else if (g.rule === 'nice-adhd') L.push('NICE NG87 referral test: ' + g.core + '/3 symptom patterns, ' + g.context + '/' + g.contextTotal + ' of persistent/pervasive/impairing | ' + (g.meets ? 'met' : 'not met'));
    else if (g.rule === 'core-all') L.push(g.def.summaryLabel + ': ' + g.core + '/2 core problems, ' + g.context + '/' + g.contextTotal + ' of long-standing/everywhere/costly | ' + (g.meets ? 'pattern present' : 'pattern not fully present'));
    else if (g.def.summaryLabel) L.push(g.def.summaryLabel + ': ' + g.checked + '/' + g.total + ' ticked');
    else L.push('NICE CG128 signs for this age: ' + g.checked + '/' + g.total + ' ticked');
    if (res.safety && res.safety.values.s1) L.push('Safety: afraid, or violence/threats/stopped from leaving: ' + res.safety.values.s1.label);
    if (g.labels.length) g.labels.forEach((t) => L.push('  * ' + t));
    L.push('');
    L.push('Profile (mean of 0-3 ratings; 1.5 or more = marked):');
    res.sections.forEach((s) => {
      const m = s.main;
      if (m.type === 'rating') {
        L.push('  ' + s.def.id + ' ' + s.def.title + ': ' + (m.enough ? fmt(m.mean) + ' (' + m.level.label + ')' : s.skipped ? 'skipped' : 'not enough answers'));
        if (m.enough && m.high.length) m.high.forEach((t) => L.push('      - ' + t));
      } else if (m.type === 'yesno') {
        L.push('  ' + s.def.id + ' ' + s.def.title + ': ' + m.yes + ' of ' + m.total + ' yes' + (m.unsure ? ', ' + m.unsure + ' not sure' : ''));
        m.yesItems.forEach((t) => L.push('      - ' + t));
      } else if (m.type === 'single' && s.def.id === 'C') {
        L.push('  Milestones: ' + s.def.parts[0].items.map((it) => it.text + ': ' + (m.values[it.id] ? m.values[it.id].label : 'not answered')).join('; '));
      } else if (m.type === 'check' && s.def.id === 'S') {
        L.push('  ' + s.def.title + ': ' + (m.labels.length ? m.labels.join('; ') : 'nothing ticked'));
      }
      Object.keys(s.parts).forEach((pid) => {
        if (pid === 'main') return;
        const p = s.parts[pid];
        const pdef = s.def.parts.filter((x) => x.id === pid)[0];
        if (p.type === 'check') L.push('  ' + pdef.prompt.replace(/:$/, '') + ' ' + (p.labels.length ? p.labels.join('; ') : 'nothing ticked'));
        else if (p.type === 'single') {
          pdef.items.forEach((it) => {
            L.push('  ' + it.text + ': ' + (p.values[it.id] ? p.values[it.id].label : 'not answered') + (pdef.risk && p.flagged ? ' (please discuss)' : ''));
          });
        }
      });
    });
    L.push('');
    if (res.route.condition === 'adhd') L.push('Signpost is a screening aid built around NICE NG87. It does not diagnose ADHD. Screeners: ASRS v1.1 (Kessler et al., WHO, 2005) / SNAP-IV (Swanson).');
    else if (res.route.condition === 'narcissism') L.push('Signpost is a screening aid. It does not diagnose a personality disorder, and it cannot diagnose anyone other than the person answering. Trait scales: NPI-16 (Ames, Rose and Anderson, 2006) / HSNS (Hendin and Cheek, 1997). Behaviour checklist: Home Office guidance on controlling or coercive behaviour.');
    else L.push('Signpost is a screening aid built around NICE CG128/CG142. It does not diagnose autism. Screeners: AQ-10 / Q-CHAT-10 (Allison, Auyeung and Baron-Cohen, 2012).');
    return L.join('\n');
  }

  return { LEVELS, MARKED, level, aq10, qchat, asrs, snap, npi, hsns, screener, signs, part, section, summarise, verdict, summaryText, fmt };
})();
