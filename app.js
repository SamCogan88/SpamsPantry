const seedRecipes = [
  {id:'sausage-casserole',title:'Sausage Tomato & Chickpea Casserole',image:'assets/01-sausage-bean-casserole.png',type:'Slow cooker',time:'6–7 hrs',serves:2,expense:2,taste:0,description:'A rich, smoky casserole with browned sausages, sweet peppers and a thick tomato sauce.',ingredients:['454g pork sausages','1 onion, sliced','1 pepper, chopped','1 carrot, sliced','400g chopped tomatoes','200g chickpeas, drained','1 tbsp tomato purée','1 tsp smoked paprika','1 tsp mixed herbs','½ chicken stock cube','1 tsp Worcestershire sauce'],steps:['Brown the sausages in a frying pan for 5 minutes.','Put the onion, pepper and carrot in the slow cooker. Arrange the sausages on top.','Add the tomatoes, chickpeas, tomato purée, paprika, herbs, stock and Worcestershire sauce.','Cook on low for 6–7 hours or high for 3–4 hours.','If the sauce is thin, remove the lid and cook on high for the final 20 minutes. Season to taste.']},
  {id:'chicken-cacciatore',title:'Chicken Cacciatore with Potatoes',image:'assets/02-chicken-cacciatore.png',type:'Slow cooker',time:'6 hrs',serves:2,expense:2,taste:0,description:'Tender chicken thighs cooked with peppers, mushrooms and potatoes in a herby tomato sauce.',ingredients:['420g chicken thigh fillets','350g baby potatoes, halved','1 onion, sliced','1 pepper, sliced','150g mushrooms, sliced','400g chopped tomatoes','150ml passata','1 tsp garlic purée','1 tsp mixed herbs','½ chicken stock cube','Black pepper'],steps:['Place the potatoes, onion, pepper and mushrooms in the slow cooker.','Season the chicken and lay it over the vegetables.','Mix the tomatoes, passata, garlic, herbs and stock cube. Pour over the chicken.','Cook on low for 6 hours or high for 3–4 hours.','Lift the chicken onto warm plates, stir the sauce and season to serve.']},
  {id:'beef-chilli',title:'Slow Cooker Beef Chilli',image:'assets/03-beef-chilli.png',type:'Slow cooker',time:'6–7 hrs',serves:2,expense:2,taste:0,description:'A deeply tomatoey chilli with beef, kidney beans and gentle smoky heat.',ingredients:['250g lean beef mince','1 onion, diced','1 pepper, diced','1 carrot, diced','400g chopped tomatoes','400g kidney beans, drained','1 tbsp tomato purée','1 tsp mild chilli powder','1 tsp smoked paprika','1 tsp garlic purée','½ beef stock cube','140g long grain rice'],steps:['Brown the mince in a frying pan and drain excess fat.','Put the onion, pepper and carrot in the slow cooker, then add the beef.','Stir in the tomatoes, beans, tomato purée, spices, garlic and stock.','Cook on low for 6–7 hours or high for 3–4 hours.','Cook the rice separately, season the chilli and serve.']},
  {id:'beef-orzo',title:'One Pot Beef & Tomato Orzo',image:'assets/04-beef-tomato-orzo.png',type:'One pot',time:'35 min',serves:2,expense:2,taste:0,description:'A glossy, comforting one-pot pasta with beef, vegetables and plenty of tomato flavour.',ingredients:['250g lean beef mince','1 onion, diced','1 carrot, diced','1 pepper, diced','400g chopped tomatoes','200ml passata','150g orzo','1 tsp garlic purée','1 tsp mixed herbs','1 beef stock cube','1 tsp Worcestershire sauce'],steps:['Brown the mince in a deep pan. Add the vegetables and cook for 5 minutes.','Stir in the garlic and herbs, then add tomatoes, passata, stock and Worcestershire sauce.','Add the orzo and simmer uncovered for 12–15 minutes, stirring often.','Add a splash of water whenever the pan looks dry.','Season and rest for 5 minutes before serving.']},
  {id:'chickpea-stew',title:'Smoky Chickpea & Sweet Potato Stew',image:'assets/05-chickpea-sweet-potato-stew.png',type:'Slow cooker',time:'6 hrs',serves:2,expense:1,taste:0,description:'A vibrant vegetarian stew with sweet potato, chickpeas and peppers in a smoky tomato broth.',ingredients:['400g sweet potato, cubed','200g chickpeas, drained','1 onion, diced','1 pepper, chopped','1 carrot, sliced','400g chopped tomatoes','1 tsp garlic purée','1 tsp smoked paprika','½ tsp mild chilli powder','1 tsp mixed herbs','½ vegetable stock cube'],steps:['Put the sweet potato, chickpeas, onion, pepper and carrot in the slow cooker.','Add the tomatoes, garlic, paprika, chilli, herbs and stock. Stir well.','Cook on low for 6 hours or high for 3–4 hours.','Mash a few sweet potato cubes against the side and stir through to thicken.','Taste, season and serve in warm bowls.']}
  ,{id:'viral-doner-kebab',title:'Homemade Döner Kebab Pitas',image:'',type:'Oven',time:'35 min',serves:4,expense:2,taste:0,description:'Tender, warmly spiced beef döner baked in parchment and tucked into warm pitas with roast tomatoes, peppers and cooling sauces.',ingredients:['1 onion, roughly chopped','2 garlic cloves','454g beef mince','1 tbsp tomato purée','2 tbsp Greek yoghurt','1 tsp ground cumin','1 tsp paprika','¼ tsp red pepper flakes (optional)','1 tsp salt','½ tsp black pepper','3 tomatoes, quartered','2 green peppers','1 tbsp olive oil','4 pita breads','Chilli sauce, to serve','Garlic-yoghurt mayo sauce, to serve'],steps:['Heat the oven to 204°C and line a large baking tray.','Blend the onion and garlic to a smooth purée, keeping all the liquid.','Mix the onion purée with the beef, tomato purée, Greek yoghurt, cumin, paprika, chilli flakes, salt and pepper for 1–2 minutes until thoroughly combined.','Divide the meat into three equal pieces. Place each piece between sheets of baking parchment and roll it into an even rectangle.','Remove the top sheet, then roll each meat rectangle tightly from a short edge with the bottom parchment still attached. Put all three rolls on the tray.','Add the tomatoes and peppers alongside the rolls, drizzle the vegetables with olive oil and season lightly.','Bake for 15–20 minutes until the meat is cooked and lightly browned. Rest for 5 minutes, unwrap and tear into generous strips.','Warm the pita breads, fill with döner meat and roasted vegetables, then finish with chilli sauce and garlic-yoghurt mayo sauce.']}
];

