// Connected Swap & Shop Website

const API_BASE = 'http://localhost:3000/api';

// Get data from localStorage or use defaults
let allItems = JSON.parse(localStorage.getItem('items')) || [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 899,
    category: "Electronics",
    description: "Excellent condition, barely used iPhone 13 Pro with original box and accessories.",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400"
    ],
    owner: "JohnDoe",
    status: "Available",
    location: "New York",
    condition: "Like New",
    datePosted: new Date().toISOString()
  },
  {
    id: 2,
    name: "Vintage Leather Jacket",
    price: 150,
    category: "Clothes",
    description: "Classic brown leather jacket, perfect for any season. Size M.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    owner: "JaneDoe",
    status: "Available",
    location: "Los Angeles",
    condition: "Used",
    datePosted: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 1199,
    category: "Electronics",
    description: "Brand new MacBook Air with M2 chip, 8GB RAM, 256GB SSD.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400"
    ],
    owner: "TechUser",
    status: "Available",
    location: "Chicago",
    condition: "New",
    datePosted: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: 4,
    name: "Programming Books Set",
    price: 75,
    category: "Books",
    description: "Collection of 5 programming books including JavaScript, Python, and React.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
    ],
    owner: "BookLover",
    status: "Available",
    location: "Houston",
    condition: "Used",
    datePosted: new Date(Date.now() - 2592000000).toISOString()
  }
];

let currentUser = localStorage.getItem('currentUser') || 'GuestUser';
let swapRequests = JSON.parse(localStorage.getItem('swaps')) || [];

// DOM Elements
const itemsGrid = document.getElementById('itemsGrid');
const addItemModal = document.getElementById('addItemModal');
const itemModal = document.getElementById('itemModal');
const swapModal = document.getElementById('swapModal');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  loadItemsFromServer();
  setupEventListeners();
  setupFilters();
  
  // Check for URL parameters
  const params = new URLSearchParams(window.location.search);
  const viewItemId = params.get('viewItem');
  const proposeSwapId = params.get('proposeSwap');
  
  if (viewItemId) {
    setTimeout(() => viewItem(parseInt(viewItemId)), 500);
  }
  
  if (proposeSwapId) {
    setTimeout(() => proposeSwap(parseInt(proposeSwapId)), 500);
  }
});

// Load items from server
async function loadItemsFromServer() {
  try {
    const response = await fetch(`${API_BASE}/items`);
    if (response.ok) {
      allItems = await response.json();
      localStorage.setItem('items', JSON.stringify(allItems));
    }
  } catch (error) {
    console.log('Using local data');
  }
  loadItems();
}

// Auto-refresh items every 5 seconds
setInterval(loadItemsFromServer, 5000);

// Load and display items
function loadItems(items = allItems) {
  if (!itemsGrid) return;
  
  itemsGrid.innerHTML = '';
  
  if (items.length === 0) {
    itemsGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    return;
  }
  
  items.forEach(item => {
    if (item.status === 'Available') {
      const itemCard = createItemCard(item);
      itemsGrid.appendChild(itemCard);
    }
  });
}

