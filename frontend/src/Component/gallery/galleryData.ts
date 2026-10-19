import type { GalleryImage } from './types';
import conferenceGroupPortrait01Full from '../../assets/gallery/conference-group-portrait-01.webp';
import conferenceGroupPortrait01Small from '../../assets/gallery/thumbnails/conference-group-portrait-01-480.webp';
import conferenceGroupPortrait01Medium from '../../assets/gallery/thumbnails/conference-group-portrait-01-960.webp';
import committeeDelegateLaptop01Full from '../../assets/gallery/committee-delegate-laptop-01.webp';
import committeeDelegateLaptop01Small from '../../assets/gallery/thumbnails/committee-delegate-laptop-01-480.webp';
import committeeDelegateLaptop01Medium from '../../assets/gallery/thumbnails/committee-delegate-laptop-01-960.webp';
import committeeRaisedNote01Full from '../../assets/gallery/committee-raised-note-01.webp';
import committeeRaisedNote01Small from '../../assets/gallery/thumbnails/committee-raised-note-01-480.webp';
import committeeRaisedNote01Medium from '../../assets/gallery/thumbnails/committee-raised-note-01-960.webp';
import conferenceGroupPortrait02Full from '../../assets/gallery/conference-group-portrait-02.webp';
import conferenceGroupPortrait02Small from '../../assets/gallery/thumbnails/conference-group-portrait-02-480.webp';
import conferenceGroupPortrait02Medium from '../../assets/gallery/thumbnails/conference-group-portrait-02-960.webp';
import committeeDelegateSpeaking01Full from '../../assets/gallery/committee-delegate-speaking-01.webp';
import committeeDelegateSpeaking01Small from '../../assets/gallery/thumbnails/committee-delegate-speaking-01-480.webp';
import committeeDelegateSpeaking01Medium from '../../assets/gallery/thumbnails/committee-delegate-speaking-01-960.webp';
import committeeRaisedPlacard01Full from '../../assets/gallery/committee-raised-placard-01.webp';
import committeeRaisedPlacard01Small from '../../assets/gallery/thumbnails/committee-raised-placard-01-480.webp';
import committeeRaisedPlacard01Medium from '../../assets/gallery/thumbnails/committee-raised-placard-01-960.webp';
import committeeNoteTaking02Full from '../../assets/gallery/committee-note-taking-02.webp';
import committeeNoteTaking02Small from '../../assets/gallery/thumbnails/committee-note-taking-02-480.webp';
import committeeNoteTaking02Medium from '../../assets/gallery/thumbnails/committee-note-taking-02-960.webp';
import conferenceAuditorium01Full from '../../assets/gallery/conference-auditorium-01.webp';
import conferenceAuditorium01Small from '../../assets/gallery/thumbnails/conference-auditorium-01-480.webp';
import conferenceAuditorium01Medium from '../../assets/gallery/thumbnails/conference-auditorium-01-960.webp';
import committeeDiscussion01Full from '../../assets/gallery/committee-discussion-01.webp';
import committeeDiscussion01Small from '../../assets/gallery/thumbnails/committee-discussion-01-480.webp';
import committeeDiscussion01Medium from '../../assets/gallery/thumbnails/committee-discussion-01-960.webp';
import committeeNoteTaking01Full from '../../assets/gallery/committee-note-taking-01.webp';
import committeeNoteTaking01Small from '../../assets/gallery/thumbnails/committee-note-taking-01-480.webp';
import committeeNoteTaking01Medium from '../../assets/gallery/thumbnails/committee-note-taking-01-960.webp';
import awardsMementoBouquet01Full from '../../assets/gallery/awards-memento-bouquet-01.webp';
import awardsMementoBouquet01Small from '../../assets/gallery/thumbnails/awards-memento-bouquet-01-480.webp';
import awardsMementoBouquet01Medium from '../../assets/gallery/thumbnails/awards-memento-bouquet-01-960.webp';
import awardsCertificate01Full from '../../assets/gallery/awards-certificate-01.webp';
import awardsCertificate01Small from '../../assets/gallery/thumbnails/awards-certificate-01-480.webp';
import awardsCertificate01Medium from '../../assets/gallery/thumbnails/awards-certificate-01-960.webp';
import awardsMedalCertificate01Full from '../../assets/gallery/awards-medal-certificate-01.webp';
import awardsMedalCertificate01Small from '../../assets/gallery/thumbnails/awards-medal-certificate-01-480.webp';
import awardsMedalCertificate01Medium from '../../assets/gallery/thumbnails/awards-medal-certificate-01-960.webp';
import awardsMedalCertificate02Full from '../../assets/gallery/awards-medal-certificate-02.webp';
import awardsMedalCertificate02Small from '../../assets/gallery/thumbnails/awards-medal-certificate-02-480.webp';
import awardsMedalCertificate02Medium from '../../assets/gallery/thumbnails/awards-medal-certificate-02-960.webp';
import awardsMedalCertificate03Full from '../../assets/gallery/awards-medal-certificate-03.webp';
import awardsMedalCertificate03Small from '../../assets/gallery/thumbnails/awards-medal-certificate-03-480.webp';
import awardsMedalCertificate03Medium from '../../assets/gallery/thumbnails/awards-medal-certificate-03-960.webp';
import awardsAppreciation01Full from '../../assets/gallery/awards-appreciation-01.webp';
import awardsAppreciation01Small from '../../assets/gallery/thumbnails/awards-appreciation-01-480.webp';
import awardsAppreciation01Medium from '../../assets/gallery/thumbnails/awards-appreciation-01-960.webp';
import awardsAppreciation02Full from '../../assets/gallery/awards-appreciation-02.webp';
import awardsAppreciation02Small from '../../assets/gallery/thumbnails/awards-appreciation-02-480.webp';
import awardsAppreciation02Medium from '../../assets/gallery/thumbnails/awards-appreciation-02-960.webp';

