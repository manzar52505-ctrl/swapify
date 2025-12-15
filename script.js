// JavaScript will be added later
function filterItems() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = document.getElementById('maxPrice').value;
  
    const items = document.querySelectorAll('.item-card');
  
    items.forEach(item => {
      const name = item.getAttribute('data-name').toLowerCase();
      const itemCategory = item.getAttribute('data-category');
      const price = parseFloat(item.getAttribute('data-price'));
  
      let visible = true;
  
      if (searchText && !name.includes(searchText)) visible = false;
      if (category && itemCategory !== category) visible = false;
      if (maxPrice && price > maxPrice) visible = false;
  
      item.style.display = visible ? 'block' : 'none';
    });
  }

  
  function toggleWishlist(btn) {
    if (btn.classList.contains('added')) {
      btn.classList.remove('added');
      btn.textContent = '♡ Add to Wishlist';
    } else {
      btn.classList.add('added');
      btn.textContent = '♥ Added to Wishlist';
    }
  }
  