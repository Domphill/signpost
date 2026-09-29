/* Signpost - the ADHD pathway. Loaded after data.js and merged into DATA.

   Screeners: the Adult ADHD Self-Report Scale v1.1 (Kessler et al., World Health Organization, 2005; freely available) and
   the 18 ADHD items of the SNAP-IV parent rating scale (Swanson; public domain), with their published scoring.
   The referral test is condensed from NICE NG87 (ADHD: diagnosis and management, 2018, updated 2019).
   The history sections are Signpost's own plain-English mapping of what a UK ADHD assessment covers; not a validated instrument. */

(() => {
  DATA.routes.push(
    { id: 'adhd-adult', condition: 'adhd', label: 'An adult, 18 or over', sub: 'Answered by the person themselves. Old school reports, or someone who knew you as a child, help with the childhood questions', respondent: 'self', screener: 'asrs', signs: 'adhd-adult', history: 'adhd-adult', ageText: 'adult (18 or over)', guideline: 'NICE NG87' },
    { id: 'adhd-child', condition: 'adhd', label: 'A child or young person aged 5 to 17', sub: 'Answered by a parent or carer. NICE needs evidence from school too, so ask the teacher the same questions if you can', respondent: 'parent', screener: 'snap', signs: 'adhd-child', history: 'adhd-child', ageText: 'child or young person aged 5 to 17', guideline: 'NICE NG87' }
  );

  const FREQ = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];
  DATA.screeners.asrs = {
    id: 'asrs', type: 'asrs', title: 'ASRS v1.1 (adult self-report scale)', short: 'ASRS',
    about: 'The Adult ADHD Self-Report Scale was developed with the World Health Organization. Part A, the first six questions, is the screener most UK adult ADHD services use; Part B covers the remaining twelve symptoms. Think about the last six months.',
    instructions: 'For each question, pick how often it happens.',
    options: FREQ,
    threshold: 4,
    items: [
      { id: 'q1', part: 'A', domain: 'in', min: 2, text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?' },
      { id: 'q2', part: 'A', domain: 'in', min: 2, text: 'How often do you have difficulty getting things in order when you have to do a task that requires organisation?' },
      { id: 'q3', part: 'A', domain: 'in', min: 2, text: 'How often do you have problems remembering appointments or obligations?' },
      { id: 'q4', part: 'A', domain: 'in', min: 3, text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?' },
      { id: 'q5', part: 'A', domain: 'hyp', min: 3, text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?' },
      { id: 'q6', part: 'A', domain: 'hyp', min: 3, text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?' },
      { id: 'q7', part: 'B', domain: 'in', min: 3, text: 'How often do you make careless mistakes when you have to work on a boring or difficult project?' },
      { id: 'q8', part: 'B', domain: 'in', min: 3, text: 'How often do you have difficulty keeping your attention when you are doing boring or repetitive work?' },
      { id: 'q9', part: 'B', domain: 'in', min: 2, text: 'How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?' },
      { id: 'q10', part: 'B', domain: 'in', min: 3, text: 'How often do you misplace or have difficulty finding things at home or at work?' },
      { id: 'q11', part: 'B', domain: 'in', min: 3, text: 'How often are you distracted by activity or noise around you?' },
      { id: 'q12', part: 'B', domain: 'hyp', min: 2, text: 'How often do you leave your seat in meetings or other situations in which you are expected to remain seated?' },
      { id: 'q13', part: 'B', domain: 'hyp', min: 3, text: 'How often do you feel restless or fidgety?' },
      { id: 'q14', part: 'B', domain: 'hyp', min: 3, text: 'How often do you have difficulty unwinding and relaxing when you have time to yourself?' },
      { id: 'q15', part: 'B', domain: 'hyp', min: 3, text: 'How often do you find yourself talking too much when you are in social situations?' },
      { id: 'q16', part: 'B', domain: 'hyp', min: 2, text: 'When you’re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?' },
      { id: 'q17', part: 'B', domain: 'hyp', min: 3, text: 'How often do you have difficulty waiting your turn in situations when turn taking is required?' },
      { id: 'q18', part: 'B', domain: 'hyp', min: 2, text: 'How often do you interrupt others when they are busy?' }
    ]
  };

  DATA.screeners.snap = {
    id: 'snap', type: 'snap', title: 'SNAP-IV (the 18 ADHD items, parent rating)', short: 'SNAP-IV',
    about: 'The SNAP-IV rating scale lists the eighteen ADHD symptoms from the diagnostic criteria. Parents rate each one; teachers are usually asked to complete the same scale, because NICE needs evidence from school as well as home. Think about the last six months.',
    instructions: 'For each statement, pick how much it describes your child.',
    options: ['Not at all', 'Just a little', 'Quite a bit', 'Very much'],
    cutoffs: { in: 1.78, hyp: 1.44 },
    items: [
      { id: 'q1', domain: 'in', text: 'Often fails to give close attention to details or makes careless mistakes in schoolwork or tasks' },
      { id: 'q2', domain: 'in', text: 'Often has difficulty sustaining attention in tasks or play activities' },
      { id: 'q3', domain: 'in', text: 'Often does not seem to listen when spoken to directly' },
      { id: 'q4', domain: 'in', text: 'Often does not follow through on instructions and fails to finish schoolwork, chores, or duties' },
      { id: 'q5', domain: 'in', text: 'Often has difficulty organising tasks and activities' },
      { id: 'q6', domain: 'in', text: 'Often avoids, dislikes, or reluctantly engages in tasks requiring sustained mental effort' },
      { id: 'q7', domain: 'in', text: 'Often loses things necessary for activities (e.g. toys, school assignments, pencils, or books)' },
      { id: 'q8', domain: 'in', text: 'Often is distracted by extraneous stimuli' },
      { id: 'q9', domain: 'in', text: 'Often is forgetful in daily activities' },
      { id: 'q10', domain: 'hyp', text: 'Often fidgets with hands or feet or squirms in seat' },
      { id: 'q11', domain: 'hyp', text: 'Often leaves seat in classroom or in other situations in which remaining seated is expected' },
      { id: 'q12', domain: 'hyp', text: 'Often runs about or climbs excessively in situations in which it is inappropriate' },
      { id: 'q13', domain: 'hyp', text: 'Often has difficulty playing or engaging in leisure activities quietly' },
      { id: 'q14', domain: 'hyp', text: 'Often is “on the go” or often acts as if “driven by a motor”' },
      { id: 'q15', domain: 'hyp', text: 'Often talks excessively' },
      { id: 'q16', domain: 'hyp', text: 'Often blurts out answers before questions have been completed' },
      { id: 'q17', domain: 'hyp', text: 'Often has difficulty awaiting turn' },
      { id: 'q18', domain: 'hyp', text: 'Often interrupts or intrudes on others (e.g. butts into conversations or games)' }
    ]
  };

  DATA.signs['adhd-adult'] = {
    title: 'Would NICE say a referral should be considered?',
    intro: 'NICE guideline NG87 says ADHD should only be diagnosed by a specialist, and that a referral is appropriate when the symptoms began in childhood, have persisted, show up in more than one setting and cause at least moderate difficulty. This is what a GP checks before referring. Tick what applies.',
    rule: 'nice-adhd',
    groups: [
      { id: 'core', title: 'The pattern', items: [
        { id: 'c1', text: 'Inattention: losing focus, careless mistakes, not finishing things, disorganisation, forgetfulness, losing things, being easily distracted' },
        { id: 'c2', text: 'Hyperactivity: restlessness, fidgeting, finding it hard to sit through things, talking a lot, feeling driven' },
        { id: 'c3', text: 'Impulsivity: interrupting, blurting things out, acting without thinking, impatience, snap decisions about money, driving or relationships' }
      ] },
      { id: 'context', title: 'What NICE needs to see (all three)', items: [
        { id: 'x1', text: 'It has been there since childhood, before about age 12, even if nobody named it at the time' },
        { id: 'x2', text: 'It shows up in two or more settings, for example work or study, home, and relationships' },
        { id: 'x3', text: 'It causes at least moderate difficulty: lost jobs or unfinished courses, money problems, accidents, strain on relationships, or a big effort just to keep up' }
      ] }
    ]
  };

  DATA.signs['adhd-child'] = {
    title: 'Would NICE say a referral should be considered?',
    intro: 'NICE guideline NG87 says a GP or school should refer a child to a paediatrician or CAMHS when ADHD-type behaviour has lasted six months or more, happens in more than one setting and causes at least moderate difficulty. A GP may first suggest up to ten weeks of watchful waiting, or a parent programme; that is part of the guideline, not a brush-off. Tick what applies.',
    rule: 'nice-adhd',
    groups: [
      { id: 'core', title: 'The pattern', items: [
        { id: 'c1', text: 'Inattention: doesn’t seem to listen, loses focus, careless mistakes, doesn’t finish tasks, disorganised, forgetful, loses things, easily distracted' },
        { id: 'c2', text: 'Hyperactivity: fidgets, leaves their seat, runs or climbs when they shouldn’t, can’t play quietly, always on the go, talks constantly' },
        { id: 'c3', text: 'Impulsivity: blurts out answers, can’t wait their turn, interrupts, acts without thinking, little sense of danger' }
      ] },
      { id: 'context', title: 'What NICE needs to see (all three)', items: [
        { id: 'x1', text: 'It has lasted at least six months, and started before age 12' },
        { id: 'x2', text: 'It is seen at school or nursery as well as at home' },
        { id: 'x3', text: 'It causes at least moderate difficulty: learning, friendships, family life, or safety' }
      ] }
    ]
  };

  DATA.history['adhd-adult'] = [
    { id: 'C', domain: 'C', title: 'Childhood and onset', stage: 'History',
      intro: 'ADHD starts in childhood, even when it is only recognised in adulthood. A UK assessment needs evidence of that, ideally from school reports or someone who knew you then. Answer as best you can.',
      parts: [{ id: 'main', type: 'yesno', prompt: 'Thinking back to childhood:', items: [
        { id: 'i1', text: 'Teachers or parents described me as a daydreamer, disruptive, chatty, lazy, or “could do better”.' },
        { id: 'i2', text: 'I had trouble finishing schoolwork or homework, even when I understood it.' },
        { id: 'i3', text: 'I was restless or fidgety as a child, or got into trouble for it.' },
        { id: 'i4', text: 'These difficulties were there before I was 12.' },
        { id: 'i5', text: 'School reports, or someone who knew me as a child, could describe this to an assessment team.' },
        { id: 'i6', text: 'Things got harder when structure fell away: sixth form, university, a first job, living alone, or becoming a parent.' }
      ] }] },
    { id: 'S', domain: 'S', title: 'Where it shows up', stage: 'History',
      intro: 'NICE needs the difficulties to be pervasive, meaning present in more than one part of life, not just at work or just at home.',
      parts: [{ id: 'main', type: 'check', prompt: 'Tick every setting where the difficulties are obvious:', items: [
        { id: 'work', text: 'Work or study' },
        { id: 'home', text: 'Home: chores, admin, bills, keeping on top of things' },
        { id: 'rel', text: 'Relationships and friendships' },
        { id: 'drive', text: 'Driving, or accidents and near misses' },
        { id: 'money', text: 'Money: impulsive spending, unpaid bills, debt' },
        { id: 'health', text: 'Health: missed appointments, forgetting medication, sleep' },
        { id: 'parent', text: 'Parenting or caring' },
        { id: 'set_none', text: 'None of these', exclusive: true }
      ] }] },
    { id: 'D', domain: 'D', title: 'Impact on daily life', stage: 'History',
      intro: 'A diagnosis depends on the symptoms causing real difficulty. This helps the team, and you, see where the impact falls.',
      parts: [{ id: 'main', type: 'rating', prompt: 'How much do these difficulties affect each area?', items: [
        { id: 'i1', text: 'Work or study (underperforming, lost jobs, unfinished courses, constant last-minute rushes)' },
        { id: 'i2', text: 'Money and admin' },
        { id: 'i3', text: 'Relationships and family life' },
        { id: 'i4', text: 'Safety (driving, accidents, risky decisions)' },
        { id: 'i5', text: 'Mental health and self-esteem (anxiety, low mood, feeling like a failure, burnout)' }
      ] }] },
    { id: 'E', domain: 'E', title: 'Everyday patterns', stage: 'History',
      intro: 'These are not part of the formal criteria, but ADHD clinics ask about them because they shape the picture and the support that helps.',
      parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
        { id: 'i1', text: 'My emotions rise fast and take a long time to settle, and small frustrations can feel huge.' },
        { id: 'i2', text: 'I lose track of time: I am often late, underestimate how long things take, or lose hours to one thing.' },
        { id: 'i3', text: 'I can hyperfocus on things that interest me and neglect everything else.' },
        { id: 'i4', text: 'At night my mind won’t switch off, so I go to sleep late and struggle to get up.' },
        { id: 'i5', text: 'Criticism or rejection hits me much harder than it seems to hit other people.' },
        { id: 'i6', text: 'I rely on caffeine, nicotine, sugar or alcohol to get going or to calm down.' }
      ] }] },
    { id: 'O', domain: 'O', title: 'Other conditions, your health, and how you are right now', stage: 'History',
      intro: 'An ADHD clinic checks for conditions that can look like ADHD or occur alongside it, and asks about heart health because it matters for medication. They will also ask how you are coping.',
      parts: [
        { id: 'cond', type: 'check', prompt: 'Tick anything that has been diagnosed, or that you suspect:', items: [
          { id: 'anx', text: 'Anxiety' },
          { id: 'dep', text: 'Depression' },
          { id: 'bipolar', text: 'Bipolar disorder' },
          { id: 'autism', text: 'Autism' },
          { id: 'spld', text: 'Dyslexia, dyspraxia (DCD) or dyscalculia' },
          { id: 'tics', text: 'Tics or Tourette’s' },
          { id: 'epi', text: 'Epilepsy or seizures' },
          { id: 'sleep', text: 'Sleep problems, loud snoring or sleep apnoea' },
          { id: 'thyroid', text: 'Thyroid problems' },
          { id: 'subst', text: 'Problems with alcohol or drugs' },
          { id: 'trauma', text: 'Trauma or very difficult experiences, in childhood or since' },
          { id: 'pd', text: 'A personality disorder diagnosis, or an eating disorder' },
          { id: 'heart', text: 'A heart condition, palpitations, or fainting on exertion' },
          { id: 'bp', text: 'High blood pressure' },
          { id: 'famheart', text: 'A close relative who died suddenly of a heart problem before 40' },
          { id: 'preg', text: 'Pregnant, planning a pregnancy, or breastfeeding' },
          { id: 'fam', text: 'A close relative with ADHD' },
          { id: 'cond_none', text: 'None of these', exclusive: true }
        ] },
        { id: 'well', type: 'single', prompt: 'Over the last two weeks, have you had thoughts that you would be better off dead, or of hurting yourself in some way?', risk: true, items: [
          { id: 'w1', text: 'Thoughts of being better off dead, or of hurting yourself', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], flagIf: [1, 2, 3] }
        ] }
      ] }
  ];

  DATA.history['adhd-child'] = [
    { id: 'C', domain: 'C', title: 'When it started', stage: 'History',
      intro: 'ADHD is present from early childhood, though it often becomes obvious when school demands rise. The team will take a developmental history, so it helps to look back now.',
      parts: [{ id: 'main', type: 'yesno', prompt: 'Thinking back:', items: [
        { id: 'i1', text: 'As a toddler or at nursery, my child was noticeably more active, impulsive or hard to settle than other children.' },
        { id: 'i2', text: 'The difficulties were clearly there before age 12.' },
        { id: 'i3', text: 'Nursery or school raised concerns about attention, restlessness or behaviour.' },
        { id: 'i4', text: 'School reports say things like “easily distracted”, “doesn’t finish work” or “could do better”.' },
        { id: 'i5', text: 'The difficulties have lasted at least six months without a clear trigger (such as a bereavement or a move).' },
        { id: 'i6', text: 'A period of watchful waiting or a parenting course has already been tried.' }
      ] }] },
    { id: 'S', domain: 'S', title: 'Where it shows up, and what school says', stage: 'History',
      intro: 'NICE needs the difficulties to be seen in more than one setting. What the teacher sees carries a lot of weight, so ask them directly if you have not already.',
      parts: [
        { id: 'main', type: 'check', prompt: 'Tick every setting where the difficulties are obvious:', items: [
          { id: 'home', text: 'Home' },
          { id: 'school', text: 'School or nursery' },
          { id: 'clubs', text: 'Clubs, sport or activities' },
          { id: 'friends', text: 'With friends' },
          { id: 'carers', text: 'With grandparents or other carers' },
          { id: 'set_none', text: 'None of these', exclusive: true }
        ] },
        { id: 'school', type: 'single', prompt: 'The school’s view:', items: [
          { id: 't1', text: 'What does the teacher say?', options: ['They see the same difficulties', 'They see some, but milder', 'They see no problem', 'I haven’t asked yet'], flagIf: [2, 3] }
        ] }
      ] },
    { id: 'D', domain: 'D', title: 'Impact on daily life', stage: 'History',
      intro: 'A diagnosis depends on the symptoms causing real difficulty. This helps the team, and you, see where the impact falls.',
      parts: [{ id: 'main', type: 'rating', prompt: 'How much do these difficulties affect each area?', items: [
        { id: 'i1', text: 'Learning and schoolwork (progress, unfinished work, detentions or exclusions)' },
        { id: 'i2', text: 'Friendships' },
        { id: 'i3', text: 'Family life (mealtimes, bedtimes, homework battles, brothers and sisters)' },
        { id: 'i4', text: 'Safety (running off, accidents, no sense of danger)' },
        { id: 'i5', text: 'My child’s self-esteem and mood' },
        { id: 'i6', text: 'Sleep' }
      ] }] },
    { id: 'O', domain: 'O', title: 'Other conditions, support so far, and how you are coping', stage: 'History',
      intro: 'A paediatrician or CAMHS checks for conditions that can look like ADHD or occur alongside it, asks about heart health because it matters for medication, and wants to know who is already involved and how the family is doing.',
      parts: [
        { id: 'cond', type: 'check', prompt: 'Tick anything that has been diagnosed, or that you suspect:', items: [
          { id: 'autism', text: 'Autism' },
          { id: 'ld', text: 'A learning disability or global developmental delay' },
          { id: 'spld', text: 'Dyslexia, dyspraxia (DCD) or another specific learning difficulty' },
          { id: 'lang', text: 'Speech, language or communication needs' },
          { id: 'tics', text: 'Tics or Tourette’s' },
          { id: 'epi', text: 'Epilepsy or seizures' },
          { id: 'sense', text: 'Hearing or eyesight problems' },
          { id: 'sleep', text: 'Sleep problems or loud snoring' },
          { id: 'anx', text: 'Anxiety' },
          { id: 'dep', text: 'Low mood' },
          { id: 'odd', text: 'Frequent defiance, anger or aggression' },
          { id: 'trauma', text: 'Difficult early experiences (trauma, neglect, several changes of carer)' },
          { id: 'birth', text: 'Premature birth, or complications around birth' },
          { id: 'heart', text: 'A heart condition, or fainting on exertion' },
          { id: 'famheart', text: 'A close relative who died suddenly of a heart problem before 40' },
          { id: 'fam', text: 'A close relative with ADHD' },
          { id: 'cond_none', text: 'None of these', exclusive: true }
        ] },
        { id: 'support', type: 'check', prompt: 'Who is already involved?', items: [
          { id: 'gp', text: 'GP' },
          { id: 'senco', text: 'School SEN support (SENCo, support plan)' },
          { id: 'plan', text: 'A formal plan: EHCP (England), IDP (Wales), CSP (Scotland) or Statement (Northern Ireland)' },
          { id: 'paed', text: 'Paediatrician' },
          { id: 'camhs', text: 'CAMHS (child and adolescent mental health service)' },
          { id: 'ep', text: 'Educational psychologist' },
          { id: 'parenting', text: 'A parenting programme' },
          { id: 'sw', text: 'Social worker or early help' },
          { id: 'sup_none', text: 'Nobody yet', exclusive: true }
        ] },
        { id: 'well', type: 'single', prompt: 'How are things at home right now?', risk: true, items: [
          { id: 'w1', text: 'Is anyone in the family struggling to cope, or is anyone at risk of harm?', options: ['No, we are managing', 'Yes, we need support', 'Not sure'], flagIf: [1, 2] }
        ] }
      ] }
  ];

  DATA.conditions.adhd = {
    id: 'adhd', label: 'ADHD', noun: 'ADHD',
    lede: 'The referral test in NICE NG87, the screening questionnaires UK clinics use, and the history an ADHD assessment takes.',
    underAgeNote: 'Under 5: NICE says a GP should refer to a specialist rather than use a questionnaire, and the first step is usually a parent programme. Talk to your health visitor or GP.',
    whoIntro: 'The questionnaire changes with age: adults answer for themselves, and a parent answers for a child.',
    pathway: [
      { title: 'Someone notices', text: 'For children it is often school. For adults it is often after their own child is diagnosed, during therapy for anxiety or depression, or when structure falls away at university or work.' },
      { title: 'GP', text: 'NICE says ADHD must not be diagnosed, or medication started, in general practice. The GP checks that the difficulties are persistent, seen in more than one setting, and impairing. For a child they may suggest up to ten weeks of watchful waiting and a parent programme first, then refer.' },
      { title: 'Referral', text: 'Adults go to a specialist adult ADHD service. Children go to community paediatrics or CAMHS. In England you can ask for a Right to Choose provider. Waits of a year or more are common, and several years in some areas.' },
      { title: 'Information gathering', text: 'Rating scales from you and from someone who knows you well; for a child, a teacher rating scale and school reports are essential. Adults are asked for old school reports or a parent’s account of childhood.' },
      { title: 'The assessment', text: 'A structured diagnostic interview (for adults usually the DIVA-5 or ACE+; for children a clinical interview with the parent and child), a developmental and psychiatric history, a check for other explanations and co-occurring conditions, and sometimes a computer-based attention test such as the QbTest. Before any medication: heart history, blood pressure, pulse, height and weight.' },
      { title: 'Decision', text: 'Against the DSM-5 criteria (five or more symptoms in a domain for adults, six for children, some present before 12, in two or more settings, with clear impairment) or ICD-11. The team may conclude ADHD, not ADHD, or that something else fits better.' },
      { title: 'Treatment and support', text: 'Adults: medication is usually offered where the impairment is significant, alongside psychoeducation and skills-based support. Children from age 5: a parent programme first, then medication if difficulties persist. A shared-care agreement lets your GP take over prescribing. Reasonable adjustments at work or school, Access to Work, and Disabled Students’ Allowance do not need a diagnosis to start.' }
    ],
    nationNotes: {
      england: {
        title: 'In England',
        points: [
          'NICE NG87 applies. Referral is through your GP; for a child, the school SENCo can often start the process, and some areas run a single neurodevelopmental pathway for ADHD and autism together.',
          'Right to Choose: when your GP refers you, you can ask for an NHS-funded provider of your choice that holds an NHS contract. It is used heavily for ADHD and can cut the wait from years to months, but check that your GP practice will accept shared care for medication afterwards, because some decline.',
          'NHS England’s ADHD taskforce (2025) confirmed long waits nearly everywhere; ask the service for its current figure when you are referred.',
          'Support does not have to wait: reasonable adjustments under the Equality Act 2010, Access to Work, Disabled Students’ Allowance, and SEN support or an EHCP for children are all based on need.'
        ]
      },
      wales: {
        title: 'In Wales',
        points: [
          'NICE NG87 applies. Children are referred by the GP or school to the local neurodevelopmental team. Adult ADHD services vary by health board; ask your GP what exists locally.',
          'The Welsh Government’s neurodivergence improvement programme is working on waits and on support that does not depend on a diagnosis.',
          'Children with additional learning needs can have an Individual Development Plan (IDP).',
          'Right to Choose does not apply in Wales.'
        ]
      },
      scotland: {
        title: 'In Scotland',
        points: [
          'Children are referred via the GP, school or health visitor to CAMHS or community paediatrics under the National Neurodevelopmental Specification (2021).',
          'Adults are referred by the GP to the health board’s ADHD pathway. Provision is patchy and waits are long; some boards have no adult service, so ask directly.',
          'Children can have a Co-ordinated Support Plan or other support through school under the Additional Support for Learning framework.',
          'Right to Choose does not apply in Scotland.'
        ]
      },
      ni: {
        title: 'In Northern Ireland',
        points: [
          'Referral is through your GP to the Trust’s children’s or adult ADHD service. Adult provision is limited and waits are long in every Trust.',
          'Children can have a Statement of Special Educational Needs through the Education Authority.',
          'Right to Choose does not apply in Northern Ireland.'
        ]
      }
    },
    bring: {
      self: [
        'This summary, copied or printed.',
        'Old school reports, or a parent or older relative who can describe you as a child. Clinics will ask.',
        'Concrete examples from work, home and money, with dates where you can.',
        'A list of your diagnoses and medicines, and anything about your heart or blood pressure.',
        'What you hope a diagnosis would change: treatment, adjustments at work or study, understanding.'
      ],
      parent: [
        'This summary, copied or printed.',
        'School reports and the teacher’s view, ideally the SNAP-IV completed by the teacher too.',
        'Your child’s red book and any earlier reports (speech and language, educational psychology).',
        'Examples from home, and what has already been tried (routines, a parenting course).',
        'What you hope a diagnosis would change: support at school, treatment, understanding.'
      ]
    },
    organisations: [
      { name: 'ADHD UK', detail: 'Information on the NHS route, Right to Choose and shared care', url: 'https://adhduk.co.uk' },
      { name: 'ADHD Foundation', detail: 'The neurodiversity charity: resources for families, schools and workplaces', url: 'https://www.adhdfoundation.org.uk' },
      { name: 'NHS: ADHD', detail: 'The NHS pages on symptoms, diagnosis and treatment', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/' },
      { name: 'Scottish ADHD Coalition', detail: 'Support groups and information for Scotland', url: 'https://www.scottishadhdcoalition.org' }
    ],
    references: [
      'NICE NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, updated 2019).',
      'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychol Med 2005;35(2):245-256.',
      'Swanson JM, Schuck S, Porter MM, et al. Categorical and dimensional definitions and evaluations of symptoms of ADHD: history of the SNAP and the SWAN rating scales. Int J Educ Psychol Assess 2012;10(1):51-70.',
      'World Health Organization. ICD-11, 6A05 Attention deficit hyperactivity disorder. American Psychiatric Association. DSM-5-TR, 314.01.'
    ]
  };
})();
