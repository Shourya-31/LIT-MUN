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
      'Participation in LIT-MUN 2026–27 is completely free. There is no registration fee.',
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'Is accommodation provided?',
    answer:
      'No. LIT-MUN is a one-day event, so accommodation will not be provided.',
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
    answer: 'LIT-MUN is open to school and college students.',
  },
];
