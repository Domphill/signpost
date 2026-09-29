/* Signpost - the narcissism pathway. Loaded after data.js and merged into DATA.

   Two routes. "About me" uses the NPI-16 (Ames, Rose and Anderson, 2006; grandiose narcissism) and the Hypersensitive
   Narcissism Scale (Hendin and Cheek, 1997; vulnerable narcissism), both freely available trait measures with no clinical
   cut-off, alongside the ICD-11 general criteria for personality disorder that UK clinicians apply. "About someone else"
   deliberately does not try to diagnose the other person: it checks the behaviour pattern against the Home Office statutory
   guidance on controlling or coercive behaviour, which is what UK services and the law respond to. */

(() => {
  DATA.routes.push(
    { id: 'narc-self', condition: 'narcissism', label: 'About me (18 or over)', sub: 'Answered by the person themselves. Two trait scales, then the questions a UK personality assessment asks', respondent: 'self', screener: 'npi16', signs: 'pd-general', history: 'narc-self', ageText: 'adult (18 or over), about themselves', guideline: 'ICD-11' },
    { id: 'narc-other', condition: 'narcissism', label: 'About someone else', sub: 'A partner, ex, parent, relative or colleague. No questionnaire can diagnose them, so this checks the pattern of behaviour and its effect on you', respondent: 'self', bringKey: 'other', screener: null, signs: 'coercive', history: 'narc-other', ageText: 'someone else, described by the person on the receiving end', guideline: 'Home Office guidance' }
  );

  DATA.screeners.npi16 = {
    id: 'npi16', type: 'npi', title: 'NPI-16 (Narcissistic Personality Inventory, short form)', short: 'NPI-16',
    about: 'The NPI-16 measures grandiose narcissism as a trait on a continuum: everyone scores somewhere. It is the most used research measure, not a diagnostic test, and high scorers are often confident, outgoing people. Typical adult scores are around 4 to 6 out of 16.',
    instructions: 'For each pair, pick the statement that is closer to how you feel, even if neither fits perfectly.',
    items: [
      { id: 'q1', key: 0, options: ['I really like to be the centre of attention', 'It makes me uncomfortable to be the centre of attention'] },
      { id: 'q2', key: 1, options: ['I am no better or no worse than most people', 'I think I am a special person'] },
      { id: 'q3', key: 0, options: ['Everybody likes to hear my stories', 'Sometimes I tell good stories'] },
      { id: 'q4', key: 1, options: ['I usually get the respect that I deserve', 'I insist upon getting the respect that is due me'] },
      { id: 'q5', key: 1, options: ['I don’t mind following orders', 'I like having authority over people'] },
      { id: 'q6', key: 0, options: ['I am going to be a great person', 'I hope I am going to be successful'] },
      { id: 'q7', key: 1, options: ['People sometimes believe what I tell them', 'I can make anybody believe anything I want them to'] },
      { id: 'q8', key: 0, options: ['I expect a great deal from other people', 'I like to do things for other people'] },
      { id: 'q9', key: 0, options: ['I like to be the centre of attention', 'I prefer to blend in with the crowd'] },
      { id: 'q10', key: 1, options: ['I am much like everybody else', 'I am an extraordinary person'] },
      { id: 'q11', key: 0, options: ['I always know what I am doing', 'Sometimes I am not sure of what I am doing'] },
      { id: 'q12', key: 1, options: ['I don’t like it when I find myself manipulating people', 'I find it easy to manipulate people'] },
      { id: 'q13', key: 1, options: ['Being an authority doesn’t mean much to me', 'People always seem to recognise my authority'] },
      { id: 'q14', key: 0, options: ['I know that I am good because everybody keeps telling me so', 'When people compliment me I sometimes get embarrassed'] },
      { id: 'q15', key: 1, options: ['I try not to be a show off', 'I will usually show off if I get the chance'] },
      { id: 'q16', key: 0, options: ['I am more capable than other people', 'There is a lot that I can learn from other people'] }
    ]
  };

  DATA.signs['pd-general'] = {
    title: 'Does the pattern look like a personality disorder?',
    intro: 'In the UK (ICD-11), a personality disorder is not a list of narcissistic traits. It is a long-standing problem in how a person sees themselves and relates to others, showing up across situations and causing real harm. Narcissistic features are one of the shapes it can take. This is what a clinician checks first. Tick what applies to you.',
    rule: 'core-all',
    summaryLabel: 'ICD-11 general personality disorder criteria',
    groups: [
      { id: 'core', title: 'Problems in', items: [
        { id: 'c1', text: 'How I see myself: my sense of worth swings between superior and worthless, or depends on other people admiring me' },
        { id: 'c2', text: 'How I relate to others: I find it hard to feel what they feel, to keep close relationships going, or to see people as anything other than useful or in the way' }
      ] },
      { id: 'context', title: 'What a clinician needs to see (all three)', items: [
        { id: 'x1', text: 'It has been like this for years, since my teens or early twenties' },
        { id: 'x2', text: 'It shows up everywhere: work, family, friendships and romantic relationships, not just one of them' },
        { id: 'x3', text: 'It has cost me: relationships, jobs, friendships, or a lot of distress' }
      ] }
    ]
  };

  DATA.signs.coercive = {
    title: 'What does this person do?',
    intro: 'Whether someone “is a narcissist” cannot be settled by a questionnaire, and a label is not what services act on. What matters is the pattern of behaviour and its effect on you. This list follows the UK statutory guidance on controlling or coercive behaviour. Tick what happens, or has happened.',
    rule: 'count',
    meetsAt: 4,
    summaryLabel: 'Controlling or coercive behaviour indicators (Home Office guidance)',
    groups: [
      { id: 'control', title: 'Control', items: [
        { id: 'k1', text: 'Isolating you from friends or family, or making it so difficult to see them that you stop' },
        { id: 'k2', text: 'Monitoring you: your phone, messages, social media, where you are, who you talk to' },
        { id: 'k3', text: 'Controlling money, what you wear, what you eat, or where you can go' },
        { id: 'k4', text: 'Rules and punishments: silent treatment or sulking for days when you step out of line' },
        { id: 'k5', text: 'Threats: to leave, to hurt themselves, to hurt you, to take the children, to share private images, to tell people things about you' },
        { id: 'k6', text: 'Pressure or coercion around sex' }
      ] },
      { id: 'contempt', title: 'Contempt, and your grip on reality', items: [
        { id: 'k7', text: 'Repeatedly putting you down or humiliating you, in private or in front of others' },
        { id: 'k8', text: 'Denying things happened, twisting what was said, or telling you that you are mad or remembering wrong (gaslighting)' },
        { id: 'k9', text: 'Blaming you for their behaviour; apologies that never come, or that turn into your fault' },
        { id: 'k10', text: 'Charming and reasonable with everyone else, contemptuous with you' },
        { id: 'k11', text: 'Cycles of intense affection and attention followed by coldness or withdrawal' },
        { id: 'k12', text: 'Your needs are treated as unreasonable; theirs are always urgent' }
      ] },
      { id: 'fear', title: 'Fear', items: [
        { id: 'k13', text: 'Intimidation: shouting in your face, blocking doorways, damaging things, driving dangerously' },
        { id: 'k14', text: 'You change what you say and do to avoid their reaction' },
        { id: 'k15', text: 'You are afraid of them, at least some of the time' }
      ] }
    ]
  };

  DATA.history['narc-self'] = [
    { id: 'V', domain: 'V', title: 'The quieter kind (HSNS)', stage: 'Screening',
      intro: 'Narcissism has a second shape that the NPI misses: hypersensitive, easily wounded, self-absorbed in a shy rather than showy way. The Hypersensitive Narcissism Scale measures it. Typical adult scores are around 25 to 33 out of 50. It is a trait measure, not a diagnosis.',
      parts: [{ id: 'main', type: 'single', layout: 'n5', prompt: 'How characteristic of you is each statement?', items: [
        { id: 'h1', text: 'I can become entirely absorbed in thinking about my personal affairs, my health, my cares or my relations to others.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h2', text: 'My feelings are easily hurt by ridicule or by the slighting remarks of others.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h3', text: 'When I enter a room I often become self-conscious and feel that the eyes of others are upon me.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h4', text: 'I dislike sharing the credit of an achievement with others.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h5', text: 'I feel that I have enough on my hands without worrying about other people’s troubles.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h6', text: 'I feel that I am temperamentally different from most people.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h7', text: 'I often interpret the remarks of others in a personal way.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h8', text: 'I easily become wrapped up in my own interests and forget the existence of others.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h9', text: 'I dislike being with a group unless I know that I am appreciated by at least one of those present.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] },
        { id: 'h10', text: 'I am secretly “put out” or annoyed when other people come to me with their troubles, asking me for my time and sympathy.', options: ['Very uncharacteristic', 'Uncharacteristic', 'Neutral', 'Characteristic', 'Very characteristic'] }
      ] }] },
    { id: 'F', domain: 'F', title: 'The pattern in relationships', stage: 'History',
      intro: 'A trait score says little on its own. What a clinician looks for is how the traits play out with the people around you, over time. Think about how you are most of the time, not on your best or worst day.',
      parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement for you?', items: [
        { id: 'i1', text: 'Relationships keep ending the same way, with the other person saying I am cold, controlling, or only think of myself.' },
        { id: 'i2', text: 'I find it hard to feel what other people feel, or to stay interested when the conversation is not about me.' },
        { id: 'i3', text: 'Criticism feels like an attack, and I answer it with anger, contempt, or by cutting the person off.' },
        { id: 'i4', text: 'I need admiration or recognition to feel all right, and feel empty or furious without it.' },
        { id: 'i5', text: 'I expect special treatment and get angry when I do not get it.' },
        { id: 'i6', text: 'I use people to get what I need and feel little guilt about it afterwards.' },
        { id: 'i7', text: 'I envy other people, or I am sure they envy me.' },
        { id: 'i8', text: 'Underneath the confidence, I feel worthless or like a fraud.' }
      ] }] },
    { id: 'C', domain: 'C', title: 'How long, and where', stage: 'History',
      intro: 'Personality patterns are long-standing and show up across situations. A pattern that appeared recently, or only in one relationship, points a clinician towards other explanations.',
      parts: [{ id: 'main', type: 'yesno', prompt: 'Is this true for you?', items: [
        { id: 'i1', text: 'This has been how I am since my teens or early twenties.' },
        { id: 'i2', text: 'It shows up in every part of life: work, family, friends, partners.' },
        { id: 'i3', text: 'More than one person, in different parts of my life, has told me the same thing about myself.' },
        { id: 'i4', text: 'I am doing this because someone called me a narcissist, or a relationship has just ended.' },
        { id: 'i5', text: 'I have had counselling or therapy before.' },
        { id: 'i6', text: 'There have been long periods when none of this was a problem.' }
      ] }] },
    { id: 'D', domain: 'D', title: 'Impact on daily life', stage: 'History',
      intro: 'A personality disorder is only diagnosed when the pattern causes real harm or distress. This helps the team, and you, see where that falls.',
      parts: [{ id: 'main', type: 'rating', prompt: 'How much does the pattern affect each area?', items: [
        { id: 'i1', text: 'Romantic relationships' },
        { id: 'i2', text: 'Family, including children' },
        { id: 'i3', text: 'Friendships' },
        { id: 'i4', text: 'Work (conflict, lost jobs, reputation)' },
        { id: 'i5', text: 'My own mood and wellbeing' }
      ] }] },
    { id: 'O', domain: 'O', title: 'Other conditions, and how you are right now', stage: 'History',
      intro: 'A clinician checks for conditions that can look like narcissism or sit alongside it, because they change what helps. They will also ask how you are coping.',
      parts: [
        { id: 'cond', type: 'check', prompt: 'Tick anything that has been diagnosed, or that you suspect:', items: [
          { id: 'dep', text: 'Depression' },
          { id: 'anx', text: 'Anxiety, including social anxiety' },
          { id: 'bipolar', text: 'Bipolar disorder' },
          { id: 'adhd', text: 'ADHD' },
          { id: 'autism', text: 'Autism' },
          { id: 'subst', text: 'Problems with alcohol or drugs' },
          { id: 'trauma', text: 'Trauma, or a childhood with a lot of criticism, neglect, or conditional love' },
          { id: 'eat', text: 'An eating disorder' },
          { id: 'pd', text: 'A previous personality disorder diagnosis' },
          { id: 'fam', text: 'A parent with a similar pattern' },
          { id: 'cond_none', text: 'None of these', exclusive: true }
        ] },
        { id: 'well', type: 'single', prompt: 'Over the last two weeks, have you had thoughts that you would be better off dead, or of hurting yourself in some way?', risk: true, support: 'self', items: [
          { id: 'w1', text: 'Thoughts of being better off dead, or of hurting yourself', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], flagIf: [1, 2, 3] }
        ] }
      ] }
  ];

  DATA.history['narc-other'] = [
    { id: 'X', domain: 'X', title: 'How it affects you', stage: 'History',
      intro: 'Services ask about the effect on you because that, not the other person’s personality, is what they can help with.',
      parts: [{ id: 'main', type: 'rating', prompt: 'How true is each statement?', items: [
        { id: 'i1', text: 'I feel like I am walking on eggshells around them.' },
        { id: 'i2', text: 'I have lost confidence in myself since being with them, or since childhood with them.' },
        { id: 'i3', text: 'I feel anxious or dread before seeing them or when a message arrives.' },
        { id: 'i4', text: 'I have lost touch with friends or family.' },
        { id: 'i5', text: 'I doubt my own memory or judgement.' },
        { id: 'i6', text: 'My sleep or physical health has suffered.' },
        { id: 'i7', text: 'I have changed how I dress, speak, spend, or behave to avoid their reaction.' }
      ] }] },
    { id: 'S', domain: 'S', title: 'Your situation', stage: 'History',
      intro: 'These change what the safest and most useful next step is.',
      parts: [{ id: 'main', type: 'check', prompt: 'Tick what applies:', items: [
        { id: 'partner', text: 'This person is my partner or ex-partner' },
        { id: 'family', text: 'This person is a parent or other family member' },
        { id: 'workplace', text: 'This person is a colleague or manager' },
        { id: 'live', text: 'We live together' },
        { id: 'children', text: 'There are children involved' },
        { id: 'money', text: 'I depend on them financially, or they control the money' },
        { id: 'history', text: 'They have a history of this in other relationships' },
        { id: 'leave', text: 'I have already tried to leave or cut contact' },
        { id: 'set_none', text: 'None of these', exclusive: true }
      ] }] },
    { id: 'T', domain: 'T', title: 'Who knows, and safety', stage: 'History',
      intro: 'Nobody has to handle this alone, and the questions below are the ones a helpline would ask first.',
      parts: [
        { id: 'support', type: 'check', prompt: 'Who have you talked to?', items: [
          { id: 'friend', text: 'A friend or family member' },
          { id: 'gp', text: 'My GP' },
          { id: 'counsellor', text: 'A counsellor or therapist' },
          { id: 'helpline', text: 'A helpline or domestic abuse service' },
          { id: 'police', text: 'The police' },
          { id: 'sup_none', text: 'Nobody yet', exclusive: true }
        ] },
        { id: 'safety', type: 'single', prompt: 'Safety:', risk: true, support: 'abuse', items: [
          { id: 's1', text: 'Are you afraid of this person, or has there been violence, threats, or being stopped from leaving?', options: ['No', 'Sometimes', 'Yes'], flagIf: [1, 2] }
        ] },
        { id: 'well', type: 'single', prompt: 'And you:', risk: true, support: 'self', items: [
          { id: 'w1', text: 'Over the last two weeks, have you had thoughts that you would be better off dead, or of hurting yourself in some way?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'], flagIf: [1, 2, 3] }
        ] }
      ] }
  ];

  DATA.support.abuse = [
    { name: 'National Domestic Abuse Helpline (Refuge)', detail: 'Call 0808 2000 247, free, 24 hours, for anyone in England; there is also a live chat on their website.' },
    { name: 'Scotland, Wales and Northern Ireland', detail: 'Scotland: Domestic Abuse and Forced Marriage Helpline 0800 027 1234. Wales: Live Fear Free 0808 80 10 800. Northern Ireland: Domestic and Sexual Abuse Helpline 0808 802 1414. All free and 24 hours.' },
    { name: 'Men’s Advice Line', detail: 'Call 0808 801 0327 if you are a man experiencing this.' },
    { name: 'Galop', detail: 'Call 0800 999 5428 if you are LGBT+.' },
    { name: 'Respect Phoneline', detail: 'Call 0808 802 4040 if you are worried about your own behaviour towards a partner.' },
    { name: 'Emergency', detail: 'If you are in immediate danger, call 999. If you cannot speak safely, listen to the operator and press 55 when prompted.' }
  ];

  DATA.conditions.narcissism = {
    id: 'narcissism', label: 'Narcissism', noun: 'narcissism',
    lede: 'Two very different questions hide behind “narcissist test”. “Am I one?” can be screened with the trait scales researchers use and the criteria UK clinicians apply. “Is my partner, parent or ex one?” cannot be answered by a questionnaire about someone who is not in the room, so that route looks at the pattern of behaviour and its effect on you instead, which is what UK services act on.',
    underAgeNote: 'Personality is still forming before 18, so clinicians are cautious about labels in teenagers. If the question is about a young person, their GP or school counsellor is the place to start.',
    whoIntro: 'Choose whether this is about you or about someone else. The two routes ask different things and lead to different kinds of help.',
    text: {
      profile: 'Each bar is the average of your 0 to 3 answers in that section. The trait scales are reported above; these bars show how the pattern plays out and what it costs. “Marked” is 1.5 or more.',
      early: 'How long, and where',
      earlyNote: 'A personality pattern is long-standing and shows up across situations. A recent change, or a pattern in one relationship only, points towards other explanations such as depression, a crisis, or the relationship itself.',
      condNote: 'A clinician weighs these up: depression and social anxiety can look like the vulnerable kind of narcissism, bipolar highs can look like grandiosity, autism and ADHD can look like not listening, and a childhood of criticism or conditional love is common in the history. Mention them all.',
      footer: 'Signpost is a screening aid, not a diagnosis. A personality assessment is a long clinical interview, and no questionnaire can diagnose someone who is not the one answering.'
    },
    pathway: [
      { title: 'Someone notices', text: '“Narcissist” is now used so loosely online that it helps to separate three things: a trait everyone has to some degree, a pattern of behaviour that harms other people, and a diagnosis. Concerns usually come from a partner, family, a therapist, or the person themselves after a relationship breaks down.' },
      { title: 'GP', text: 'The GP listens, checks for depression, anxiety, bipolar disorder and substance use, and may offer NHS talking therapies for those. When a pattern is long-standing and causing significant harm, they can refer to the community mental health team for a personality assessment. There is no NICE guideline for narcissistic personality disorder and no questionnaire the GP is asked to use.' },
      { title: 'Referral', text: 'Community mental health teams assess personality difficulties; some areas have a personality disorder or “complex emotional needs” service, most of which focus on borderline patterns. Many people use a private psychologist or psychiatrist for this assessment. For the person on the receiving end of the behaviour, the route is different: domestic abuse services, counselling, and where needed the police.' },
      { title: 'Information gathering', text: 'A history of relationships, work and how the person is across settings, sometimes with an informant’s view, and questionnaires such as the PID-5 personality trait inventory.' },
      { title: 'The assessment', text: 'A clinical interview with a psychiatrist or clinical psychologist, sometimes structured (SCID-5-PD or IPDE). It checks whether the pattern is better explained by depression, bipolar disorder, autism, ADHD, substance use or a recent crisis.' },
      { title: 'Decision', text: 'The UK uses ICD-11: is there a personality disorder at all (problems in how the person sees themselves and relates to others, across situations, over years, causing harm), how severe is it, and which trait domains are prominent. Narcissistic features fall mainly under dissociality, and the vulnerable kind under negative affectivity. Some clinicians also use the DSM-5 category of narcissistic personality disorder.' },
      { title: 'Treatment and support', text: 'Long-term psychological therapy (schema therapy, mentalisation-based therapy, psychodynamic therapy), and treatment of any depression, anxiety or substance use. No medication treats narcissism itself. For people affected by someone else’s behaviour: domestic abuse services, counselling, and the law on controlling or coercive behaviour, which does not require a diagnosis of anyone.' }
    ],
    nationNotes: {
      england: {
        title: 'In England',
        points: [
          'For yourself: GP, then NHS talking therapies for depression or anxiety, or the community mental health team for a personality assessment. Waits vary widely; a private assessment with a BACP or UKCP registered therapist or a psychiatrist is common.',
          'If the concern is someone else’s behaviour: controlling or coercive behaviour in an intimate or family relationship is a criminal offence under the Serious Crime Act 2015. You do not need a diagnosis of anyone to report it or to get support.',
          'Clare’s Law: you can ask the police whether a partner has a history of abuse (the Domestic Violence Disclosure Scheme).',
          'Domestic abuse services are free, confidential, and open to people who have not decided anything yet.'
        ]
      },
      wales: {
        title: 'In Wales',
        points: [
          'For yourself: GP, then the local primary mental health team or the community mental health team for a personality assessment.',
          'Controlling or coercive behaviour is a criminal offence under the Serious Crime Act 2015, which applies in Wales as in England. Live Fear Free (0808 80 10 800) is the Welsh Government’s free, 24-hour helpline.',
          'Clare’s Law (the Domestic Violence Disclosure Scheme) applies.'
        ]
      },
      scotland: {
        title: 'In Scotland',
        points: [
          'For yourself: GP, then the community mental health team; adult personality assessment provision varies by health board.',
          'The Domestic Abuse (Scotland) Act 2018 makes psychological abuse and coercive control a criminal offence. Scotland’s Domestic Abuse and Forced Marriage Helpline is 0800 027 1234, free and 24 hours.',
          'The Disclosure Scheme for Domestic Abuse Scotland lets you ask the police about a partner’s history.'
        ]
      },
      ni: {
        title: 'In Northern Ireland',
        points: [
          'For yourself: GP, then the Trust’s community mental health team.',
          'The Domestic Abuse and Civil Proceedings Act (Northern Ireland) 2021 made coercive and controlling behaviour a criminal offence. The Domestic and Sexual Abuse Helpline is 0808 802 1414, free and 24 hours.',
          'The Domestic Violence and Abuse Disclosure Scheme lets you ask the police about a partner’s history.'
        ]
      }
    },
    bring: {
      self: [
        'This summary, copied or printed.',
        'A short history of your relationships, jobs and friendships, and how they ended.',
        'What the people close to you have said, in their words if you can bear it.',
        'Any previous diagnoses, therapy, and medicines.',
        'What you want to change. Assessment is only useful if it leads somewhere.'
      ],
      other: [
        'This summary, copied or printed, or just the list of behaviours you ticked.',
        'Dates and examples if it is safe to keep them, ideally somewhere the person cannot see.',
        'Anything about children, money, housing or immigration status that affects your options.',
        'You do not need to have decided to leave, and you do not need proof, to talk to a service.'
      ],
      parent: [
        'This summary, copied or printed, or just the list of behaviours you ticked.',
        'Dates and examples if it is safe to keep them, ideally somewhere the person cannot see.',
        'Anything about children, money, housing or immigration status that affects your options.',
        'You do not need to have decided to leave, and you do not need proof, to talk to a service.'
      ]
    },
    organisations: [
      { name: 'Refuge, National Domestic Abuse Helpline', detail: '0808 2000 247, 24 hours, and a live chat for anyone affected by controlling or abusive behaviour', url: 'https://www.nationaldahelpline.org.uk' },
      { name: 'Women’s Aid', detail: 'Information, live chat and the Survivor’s Handbook', url: 'https://www.womensaid.org.uk' },
      { name: 'Men’s Advice Line', detail: 'Support for men experiencing domestic abuse', url: 'https://mensadviceline.org.uk' },
      { name: 'Respect Phoneline', detail: 'For people worried about their own behaviour in a relationship', url: 'https://respectphoneline.org.uk' },
      { name: 'Mind: personality disorders', detail: 'Plain-English information on diagnosis and treatment', url: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/personality-disorders/' },
      { name: 'BACP therapist directory', detail: 'Find a registered counsellor or psychotherapist', url: 'https://www.bacp.co.uk/search/Therapists' }
    ],
    references: [
      'World Health Organization. ICD-11, 6D10 Personality disorder (severity) and 6D11 trait domain specifiers. American Psychiatric Association. DSM-5-TR, 301.81 Narcissistic personality disorder.',
      'Ames DR, Rose P, Anderson CP. The NPI-16 as a short measure of narcissism. J Res Pers 2006;40(4):440-450.',
      'Hendin HM, Cheek JM. Assessing hypersensitive narcissism: a re-examination of Murray’s Narcism Scale. J Res Pers 1997;31(4):588-599.',
      'Home Office. Controlling or coercive behaviour: statutory guidance framework (2023). Serious Crime Act 2015, section 76.'
    ]
  };
})();
