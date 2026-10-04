import { seedRecipes } from './recipes.js';

const savedRatings = JSON.parse(localStorage.getItem('spams-pantry-ratings') || '{}');
const recipes = seedRecipes.map(recipe => ({...recipe, taste: Number(savedRatings[recipe.id]) || recipe.taste}));
let pantry = [];
let activeType = 'All';
let activeMeal = 'All';
let query = '';
const grid = document.querySelector('#recipeGrid');
const chips = document.querySelector('#ingredientChips');
const summary = document.querySelector('#matchSummary');
const detailDialog = document.querySelector('#recipeDialog');

const normalize = text => text.toLowerCase().replace(/[^a-z\s]/g,' ').replace(/\b(g|kg|ml|l|tbsp|tsp|tin|half|the|a|an|of|and|to|in|with|dry|chopped|sliced|diced|drained|lean|hot)\b/g,' ').replace(/\s+/g,' ').trim();
const ingredientName = line => normalize(line).split(' ').filter(w => w.length > 2).slice(-3).join(' ');
const persistRatings = () => localStorage.setItem('spams-pantry-ratings', JSON.stringify(Object.fromEntries(recipes.map(r => [r.id, r.taste]))));
const types = () => ['All', ...new Set(recipes.map(r => r.type))];
const meals = () => ['All', ...new Set(recipes.map(r => r.meal))];

function matchFor(recipe){
  if(!pantry.length) return null;
  const ingredients = recipe.ingredients.map(normalize).join(' ');
  const matched = pantry.filter(item => ingredients.includes(normalize(item)) || normalize(item).split(' ').some(word => word.length > 2 && ingredients.includes(word)));
  return {count:matched.length, percent:Math.round((matched.length / recipe.ingredients.length) * 100)};
}

function starButtons(recipe, compact=false){
  const wrap=document.createElement('div'); wrap.className='stars'; wrap.setAttribute('role','group'); wrap.setAttribute('aria-label',`Rate ${recipe.title} for taste`);
  for(let i=1;i<=5;i++){const b=document.createElement('button');b.type='button';b.className=`star ${i<=recipe.taste?'filled':''}`;b.textContent='★';b.title=`${i} out of 5`;b.setAttribute('aria-label',`${i} star${i>1?'s':''}`);b.onclick=e=>{e.stopPropagation();recipe.taste=i;persistRatings();render();if(!compact)openRecipe(recipe.id)};wrap.append(b)}
  return wrap;
}

function renderFilters(){
  const renderRow=(selector,values,active,onSelect)=>{const row=document.querySelector(selector);row.innerHTML='';values.forEach(value=>{const b=document.createElement('button');b.className=`filter-chip ${value===active?'active':''}`;b.textContent=value;b.type='button';b.setAttribute('aria-pressed',String(value===active));b.onclick=()=>{onSelect(value);render()};row.append(b)})};
  renderRow('#mealFilterRow',meals(),activeMeal,value=>activeMeal=value);
  renderRow('#typeFilterRow',types(),activeType,value=>activeType=value);
}

function render(){
  renderFilters(); grid.innerHTML='';
  let visible=recipes.filter(r=>(activeMeal==='All'||r.meal===activeMeal)&&(activeType==='All'||r.type===activeType)&&(`${r.title} ${r.description} ${r.ingredients.join(' ')}`.toLowerCase().includes(query)));
  if(pantry.length) visible.sort((a,b)=>(matchFor(b)?.count||0)-(matchFor(a)?.count||0));
  document.querySelector('#emptyState').hidden=visible.length>0;
  visible.forEach(recipe=>{
    const match=matchFor(recipe); const card=document.createElement('article'); card.className='recipe-card';
    const image=recipe.image?`<img class="card-image" src="${recipe.image}" alt="${recipe.title}">`:`<div class="custom-placeholder" aria-hidden="true">${recipe.title.charAt(0)}</div>`;
    card.innerHTML=`<div class="card-image-wrap">${image}<span class="type-pill">${recipe.meal} · ${recipe.type}</span>${match&&match.count?`<span class="match-pill">${match.count} match${match.count>1?'es':''}</span>`:''}</div><div class="card-body"><h3>${recipe.title}</h3><p class="card-description">${recipe.description||'A family recipe waiting to be cooked.'}</p><div class="card-meta"><span>◷ ${recipe.time}</span><span>♙ Serves ${recipe.serves}</span></div><div class="card-footer"><div class="rating-slot"></div><span class="expense" title="Expense">${'£'.repeat(recipe.expense)}<span class="off">${'£'.repeat(3-recipe.expense)}</span></span><button class="open-recipe" type="button">View →</button></div></div>`;
    card.querySelector('.rating-slot').replaceWith(starButtons(recipe,true));
    card.querySelector('.open-recipe').onclick=()=>openRecipe(recipe.id);
    card.querySelector('.card-image-wrap').onclick=()=>openRecipe(recipe.id);
    grid.append(card);
  });
  if(pantry.length){const best=visible.slice(0,3).filter(r=>matchFor(r).count);summary.hidden=!best.length;summary.innerHTML=best.length?`Best matches: <strong>${best.map(r=>`${r.title} (${matchFor(r).count})`).join(' · ')}</strong>`:''}else summary.hidden=true;
}

