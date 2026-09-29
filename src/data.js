/* Signpost - questionnaire content and pathway text.

   The validated screeners (AQ-10 Adult, Adolescent and Child, and the Q-CHAT-10) reproduce the published items and scoring
   from Allison, Auyeung and Baron-Cohen (2012), J Am Acad Child Adolesc Psychiatry 51(2):202-212, which the Autism Research
   Centre (University of Cambridge) makes freely available. The recognition checklists are condensed from NICE CG128 (under-19s)
   and CG142 (adults). The structured history sections are Signpost's own plain-English mapping of the ICD-11 / DSM-5 criteria
   that a UK assessment team works through; they are not a validated instrument and are scored only as a profile. */

const DATA = {
  version: 1,

  routes: [
    { id: 'adult', label: 'An adult, 16 or over', sub: 'Answered by the person themselves, ideally with someone who knew them as a child on hand for the early-years questions', respondent: 'self', screener: 'aq10-adult', signs: 'adult', history: 'adult', ageText: 'adult (16 or over)', guideline: 'NICE CG142' },
    { id: 'teen', label: 'A young person aged 12 to 15', sub: 'Answered by a parent or carer', respondent: 'parent', screener: 'aq10-adolescent', signs: 'secondary', history: 'child', ageText: 'young person aged 12 to 15', guideline: 'NICE CG128' },
    { id: 'child', label: 'A child aged 4 to 11', sub: 'Answered by a parent or carer', respondent: 'parent', screener: 'aq10-child', signs: 'primary', history: 'child', ageText: 'child aged 4 to 11', guideline: 'NICE CG128' },
    { id: 'preschool', label: 'A child aged 2½ to 3', sub: 'Answered by a parent or carer. No brief questionnaire is validated for this age, so Signpost uses the NICE signs list and a developmental history', respondent: 'parent', screener: null, signs: 'preschool', history: 'toddler', ageText: 'child aged 2½ to 3', guideline: 'NICE CG128' },
    { id: 'toddler', label: 'A toddler aged 18 months to 2½', sub: 'Answered by a parent or carer', respondent: 'parent', screener: 'qchat10', signs: 'preschool', history: 'toddler', ageText: 'toddler aged 18 to 30 months', guideline: 'NICE CG128' }
  ],
  underAgeNote: 'Under 18 months: the screening questionnaires are not validated this young. If you have concerns, talk to your health visitor. Signs such as not responding to their name, not pointing, and little babble by 12 months are worth mentioning.',

  nations: [
    { id: 'england', label: 'England' },
    { id: 'wales', label: 'Wales' },
    { id: 'scotland', label: 'Scotland' },
    { id: 'ni', label: 'Northern Ireland' }
  ],

  /* ---------- validated screeners ---------- */
  screeners: {
    'aq10-adult': {
      id: 'aq10-adult', type: 'aq10', title: 'AQ-10 (adult version)', short: 'AQ-10',
      about: 'The ten-item Autism Spectrum Quotient is the screening questionnaire NICE recommends for adults in primary care. A GP may use it before deciding on a referral. Answer about how you are generally, not how you would like to be.',
      instructions: 'For each statement, pick the answer closest to how you feel.',
      options: ['Definitely agree', 'Slightly agree', 'Slightly disagree', 'Definitely disagree'],
      threshold: 6,
      items: [
        { id: 'q1', key: 'agree', text: 'I often notice small sounds when others do not.' },
        { id: 'q2', key: 'disagree', text: 'I usually concentrate more on the whole picture, rather than the small details.' },
        { id: 'q3', key: 'disagree', text: 'I find it easy to do more than one thing at once.' },
        { id: 'q4', key: 'disagree', text: 'If there is an interruption, I can switch back to what I was doing very quickly.' },
        { id: 'q5', key: 'disagree', text: 'I find it easy to ‘read between the lines’ when someone is talking to me.' },
        { id: 'q6', key: 'disagree', text: 'I know how to tell if someone listening to me is getting bored.' },
        { id: 'q7', key: 'agree', text: 'When I’m reading a story I find it difficult to work out the characters’ intentions.' },
        { id: 'q8', key: 'agree', text: 'I like to collect information about categories of things (e.g. types of car, types of bird, types of train, types of plant etc).' },
        { id: 'q9', key: 'disagree', text: 'I find it easy to work out what someone is thinking or feeling just by looking at their face.' },
        { id: 'q10', key: 'agree', text: 'I find it difficult to work out people’s intentions.' }
      ]
    },
    'aq10-adolescent': {
      id: 'aq10-adolescent', type: 'aq10', title: 'AQ-10 (adolescent version, 12 to 15)', short: 'AQ-10',
      about: 'The ten-item Autism Spectrum Quotient for adolescents is completed by a parent or carer. It is a screening questionnaire, used to decide whether a full assessment is worth considering.',
      instructions: 'For each statement, pick the answer that best describes your child.',
      options: ['Definitely agree', 'Slightly agree', 'Slightly disagree', 'Definitely disagree'],
      threshold: 6,
      items: [
        { id: 'q1', key: 'agree', text: 'S/he notices patterns in things all the time.' },
        { id: 'q2', key: 'disagree', text: 'S/he usually concentrates more on the whole picture, rather than the small details.' },
        { id: 'q3', key: 'disagree', text: 'In a social group, s/he can easily keep track of several different people’s conversations.' },
        { id: 'q4', key: 'disagree', text: 'If there is an interruption, s/he can switch back to what s/he was doing very quickly.' },
        { id: 'q5', key: 'agree', text: 'S/he frequently finds that s/he doesn’t know how to keep a conversation going.' },
        { id: 'q6', key: 'disagree', text: 'S/he is good at social chit-chat.' },
        { id: 'q7', key: 'disagree', text: 'When s/he was younger, s/he used to enjoy playing games involving pretending with other children.' },
        { id: 'q8', key: 'agree', text: 'S/he finds it difficult to imagine what it would be like to be someone else.' },
        { id: 'q9', key: 'disagree', text: 'S/he finds social situations easy.' },
        { id: 'q10', key: 'agree', text: 'S/he finds it hard to make new friends.' }
      ]
    },
    'aq10-child': {
      id: 'aq10-child', type: 'aq10', title: 'AQ-10 (child version, 4 to 11)', short: 'AQ-10',
      about: 'The ten-item Autism Spectrum Quotient for children is completed by a parent or carer. It is a screening questionnaire, used to decide whether a full assessment is worth considering.',
      instructions: 'For each statement, pick the answer that best describes your child.',
      options: ['Definitely agree', 'Slightly agree', 'Slightly disagree', 'Definitely disagree'],
      threshold: 6,
      items: [
        { id: 'q1', key: 'agree', text: 'S/he often notices small sounds when others do not.' },
        { id: 'q2', key: 'disagree', text: 'S/he usually concentrates more on the whole picture, rather than the small details.' },
        { id: 'q3', key: 'disagree', text: 'In a social group, s/he can easily keep track of several different people’s conversations.' },
        { id: 'q4', key: 'disagree', text: 'S/he finds it easy to go back and forth between different activities.' },
        { id: 'q5', key: 'agree', text: 'S/he doesn’t know how to keep a conversation going with his/her peers.' },
        { id: 'q6', key: 'disagree', text: 'S/he is good at social chit-chat.' },
        { id: 'q7', key: 'agree', text: 'When s/he is read a story, s/he finds it difficult to work out the character’s intentions or feelings.' },
        { id: 'q8', key: 'disagree', text: 'When s/he was in preschool, s/he used to enjoy playing games involving pretending with other children.' },
        { id: 'q9', key: 'disagree', text: 'S/he finds it easy to work out what someone is thinking or feeling just by looking at their face.' },
        { id: 'q10', key: 'agree', text: 'S/he finds it hard to make new friends.' }
      ]
    },
    'qchat10': {
      id: 'qchat10', type: 'qchat', title: 'Q-CHAT-10 (toddlers)', short: 'Q-CHAT-10',
      about: 'The ten-item Quantitative Checklist for Autism in Toddlers is completed by a parent or carer. It was developed with 18 to 24-month-olds and is widely used up to about 30 months. It is a screening questionnaire, not a diagnosis.',
      instructions: 'Pick the answer that best describes your child at the moment.',
      threshold: 3,
      items: [
        { id: 'q1', text: 'Does your child look at you when you call his/her name?', options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'], scoreIf: [2, 3, 4] },
        { id: 'q2', text: 'How easy is it for you to get eye contact with your child?', options: ['Very easy', 'Quite easy', 'Quite difficult', 'Very difficult', 'Impossible'], scoreIf: [2, 3, 4] },
        { id: 'q3', text: 'Does your child point to indicate that s/he wants something (e.g. a toy that is out of reach)?', options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'], scoreIf: [2, 3, 4] },
        { id: 'q4', text: 'Does your child point to share interest with you (e.g. pointing at an interesting sight)?', options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'], scoreIf: [2, 3, 4] },
        { id: 'q5', text: 'Does your child pretend (e.g. care for dolls, talk on a toy phone)?', options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'], scoreIf: [2, 3, 4] },
        { id: 'q6', text: 'Does your child follow where you’re looking?', options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'], scoreIf: [2, 3, 4] },
        { id: 'q7', text: 'If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them (e.g. stroking hair, hugging them)?', options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'], scoreIf: [2, 3, 4] },
        { id: 'q8', text: 'Would you describe your child’s first words as:', options: ['Very typical', 'Quite typical', 'Slightly unusual', 'Very unusual', 'My child doesn’t speak'], scoreIf: [2, 3, 4] },
        { id: 'q9', text: 'Does your child use simple gestures (e.g. wave goodbye)?', options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'], scoreIf: [2, 3, 4] },
        { id: 'q10', text: 'Does your child stare at nothing with no apparent purpose?', options: ['Many times a day', 'A few times a day', 'A few times a week', 'Less than once a week', 'Never'], scoreIf: [0, 1, 2] }
      ]
    }
  },

  /* ---------- NICE recognition checklists ---------- */
  signs: {
    adult: {
      title: 'Would NICE say an assessment should be considered?',
      intro: 'The adult guideline (NICE CG142) tells GPs and other professionals to consider an autism assessment when someone has at least one of the core signs and at least one of the life factors below. This is the same test a GP applies before referring. Tick what applies.',
      rule: 'nice-adult',
      groups: [
        { id: 'core', title: 'Core signs', items: [
          { id: 'c1', text: 'Persistent difficulties in social interaction, for example making and keeping friends, reading social situations, or knowing how to behave with people' },
          { id: 'c2', text: 'Persistent difficulties in social communication, for example conversations, understanding what people mean, eye contact, or body language' },
          { id: 'c3', text: 'Rigid and repetitive behaviours, resistance to change, or restricted interests' }
        ] },
        { id: 'context', title: 'Life factors', items: [
          { id: 'x1', text: 'Problems getting or keeping a job, or difficulties with education' },
          { id: 'x2', text: 'Difficulties starting or keeping social relationships' },
          { id: 'x3', text: 'Previous or current contact with mental health or learning disability services' },
          { id: 'x4', text: 'A history of a neurodevelopmental condition (including a learning disability or ADHD) or of a mental health condition' }
        ] }
      ]
    },
    preschool: {
      title: 'Signs NICE lists for pre-school children',
      intro: 'NICE CG128 gives health visitors, GPs and nursery staff a list of signs that should prompt a conversation about referral. No single sign means autism, and NICE does not set a number, but several together are a good reason to ask for an assessment. Tick anything you recognise in your child.',
      rule: 'count',
      groups: [
        { id: 'social', title: 'Social interaction and communication', items: [
          { id: 's1', text: 'Language delay: little babble, or fewer than about ten words by age 2' },
          { id: 's2', text: 'Loss of words or speech they used to have (regression)' },
          { id: 's3', text: 'Unusual speech: odd or flat intonation, non-speech-like sounds, or repeating set words and phrases (echolalia)' },
          { id: 's4', text: 'Refers to themselves by name or as ‘you’ beyond age 3, or uses single words although able to speak in sentences' },
          { id: 's5', text: 'Little or delayed response to their name being called, even though hearing is normal' },
          { id: 's6', text: 'Little response to other people’s facial expressions or feelings' },
          { id: 's7', text: 'Unusually negative response to being asked to do things (demand avoidance)' },
          { id: 's8', text: 'Rejects cuddles from a parent or carer, although may start cuddles themselves' },
          { id: 's9', text: 'Little awareness of personal space, or very intolerant of people coming into their space' },
          { id: 's10', text: 'Little social interest in others, including children of their own age (may reject them, or approach in a way that seems aggressive or disruptive)' },
          { id: 's11', text: 'Little copying of other people’s actions; rarely starts social play; plays alone' },
          { id: 's12', text: 'Little enjoyment of situations most children like, such as birthday parties; rarely shares enjoyment' },
          { id: 's13', text: 'Few gestures or facial expressions used to communicate (though may place an adult’s hand on objects)' },
          { id: 's14', text: 'Little social use of eye contact (assuming their eyesight is fine)' },
          { id: 's15', text: 'Little joint attention: doesn’t follow a point, point to show things, or look between an object and a person to share interest' },
          { id: 's16', text: 'Little or limited pretend play, or pretend play that lacks variety' }
        ] },
        { id: 'rrb', title: 'Unusual or restricted interests and rigid, repetitive behaviour', items: [
          { id: 'r1', text: 'Repetitive movements such as hand flapping, body rocking, spinning, or finger flicking' },
          { id: 'r2', text: 'Repetitive or stereotyped play, such as opening and closing doors or lining things up' },
          { id: 'r3', text: 'Over-focused or unusual interests' },
          { id: 'r4', text: 'Insists on following their own agenda' },
          { id: 'r5', text: 'Extreme emotional reactions, out of proportion to the situation' },
          { id: 'r6', text: 'Strong preference for familiar routines and things being ‘just right’' },
          { id: 'r7', text: 'Dislike of change, which often leads to anxiety or distress (including aggression)' },
          { id: 'r8', text: 'Over- or under-reaction to sensory input such as textures, sounds or smells' },
          { id: 'r9', text: 'Extreme reaction to the taste, smell, texture or appearance of food, or extreme food fads' }
        ] }
      ]
    },
    primary: {
      title: 'Signs NICE lists for primary-school-age children',
      intro: 'NICE CG128 gives teachers, GPs and other professionals a list of signs that should prompt a conversation about referral. No single sign means autism, and NICE does not set a number, but several together are a good reason to ask for an assessment. Tick anything you recognise in your child.',
      rule: 'count',
      groups: [
        { id: 'social', title: 'Social interaction and communication', items: [
          { id: 's1', text: 'Unusual speech: very limited, monotonous, repetitive or full of stock phrases; echoes others; refers to themselves as ‘you’; unusual vocabulary for their age' },
          { id: 's2', text: 'Uses language mainly to talk about their own topics of interest, rather than to chat' },
          { id: 's3', text: 'Little response to other people’s facial expressions or feelings' },
          { id: 's4', text: 'Little or delayed response to their name being called, even though hearing is normal' },
          { id: 's5', text: 'Takes things literally and misunderstands sarcasm, jokes or figures of speech; struggles to work out what people intend' },
          { id: 's6', text: 'Unusually negative response to being asked to do things (demand avoidance)' },
          { id: 's7', text: 'Little awareness of personal space, or very intolerant of people entering theirs' },
          { id: 's8', text: 'Little social interest in people, including children of their own age (may reject them, or approach in a way that seems aggressive or disruptive)' },
          { id: 's9', text: 'Rarely greets people or says goodbye; little awareness of what is socially expected' },
          { id: 's10', text: 'Rarely joins in with other children’s play or ideas; plays alone' },
          { id: 's11', text: 'Can’t adapt how they talk to the situation, for example overly formal or too familiar' },
          { id: 's12', text: 'Little enjoyment of situations most children like' },
          { id: 's13', text: 'Few gestures or facial expressions used to communicate; little social use of eye contact; little joint attention' },
          { id: 's14', text: 'Little flexible imaginative play, although scenes from TV or games may be re-enacted' },
          { id: 's15', text: 'Makes comments without awareness of social niceties or who they are talking to' }
        ] },
        { id: 'rrb', title: 'Unusual or restricted interests and rigid, repetitive behaviour', items: [
          { id: 'r1', text: 'Repetitive movements such as hand flapping, body rocking, spinning, or finger flicking' },
          { id: 'r2', text: 'Play that is repetitive and about objects rather than people' },
          { id: 'r3', text: 'Over-focused or unusual interests' },
          { id: 'r4', text: 'Rigid expectation that other children should stick to their rules of play' },
          { id: 'r5', text: 'Insists on following their own agenda' },
          { id: 'r6', text: 'Extreme emotional reactions, out of proportion to the situation' },
          { id: 'r7', text: 'Strong preference for familiar routines and things being ‘just right’' },
          { id: 'r8', text: 'Dislike of change, which often leads to anxiety or distress (including aggression)' },
          { id: 'r9', text: 'Over- or under-reaction to sensory input such as textures, sounds or smells' },
          { id: 'r10', text: 'Extreme reaction to the taste, smell, texture or appearance of food, or extreme food fads' }
        ] },
        { id: 'other', title: 'Other things NICE says can support a concern', items: [
          { id: 'o1', text: 'An uneven profile: for example social or coordination skills well behind, while reading, vocabulary or a particular area of knowledge is well ahead' },
          { id: 'o2', text: 'Social and emotional development that is much younger than other areas; very trusting, lacking ‘common sense’, or less independent than other children the same age' }
        ] }
      ]
    },
    secondary: {
      title: 'Signs NICE lists for secondary-school-age young people',
      intro: 'NICE CG128 gives teachers, GPs and other professionals a list of signs that should prompt a conversation about referral. No single sign means autism, and NICE does not set a number, but several together are a good reason to ask for an assessment. Tick anything you recognise.',
      rule: 'count',
      groups: [
        { id: 'social', title: 'Social interaction and communication', items: [
          { id: 's1', text: 'Unusual speech: monotonous, over-formal, repetitive, or full of stock phrases; unusual vocabulary' },
          { id: 's2', text: 'Talks mainly about their own interests; struggles with ordinary back-and-forth conversation' },
          { id: 's3', text: 'Little response to other people’s feelings, or responds in an unexpected way' },
          { id: 's4', text: 'Takes things literally; misunderstands sarcasm, humour, metaphor or hints' },
          { id: 's5', text: 'Unusually negative response to being asked to do things (demand avoidance)' },
          { id: 's6', text: 'Little awareness of personal space, or very intolerant of people entering theirs' },
          { id: 's7', text: 'Little interest in other people of their own age; may reject them, or approach them in ways that seem odd, intrusive or aggressive' },
          { id: 's8', text: 'Doesn’t seem to understand friendship; tries to make friends but is often unsuccessful; may be a target for bullying' },
          { id: 's9', text: 'Little awareness of what is socially expected; comments without regard to social niceties or hierarchy' },
          { id: 's10', text: 'Can’t adapt how they talk or behave to the situation, for example overly formal, or too familiar with strangers' },
          { id: 's11', text: 'Struggles with group work, teams and turn-taking; problems with losing, or with rules changing' },
          { id: 's12', text: 'Few gestures or facial expressions; little social use of eye contact' },
          { id: 's13', text: 'Little flexible imagination; creative work tends to be factual or copied' }
        ] },
        { id: 'rrb', title: 'Unusual or restricted interests and rigid, repetitive behaviour', items: [
          { id: 'r1', text: 'Repetitive movements such as hand flapping, rocking, spinning, or finger flicking, particularly when excited or stressed' },
          { id: 'r2', text: 'Over-focused or unusual interests that take up most of their time or conversation' },
          { id: 'r3', text: 'Rigid expectation that others should follow their rules' },
          { id: 'r4', text: 'Insists on following their own agenda' },
          { id: 'r5', text: 'Extreme emotional reactions, out of proportion to the situation' },
          { id: 'r6', text: 'Strong preference for familiar routines and things being ‘just right’' },
          { id: 'r7', text: 'Dislike of change, which often leads to anxiety or distress (including aggression)' },
          { id: 'r8', text: 'Over- or under-reaction to sensory input such as textures, sounds or smells' },
          { id: 'r9', text: 'Extreme reaction to the taste, smell, texture or appearance of food, or a very limited diet' }
        ] },
        { id: 'other', title: 'Other things NICE says can support a concern', items: [
          { id: 'o1', text: 'An uneven profile: for example social or coordination skills well behind, while a particular area of knowledge or skill is well ahead' },
          { id: 'o2', text: 'Social and emotional maturity well below their age; very trusting, lacking ‘common sense’, or much less independent than others their age' },
          { id: 'o3', text: 'Increasing difficulty as social demands rise: anxiety, school refusal, exhaustion after school, or difficulties that appeared with the move to secondary school' }
        ] }
      ]
    }
  },

  /* ---------- scales used by the structured history ---------- */
  scales: {
    rating: { options: ['Not at all', 'A little', 'Quite a lot', 'Very much'], values: [0, 1, 2, 3] },
    yesno: { options: ['Yes', 'No', 'Not sure'], values: ['yes', 'no', 'unsure'] }
  },

  /* ---------- structured history: what a UK assessment team works through ---------- */
  history: {
    adult: [
      { id: 'A1', domain: 'A', title: 'Social and emotional back-and-forth', stage: 'Social communication and interaction',
        intro: 'Assessment teams look at the give-and-take of everyday interaction. Think about how you are most of the time, not just on a bad day.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'I find it hard to start conversations, or to keep them going once they have started.' },
          { id: 'i2', text: 'Small talk feels pointless, or I don’t know how to do it.' },
          { id: 'i3', text: 'People say I talk too much about my own interests, or I only notice afterwards that they had lost interest.' },
          { id: 'i4', text: 'I don’t naturally share my news, feelings or interests with other people.' },
          { id: 'i5', text: 'When someone is upset I often don’t know what to say or do, even though I care.' },
          { id: 'i6', text: 'I find it hard to know when it’s my turn to speak, so I interrupt or stay quiet too long.' }
        ] }] },
      { id: 'A2', domain: 'A', title: 'Eye contact, expressions and unspoken meaning', stage: 'Social communication and interaction',
        intro: 'This covers the non-verbal side of communication: eye contact, facial expression, tone of voice, gesture, and reading what is implied.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'Eye contact feels uncomfortable, or I have to think about how much of it to do.' },
          { id: 'i2', text: 'I find it hard to read facial expressions, tone of voice or body language.' },
          { id: 'i3', text: 'People say my face or voice doesn’t show what I’m feeling, or that I seem ‘flat’ or ‘intense’.' },
          { id: 'i4', text: 'I take things literally and miss hints, sarcasm or things that are only implied.' },
          { id: 'i5', text: 'I use few gestures when I talk, or my gestures feel awkward or rehearsed.' },
          { id: 'i6', text: 'I can’t tell how someone feels about me unless they say it directly.' }
        ] }] },
      { id: 'A3', domain: 'A', title: 'Friendships and relationships', stage: 'Social communication and interaction',
        intro: 'The third area is developing, keeping and understanding relationships, and adjusting to different social situations.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'I find it hard to make friends, or friendships fade because I don’t know how to keep them going.' },
          { id: 'i2', text: 'I’m unsure what makes someone a friend rather than an acquaintance.' },
          { id: 'i3', text: 'I struggle to change how I behave to suit the situation, for example an interview compared with a night out.' },
          { id: 'i4', text: 'Groups (parties, meetings, team settings) confuse or exhaust me, so I avoid them or stick to one person.' },
          { id: 'i5', text: 'People have called me rude, blunt, odd or ‘in my own world’ without my understanding why.' },
          { id: 'i6', text: 'I have little interest in socialising, or I want friends but don’t know how to get or keep them.' }
        ] }] },
      { id: 'B1', domain: 'B', title: 'Repetitive movements, speech and use of objects', stage: 'Restricted and repetitive behaviour',
        intro: 'The second half of the criteria covers repetitive behaviour, routines, intense interests and the senses. Teams need at least two of these four areas.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'I make repetitive movements (rocking, flapping, pacing, tapping, fiddling), especially when excited, stressed or concentrating.' },
          { id: 'i2', text: 'I repeat words, phrases or sounds, or echo lines from films, TV or other people.' },
          { id: 'i3', text: 'I like to line up, sort, arrange or handle objects in particular ways.' },
          { id: 'i4', text: 'My speech is unusually formal, precise or scripted, or I use invented words or phrases.' }
        ] }] },
      { id: 'B2', domain: 'B', title: 'Routines, sameness and change', stage: 'Restricted and repetitive behaviour',
        intro: 'Insistence on sameness: how you cope with change, transitions and things not being done the expected way.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'Small changes to plans, routines or my surroundings upset me far more than they seem to upset others.' },
          { id: 'i2', text: 'I need to do things in a set order or a particular way, and it’s distressing if this is disrupted.' },
          { id: 'i3', text: 'I eat the same foods, take the same routes or wear the same clothes far more than most people.' },
          { id: 'i4', text: 'Big transitions (a new job, moving house, changes at school or university) have been extremely hard for me.' },
          { id: 'i5', text: 'I think in fixed, black-and-white ways, with strong rules about how things should be.' },
          { id: 'i6', text: 'I ask the same questions again and again, or need to know exactly what will happen in advance.' }
        ] }] },
      { id: 'B3', domain: 'B', title: 'Intense or unusual interests', stage: 'Restricted and repetitive behaviour',
        intro: 'Interests that are unusual in how intense or how narrow they are. Having a hobby is not what is meant here; it is the intensity and the difficulty switching off.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'I have one or more interests that take up most of my thinking time.' },
          { id: 'i2', text: 'My interests are unusually intense, or unusual in their focus (for example collecting facts, systems, timetables, or particular objects).' },
          { id: 'i3', text: 'I find it hard to stop thinking or talking about my interests, even when others have lost interest.' },
          { id: 'i4', text: 'I become very attached to particular objects.' },
          { id: 'i5', text: 'Things outside my interests are hard to make myself do.' }
        ] }] },
      { id: 'B4', domain: 'B', title: 'The senses', stage: 'Restricted and repetitive behaviour',
        intro: 'Over- or under-reaction to sound, touch, light, smell, taste, pain or movement, or seeking out sensations.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'Some everyday sounds (chewing, hand dryers, sudden noises, background hum) are unbearable or painful to me.' },
          { id: 'i2', text: 'Textures, clothing labels, bright light, smells or tastes bother me much more than they bother other people.' },
          { id: 'i3', text: 'I notice things others don’t, such as flickering lights, faint sounds or small changes in a room.' },
          { id: 'i4', text: 'I seek out sensory experiences (deep pressure, spinning, watching things move, touching textures, particular sounds).' },
          { id: 'i5', text: 'I don’t notice pain, hunger, cold or heat as much as other people seem to.' },
          { id: 'i6', text: 'Busy places (supermarkets, crowds, open-plan offices) overwhelm me, so I need to leave or I ‘shut down’.' }
        ] }] },
      { id: 'C', domain: 'C', title: 'Early development', stage: 'History',
        intro: 'Autism begins early in life, even if nobody noticed at the time. Assessment teams will ask about childhood and, where possible, talk to a parent or someone who knew you then. Answer as best you can.',
        parts: [{ id: 'main', type: 'yesno', prompt: 'Thinking back to childhood:', items: [
          { id: 'i1', text: 'As far as I can tell, these traits have always been there, rather than starting at a particular point in my life.' },
          { id: 'i2', text: 'As a child I was described as shy, a loner, ‘in my own world’, old-fashioned, or unusual.' },
          { id: 'i3', text: 'My speech was delayed, unusually early or formal, or I stopped talking for a period.' },
          { id: 'i4', text: 'I had intense interests, collections or rituals as a child.' },
          { id: 'i5', text: 'I found the social side of school hard, even if I managed the work (or I struggled with both).' },
          { id: 'i6', text: 'Things got noticeably harder when demands increased: secondary school, college, work, living independently, or becoming a parent.' },
          { id: 'i7', text: 'Someone who knew me as a child (a parent, older relative or family friend) could talk to an assessment team.' }
        ] }] },
      { id: 'D', domain: 'D', title: 'Impact on daily life', stage: 'History',
        intro: 'A diagnosis also depends on the difficulties having a real effect on life. This section helps the team, and you, see where the impact falls.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How much do these difficulties affect each area?', items: [
          { id: 'i1', text: 'Education or work (leaving courses, losing jobs, working below my ability, needing a lot of support)' },
          { id: 'i2', text: 'Friendships and relationships' },
          { id: 'i3', text: 'Everyday living (self-care, money, appointments, housework, sleep)' },
          { id: 'i4', text: 'Mental health (anxiety, low mood, burnout, meltdowns or shutdowns)' },
          { id: 'i5', text: 'Family life, or my role as a partner or parent' }
        ] }] },
      { id: 'M', domain: 'M', title: 'Masking and camouflaging', stage: 'History',
        intro: 'Many autistic people, particularly women and girls, learn to hide their traits. This can keep questionnaire scores low even when the difficulties are real, so assessment teams ask about it directly.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
          { id: 'i1', text: 'I copy other people’s phrases, gestures or mannerisms to fit in.' },
          { id: 'i2', text: 'I rehearse conversations or prepare scripts before social situations.' },
          { id: 'i3', text: 'I force myself to make eye contact or smile because I know I’m supposed to.' },
          { id: 'i4', text: 'Socialising leaves me exhausted, and I need a long time alone to recover.' },
          { id: 'i5', text: 'People who know me well see a very different person from the one everyone else sees.' },
          { id: 'i6', text: 'I learned the rules of social behaviour by watching and working them out, rather than picking them up naturally.' }
        ] }] },
      { id: 'O', domain: 'O', title: 'Other conditions, and how you are right now', stage: 'History',
        intro: 'An assessment team checks for conditions that can look like autism or occur alongside it. They will also ask how you are coping. Neither rules autism in or out; both shape the right support.',
        parts: [
          { id: 'cond', type: 'check', prompt: 'Tick anything that has been diagnosed, or that you suspect:', items: [
            { id: 'adhd', text: 'ADHD' },
            { id: 'anx', text: 'Anxiety, including social anxiety' },
            { id: 'dep', text: 'Depression' },
            { id: 'ocd', text: 'OCD (obsessive-compulsive disorder)' },
            { id: 'ld', text: 'A learning disability, or big difficulties with learning at school' },
            { id: 'spld', text: 'Dyslexia, dyspraxia (DCD) or dyscalculia' },
            { id: 'lang', text: 'A speech, language or communication difficulty' },
            { id: 'epi', text: 'Epilepsy or seizures' },
            { id: 'sense', text: 'Hearing or eyesight problems' },
            { id: 'tics', text: 'Tics or Tourette’s' },
            { id: 'eat', text: 'Eating difficulties or an eating disorder' },
            { id: 'sleep', text: 'Sleep problems' },
            { id: 'trauma', text: 'Trauma or very difficult experiences, in childhood or since' },
            { id: 'mh', text: 'A mental health diagnosis such as bipolar disorder, psychosis or a personality disorder' },
            { id: 'subst', text: 'Problems with alcohol or drugs' },
            { id: 'fam', text: 'A close relative who is autistic or has ADHD' },
            { id: 'cond_none', text: 'None of these', exclusive: true }
          ] },
          { id: 'well', type: 'single', prompt: 'Over the last two weeks, have you had thoughts that you would be better off dead, or of hurting yourself in some way?', risk: true, items: [
            { id: 'w1', text: 'Thoughts of being better off dead, or of hurting yourself', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], flagIf: [1, 2, 3] }
          ] }
        ] }
    ],

    child: [
      { id: 'A1', domain: 'A', title: 'Social and emotional back-and-forth', stage: 'Social communication and interaction',
        intro: 'Assessment teams look at the give-and-take of everyday interaction. Think about how your child is most of the time, at home and elsewhere.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child finds it hard to start or keep a conversation going, or conversations are one-sided.' },
          { id: 'i2', text: 'My child talks at people about their own interests without noticing whether they are interested.' },
          { id: 'i3', text: 'My child rarely shares things spontaneously: showing me things, telling me about their day, or bringing things to look at.' },
          { id: 'i4', text: 'My child doesn’t respond much when other people show feelings, or responds in an unexpected way.' },
          { id: 'i5', text: 'My child struggles with the give-and-take of play or chat with other children (turn-taking, joining in, keeping a game going).' },
          { id: 'i6', text: 'My child finds greetings, goodbyes and social ‘niceties’ hard, or forgets them.' }
        ] }] },
      { id: 'A2', domain: 'A', title: 'Eye contact, expressions and unspoken meaning', stage: 'Social communication and interaction',
        intro: 'This covers the non-verbal side of communication: eye contact, facial expression, tone of voice, gesture, and reading what is implied.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child’s eye contact is unusual: very little of it, or fixed and intense.' },
          { id: 'i2', text: 'My child uses few gestures or facial expressions, or their expressions don’t match the situation.' },
          { id: 'i3', text: 'My child finds it hard to read other people’s faces, tone of voice or body language.' },
          { id: 'i4', text: 'My child takes things literally and misses jokes, sarcasm or hints.' },
          { id: 'i5', text: 'My child’s tone of voice is unusual: flat, sing-song, very loud, or formal.' },
          { id: 'i6', text: 'My child doesn’t point to show me things, or doesn’t look when I point.' }
        ] }] },
      { id: 'A3', domain: 'A', title: 'Friendships and play with others', stage: 'Social communication and interaction',
        intro: 'The third area is developing, keeping and understanding relationships, and adjusting to different social situations.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child finds it hard to make friends, or friendships don’t last.' },
          { id: 'i2', text: 'My child prefers to play alone, or plays alongside other children rather than with them.' },
          { id: 'i3', text: 'My child behaves the same way with everyone (teachers, strangers, friends) rather than adjusting to the situation.' },
          { id: 'i4', text: 'My child struggles with imaginative play with others, or their play is repetitive or scripted from TV or games.' },
          { id: 'i5', text: 'Other children find my child odd, or my child has been bullied or left out.' },
          { id: 'i6', text: 'My child seems to have little interest in other children, or wants friends but doesn’t know how to make them.' }
        ] }] },
      { id: 'B1', domain: 'B', title: 'Repetitive movements, speech and play', stage: 'Restricted and repetitive behaviour',
        intro: 'The second half of the criteria covers repetitive behaviour, routines, intense interests and the senses. Teams need at least two of these four areas.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child makes repetitive movements (hand flapping, rocking, spinning, jumping, finger flicking, pacing).' },
          { id: 'i2', text: 'My child repeats words or phrases, echoes what others say, or quotes scripts from TV or games.' },
          { id: 'i3', text: 'My child lines up, sorts, spins or arranges toys or objects rather than playing with them in the usual way.' },
          { id: 'i4', text: 'My child uses unusual words, an unusually formal way of speaking, or invented words.' }
        ] }] },
      { id: 'B2', domain: 'B', title: 'Routines, sameness and change', stage: 'Restricted and repetitive behaviour',
        intro: 'Insistence on sameness: how your child copes with change, transitions and things not being done the expected way.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child gets very upset by small changes: a different route, a change of plan, furniture moved, a supply teacher.' },
          { id: 'i2', text: 'My child needs things done in a set order or a particular way and is distressed if this is disrupted.' },
          { id: 'i3', text: 'My child eats a very limited range of foods, or insists on the same clothes, plates or routines.' },
          { id: 'i4', text: 'Transitions (moving between activities, ending screen time, starting school or a new class) are very hard.' },
          { id: 'i5', text: 'My child asks the same questions repeatedly, or needs to know exactly what will happen.' },
          { id: 'i6', text: 'My child insists that others follow their rules in games, and can’t cope with losing or rules changing.' }
        ] }] },
      { id: 'B3', domain: 'B', title: 'Intense or unusual interests', stage: 'Restricted and repetitive behaviour',
        intro: 'Interests that are unusual in how intense or how narrow they are. Liking dinosaurs is not what is meant here; it is the intensity and the difficulty moving on.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child has an unusually intense interest that dominates their play, talk or thinking.' },
          { id: 'i2', text: 'My child’s interests are unusual for their age (for example washing machines, timetables, logos, numbers, or a particular object).' },
          { id: 'i3', text: 'My child finds it hard to move on from their interest, even when others have lost interest.' },
          { id: 'i4', text: 'My child is very attached to a particular object and distressed without it.' },
          { id: 'i5', text: 'My child’s play is narrow and repetitive rather than varied.' }
        ] }] },
      { id: 'B4', domain: 'B', title: 'The senses', stage: 'Restricted and repetitive behaviour',
        intro: 'Over- or under-reaction to sound, touch, light, smell, taste, pain or movement, or seeking out sensations.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child covers their ears or is distressed by everyday sounds (hand dryers, hoovers, sudden noises, singing).' },
          { id: 'i2', text: 'My child is very bothered by textures, labels or seams, or by having their hair cut or washed, teeth cleaned, or nails cut.' },
          { id: 'i3', text: 'My child is fussy about the taste, smell, texture or look of food, far beyond ordinary fussiness.' },
          { id: 'i4', text: 'My child seeks sensations: spinning, watching things move, smelling or touching things, deep pressure, crashing into things.' },
          { id: 'i5', text: 'My child doesn’t seem to notice pain, cold, heat or hunger as others do.' },
          { id: 'i6', text: 'My child gets overwhelmed in busy places (shops, parties, assemblies) and melts down or shuts down.' }
        ] }] },
      { id: 'C', domain: 'C', title: 'Early development', stage: 'History',
        intro: 'Autism begins early in life. The team will take a detailed developmental history, so it helps to look back at the first three years now. Your child’s red book and any early photos or videos can jog your memory.',
        parts: [
          { id: 'main', type: 'yesno', prompt: 'Thinking back to the early years:', items: [
            { id: 'i1', text: 'First words came later than expected (around 2 years or later), or first short phrases came after age 3.' },
            { id: 'i2', text: 'My child lost words or skills they had already gained, at any age (regression).' },
            { id: 'i3', text: 'As a toddler, my child didn’t respond consistently to their name, even though hearing was normal.' },
            { id: 'i4', text: 'As a toddler, my child rarely pointed to show me things or to share interest.' },
            { id: 'i5', text: 'As a toddler, my child showed little pretend play (feeding a doll, pretend phone calls, toy tea parties).' },
            { id: 'i6', text: 'Concerns about social or communication development were raised early on, by a health visitor, nursery or family.' },
            { id: 'i7', text: 'Nursery or school have raised concerns about social or communication skills.' }
          ] },
          { id: 'hear', type: 'single', prompt: 'Hearing:', items: [
            { id: 'h1', text: 'Has your child’s hearing been tested?', options: ['Yes, and it was normal', 'Yes, and concerns were found', 'Not tested, or not sure'] }
          ] }
        ] },
      { id: 'D', domain: 'D', title: 'Impact on daily life', stage: 'History',
        intro: 'A diagnosis also depends on the difficulties having a real effect on life. This section helps the team, and you, see where the impact falls.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How much do these difficulties affect each area?', items: [
          { id: 'i1', text: 'Learning and school (progress, attendance, needing support, exclusions)' },
          { id: 'i2', text: 'Friendships' },
          { id: 'i3', text: 'Family life at home (mealtimes, bedtimes, outings, brothers and sisters)' },
          { id: 'i4', text: 'My child’s emotional wellbeing (anxiety, meltdowns, low mood)' },
          { id: 'i5', text: 'Everyday tasks for their age (dressing, toileting, eating, sleeping)' }
        ] }] },
      { id: 'M', domain: 'M', title: 'Holding it together, and masking', stage: 'History',
        intro: 'Many autistic children, particularly girls, hide their difficulties at school and let go at home. Teachers may see no problem while home is a struggle. Assessment teams ask about this directly, because it changes how the evidence is read.',
        parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for your child?', items: [
          { id: 'i1', text: 'My child holds it together at school or nursery and then melts down or shuts down at home.' },
          { id: 'i2', text: 'My child copies phrases, accents or mannerisms from other children or TV to fit in.' },
          { id: 'i3', text: 'My child is very different with family from how they are with other people.' },
          { id: 'i4', text: 'My child comes home exhausted and needs a long time alone to recover.' },
          { id: 'i5', text: 'Teachers say they see no problems, but home tells a different story.' }
        ] }] },
      { id: 'O', domain: 'O', title: 'Other conditions, support so far, and how you are coping', stage: 'History',
        intro: 'An assessment team checks for conditions that can look like autism or occur alongside it, and asks who is already involved. They will also want to know how the family is coping.',
        parts: [
          { id: 'cond', type: 'check', prompt: 'Tick anything that has been diagnosed, or that you suspect:', items: [
            { id: 'adhd', text: 'ADHD' },
            { id: 'anx', text: 'Anxiety' },
            { id: 'dep', text: 'Low mood or depression' },
            { id: 'ld', text: 'A learning disability or global developmental delay' },
            { id: 'spld', text: 'Dyslexia, dyspraxia (DCD) or another specific learning difficulty' },
            { id: 'lang', text: 'Speech, language or communication needs' },
            { id: 'mute', text: 'Selective mutism' },
            { id: 'epi', text: 'Epilepsy or seizures' },
            { id: 'sense', text: 'Hearing or eyesight problems' },
            { id: 'tics', text: 'Tics or Tourette’s' },
            { id: 'eat', text: 'Eating difficulties' },
            { id: 'sleep', text: 'Sleep problems' },
            { id: 'trauma', text: 'Difficult early experiences (trauma, neglect, several changes of carer)' },
            { id: 'birth', text: 'Premature birth, or complications around birth' },
            { id: 'fam', text: 'A close relative who is autistic or has ADHD' },
            { id: 'cond_none', text: 'None of these', exclusive: true }
          ] },
          { id: 'support', type: 'check', prompt: 'Who is already involved?', items: [
            { id: 'hv', text: 'Health visitor' },
            { id: 'gp', text: 'GP' },
            { id: 'salt', text: 'Speech and language therapist' },
            { id: 'paed', text: 'Paediatrician' },
            { id: 'camhs', text: 'CAMHS (child and adolescent mental health service)' },
            { id: 'ep', text: 'Educational psychologist' },
            { id: 'senco', text: 'School SEN support (SENCo, support plan)' },
            { id: 'plan', text: 'A formal plan: EHCP (England), IDP (Wales), CSP (Scotland) or Statement (Northern Ireland)' },
            { id: 'sw', text: 'Social worker or early help' },
            { id: 'sup_none', text: 'Nobody yet', exclusive: true }
          ] },
          { id: 'well', type: 'single', prompt: 'How are things at home right now?', risk: true, items: [
            { id: 'w1', text: 'Is anyone in the family struggling to cope, or is anyone at risk of harm?', options: ['No, we are managing', 'Yes, we need support', 'Not sure'], flagIf: [1, 2] }
          ] }
        ] }
    ],

    toddler: [
      { id: 'DEV', domain: 'T', title: 'How your child communicates and plays', stage: 'Development',
        intro: 'At this age an assessment team focuses on social communication: responding to their name, pointing, sharing interest, copying, pretend play and gestures. Tick what you see most of the time.',
        parts: [{ id: 'main', type: 'yesno', prompt: 'Is this true of your child?', items: [
          { id: 'i1', text: 'My child often doesn’t respond to their name, even though their hearing seems fine.' },
          { id: 'i2', text: 'My child rarely points to ask for things.' },
          { id: 'i3', text: 'My child rarely points at, brings or shows me things just to share them.' },
          { id: 'i4', text: 'My child doesn’t look where I’m pointing or looking.' },
          { id: 'i5', text: 'My child shows little pretend play (feeding a doll, toy phone, cars ‘driving’).' },
          { id: 'i6', text: 'My child rarely copies what I do (waving, clapping, actions to songs).' },
          { id: 'i7', text: 'My child’s babble or words came late, or they have lost words they used to say.' },
          { id: 'i8', text: 'My child uses few gestures (waving, nodding, reaching up to be picked up).' },
          { id: 'i9', text: 'My child’s eye contact is brief, fleeting or hard to get.' },
          { id: 'i10', text: 'My child doesn’t seem to enjoy games like peekaboo or being chased.' },
          { id: 'i11', text: 'My child’s play is repetitive (lining up, spinning wheels, opening and closing doors) rather than varied.' },
          { id: 'i12', text: 'My child is very upset by change, or by things being ‘wrong’.' },
          { id: 'i13', text: 'My child is unusually sensitive to sounds, textures or foods, or seeks out sensations (spinning, looking at things from the corner of the eye).' },
          { id: 'i14', text: 'My child makes repetitive movements (flapping, rocking, toe-walking, finger flicking).' }
        ] }] },
      { id: 'C', domain: 'C', title: 'Milestones', stage: 'Development',
        intro: 'The team will ask when things happened. The red book helps. Loss of skills at any age is something to mention to a GP promptly, whatever else is going on.',
        parts: [{ id: 'main', type: 'single', prompt: 'Roughly when did these happen?', items: [
          { id: 'words', text: 'First clear words', options: ['Before 12 months', '12 to 18 months', '18 to 24 months', 'After 2 years', 'Not yet'], flagIf: [3, 4] },
          { id: 'walk', text: 'Walking on their own', options: ['Before 12 months', '12 to 18 months', 'After 18 months', 'Not yet'], flagIf: [2, 3] },
          { id: 'hear', text: 'Hearing test', options: ['Done, and normal', 'Done, concerns found', 'Not tested, or not sure'], flagIf: [1, 2] },
          { id: 'loss', text: 'Lost words or skills they used to have', options: ['No', 'Yes', 'Not sure'], flagIf: [1] }
        ] }] },
      { id: 'O', domain: 'O', title: 'Concerns so far, other conditions, and how you are coping', stage: 'Development',
        intro: 'Who has noticed, what else is going on, and how the family is doing. These shape the right next step.',
        parts: [
          { id: 'raised', type: 'check', prompt: 'Who has raised concerns so far?', items: [
            { id: 'me', text: 'Me or my family' },
            { id: 'hv', text: 'Health visitor' },
            { id: 'nursery', text: 'Nursery or childminder' },
            { id: 'gp', text: 'GP' },
            { id: 'salt', text: 'Speech and language therapist' },
            { id: 'raised_none', text: 'Nobody yet', exclusive: true }
          ] },
          { id: 'cond', type: 'check', prompt: 'Tick anything that applies:', items: [
            { id: 'prem', text: 'Born early (before 37 weeks)' },
            { id: 'birth', text: 'Complications in pregnancy or at birth' },
            { id: 'gdd', text: 'Global developmental delay, or a known genetic condition' },
            { id: 'epi', text: 'Epilepsy or seizures' },
            { id: 'sense', text: 'Hearing or eyesight problems' },
            { id: 'feed', text: 'Feeding problems' },
            { id: 'sleep', text: 'Sleep problems' },
            { id: 'fam', text: 'A close relative who is autistic or has ADHD' },
            { id: 'cond_none', text: 'None of these', exclusive: true }
          ] },
          { id: 'well', type: 'single', prompt: 'How are things at home right now?', risk: true, items: [
            { id: 'w1', text: 'Is anyone in the family struggling to cope, or is anyone at risk of harm?', options: ['No, we are managing', 'Yes, we need support', 'Not sure'], flagIf: [1, 2] }
          ] }
        ] }
    ]
  },

  /* ---------- the UK pathway, as shown on the home page and the results page ---------- */
  pathway: [
    { title: 'Someone notices', text: 'You, family, nursery or school, a health visitor, a GP or another professional recognises signs. NICE lists the signs that should prompt action; Signpost walks through them.' },
    { title: 'GP or health visitor', text: 'They listen, look for the NICE signs and, for adults, may use the AQ-10. They decide about referral. Some areas let schools refer children, or accept self-referral; ask what the local route is.' },
    { title: 'Referral to the assessment team', text: 'Adults go to a specialist adult autism service. Children go to community paediatrics, CAMHS or a neurodevelopmental team. NICE says the assessment should start within three months of referral; in most areas the wait is much longer.' },
    { title: 'Information gathering', text: 'Questionnaires, reports from school, nursery or work, and a developmental history from a parent or someone who knew the person as a child, where that is possible.' },
    { title: 'The assessment', text: 'Usually two or more appointments with a team (for example a paediatrician or psychiatrist, a psychologist, and a speech and language therapist). A detailed interview about early development and current life (tools such as ADI-R, DISCO or 3Di), a structured observation (usually ADOS-2), and a careful look at other explanations and co-occurring conditions. Children also have a physical examination.' },
    { title: 'Decision', text: 'The team weighs everything against the ICD-11 or DSM-5 criteria. They may conclude autism, not autism, or that it is not yet clear, and explain why.' },
    { title: 'Report and support', text: 'A written report with a profile of strengths and needs, and signposting: post-diagnostic sessions, adjustments at work or school under the Equality Act, Access to Work, SEN support or an EHCP for children, and organisations such as the National Autistic Society.' }
  ],

  nationNotes: {
    england: {
      title: 'In England',
      points: [
        'NICE guidance applies. Referral is usually through your GP; for children, a school, health visitor or paediatrician can often refer too, and some areas accept self-referral.',
        'The NICE quality standard says the assessment should start within three months of referral. Most services are well outside this, so ask the service for its current wait when you are referred.',
        'Right to Choose: when your GP refers you, you can ask for an NHS-funded provider of your choice that holds an NHS contract, which can shorten the wait. Its availability for autism assessments has been under review, so check the current position with your GP.',
        'Support does not have to wait for a diagnosis: reasonable adjustments under the Equality Act 2010, Access to Work, and SEN support or an EHCP for children are all based on need.'
      ]
    },
    wales: {
      title: 'In Wales',
      points: [
        'NICE guidance applies. Adults are usually referred by their GP to the regional Integrated Autism Service; children go to the local neurodevelopmental team, often via the GP, school or health visitor.',
        'The Welsh Government’s Code of Practice on the Delivery of Autism Services (2021) sets out what health boards and councils must provide, including support that does not depend on a diagnosis.',
        'Children with additional learning needs can have an Individual Development Plan (IDP) through school or the local authority.',
        'Right to Choose does not apply in Wales.'
      ]
    },
    scotland: {
      title: 'In Scotland',
      points: [
        'For children and young people, SIGN 145 and the National Neurodevelopmental Specification (2021) set the standard. Referral is usually via the GP, health visitor or school to the community paediatric or CAMHS neurodevelopmental service.',
        'For adults, the GP refers to the health board’s adult autism assessment pathway. What is available varies by board, and national adult neurodevelopmental pathways are still being developed.',
        'Children with additional support needs can have a Co-ordinated Support Plan (CSP) or other support through school under the Additional Support for Learning framework.',
        'Right to Choose does not apply in Scotland.'
      ]
    },
    ni: {
      title: 'In Northern Ireland',
      points: [
        'The Autism Act (Northern Ireland) 2011 requires each Health and Social Care Trust to provide an autism service. Referral is through your GP, to the children’s or adult autism service.',
        'Waits are long in every Trust; ask for the current position when you are referred.',
        'Children can have a Statement of Special Educational Needs through the Education Authority.',
        'Right to Choose does not apply in Northern Ireland.'
      ]
    }
  },

  bring: {
    self: [
      'This summary, copied or printed.',
      'Concrete examples from daily life, recent ones and ones from childhood.',
      'Anyone who knew you as a child, or their written memories. Old school reports and any earlier assessments help too.',
      'A list of your diagnoses and medicines.',
      'What you hope a diagnosis would change: adjustments at work or in education, understanding, access to support.'
    ],
    parent: [
      'This summary, copied or printed.',
      'Your child’s red book, and any nursery or school reports, support plans, or reports from a speech and language therapist or educational psychologist.',
      'Short videos of the behaviours you are describing. Teams find these useful because children rarely show everything in the clinic.',
      'A note of milestones (first words, first phrases, walking) and any loss of skills.',
      'What you hope a diagnosis would change: support at school, understanding, access to services.'
    ]
  },

  support: {
    self: [
      { name: 'Samaritans', detail: 'Call 116 123, free, any time of day or night.' },
      { name: 'Shout', detail: 'Text SHOUT to 85258 for a free, confidential text conversation.' },
      { name: 'NHS urgent mental health help', detail: 'England: call 111 and choose the mental health option. Scotland: NHS 24 on 111. Wales: 111 and press 2. Northern Ireland: Lifeline on 0808 808 8000.' },
      { name: 'Emergency', detail: 'If you or someone else is in immediate danger, call 999.' }
    ],
    parent: [
      { name: 'Samaritans', detail: 'Call 116 123, free, any time of day or night.' },
      { name: 'YoungMinds Parents Helpline', detail: 'Call 0808 802 5544 on weekdays for advice about a child’s mental health.' },
      { name: 'NSPCC', detail: 'Call 0808 800 5000 if you are worried about a child’s safety.' },
      { name: 'NHS urgent help', detail: 'Call 111 (in Northern Ireland, Lifeline on 0808 808 8000). Your GP and health visitor can also help you get support quickly.' },
      { name: 'Emergency', detail: 'If anyone is in immediate danger, call 999.' }
    ]
  },

  organisations: [
    { name: 'National Autistic Society', detail: 'Information on diagnosis, rights and support across the UK', url: 'https://www.autism.org.uk' },
    { name: 'NHS: Autism', detail: 'The NHS pages on signs, getting diagnosed and what happens next', url: 'https://www.nhs.uk/conditions/autism/' },
    { name: 'Ambitious about Autism', detail: 'Support for autistic children and young people and their families', url: 'https://www.ambitiousaboutautism.org.uk' },
    { name: 'Scottish Autism', detail: 'Advice line and information for Scotland', url: 'https://www.scottishautism.org' },
    { name: 'Autism NI', detail: 'Support and the helpline for Northern Ireland', url: 'https://www.autismni.org' }
  ],

  references: [
    'NICE CG128. Autism spectrum disorder in under 19s: recognition, referral and diagnosis (2011, updated 2017).',
    'NICE CG142. Autism spectrum disorder in adults: diagnosis and management (2012, updated 2021).',
    'NICE QS51. Autism quality standard (2014, updated 2021).',
    'Allison C, Auyeung B, Baron-Cohen S. Toward brief “red flags” for autism screening: the Short Autism Spectrum Quotient and the Short Quantitative Checklist for Autism in Toddlers in 1,000 cases and 3,000 controls. J Am Acad Child Adolesc Psychiatry 2012;51(2):202-212.',
    'SIGN 145. Assessment, diagnosis and interventions for autism spectrum disorders (2016).',
    'World Health Organization. ICD-11, 6A02 Autism spectrum disorder. American Psychiatric Association. DSM-5-TR, 299.00.'
  ]
};
