import type { ReactNode } from 'react';
import './conference.css';

interface SectionHeadingProps {
  id: string;
  number: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
}

export default function SectionHeading({ id, number, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="conference-heading">
      <div>
        <p className="conference-eyebrow"><span aria-hidden="true">{number}</span>{eyebrow}</p>
        <h2 id={id} className="conference-title">{title}</h2>
        <p className="conference-description">{description}</p>
      </div>
    </header>
  );
}
