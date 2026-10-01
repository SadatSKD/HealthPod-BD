import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',args:['--no-sandbox']});
await mkdir('artifacts',{recursive:true});
try {
  for(const width of [320,390,768,1440]) {
    const page = await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    if(width===390) await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
    await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,45));}window.scrollTo(0,0);});
    await page.locator('.team-card img').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);});
    await page.waitForTimeout(450);
    await page.screenshot({path:`artifacts/ui-${width}.png`,fullPage:true});
    if(width===320) await page.locator('.hero').screenshot({path:'artifacts/hero-320.png'});
    if(width===1440) await page.locator('.team-section').screenshot({path:'artifacts/team-1440.png'});
    const metrics=await page.evaluate(()=>({innerWidth,scrollWidth:document.documentElement.scrollWidth,overflowElements:[...document.querySelectorAll<HTMLElement>('body *')].filter(element=>{const rect=element.getBoundingClientRect();return rect.width>0 && rect.right>innerWidth+1 && getComputedStyle(element).position!=='absolute'}).slice(0,10).map(element=>({tag:element.tagName,className:element.className,right:Math.round(element.getBoundingClientRect().right)})),brokenImages:[...document.images].filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.getAttribute('src')),teamCount:document.querySelectorAll('.team-card').length,videoSource:document.querySelector('iframe')?.getAttribute('src')}));
    console.log(JSON.stringify({width,...metrics,errors}));
    if(width===320){
      await page.getByRole('button',{name:'Open menu'}).click();
      const expanded=await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded');
      await page.keyboard.press('Escape');
      console.log(JSON.stringify({mobileMenuExpanded:expanded,mobileMenuClosed:await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')}));
      await page.getByRole('link',{name:'Ask the AI Advisor'}).click();
      console.log(JSON.stringify({advisorAnchor:new URL(page.url()).hash}));
      await page.getByLabel('Your question').fill('How do all five laws connect?');
      await page.getByRole('button',{name:/Send/}).click();
      await page.waitForFunction(()=>!!document.querySelector('[role=alert]')?.textContent?.trim());
      console.log(JSON.stringify({chatError:await page.locator('.chat-error').innerText(),draftPreserved:await page.getByLabel('Your question').inputValue()}));
    }
    if(width===390){
      console.log(JSON.stringify({reducedMotion:await page.evaluate(()=>({scrollBehavior:getComputedStyle(document.documentElement).scrollBehavior,revealOpacity:getComputedStyle(document.querySelector('[data-reveal]')!).opacity}))}));
      await page.setViewportSize({width:390,height:500});
      const input=page.getByLabel('Your question');
      await input.scrollIntoViewIfNeeded();await input.focus();
      const inputBox=await input.boundingBox();
      const bangla=page.getByRole('button',{name:'ত্রুটিপূর্ণ যন্ত্র দিলে HealthPod কী করতে পারে?'});
      const glyphFits=await bangla.evaluate(element=>element.scrollHeight<=element.clientHeight+1);
      const shortTargets=await page.evaluate(()=>[...document.querySelectorAll<HTMLElement>('button,select,a')].filter(element=>getComputedStyle(element).display!=='none'&&element.getBoundingClientRect().width>0&&element.getBoundingClientRect().height>0&&element.getBoundingClientRect().height<44).slice(0,8).map(element=>({label:element.textContent?.trim().slice(0,35),height:Math.round(element.getBoundingClientRect().height)})));
      console.log(JSON.stringify({keyboardViewportInputVisible:!!inputBox&&inputBox.y>=0&&inputBox.y+inputBox.height<=500,bengaliChipGlyphFits:glyphFits,shortTargets}));
    }
    if(width===1440){
      const fallback=await page.locator('a[href="https://www.youtube.com/watch?v=cz1xlWTkY94"]').count();
      const frame=page.frames().find(item=>item.url().includes('youtube.com/embed/'));
      const playButton=frame?await frame.locator('.ytp-large-play-button').count().catch(()=>0):0;
      let videoControlResult='controls not visible in this browser environment';
      if(frame && playButton){
        await frame.locator('.ytp-large-play-button').click({timeout:3000}).catch(()=>{});
        videoControlResult=await frame.locator('.ytp-play-button').getAttribute('aria-label',{timeout:3000}).catch(()=>null)||'player loaded';
      }
      console.log(JSON.stringify({videoFallbackLink:!!fallback,videoFrameUrl:frame?.url()||null,videoControlResult}));
    }
    await page.close();
  }
} finally { await browser.close(); }
