// Admin Panel JavaScript
let users = JSON.parse(localStorage.getItem('users')) || [
  { id: 1, username: 'JohnDoe', email: 'john@example.com', contact: '+123456789' },
  { id: 2, username: 'JaneDoe', email: 'jane@example.com', contact: '+987654321' }
];

let items = JSON.parse(localStorage.getItem('items')) || [
  { id: 1, name: 'Old Phone', category: 'Electronics', price: 50, status: 'Available', owner: 'JohnDoe' },
  { id: 2, name: 'T-Shirt', category: 'Clothes', price: 25, status: 'Available', owner: 'JaneDoe' }
];

let swaps = JSON.parse(localStorage.getItem('swaps')) || [
  { id: 1, proposer: 'JaneDoe', itemOffered: 'T-Shirt', requestedItem: 'Old Phone', status: 'Pending' }
];

let messages = JSON.parse(localStorage.getItem('messages')) || [
  { id: 1, sender: 'JohnDoe', receiver: 'JaneDoe', message: 'Hello, is your item available?', timestamp: '2025-01-02 10:15' }
];

function loadUsers() {
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.contact}</td>
      <td>
        <button class="btn btn-sm" onclick="editUser(${user.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function loadItems() {
  const tbody = document.getElementById('itemsTable');
  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>$${item.price}</td>
      <td>${item.status}</td>
      <td>
        <button class="btn btn-sm" onclick="editItem(${item.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function loadSwaps() {
  const tbody = document.getElementById('swapsTable');
  tbody.innerHTML = swaps.map(swap => `
    <tr>
      <td>${swap.id}</td>
      <td>${swap.proposer}</td>
      <td>${swap.itemOffered}</td>
      <td>${swap.requestedItem}</td>
      <td>${swap.status}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="acceptSwap(${swap.id})">Accept</button>
        <button class="btn btn-sm btn-danger" onclick="rejectSwap(${swap.id})">Reject</button>
      </td>
    </tr>
  `).join('');
}

function loadMessages() {
  const tbody = document.getElementById('messagesTable');
  tbody.innerHTML = messages.map(msg => `
    <tr>
      <td>${msg.id}</td>
      <td>${msg.sender}</td>
      <td>${msg.receiver}</td>
      <td>${msg.message}</td>
      <td>${msg.timestamp}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteMessage(${msg.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function acceptSwap(id) {
  const swap = swaps.find(s => s.id === id);
  if (swap) {
    swap.status = 'Accepted';
    localStorage.setItem('swaps', JSON.stringify(swaps));
    loadSwaps();
    showToast('Swap accepted!');
  }
}

function rejectSwap(id) {
  const swap = swaps.find(s => s.id === id);
  if (swap) {
    swap.status = 'Rejected';
    localStorage.setItem('swaps', JSON.stringify(swaps));
    loadSwaps();
    showToast('Swap rejected!');
  }
}

function deleteUser(id) {
  if (confirm('Delete this user?')) {
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
    showToast('User deleted!');
  }
}

function deleteItem(id) {
  if (confirm('Delete this item?')) {
    items = items.filter(i => i.id !== id);
    localStorage.setItem('items', JSON.stringify(items));
    loadItems();
    showToast('Item deleted!');
  }
}

function deleteMessage(id) {
  if (confirm('Delete this message?')) {
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem('messages', JSON.stringify(messages));
    loadMessages();
    showToast('Message deleted!');
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  loadUsers();
  loadItems();
  loadSwaps();
  loadMessages();
});