// Create item card
function createItemCard(item) {
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
    <div class="item-content">
      <h4 class="item-title">${item.name}</h4>
      <div class="item-price">$${item.price}</div>
      <p class="item-description">${item.description}</p>
      <div class="item-actions">
        <button class="btn btn-primary btn-sm" onclick="viewItemDetail(${item.id})">View Details</button>
        <button class="btn btn-outline btn-sm" onclick="proposeSwap(${item.id})">Swap</button>
      </div>
    </div>
  `;
  return card;
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  // Category filter
  const categoryFilter = document.getElementById('filterCategory');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryFilter);
  }
  
  // Add item form
  const addItemForm = document.getElementById('addItemForm');
  if (addItemForm) {
    addItemForm.addEventListener('submit', handleAddItem);
  }
  
  // Image upload functionality
  setupImageUpload();
  
  // Close modals when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      closeAllModals();
    }
  });
}

// Image upload setup
function setupImageUpload() {
  const uploadArea = document.getElementById('imageUploadArea');
  const fileInput = document.getElementById('add_image');
  const placeholder = uploadArea.querySelector('.upload-placeholder');
  const preview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  
  if (!uploadArea || !fileInput) return;
  
  // Click to browse
  uploadArea.addEventListener('click', () => fileInput.click());
  
  // File input change
  fileInput.addEventListener('change', handleFileSelect);
  
  // Drag & drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFile(file));
  });
}

// Initialize images array
if (!window.selectedImages) {
  window.selectedImages = [];
}

// Handle file selection
function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => handleFile(file));
}

// Handle file processing
function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please select image files only');
    return;
  }
  
  compressImage(file, (compressedDataUrl) => {
    window.selectedImages.push(compressedDataUrl);
    updateImagePreviews();
  });
}

// Compress image
function compressImage(file, callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = function() {
    // Calculate new dimensions (max 800px)
    const maxSize = 800;
    let { width, height } = img;
    
    if (width > height) {
      if (width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw and compress
    ctx.drawImage(img, 0, 0, width, height);
    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    callback(compressedDataUrl);
  };
  
  img.src = URL.createObjectURL(file);
}

// Update image previews
function updateImagePreviews() {
  const container = document.getElementById('imagePreviewContainer');
  const placeholder = document.querySelector('.upload-placeholder');
  
  container.innerHTML = '';
  
  if (window.selectedImages.length === 0) {
    placeholder.style.display = 'block';
  } else {
    placeholder.style.display = 'none';
    window.selectedImages.forEach((dataUrl, index) => {
      const div = document.createElement('div');
      div.className = 'image-preview';
      div.innerHTML = `
        <img src="${dataUrl}" alt="Image ${index + 1}">
        <button type="button" onclick="removeImage(${index})" class="remove-btn">✕</button>
      `;
      container.appendChild(div);
    });
  }
}

// Remove specific image
function removeImage(index) {
  window.selectedImages.splice(index, 1);
  updateImagePreviews();
  if (window.selectedImages.length === 0) {
    document.getElementById('add_image').value = '';
  }
}

// Search functionality
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const filteredItems = allItems.filter(item => 
    item.status === 'Available' &&
    (item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query))
  );
  loadItems(filteredItems);
}

// Category filter
function handleCategoryFilter(e) {
  const category = e.target.value;
  if (category === '') {
    loadItems(allItems);
  } else {
    const filteredItems = allItems.filter(item => 
      item.category === category && item.status === 'Available'
    );
    loadItems(filteredItems);
  }
}

// Modal functions
function showAddItemModal() {
  if (addItemModal) {
    addItemModal.style.display = 'flex';
  }
}

function closeAddItemModal() {
  if (addItemModal) {
    addItemModal.style.display = 'none';
    document.getElementById('addItemForm').reset();
  }
}

function viewItem(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (!item || !itemModal) return;
  
  window.currentViewingItem = item;
  
  const content = document.getElementById('itemDetailContent');
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
      <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 15px;" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
      <div>
        <h2 style="margin-bottom: 1rem; color: var(--dark);">${item.name}</h2>
        <div style="font-size: 2rem; font-weight: 700; color: var(--primary); margin-bottom: 1rem;">$${item.price}</div>
        <div style="background: #f8fafc; padding: 0.5rem 1rem; border-radius: 20px; display: inline-block; margin-bottom: 1rem; color: var(--secondary); font-weight: 500;">${item.category}</div>
        <p style="color: #64748b; line-height: 1.6; margin-bottom: 1rem;">${item.description}</p>
        <div style="background: #f1f5f9; padding: 1rem; border-radius: 12px; margin-bottom: 1rem;">
          <p style="margin: 0; color: #64748b; font-size: 0.9rem;">Sold by:</p>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
            <div style="width: 32px; height: 32px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.9rem;">${item.owner.charAt(0).toUpperCase()}</div>
            <div>
              <p style="margin: 0; font-weight: 600; color: var(--dark);">${item.owner}</p>
              <a href="customer-profile.html?customer=${item.owner}" style="font-size: 0.8rem; color: var(--primary); text-decoration: none;">View Profile →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  itemModal.style.display = 'flex';
}

function closeItemModal() {
  if (itemModal) {
    itemModal.style.display = 'none';
  }
}

function proposeSwap(itemId) {
  viewItem(itemId);
  setTimeout(() => showSwapModal(), 300);
}

function showSwapModal() {
  if (!swapModal || !window.currentViewingItem) return;
  
  // Load user's items for swapping
  const userItems = allItems.filter(item => 
    item.owner === currentUser && 
    item.status === 'Available' && 
    item.id !== window.currentViewingItem.id
  );
  
  const select = document.getElementById('yourItemsSelect');
  select.innerHTML = '<option value="">Select your item to offer</option>';
  
  userItems.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.name} - $${item.price}`;
    select.appendChild(option);
  });
  
  document.getElementById('swapTargetText').textContent = 
    `You want to swap for: ${window.currentViewingItem.name}`;
  
  swapModal.style.display = 'flex';
}

function closeSwapModal() {
  if (swapModal) {
    swapModal.style.display = 'none';
  }
}

