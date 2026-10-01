'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatResponse, Language } from '@/lib/chat-shared';

type Message = {role:'user'|'assistant';content:string;sources?:ChatResponse['sources']};
const starters = [
  'How do all five laws connect to HealthPod BD?',
  'ত্রুটিপূর্ণ যন্ত্র দিলে HealthPod কী করতে পারে?',
  'Supplier er cheque bounce korle ki hobe?',
  'Why does partnership law apply if HealthPod is a company?'
];

export function Advisor() {
  const [language,setLanguage]=useState<Language>('auto');
  const [draft,setDraft]=useState('');
  const [messages,setMessages]=useState<Message[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [wait,setWait]=useState(0);
  const [newResponse,setNewResponse]=useState(false);
  const scrollRef=useRef<HTMLDivElement>(null);
  const nearBottom=useRef(true);
  const currentRequest=useRef(false);
  useEffect(()=>{if(wait<=0)return;const timer=window.setInterval(()=>setWait(value=>Math.max(0,value-1)),1000);return()=>window.clearInterval(timer);},[wait]);
  useEffect(()=>{if(!loading && nearBottom.current) scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:'smooth'});},[messages,loading]);

  async function send(value=draft) {
    const message=value.trim();
    if(!message || currentRequest.current || wait>0) return;
    if(message.length>2000){setError('Please keep your question under 2,000 characters.');return;}
    currentRequest.current=true; setLoading(true); setError('');
    const history=messages.slice(-8).map(({role,content})=>({role,content}));
    try {
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language,history})});
      const data=await response.json() as ChatResponse & {error?:string};
      if(!response.ok || !data.answer){
        setError(data.error || 'The advisor is unavailable. Please try again.');
        if(response.status===429)setWait(Number(response.headers.get('Retry-After'))||60);
        return;
      }
      setMessages(previous=>[...previous,{role:'user',content:message},{role:'assistant',content:data.answer,sources:data.sources}]);
      setDraft('');
      if(!nearBottom.current)setNewResponse(true);
    } catch { setError('Connection lost. Your question is still here; please try again.'); }
    finally {setLoading(false);currentRequest.current=false;}
  }

  function onScroll(){const element=scrollRef.current;if(!element)return;nearBottom.current=element.scrollHeight-element.scrollTop-element.clientHeight<90;if(nearBottom.current)setNewResponse(false);}
  function goToLatest(){const element=scrollRef.current;if(element)element.scrollTo({top:element.scrollHeight,behavior:'smooth'});setNewResponse(false);nearBottom.current=true;}

  return <div className="advisor-shell">
    <div className="advisor-top"><div><span className="online-dot" aria-hidden="true"/><span className="eyebrow compact">AI LEGAL ADVISOR</span><h3>Ask the question behind the story.</h3></div><button type="button" className="clear-button" onClick={()=>{setMessages([]);setDraft('');setError('');setNewResponse(false);}} disabled={loading || !messages.length}>Clear chat</button></div>
    <div className="advisor-controls"><label htmlFor="chat-language">Response language</label><select id="chat-language" value={language} onChange={event=>setLanguage(event.target.value as Language)}><option value="auto">Auto · match my question</option><option value="en">English</option><option value="bn">বাংলা</option><option value="banglish">Banglish</option></select></div>
    <div className="chat-window" ref={scrollRef} onScroll={onScroll} role="log" aria-label="Chat conversation" aria-live="polite" aria-relevant="additions text">
      {messages.length===0 && <div className="chat-welcome"><div className="spark-icon" aria-hidden="true">✳</div><strong>Start with a question</strong><p>Ask about the five laws, the supplier dispute, or a new judge’s curveball. The scenario is illustrative until the team confirms it.</p></div>}
      {messages.map((item,index)=><div className={`chat-message ${item.role}`} key={index}><span className="message-label">{item.role==='user'?'You':'HealthPod advisor'}</span><p>{item.content}</p>{!!item.sources?.length && <div className="message-sources"><span>Sources</span>{item.sources.map(source=>source.url?<a href={source.url} key={source.id} target="_blank" rel="noopener noreferrer" title={source.title}>{source.title.replace(/, sections?.*$/i,'')}{source.section?` · §§ ${source.section}`:''} <span aria-hidden="true">↗</span></a>:<span className="local-source" key={source.id} title={source.title}>{source.title}</span>)}</div>}</div>)}
      {loading && <div className="chat-message assistant typing" aria-label="Advisor is preparing a response"><span className="message-label">HealthPod advisor</span><div aria-hidden="true"><i/><i/><i/></div></div>}
    </div>
    {newResponse && <button className="new-response" type="button" onClick={goToLatest}>New response ↓</button>}
    <div className="starter-wrap"><span>Try asking</span><div className="starter-list">{starters.map(item=><button type="button" key={item} disabled={loading || wait>0} onClick={()=>{setDraft(item);void send(item);}}>{item}</button>)}</div></div>
    <form className="chat-form" onSubmit={event=>{event.preventDefault();void send();}}><label htmlFor="chat-message" className="sr-only">Your question</label><textarea id="chat-message" rows={2} value={draft} maxLength={2000} placeholder="Ask about HealthPod BD and Bangladesh business law…" onChange={event=>setDraft(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();void send();}}} /><button className="send-button" type="submit" disabled={!draft.trim() || loading || wait>0}>{loading?'Thinking…':wait>0?`Wait ${wait}s`:'Send'} <span aria-hidden="true">↗</span></button></form>
    {error && <p className="chat-error" role="alert">{error} <button type="button" onClick={()=>void send()} disabled={loading || wait>0}>Retry</button></p>}
    <div className="chat-notice"><p>Educational business-law information. Verify legal conclusions against the cited law.</p><p>Messages are sent to Google’s Gemini service. Please do not share personal, medical, or confidential information.</p></div>
  </div>;
}