const savedRatings = JSON.parse(localStorage.getItem('spams-pantry-ratings') || '{}');
const recipes = seedRecipes.map(recipe => ({...recipe, taste: Number(savedRatings[recipe.id]) || recipe.taste}));
let pantry = [];
let activeType = 'All';
let query = '';
const grid = document.querySelector('#recipeGrid');
const chips = document.querySelector('#ingredientChips');
const summary = document.querySelector('#matchSummary');
const detailDialog = document.querySelector('#recipeDialog');

const normalize = text => text.toLowerCase().replace(/[^a-z\s]/g,' ').replace(/\b(g|kg|ml|l|tbsp|tsp|tin|half|the|a|an|of|and|to|in|with|dry|chopped|sliced|diced|drained|lean|hot)\b/g,' ').replace(/\s+/g,' ').trim();
const ingredientName = line => normalize(line).split(' ').filter(w => w.length > 2).slice(-3).join(' ');
const persistRatings = () => localStorage.setItem('spams-pantry-ratings', JSON.stringify(Object.fromEntries(recipes.map(r => [r.id, r.taste]))));
const types = () => ['All', ...new Set(recipes.map(r => r.type))];

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
  const row=document.querySelector('#filterRow');row.innerHTML='';
  types().forEach(type=>{const b=document.createElement('button');b.className=`filter-chip ${type===activeType?'active':''}`;b.textContent=type;b.type='button';b.onclick=()=>{activeType=type;render()};row.append(b)});
}

function render(){
  renderFilters(); grid.innerHTML='';
  let visible=recipes.filter(r=>(activeType==='All'||r.type===activeType)&&(`${r.title} ${r.description} ${r.ingredients.join(' ')}`.toLowerCase().includes(query)));
  if(pantry.length) visible.sort((a,b)=>(matchFor(b)?.count||0)-(matchFor(a)?.count||0));
  document.querySelector('#emptyState').hidden=visible.length>0;
  visible.forEach(recipe=>{
    const match=matchFor(recipe); const card=document.createElement('article'); card.className='recipe-card';
    const image=recipe.image?`<img class="card-image" src="${recipe.image.replace('assets/','')}" alt="${recipe.title}">`:`<div class="custom-placeholder" aria-hidden="true">${recipe.title.charAt(0)}</div>`;
    card.innerHTML=`<div class="card-image-wrap">${image}<span class="type-pill">${recipe.type}</span>${match&&match.count?`<span class="match-pill">${match.count} match${match.count>1?'es':''}</span>`:''}</div><div class="card-body"><h3>${recipe.title}</h3><p class="card-description">${recipe.description||'A family recipe waiting to be cooked.'}</p><div class="card-meta"><span>◷ ${recipe.time}</span><span>♙ Serves ${recipe.serves}</span></div><div class="card-footer"><div class="rating-slot"></div><span class="expense" title="Expense">${'£'.repeat(recipe.expense)}<span class="off">${'£'.repeat(3-recipe.expense)}</span></span><button class="open-recipe" type="button">View →</button></div></div>`;
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
  return line.replace(/^(\d+(?:\.\d+)?|[½¼¾])/,amount=>{
    const number=fractions[amount]??Number(amount);
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
  const recipe=recipes.find(r=>r.id===id);if(!recipe)return;recipe.image=recipe.image.replace('assets/','');const match=matchFor(recipe);const el=document.querySelector('#recipeDetail');
  const servingOptions=Array.from({length:8},(_,i)=>i+1).map(n=>`<option value="${n}" ${n===recipe.serves?'selected':''}>${n} ${n===1?'person':'people'}</option>`).join('');
  el.innerHTML=`${recipe.image?`<img class="detail-image" src="${recipe.image}" alt="${recipe.title}">`:''}<div class="detail-content"><div class="detail-top"><div><p class="eyebrow">${recipe.type.toUpperCase()}</p><h2>${recipe.title}</h2></div><button class="icon-button" type="button" data-close-detail aria-label="Close">×</button></div><p class="detail-lead">${recipe.description||''}</p><div class="detail-meta"><span>◷ ${recipe.time}</span><label class="serving-control">Scale for <select id="servingSelect" aria-label="Number of people">${servingOptions}</select></label><span>${'£'.repeat(recipe.expense)} expense</span>${match?`<span>${match.count} pantry matches</span>`:''}</div><div class="rating-line"><strong>Taste</strong><div class="detail-rating"></div></div><div class="detail-columns"><section><h3>Ingredients</h3><p class="scaled-note" id="scaledNote"></p><ul class="ingredients-list" id="scaledIngredients"></ul></section><section><h3>Method</h3><ol class="steps-list">${recipe.steps.map(s=>`<li>${s}</li>`).join('')}</ol></section></div></div>`;
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
