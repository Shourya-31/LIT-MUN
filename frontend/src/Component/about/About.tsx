import React from 'react';
import './About.css';
import NITRRMUNdark from '../../assets/NITRRMUN-dark.png';

export const About: React.FC = () => {
  return (
    <section className="about-section" id="about" aria-labelledby="about-main-title">
      <div className="about-container">
        <header className="about-header" data-reveal>
          <h2 id="about-main-title" className="about-main-title">
            DIPLOMACY. DIALOGUE. A BLUE FUTURE.
          </h2>
          <h3 className="about-sub-title">
            NITRRMUN 2026–27 | NIT RAIPUR
          </h3>
        </header>

        <div className="about-content">
          <figure className="about-visual" data-about-image>
            <img
              className="about-image"
              src={NITRRMUNdark}
              alt="Official NITRRMUN Global Emblem"
              loading="lazy"
            />
            <span className="about-image-frame" aria-hidden="true" />
          </figure>

          <div className="about-copy">
            <p className="about-paragraph" data-about-paragraph>
              <span className="about-highlight">Literati</span> presents <span className="about-highlight">NITRRMUN 2026–27</span> which brings you an inspiring platform where diplomacy converges with youthful leadership at <span className="about-highlight">NIT Raipur</span>. Stepping into the theater of international affairs, NITRRMUN invites students to engage in rigorous discourse, analyze multifaceted geopolitical issues, and forge collaborative policies alongside visionary peers.
            </p>

            <p className="about-paragraph" data-about-paragraph>
              At the center of this year&apos;s conference is the defining theme: <span className="about-highlight">BLUE PULSE</span>. Dedicated to marine life conservation, the safeguarding of fragile aquatic ecosystems, and environmental responsibility, BLUE PULSE urges delegates to confront pressing oceanic crises with bold, sustainable solutions. It calls upon future leaders to champion ocean governance and environmental stewardship for our shared planet.
            </p>

            <p className="about-paragraph" data-about-paragraph>
              Model United Nations provides students with an invaluable arena to hone skills in diplomatic negotiation, in-depth research, critical thinking, public speaking, and multilateral problem-solving. Building upon the success of our previous edition, NITRRMUN 2026–27 empowers student voices to lead with purpose and shape a sustainable blue future.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
