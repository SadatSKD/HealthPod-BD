import Image from 'next/image';
import { SiteChrome, Reveal } from '@/components/SiteChrome';
import { Advisor } from '@/components/Advisor';
import { scenario, laws } from '@/content/scenario';
import { team } from '@/content/team';
import { factCheck } from '@/content/fact-check';
import { approvedKnowledge } from '@/content/knowledge';
import { parseYouTubeUrl } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

const journey = [
  {number:'01',title:'Check in',text:'Follow simple, on-screen steps at a proposed booth.'},
  {number:'02',title:'Take measurements',text:'Use suitable devices for blood pressure, glucose and SpO₂.'},
  {number:'03',title:'See a clear report',text:'Understand the recorded readings in a simple format.'},
  {number:'04',title:'Get general guidance',text:'Know when to seek professional care, without replacing a clinician.'}
];

export default function Home() {
  const video = parseYouTubeUrl(process.env.YOUTUBE_VIDEO_URL);
  const legalSources = approvedKnowledge.filter(entry=>entry.status==='verified_legal_rule');
  return <>
    <SiteChrome />
    <main id="top">
      <section className="hero section" aria-labelledby="hero-title">
        <div className="hero-orb orb-one" aria-hidden="true"/><div className="hero-orb orb-two" aria-hidden="true"/>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line"/> NEXT VENTURE · BUSINESS LAW · SUMMER 2026</div>
            <h1 id="hero-title">HealthPod <span>BD</span></h1>
            <p className="hero-tagline">Making basic health checks easier to access, one booth at a time.</p>
            <p className="hero-description">Explore our business concept, follow the legal crisis, and ask our AI Legal Advisor how Bangladesh’s business laws connect.</p>
            <div className="hero-actions"><a className="button button-primary" href="#advisor">Ask the AI Advisor <span aria-hidden="true">↗</span></a><a className="button button-secondary" href="#video">Watch the concept video <span aria-hidden="true">▶</span></a></div>
            <p className="hero-footnote"><span className="tiny-plus" aria-hidden="true">✚</span> A student business concept by Next Venture, UIU.</p>
          </div>
          <div className="hero-art" role="img" aria-label="Conceptual illustration of a HealthPod booth showing a health check screen">
            <span className="art-halo"/><span className="art-grid"/><span className="art-corner corner-one"/><span className="art-corner corner-two"/>
            <div className="art-status"><span/> A simpler check, closer to you</div>
            <div className="booth"><div className="booth-top"><span className="booth-symbol">✚</span> <strong>HealthPod</strong><small>BD</small></div><div className="booth-screen"><div className="screen-small">YOUR WELLNESS, IN VIEW</div><div className="screen-hello">Welcome<br/>to your check.</div><div className="screen-graph"><span/><span/><span/><span/><span/><span/><span/></div><div className="screen-steps"><span>01&nbsp; Check in</span><span>02&nbsp; Measure</span><span>03&nbsp; Report</span></div></div><div className="booth-bottom"><span className="booth-button"/><span>SELF-SERVICE HEALTH CHECK</span></div></div>
            <div className="art-note">Concept illustration <span aria-hidden="true">↗</span></div>
          </div>
        </div>
        <div className="container hero-scroll-cue"><span className="scroll-line"/> SCROLL TO EXPLORE</div>
      </section>

      <section className="section concept-section" id="concept" aria-labelledby="concept-title"><div className="container">
        <Reveal className="section-head concept-head"><div><span className="eyebrow">01 / THE IDEA</span><h2 id="concept-title">A quick check should fit<br/><em>into everyday life.</em></h2></div><p>HealthPod BD proposes self-service booths in the places people already pass through. Basic measurements and a clear report could help make routine monitoring more convenient, while professional care remains essential.</p></Reveal>
        <Reveal className="journey-grid">{journey.map(step=><div className="journey-card" key={step.number}><span className="journey-number">{step.number}</span><div className="journey-icon" aria-hidden="true">{step.number==='01'?'◎':step.number==='02'?'✚':step.number==='03'?'▤':'↗'}</div><h3>{step.title}</h3><p>{step.text}</p></div>)}</Reveal>
        <Reveal className="concept-bottom"><div><span className="mini-label">POSSIBLE PLACES</span><p>Universities · malls · metro stations · offices · transport hubs</p></div><div><span className="mini-label">PROPOSED REVENUE</span><p>Pay-per-check · memberships · care partnerships · corporate wellness</p></div></Reveal>
        <p className="concept-caveat">Glucose-testing method, hygiene, consent, device validation, and operational approvals remain questions for a real service.</p>
      </div></section>

      <section className="section story-section" id="story" aria-labelledby="story-title"><div className="container">
        <Reveal className="section-head story-head"><div><span className="eyebrow">02 / THE STORY</span><h2 id="story-title">From a promising idea<br/>to a legal crossroads.</h2></div><div><span className="scenario-label"><span/> {scenario.label}</span><p>This connected case is fictional and subject to team and instructor confirmation. The original business submission does not finalize a crisis.</p></div></Reveal>
        <div className="acts-grid"><Reveal className="act-card rise-card"><span className="act-kicker">ACT 01 <span>THE RISE</span></span><h3>Build the network.</h3><p>{scenario.facts[0]} {scenario.facts[1]}</p><div className="transaction"><div><strong>{scenario.kits}</strong><span>equipment kits</span></div><span className="times">×</span><div><strong>৳{scenario.kitPriceBdt.toLocaleString('en-US')}</strong><span>each</span></div><span className="equals">=</span><div><strong>৳{scenario.orderBdt.toLocaleString('en-US')}</strong><span>illustrative order</span></div></div></Reveal><Reveal className="act-card crisis-card"><span className="act-kicker">ACT 02 <span>THE CRISIS</span></span><h3>Inspect. Document. Respond.</h3><p>{scenario.facts[2]} {scenario.facts[3]}</p><div className="crisis-rule"><span>THE CORE ISSUE</span><strong>What can the evidence support?</strong><p>Check the agreements, test records, acceptance, partner signatures, cheque and bank memo before choosing a response.</p></div></Reveal></div>
        <Reveal className="law-map"><div className="law-map-intro"><span className="eyebrow">ONE STORY · FIVE LAWS</span><h3>How the law connects</h3><p>Each law enters at a different point in the same equipment dispute. Open a card to see what it changes.</p></div><div className="law-list">{laws.map((law,index)=><details key={law.name} className="law-item"><summary><span className="law-index">0{index+1}</span><span className="law-name">{law.name}<small>{law.phase}</small></span><span className="law-plus" aria-hidden="true">+</span></summary><p>{law.detail}</p></details>)}</div></Reveal>
      </div></section>

      <section className="section advisor-section" id="advisor" aria-labelledby="advisor-title"><div className="container advisor-layout"><Reveal className="advisor-intro"><span className="eyebrow">03 / ASK THE ADVISOR</span><h2 id="advisor-title">A better question<br/>opens the case.</h2><p>Ask about HealthPod BD in English, বাংলা, or Banglish. Test the proposed facts, change a detail, and see which evidence matters.</p><div className="advisor-side-note"><span className="side-note-icon">i</span><div><strong>Built for the legal firefight.</strong><p>Answers draw on reviewed scenario notes and official Bangladesh statute references. They can still make mistakes, so check every conclusion.</p></div></div></Reveal><Reveal><Advisor/></Reveal></div></section>

      <section className="section video-section" id="video" aria-labelledby="video-title"><div className="container video-layout"><Reveal><span className="eyebrow">04 / THE CONCEPT VIDEO</span><h2 id="video-title">See the idea<br/>in motion.</h2><p>The supplied YouTube video is here for the team’s concept presentation. Its duration, contents and production tool still need team review.</p>{video && <a className="text-link" href={video.watchUrl} target="_blank" rel="noopener noreferrer">Open on YouTube <span aria-hidden="true">↗</span></a>}</Reveal><Reveal className="video-wrap">{video?<iframe src={video.embedUrl} title="HealthPod BD concept video on YouTube" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="video-unavailable"><span>▶</span><strong>Video temporarily unavailable</strong><p>Add a valid YouTube URL to the local environment configuration.</p></div>}</Reveal></div></section>

      <section className="section verification-section" aria-labelledby="verify-title"><div className="container"><Reveal className="section-head"><div><span className="eyebrow">05 / VERIFY THE AI</span><h2 id="verify-title">Trust the source,<br/><em>check the answer.</em></h2></div><p>The competition asks for a genuine AI error and a documented correction. We will show that evidence only after the team supplies an original transcript or screenshot.</p></Reveal><Reveal className="verification-card"><div className="verification-symbol">?</div><div><span className="pending-pill">{factCheck.status==='pending'?'EVIDENCE PENDING':'EVIDENCE VERIFIED'}</span><h3>{factCheck.status==='pending'?'Fact-check evidence pending team verification':'Verified fact-check'}</h3>{factCheck.status==='pending'?<p>No authentic incorrect AI claim has been supplied yet. The team must record the exact claim, verify the correction against an official statute and section, and provide the original evidence.</p>:<div className="fact-details"><p><strong>Tool / date:</strong> {factCheck.toolModel} · {factCheck.date}</p><p><strong>Original prompt:</strong> {factCheck.originalPrompt}</p><p><strong>Exact incorrect claim:</strong> “{factCheck.exactIncorrectClaim}”</p><p><strong>Original evidence:</strong> {factCheck.originalEvidence}</p><p><strong>Why incorrect:</strong> {factCheck.whyIncorrect}</p><p><strong>Correction:</strong> {factCheck.correction}</p><p><strong>Reviewed source:</strong> {factCheck.officialUrl?<a href={factCheck.officialUrl} target="_blank" rel="noopener noreferrer">{factCheck.statute} § {factCheck.section} ↗</a>:factCheck.statute} · {factCheck.reviewedAt}</p>{factCheck.reviewer&&<p><strong>Reviewer:</strong> {factCheck.reviewer}</p>}</div>}</div></Reveal></div></section>

      <section className="section sources-section" aria-labelledby="sources-title"><div className="container"><Reveal className="sources-grid"><div><span className="eyebrow">06 / THE REFERENCES</span><h2 id="sources-title">Sources & tools.</h2><p>The legal advisor uses a curated knowledge collection. Statute links point to the official Bangladesh Laws site; a source badge is a trail to check, not proof that an AI conclusion is correct.</p><div className="review-stamp">Knowledge reviewed against listed provisions · 1 Oct 2026</div></div><div className="sources-accordions"><details><summary>Official legal references <span aria-hidden="true">+</span></summary><ul>{legalSources.map(entry=><li key={entry.id}><a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">{entry.sourceTitle} <span aria-hidden="true">↗</span></a></li>)}</ul></details><details><summary>Project documents & AI tools <span aria-hidden="true">+</span></summary><div className="sources-copy"><p><strong>Project:</strong> HealthPod BD Business Idea Submission; AI Legal Advisor Knowledge Document; UIU Business Law Poster Competition brief.</p><p><strong>Chat model:</strong> {process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash'} via Google Gemini. <strong>Video-generation tool:</strong> pending team identification.</p></div></details></div></Reveal></div></section>

      <section className="section team-section" id="team" aria-labelledby="team-title"><div className="container"><Reveal className="team-head"><span className="eyebrow">07 / THE PEOPLE</span><h2 id="team-title">Meet Next Venture.</h2><p>Section B · United International University</p></Reveal><Reveal className="team-grid">{team.map(member=><article className="team-card" key={member.name}><div className="portrait-ring">{member.photo?<Image src={member.photo} alt={`Portrait of ${member.name}`} width={360} height={360} sizes="(max-width: 600px) 38vw, (max-width: 900px) 22vw, 220px" style={{objectPosition:member.objectPosition,transform:member.photoTransform}}/>:<span aria-label={`${member.name} portrait unavailable`}>{member.initials}</span>}</div><h3>{member.name}</h3><p>ID {member.studentId}</p></article>)}</Reveal></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><p>Next Venture · Section B · Business Law LAW 4151 / 2106 · Summer 2026 · United International University.</p><p>Educational concept only. Chat stays in this browser session and is sent to Google Gemini; do not share personal or medical information.</p><a href="#top">Back to top ↑</a></div></footer>
  </>;
}
