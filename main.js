// Function to load items into any container
async function loadItems(containerSelector, query = '') {
    const response = await fetch(`http://localhost:3000/api/items${query}`);
    const items = await response.json();

    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '';
    items.forEach(item => {
        container.innerHTML += `
        <div class="item-card">
            <img src="${item.image || 'https://via.placeholder.com/150'}" alt="item">
            <h3>${item.name}</h3>
            <p>${item.category}</p>
            <p>${item.price || 'Free'}</p>
            <button onclick="viewItem('${item._id}')">View</button>
        </div>
        `;
    });
}

// Function to go to item detail page
function viewItem(id) {
    window.location.href = `itemDetail.html?id=${id}`;
}

// Auto-load items based on page
window.onload = function() {
    if (document.querySelector('.items')) loadItems('.items');           // index.html
    if (document.querySelector('#userItems')) loadItems('#userItems', '?userId=USER_ID_HERE'); // profile.html
}
