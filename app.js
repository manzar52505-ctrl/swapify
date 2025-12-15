// ====== CONFIG ======
const API = 'http://localhost:3000/api'; // backend base
// TODO: Replace these with real logged-in user info after you implement auth:
const currentUserId = 'REPLACE_WITH_USER_ID';   // e.g. '64f...'
const currentUserName = 'Mahir';                // display name

// UI elements
const itemsGrid = document.getElementById('itemsGrid');
const addItemModal = document.getElementById('addItemModal');
const addItemForm = document.getElementById('addItemForm');
const itemModal = document.getElementById('itemModal');
const itemDetailContent = document.getElementById('itemDetailContent');
const swapModal = document.getElementById('swapModal');
const yourItemsSelect = document.getElementById('yourItemsSelect');
const swapTargetText = document.getElementById('swapTargetText');
const toast = document.getElementById('toast');

// Keep track of currently-opened item for swap
let currentItemForSwap = null;

// -- Toast helper
function showToast(msg, time=2500){
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(()=> toast.style.display='none', time);
}

// ======== ITEMS: load and render ========
async function loadItems(){
  const q = document.getElementById('globalSearch').value || '';
  const cat = document.getElementById('filterCategory').value || '';
  const url = new URL(API + '/items');
  if(q) url.searchParams.set('q', q);
  if(cat) url.searchParams.set('category', cat);

  try{
    const res = await fetch(url);
    const items = await res.json();
    renderItems(items);
  } catch(err){
    console.error(err);
    showToast('Cannot load items (backend?)');
  }
}

