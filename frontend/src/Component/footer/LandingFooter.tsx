import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import type { MouseEvent } from 'react';
import crest from '../../assets/NITRRMUN-crest.png';
import './LandingFooter.css';

const quickLinks = [
  { label: 'About the conference', href: '#about' },
  { label: 'Committees', href: '#committees' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'FAQs', href: '#faq' },
];

const preparationLinks = [
  { label: 'All delegate resources', href: '#resources' },
  { label: 'Protocol of deliberation', href: '#resource-rules' },
  { label: 'Research & representation', href: '#resource-position-papers' },
  { label: 'Drafting a resolution', href: '#resource-resolutions' },
  { label: 'Code of conduct', href: '#resource-conference-guidelines' },
];

export default function LandingFooter({ onRegister }: { onRegister?: () => void }) {
  function openGuide(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith('#resource-') || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('litmun:resource-guide', { detail: href.slice('#resource-'.length) }));
  }
  return (
    <footer className="landing-footer conference-footer" data-reveal data-reveal-footer>
      <div className="conference-footer-container">
        <div className="conference-footer-grid">
          <div className="footer-brand">
            <a className="footer-brand-link" href="#home" aria-label="NITRRMUN home">
              <img src={crest} alt="" width={64} height={64} loading="lazy" decoding="async" />
              <span className="landing-footer-title">NITRRMUN<br /><span>2026–27 · NIT Raipur</span></span>
            </a>
            <p className="footer-summary">Model United Nations at NIT Raipur brings aspiring diplomats together for informed debate, strategic negotiation, and constructive dialogue.</p>
            <a className="footer-social" href="https://www.instagram.com/literary.nitrr?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><FaInstagram size={18} aria-hidden="true" />Follow Literati<ArrowUpRight size={13} aria-hidden="true" /></a>
          </div>
          <nav className="footer-column" aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links">Quick Links</h2>
            <ul>{quickLinks.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
          </nav>
          <nav className="footer-column" aria-labelledby="footer-resources">
            <h2 id="footer-resources">Delegate Resources</h2>
            <ul>{preparationLinks.map((link) => <li key={link.href}><a href={link.href} onClick={(event) => openGuide(event, link.href)}>{link.label}</a></li>)}</ul>
          </nav>
          <div className="footer-column footer-connect">
            <h2>Stay Connected</h2>
            <p>For conference enquiries and participation assistance, reach the organising team.</p>
            <a className="footer-email" href="mailto:nitrrmun@nitrr.ac.in"><Mail size={16} aria-hidden="true" />nitrrmun@nitrr.ac.in</a>
            <a href="#contact">Contact the team<ArrowUpRight size={13} aria-hidden="true" /></a>
            {onRegister && <button className="footer-register" type="button" onClick={onRegister}>Register as Delegate<ArrowRight size={15} aria-hidden="true" /></button>}
          </div>
        </div>
        <p className="footer-welcome">“For every question that deserves consideration, every perspective that merits a hearing, and every solution that begins with dialogue, team LITERATI welcomes your engagement.”</p>
        <div className="footer-bottom"><p>© 2026 NITRRMUN Conference, NIT Raipur. All rights reserved.</p><a href="#home">Back to top <ArrowRight size={13} aria-hidden="true" /></a></div>
      </div>
    </footer>
  );
}