function closeAllModals() {
  closeAddItemModal();
  closeItemModal();
  closeSwapModal();
}

// Add item functionality
async function handleAddItem(e) {
  e.preventDefault();
  
  const newItem = {
    name: document.getElementById('add_name').value,
    category: document.getElementById('add_category').value,
    price: parseInt(document.getElementById('add_price').value) || 0,
    description: document.getElementById('add_description').value,
    image: window.selectedImages[0] || 'https://via.placeholder.com/400x200?text=New+Item',
    images: window.selectedImages || [],
    owner: currentUser,
    status: 'Available',
    location: 'New York',
    condition: 'New'
  };
  
  try {
    const response = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    
    if (response.ok) {
      const savedItem = await response.json();
      allItems.push(savedItem);
      localStorage.setItem('items', JSON.stringify(allItems));
    } else {
      allItems.push({...newItem, id: Date.now()});
      localStorage.setItem('items', JSON.stringify(allItems));
    }
  } catch (error) {
    allItems.push({...newItem, id: Date.now()});
    localStorage.setItem('items', JSON.stringify(allItems));
  }
  
  loadItems();
  closeAddItemModal();
  
  // Reset images
  window.selectedImages = [];
  updateImagePreviews();
  document.getElementById('add_image').value = '';
  
  showToast('Item added successfully!');
}

// Toast notification
function showToast(message) {
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Theme toggle function
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const themeToggle = document.getElementById('themeToggle');
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// Load saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.textContent = '☀️';
}

// Other functions
function showWishlist() {
  showToast('Wishlist feature coming soon!');
}

function openProfile() {
  showToast('Profile feature coming soon!');
}

function buyNow() {
  if (!window.currentViewingItem) return;
  
  // Mark item as sold
  const item = allItems.find(i => i.id === window.currentViewingItem.id);
  if (item) {
    item.status = 'Sold';
    localStorage.setItem('items', JSON.stringify(allItems));
    loadItems();
    showToast('Item purchased successfully!');
    closeItemModal();
  }
}

function viewItemDetail(itemId) {
  const detailPages = {
    1: '../iphone-detail.html',
    2: '../jacket-detail.html', 
    3: '../macbook-detail.html',
    4: '../books-detail.html'
  };
  
  window.location.href = detailPages[itemId] || '../itemdetail.html';
}

