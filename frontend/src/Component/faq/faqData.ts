export interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    number: '01',
    question: 'What hospitality measures are taken for delegates?',
    answer:
      'Refreshments and lunch will be provided to all delegates, along with the necessary arrangements and requirements for the conference.',
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'What is the registration fee?',
    answer:
      'Participation in NITRRMUN 2026–27 is completely free. There is no registration fee.',
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'Is accommodation provided?',
    answer:
      'No. NITRRMUN is a one-day event, so accommodation will not be provided.',
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'What is the dress code?',
    answer:
      'Delegates are expected to wear formal attire and dress decently and appropriately for an academic conference.',
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'Who is eligible to participate?',
    answer: 'NITRRMUN is open to school and college students.',
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'Do I need prior MUN experience?',
    answer:
      'No prior Model United Nations (MUN) experience is required. Both beginners and experienced delegates are welcome to participate. NITRRMUN is an opportunity to learn, develop your skills, and engage in meaningful debate.',
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'How should I prepare for my committee?',
    answer:
      "Start by understanding your committee's mandate and agenda. Research the topic, learn about your assigned country's position, explore relevant policies and international developments, and prepare key arguments and potential solutions. Stay informed and be ready to collaborate with fellow delegates.",
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'How are delegates evaluated?',
    answer:
      'Delegates are evaluated based on their research, quality of arguments, participation in formal and informal discussions, diplomatic conduct, collaboration, and contribution to meaningful debate. Clarity, critical thinking, and constructive engagement are valued throughout the conference.',
  },
];
