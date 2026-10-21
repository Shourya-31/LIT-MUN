export interface Committee {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  agenda: string;
  agendaNotice?: string;
  emblemSrc: string;
  emblemAlt: string;
}

export const committeesData: Committee[] = [
  {
    id: 'unhrc',
    code: 'UNHRC',
    name: 'United Nations Human Rights Council',
    category: 'International Body',
    description:
      'Dedicated to the promotion and protection of human rights globally, addressing urgent humanitarian crises and safeguarding fundamental civil liberties worldwide.',
    agenda: 'Agenda to be announced.',
    agendaNotice: 'The official study guide and comprehensive agenda points will be released prior to the conference.',
    emblemSrc: '/images/committees/unhrc-emblem.png',
    emblemAlt: 'Official Emblem of United Nations Human Rights Council (UNHRC)',
  },
  {
    id: 'unsc',
    code: 'UNSC',
    name: 'United Nations Security Council',
    category: 'Crisis & Security',
    description:
      'Entrusted with the maintenance of international peace and security, resolving armed conflicts, and directing multilateral peacekeeping and diplomatic sanctions.',
    agenda: 'Agenda to be announced.',
    agendaNotice: 'The official study guide and comprehensive agenda points will be released prior to the conference.',
    emblemSrc: '/images/committees/unsc-emblem.png',
    emblemAlt: 'Official Emblem of United Nations Security Council (UNSC)',
  },
  {
    id: 'aippm',
    code: 'AIPPM',
    name: 'All India Political Parties Meet',
    category: 'Indian Parliamentary',
    description:
      'A vibrant parliamentary simulation convening diverse national political viewpoints to deliberate on pressing legislative governance and constitutional policy reforms.',
    agenda: 'Agenda to be announced.',
    agendaNotice: 'The official study guide and comprehensive agenda points will be released prior to the conference.',
    emblemSrc: '/images/committees/aippm-emblem.png',
    emblemAlt: 'Official Emblem of All India Political Parties Meet (AIPPM)',
  },
];