async function submitSwap() {
  const offeredItemId = document.getElementById('yourItemsSelect').value;
  const message = document.getElementById('swapMessage').value;
  
  if (!offeredItemId) {
    showToast('Please select an item to offer!');
    return;
  }
  
  const offeredItem = allItems.find(item => item.id == offeredItemId);
  const requestedItem = window.currentViewingItem;
  
  const newSwap = {
    proposer: currentUser,
    itemOffered: offeredItem.name,
    requestedItem: requestedItem.name,
    message: message,
    offeredItemId: offeredItemId,
    requestedItemId: requestedItem.id
  };
  
  try {
    const response = await fetch(`${API_BASE}/swaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSwap)
    });
    
    if (response.ok) {
      const savedSwap = await response.json();
      swapRequests.push(savedSwap);
    } else {
      swapRequests.push({...newSwap, id: Date.now(), status: 'Pending', timestamp: new Date().toLocaleString()});
    }
  } catch (error) {
    swapRequests.push({...newSwap, id: Date.now(), status: 'Pending', timestamp: new Date().toLocaleString()});
  }
  
  localStorage.setItem('swaps', JSON.stringify(swapRequests));
  showToast('Swap proposal sent successfully!');
  closeSwapModal();
  closeItemModal();
}

// Filter functionality
function setupFilters() {
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const locationFilter = document.getElementById('locationFilter');
  const conditionFilter = document.getElementById('conditionFilter');
  const dateFilter = document.getElementById('dateFilter');
  
  if (priceMin && priceMax) {
    priceMin.addEventListener('input', updatePriceDisplay);
    priceMax.addEventListener('input', updatePriceDisplay);
    priceMin.addEventListener('change', applyFilters);
    priceMax.addEventListener('change', applyFilters);
  }
  
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);
  if (conditionFilter) conditionFilter.addEventListener('change', applyFilters);
  if (dateFilter) dateFilter.addEventListener('change', applyFilters);
}

function updatePriceDisplay() {
  const minVal = parseInt(document.getElementById('priceMin').value);
  const maxVal = parseInt(document.getElementById('priceMax').value);
  
  if (minVal > maxVal) {
    document.getElementById('priceMin').value = maxVal;
  }
  
  document.getElementById('minPrice').textContent = document.getElementById('priceMin').value;
  document.getElementById('maxPrice').textContent = document.getElementById('priceMax').value;
}

function applyFilters() {
  const minPrice = parseInt(document.getElementById('priceMin').value);
  const maxPrice = parseInt(document.getElementById('priceMax').value);
  const location = document.getElementById('locationFilter').value;
  const condition = document.getElementById('conditionFilter').value;
  const dateRange = document.getElementById('dateFilter').value;
  
  let filtered = allItems.filter(item => {
    if (item.status !== 'Available') return false;
    
    // Price filter
    if (item.price < minPrice || item.price > maxPrice) return false;
    
    // Location filter
    if (location && item.location !== location) return false;
    
    // Condition filter
    if (condition && item.condition !== condition) return false;
    
    // Date filter
    if (dateRange) {
      const itemDate = new Date(item.datePosted);
      const now = new Date();
      const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);
      
      switch(dateRange) {
        case 'today':
          if (daysDiff > 1) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
      }
    }
    
    return true;
  });
  
  loadItems(filtered);
}

function clearFilters() {
  document.getElementById('priceMin').value = 0;
  document.getElementById('priceMax').value = 1000;
  document.getElementById('locationFilter').value = '';
  document.getElementById('conditionFilter').value = '';
  document.getElementById('dateFilter').value = '';
  updatePriceDisplay();
  loadItems(allItems);
}

// Chatbot functionality
function toggleChat() {
  const chatbot = document.getElementById('chatbot');
  const chatIcon = document.getElementById('chatIcon');
  
  if (chatbot.classList.contains('open')) {
    chatbot.classList.remove('open');
    chatIcon.style.display = 'flex';
  } else {
    chatbot.classList.add('open');
    chatIcon.style.display = 'none';
  }
}

function handleChatEnter(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  addMessage(message, 'user');
  input.value = '';
  
  setTimeout(() => {
    const response = getBotResponse(message.toLowerCase());
    addMessage(response, 'bot');
  }, 500);
}

function addMessage(text, type) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = type === 'user' ? 'user-message' : 'bot-message';
  
  const avatar = type === 'user' ? '👤' : '🤖';
  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  div.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-text">${text}</div>
      <div class="message-time">${time}</div>
    </div>
  `;
  
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function getBotResponse(message) {
  // New user responses
  if (message.includes('new') || message.includes('help') || message.includes('how')) {
    return "Welcome to Swap&Shop! 🎉 I'm Swapy, your guide to buying and swapping items safely.\n\nHere's how it works:\n• 🛍️ BUY items directly from sellers\n• 🔄 SWAP items you no longer need for things you want\n• 💬 MESSAGE sellers securely through our platform\n\nAs a new user, I recommend:\n1. Browse items to see what's available\n2. Start with smaller transactions to build confidence\n3. Always meet in public places for exchanges\n\nWhat would you like to explore first?";
  }
  
  // Swap guidance responses
  if (message.includes('swap') || message.includes('trade') || message.includes('exchange')) {
    return "Great! Here's my swap guidance:\n\n1. Check if your item is a fair value match\n2. Consider offering additional items if values don't align\n3. Write a friendly proposal explaining why it's a good swap\n\nRemember:\n✓ Always meet in public places\n✓ Verify item condition before finalizing\n✓ Use our messaging system for all communications\n\nWould you like me to help draft your swap proposal?";
  }
  
  // Safety responses
  if (message.includes('safe') || message.includes('security') || message.includes('meet')) {
    return "Safety first! Here are our recommended protocols:\n\n✓ Meet in public places (malls, coffee shops)\n✓ Bring a friend if possible\n✓ Inspect items thoroughly before agreeing\n✓ Use our in-app messaging system\n✓ Trust your instincts - if something feels off, walk away\n\nNever share personal information like your home address!";
  }
  
  // Value/pricing responses
  if (message.includes('value') || message.includes('price') || message.includes('worth')) {
    return "To evaluate fair value:\n\n1. Research similar items online\n2. Consider item condition and age\n3. Factor in original retail price\n4. Check completed sales on other platforms\n\nFor swaps, aim for items within 20% of each other's value. You can always add cash or additional items to balance the trade!";
  }
  
  // General responses
  if (message.includes('hi') || message.includes('hello')) {
    return "Hello! 👋 I'm here to help you with buying, selling, and swapping. What can I assist you with today?";
  }
  
  // Default response
  return "I'm here to help with:\n• 🔄 Swap guidance and value matching\n• 🛡️ Safety tips and protocols\n• 📝 Writing swap proposals\n• 🆕 Platform features for new users\n\nWhat specific question do you have?";
}