function renderPantry(){chips.innerHTML='';pantry.forEach((item,index)=>{const b=document.createElement('button');b.className='ingredient-chip';b.type='button';b.textContent=`${item} ×`;b.title='Remove ingredient';b.onclick=()=>{pantry.splice(index,1);renderPantry();render()};chips.append(b)});render()}

function formatNumber(value){
  const rounded=Math.round(value*100)/100;
  const whole=Math.floor(rounded);const fraction=Math.round((rounded-whole)*4)/4;
  const symbols={0.25:'¼',0.5:'½',0.75:'¾'};
  if(symbols[fraction])return `${whole||''}${symbols[fraction]}`;
  return Number.isInteger(rounded)?String(rounded):String(rounded).replace(/\.00$/,'');
}

function scaleIngredient(line,factor){
  if(factor===1)return line;
  const fractions={'½':.5,'¼':.25,'¾':.75};
  return line.replace(/^(\d+(?:\.\d+)?)?([½¼¾])|^(\d+(?:\.\d+)?)/,(amount,whole,fraction,decimal)=>{
    const number=decimal!==undefined?Number(decimal):Number(whole||0)+fractions[fraction];
    return `<span class="scaled-amount">${formatNumber(number*factor)}</span>`;
  });
}

function renderScaledIngredients(recipe,servings){
  const factor=servings/recipe.serves;
  const list=document.querySelector('#scaledIngredients');
  list.innerHTML=recipe.ingredients.map(item=>`<li>${scaleIngredient(item,factor)}</li>`).join('');
  document.querySelector('#scaledNote').textContent=servings===recipe.serves?`Original recipe · serves ${recipe.serves}`:`Quantities scaled × ${formatNumber(factor)} from the original`;
}

function openRecipe(id){
  const recipe=recipes.find(r=>r.id===id);if(!recipe)return;const match=matchFor(recipe);const el=document.querySelector('#recipeDetail');
  const servingOptions=Array.from({length:8},(_,i)=>i+1).map(n=>`<option value="${n}" ${n===recipe.serves?'selected':''}>${n} ${n===1?'person':'people'}</option>`).join('');
  el.innerHTML=`${recipe.image?`<img class="detail-image" src="${recipe.image}" alt="${recipe.title}">`:''}<div class="detail-content"><div class="detail-top"><div><p class="eyebrow">${recipe.meal.toUpperCase()} · ${recipe.type.toUpperCase()}</p><h2>${recipe.title}</h2></div><button class="icon-button" type="button" data-close-detail aria-label="Close">×</button></div><p class="detail-lead">${recipe.description||''}</p>${recipe.source?`<a class="source-link" href="${recipe.source}" target="_blank" rel="noopener noreferrer">Inspired by ${recipe.sourceLabel} ↗</a>`:''}<div class="detail-meta"><span>◷ ${recipe.time}</span><label class="serving-control">Scale for <select id="servingSelect" aria-label="Number of people">${servingOptions}</select></label><span>${'£'.repeat(recipe.expense)} expense</span>${match?`<span>${match.count} pantry matches</span>`:''}</div><div class="rating-line"><strong>Taste</strong><div class="detail-rating"></div></div><div class="detail-columns"><section><h3>Ingredients</h3><p class="scaled-note" id="scaledNote"></p><ul class="ingredients-list" id="scaledIngredients"></ul></section><section><h3>Method</h3><ol class="steps-list">${recipe.steps.map(s=>`<li>${s}</li>`).join('')}</ol></section></div></div>`;
  renderScaledIngredients(recipe,recipe.serves);
  el.querySelector('#servingSelect').onchange=e=>renderScaledIngredients(recipe,Number(e.target.value));
  el.querySelector('.detail-rating').replaceWith(starButtons(recipe));el.querySelector('[data-close-detail]').onclick=()=>detailDialog.close();
  if(!detailDialog.open)detailDialog.showModal();
}

document.querySelector('#ingredientForm').addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector('#ingredientInput');const value=input.value.trim();if(value&&!pantry.some(i=>i.toLowerCase()===value.toLowerCase()))pantry.push(value);input.value='';renderPantry()});
document.querySelector('#searchInput').addEventListener('input',e=>{query=e.target.value.toLowerCase().trim();render()});
detailDialog.addEventListener('click',e=>{if(e.target===detailDialog)detailDialog.close()});
const suggestions=[...new Set(recipes.flatMap(recipe=>recipe.ingredients.map(ingredientName)).filter(Boolean))].sort();
document.querySelector('#ingredientSuggestions').innerHTML=suggestions.map(item=>`<option value="${item}"></option>`).join('');
render();