// User-supplied photographs imported through Vite for base-aware, fingerprinted URLs.
// The original JPGs remain unchanged outside the repository.
export const galleryImages: readonly GalleryImage[] = [
  {
    id: "conference-group-portrait-01",
    src: conferenceGroupPortrait01Full,
    thumbnailSrc: conferenceGroupPortrait01Medium,
    thumbnailSrcSet: `${conferenceGroupPortrait01Small} 480w, ${conferenceGroupPortrait01Medium} 960w`,
    category: "Conference Moments",
    caption: "The conference community, together in one frame.",
    alt: "A large group of conference participants posing together in front of a projection screen.",
    width: 2400,
    height: 1600,
  },
  {
    id: "committee-delegate-laptop-01",
    src: committeeDelegateLaptop01Full,
    thumbnailSrc: committeeDelegateLaptop01Medium,
    thumbnailSrcSet: `${committeeDelegateLaptop01Small} 480w, ${committeeDelegateLaptop01Medium} 960w`,
    category: "Committee Sessions",
    caption: "Following the discussion, with a laptop close at hand.",
    alt: "A delegate in a white shirt and patterned tie seated behind an open laptop during a committee session.",
    width: 2400,
    height: 1600,
  },
  {
    id: "committee-raised-note-01",
    src: committeeRaisedNote01Full,
    thumbnailSrc: committeeRaisedNote01Medium,
    thumbnailSrcSet: `${committeeRaisedNote01Small} 480w, ${committeeRaisedNote01Medium} 960w`,
    category: "Committee Sessions",
    caption: "A raised note in the midst of committee discussion.",
    alt: "A delegate in a beige jacket raising a handwritten note above a New Zealand country placard.",
    width: 1600,
    height: 2400,
  },
  {
    id: "conference-group-portrait-02",
    src: conferenceGroupPortrait02Full,
    thumbnailSrc: conferenceGroupPortrait02Medium,
    thumbnailSrcSet: `${conferenceGroupPortrait02Small} 480w, ${conferenceGroupPortrait02Medium} 960w`,
    category: "Conference Moments",
    caption: "Together in the frame, connected by the experience.",
    alt: "Eight conference participants standing side by side for a group portrait.",
    width: 2400,
    height: 1600,
  },
  {
    id: "committee-delegate-speaking-01",
    src: committeeDelegateSpeaking01Full,
    thumbnailSrc: committeeDelegateSpeaking01Medium,
    thumbnailSrcSet: `${committeeDelegateSpeaking01Small} 480w, ${committeeDelegateSpeaking01Medium} 960w`,
    category: "Committee Sessions",
    caption: "Making a point, adding a perspective.",
    alt: "A delegate wearing glasses and a dark blazer speaking and gesturing at a committee desk.",
    width: 2400,
    height: 1600,
  },
  {
    id: "committee-raised-placard-01",
    src: committeeRaisedPlacard01Full,
    thumbnailSrc: committeeRaisedPlacard01Medium,
    thumbnailSrcSet: `${committeeRaisedPlacard01Small} 480w, ${committeeRaisedPlacard01Medium} 960w`,
    category: "Committee Sessions",
    caption: "A placard raised during committee proceedings.",
    alt: "A seated delegate holding a conference placard overhead beside an open laptop.",
    width: 2400,
    height: 1600,
  },
  {
    id: "committee-note-taking-02",
    src: committeeNoteTaking02Full,
    thumbnailSrc: committeeNoteTaking02Medium,
    thumbnailSrcSet: `${committeeNoteTaking02Small} 480w, ${committeeNoteTaking02Medium} 960w`,
    category: "Committee Sessions",
    caption: "Careful notes capture the detail of the discussion.",
    alt: "A delegate in a pinstriped jacket and glasses writing notes at a committee desk.",
    width: 1600,
    height: 2400,
  },
  {
    id: "conference-auditorium-01",
    src: conferenceAuditorium01Full,
    thumbnailSrc: conferenceAuditorium01Medium,
    thumbnailSrcSet: `${conferenceAuditorium01Small} 480w, ${conferenceAuditorium01Medium} 960w`,
    category: "Conference Moments",
    caption: "The conference community gathers in the auditorium.",
    alt: "Rows of conference participants seated in red auditorium chairs.",
    width: 2400,
    height: 1600,
  },
  {
    id: "committee-discussion-01",
    src: committeeDiscussion01Full,
    thumbnailSrc: committeeDiscussion01Medium,
    thumbnailSrcSet: `${committeeDiscussion01Small} 480w, ${committeeDiscussion01Medium} 960w`,
    category: "Committee Sessions",
    caption: "Ideas take shape through an animated exchange.",
    alt: "A participant in a navy shirt gesturing with both hands while speaking during a committee discussion.",
    width: 1600,
    height: 2400,
  },
  {
    id: "committee-note-taking-01",
    src: committeeNoteTaking01Full,
    thumbnailSrc: committeeNoteTaking01Medium,
    thumbnailSrcSet: `${committeeNoteTaking01Small} 480w, ${committeeNoteTaking01Medium} 960w`,
    category: "Committee Sessions",
    caption: "Putting ideas on paper, one note at a time.",
    alt: "A delegate in a white shirt and red tie writing beside a United Kingdom country placard.",
    width: 2400,
    height: 1600,
  },
  {
    id: "awards-memento-bouquet-01",
    src: awardsMementoBouquet01Full,
    thumbnailSrc: awardsMementoBouquet01Medium,
    thumbnailSrcSet: `${awardsMementoBouquet01Small} 480w, ${awardsMementoBouquet01Medium} 960w`,
    category: "Awards & Recognition",
    caption: "Marking the occasion with a memento and bouquet.",
    alt: "A participant receiving a plaque and certificate while a bouquet is presented alongside them.",
    width: 2400,
    height: 1600,
  },
  {
    id: "awards-certificate-01",
    src: awardsCertificate01Full,
    thumbnailSrc: awardsCertificate01Medium,
    thumbnailSrcSet: `${awardsCertificate01Small} 480w, ${awardsCertificate01Medium} 960w`,
    category: "Awards & Recognition",
    caption: "A moment of recognition at the certificate presentation.",
    alt: "A participant in a blue blazer holding a certificate together with two presenters.",
    width: 2400,
    height: 1600,
  },
  {
    id: "awards-medal-certificate-01",
    src: awardsMedalCertificate01Full,
    thumbnailSrc: awardsMedalCertificate01Medium,
    thumbnailSrcSet: `${awardsMedalCertificate01Small} 480w, ${awardsMedalCertificate01Medium} 960w`,
    category: "Awards & Recognition",
    caption: "A medal, a certificate, and a moment to remember.",
    alt: "A smiling participant wearing a medal receiving a certificate with three people beside them.",
    width: 2400,
    height: 1600,
  },
  {
    id: "awards-medal-certificate-02",
    src: awardsMedalCertificate02Full,
    thumbnailSrc: awardsMedalCertificate02Medium,
    thumbnailSrcSet: `${awardsMedalCertificate02Small} 480w, ${awardsMedalCertificate02Medium} 960w`,
    category: "Awards & Recognition",
    caption: "Recognition captured in a shared presentation.",
    alt: "A participant wearing a medal and dark blazer holding a certificate with two presenters.",
    width: 2400,
    height: 1600,
  },
  {
    id: "awards-medal-certificate-03",
    src: awardsMedalCertificate03Full,
    thumbnailSrc: awardsMedalCertificate03Medium,
    thumbnailSrcSet: `${awardsMedalCertificate03Small} 480w, ${awardsMedalCertificate03Medium} 960w`,
    category: "Awards & Recognition",
    caption: "A medal held up for a photograph to remember.",
    alt: "A participant in a light grey blazer displaying a medal while holding a certificate with two presenters.",
    width: 2400,
    height: 1600,
  },
  {
    id: "awards-appreciation-01",
    src: awardsAppreciation01Full,
    thumbnailSrc: awardsAppreciation01Medium,
    thumbnailSrcSet: `${awardsAppreciation01Small} 480w, ${awardsAppreciation01Medium} 960w`,
    category: "Awards & Recognition",
    caption: "A token of appreciation, presented with flowers.",
    alt: "A participant in a dark suit receiving a plaque, certificate, and bouquet beside three presenters.",
    width: 2400,
    height: 1600,
  },
  {
    id: "awards-appreciation-02",
    src: awardsAppreciation02Full,
    thumbnailSrc: awardsAppreciation02Medium,
    thumbnailSrcSet: `${awardsAppreciation02Small} 480w, ${awardsAppreciation02Medium} 960w`,
    category: "Awards & Recognition",
    caption: "A certificate and memento mark a shared occasion.",
    alt: "A participant dressed in black holding a certificate and plaque, with flowers and presenters beside them.",
    width: 2400,
    height: 1600,
  },
];
