import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import './DevelopersCredits.css';

export interface Developer {
  name: string;
  github: string;
  username: string;
}

export const developers: Developer[] = [
  { name: 'Shourya Veer Singh', github: 'https://github.com/Shourya-31', username: 'Shourya-31' },
  { name: 'Anish Jaiswal', github: 'https://github.com/AnishJaiswal01', username: 'AnishJaiswal01' },
  { name: 'Atulya Jaiswal', github: 'https://github.com/atulwal', username: 'atulwal' },
  { name: 'Ashwast Gupta', github: 'https://github.com/ash-heinz', username: 'ash-heinz' },
  { name: 'Gargee Dhale', github: 'https://github.com/Gargeeeee7', username: 'Gargeeeee7' },
];

export default function DevelopersCredits() {
  return (
    <div className="footer-developers-section">
      <div className="footer-developers-header">
        <span className="footer-dev-title">Platform Developers</span>
      </div>
      <div className="footer-developers-grid">
        {developers.map((dev) => (
          <a
            key={dev.username}
            href={dev.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-dev-card"
            aria-label={`${dev.name} (${dev.username} on GitHub)`}
          >
            <span className="footer-dev-icon">
              <FaGithub size={15} aria-hidden="true" />
            </span>
            <span className="footer-dev-info">
              <span className="footer-dev-name">{dev.name}</span>
              <span className="footer-dev-handle">@{dev.username}</span>
            </span>
            <ArrowUpRight size={12} className="footer-dev-arrow" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}