function renderItems(items){
  itemsGrid.innerHTML = '';
  if(!items || items.length===0){
    itemsGrid.innerHTML = `<div style="color:#cbd5e1;padding:20px">No items to show.</div>`;
    return;
  }
  items.forEach(item=>{
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/600x400?text=No+Image'}" alt="${escapeHtml(item.name)}" />
      <div>
        <div class="item-title">${escapeHtml(item.name)}</div>
        <div class="item-meta">
          <div class="badge">${escapeHtml(item.category || 'Other')}</div>
          <div style="font-weight:600">$${item.price ?? '0'}</div>
        </div>
        <p style="color:#4b5563;margin-top:8px">${(item.description || '').slice(0,100)}</p>
        <div class="item-actions">
          <button class="btn btn-outline" onclick="openItemModal('${item._id}')">View</button>
          <button class="btn btn-primary" onclick="openItemModal('${item._id}')">Buy</button>
          <button class="btn" onclick="openItemModal('${item._id}', true)">Swap</button>
        </div>
      </div>
    `;
    itemsGrid.appendChild(card);
  });
}

// escape helper
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]) ); }

// ======= ADD ITEM (modal + post) =======
function showAddItemModal(){ addItemModal.style.display='flex'; }
function closeAddItemModal(){ addItemModal.style.display='none'; addItemForm.reset(); }

addItemForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  // collect values
  const payload = {
    name: document.getElementById('add_name').value.trim(),
    category: document.getElementById('add_category').value.trim(),
    price: Number(document.getElementById('add_price').value) || 0,
    description: document.getElementById('add_description').value.trim(),
    image: document.getElementById('add_image').value.trim() || '',
    userId: currentUserId,
    username: currentUserName,
    status: 'available'
  };

  try{
    const res = await fetch(API+'/items', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('failed');
    showToast('Item added');
    closeAddItemModal();
    loadItems();
  } catch(err){
    console.error(err);
    showToast('Cannot add item');
  }
});

// ======= ITEM DETAIL & SWAP =======
async function openItemModal(itemId, openSwap=false){
  try{
    const res = await fetch(API+`/items/${itemId}`);
    const item = await res.json();
    currentItemForSwap = item;
    // fill content
    itemDetailContent.innerHTML = `
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        <div style="flex:1;min-width:240px">
          <img src="${item.image || 'https://via.placeholder.com/600x400?text=No+Image'}" style="width:100%;border-radius:8px" />
        </div>
        <div style="flex:1;min-width:260px">
          <h2>${escapeHtml(item.name)}</h2>
          <div style="color:#475569;margin-top:8px">${escapeHtml(item.category)} • $${item.price ?? 0}</div>
          <p style="margin-top:12px;color:#374151">${escapeHtml(item.description || 'No description')}</p>
          <div style="margin-top:12px;color:#6b7280">Seller: ${escapeHtml(item.username || item.userId || 'Unknown')}</div>
        </div>
      </div>
    `;
    // show modal
    itemModal.style.display = 'flex';
    // if openSwap true, open swap modal instead
    if(openSwap) setTimeout(()=> showSwapModal(), 200);
  } catch(err){
    console.error(err);
    showToast('Cannot open item');
  }
}
function closeItemModal(){ itemModal.style.display='none'; currentItemForSwap = null; }

// SWAP modal flow
async function showSwapModal(){
  if(!currentItemForSwap){
    showToast('No item selected');
    return;
  }
  // load user's items to choose from
  try{
    const res = await fetch(API + `/items?userId=${currentUserId}`);
    const yourItems = await res.json();
    yourItemsSelect.innerHTML = '';
    // exclude the target item
    yourItems.filter(i => i._id !== currentItemForSwap._id).forEach(i=>{
      const o = document.createElement('option');
      o.value = i._id;
      o.textContent = `${i.name} — $${i.price}`;
      yourItemsSelect.appendChild(o);
    });
    swapTargetText.innerText = `You are proposing a swap for "${currentItemForSwap.name}" (owner: ${currentItemForSwap.username || currentItemForSwap.userId || 'seller'})`;
    swapModal.style.display = 'flex';
  }catch(err){
    console.error(err);
    showToast('Cannot load your items');
  }
}
function closeSwapModal(){ swapModal.style.display = 'none'; document.getElementById('swapMessage').value=''; }

// submit swap proposal
async function submitSwap(){
  const proposerItemId = yourItemsSelect.value;
  if(!proposerItemId){
    showToast('Choose one of your items to propose');
    return;
  }
  const message = document.getElementById('swapMessage').value || '';
  const payload = {
    proposerId: currentUserId,
    proposerName: currentUserName,
    proposerItemId,
    requestedItemId: currentItemForSwap._id,
    requestedOwnerId: currentItemForSwap.userId || null,
    message,
    status: 'Pending',
    createdAt: new Date()
  };
  try{
    const res = await fetch(API + '/swaps', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('failed');
    showToast('Swap proposed');
    closeSwapModal();
    closeItemModal();
  }catch(err){
    console.error(err);
    showToast('Cannot send swap');
  }
}

// BUY placeholder
function buyNow(){
  showToast('Buy flow not implemented (payment gateway).');
}

// Wishlist
let wishlist = [];
function showWishlist(){
  // render quickly in a modal-like view (re-use addItemModal for simplicity)
  const html = wishlist.length ? wishlist.map(w=>`<div style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(w.name)} — $${w.price}</div>`).join('') : '<div style="padding:10px;color:#666">No items</div>';
  // tiny modal replacement
  addItemModal.style.display = 'flex';
  addItemModal.querySelector('.modal-card h3').innerText = 'Your Wishlist';
  addItemModal.querySelector('form').style.display = 'none';
  addItemModal.querySelector('.modal-actions').style.display = 'none';
  setTimeout(()=>{ // restore later when closed
    addItemModal.dataset.wasWishlist = 'true';
  }, 0);
}
function addToWishlist(item){
  wishlist.push(item);
  showToast('Added to wishlist');
}

// Open profile (placeholder)
function openProfile(){ showToast('Profile page not implemented yet'); }

// Helper to ensure modals hide/restore form
function closeAddItemModal(){
  addItemModal.style.display='none';
  addItemForm.style.display = '';
  addItemForm.reset();
  if(addItemModal.dataset.wasWishlist){ // restore title & actions when closing wishlist view
    addItemModal.querySelector('.modal-card h3').innerText = 'Add New Item';
    addItemModal.querySelector('.modal-actions').style.display = '';
    delete addItemModal.dataset.wasWishlist;
  }
}

// escape html helper reused
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g,c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// hook search and filters
document.getElementById('globalSearch').addEventListener('input', debounce(()=>loadItems(), 350));
document.getElementById('filterCategory').addEventListener('change', ()=>loadItems());

// debounce
function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); } }

// OPEN/CLOSE modals on outside click
document.querySelectorAll('.modal').forEach(m=>{
  m.addEventListener('click', (e)=>{ if(e.target === m) { // clicked overlay
    m.style.display = 'none';
    if(m===addItemModal) closeAddItemModal();
  }});
});

// On load: fetch items
window.addEventListener('load', ()=>{ loadItems(); });
