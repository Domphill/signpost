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

  function screener(answers, def) {
    return def.type === 'aq10' ? aq10(answers, def) : qchat(answers, def);
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
    } else {
      /* NICE sets no number for children. Three or more signs is Signpost's working line for "several together". */
      r.meets = checked >= 3;
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

    /* other conditions, support, wellbeing */
    const O = byId.O;
    res.conditions = O && O.parts.cond ? O.parts.cond : null;
    res.supportSoFar = O && O.parts.support ? O.parts.support : null;
    res.raised = O && O.parts.raised ? O.parts.raised : null;
    res.wellbeing = O && O.parts.well ? O.parts.well : null;
    res.risk = !!(res.wellbeing && res.wellbeing.flagged);

    res.verdict = verdict(res);
    return res;
  }

  function verdict(res) {
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
      L.push('Screening questionnaire: ' + s.def.title + ' score ' + s.score + '/' + s.total + (s.complete ? '' : ' (' + s.answered + ' of ' + s.total + ' answered)') + ' | cut-off ' + s.threshold + ' | ' + (s.complete ? (s.flagged ? 'at or above the cut-off: consider referral for assessment' : 'below the cut-off') : 'incomplete'));
    }
    const g = res.signs;
    if (g.rule === 'nice-adult') L.push('NICE CG142 identification: ' + g.core + '/3 core signs, ' + g.context + '/4 life factors | ' + (g.meets ? 'meets the "consider assessment" test' : 'does not meet the "consider assessment" test'));
    else L.push('NICE CG128 signs for this age: ' + g.checked + '/' + g.total + ' ticked');
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
    L.push('Signpost is a screening aid built around NICE CG128/CG142. It does not diagnose autism. Screeners: AQ-10 / Q-CHAT-10 (Allison, Auyeung and Baron-Cohen, 2012).');
    return L.join('\n');
  }

  return { LEVELS, MARKED, level, aq10, qchat, screener, signs, part, section, summarise, verdict, summaryText, fmt };
})();
