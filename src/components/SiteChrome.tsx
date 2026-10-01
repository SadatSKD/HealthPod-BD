'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const links = [{href:'#story',label:'The story'},{href:'#advisor',label:'AI Advisor'},{href:'#video',label:'Concept video'},{href:'#team',label:'The team'}];

export function SiteChrome() {
  const [open,setOpen] = useState(false);
  const [progress,setProgress] = useState(0);
  useEffect(()=>{
    const update=()=>{ const max=document.documentElement.scrollHeight-window.innerHeight; setProgress(max>0?window.scrollY/max*100:0); };
    window.addEventListener('scroll',update,{passive:true}); update();
    return ()=>window.removeEventListener('scroll',update);
  },[]);
  useEffect(()=>{
    if (!open) return;
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape') setOpen(false);};
    window.addEventListener('keydown',escape);
    return ()=>window.removeEventListener('keydown',escape);
  },[open]);
  return <>
    <div className="scroll-progress" style={{width:`${progress}%`}} aria-hidden="true" />
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label="HealthPod BD, back to top" onClick={()=>setOpen(false)}><Image src="/brand/healthpod-logo.jpeg" width={1600} height={584} priority alt="HealthPod BD" /></a>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-nav" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}><span /><span /><span /></button>
        <nav id="primary-nav" className={open?'nav-links is-open':'nav-links'} aria-label="Primary navigation">{links.map(link=><a key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.label}</a>)}<a href="#advisor" className="nav-cta" onClick={()=>setOpen(false)}>Ask a question <span aria-hidden="true">↗</span></a></nav>
      </div>
    </header>
  </>;
}

export function Reveal({children,className=''}:{children:React.ReactNode;className?:string}) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const item=ref.current;
    if(!item) return;
    const observer = new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
    item.dataset.revealReady='true';observer.observe(item);
    return ()=>observer.disconnect();
  },[]);
  return <div ref={ref} data-reveal className={className}>{children}</div>;
}
