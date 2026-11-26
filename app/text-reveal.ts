export function prepareTextReveal(roots:HTMLElement[],reduced:boolean){
 const originals:{node:Text;replacement:HTMLElement}[]=[];
 if(!reduced)for(const root of roots){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),texts:Text[]=[];let node:Node|null;
  while((node=walker.nextNode()))if(node.textContent?.trim())texts.push(node as Text);
  const total=texts.reduce((sum,n)=>sum+Array.from(n.data).length,0);let order=0;
  for(const text of texts){const wrapper=document.createElement('span');wrapper.className='reveal-run';
   const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=text.data;wrapper.append(accessible);
   const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');
   for(const word of text.data.split(/(\s+)/)){if(!word)continue;if(/^\s+$/.test(word)){visual.append(document.createTextNode(word));order+=word.length;continue;}
    const group=document.createElement('span');group.className='reveal-word';
    for(const char of Array.from(word)){const span=document.createElement('span');span.className='reveal-char';span.textContent=char;span.style.setProperty('--reveal-delay',((order++/Math.max(1,total))*.62)+'s');group.append(span);}visual.append(group);
   }wrapper.append(visual);text.replaceWith(wrapper);originals.push({node:text,replacement:wrapper});
  }
 }
 let last=-1;
 return {update(index:number){if(index===last)return;last=index;roots.forEach(root=>root.classList.toggle('text-revealed',index>=0&&root.closest('section')?.id===['accueil','offres','methode','projets','contact'][index]));if(index>=0&&!reduced)window.dispatchEvent(new Event('ohiho:text-reveal'));},dispose(){for(const {node,replacement} of originals)replacement.replaceWith(node);roots.forEach(root=>root.classList.remove('text-revealed'));}};
}
