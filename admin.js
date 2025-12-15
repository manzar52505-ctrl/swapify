// Delete row
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    alert("Row deleted successfully!");
  }
  
  // Edit row
  function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");
  
    for (let i = 1; i < cells.length - 1; i++) { // skip ID and Actions
      const currentText = cells[i].textContent;
      const input = document.createElement("input");
      input.value = currentText;
      cells[i].textContent = "";
      cells[i].appendChild(input);
    }
  
    // Change buttons to Save / Cancel
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
      <button onclick="saveRow(this)">Save</button>
      <button onclick="cancelEdit(this)">Cancel</button>
    `;
  }
  
  // Save row after edit
  function saveRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");
  
    for (let i = 1; i < cells.length - 1; i++) { // skip ID and Actions
      const input = cells[i].querySelector("input");
      cells[i].textContent = input.value;
    }
  
    // Restore Edit/Delete buttons
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
      <button onclick="editRow(this)">Edit</button>
      <button onclick="deleteRow(this)">Delete</button>
    `;
  }
  
  // Cancel edit
  function cancelEdit(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");
  
    for (let i = 1; i < cells.length - 1; i++) { // skip ID and Actions
      const input = cells[i].querySelector("input");
      cells[i].textContent = input.defaultValue;
    }
  
    // Restore Edit/Delete buttons
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
      <button onclick="editRow(this)">Edit</button>
      <button onclick="deleteRow(this)">Delete</button>
    `;
  }

  // Accept swap
function acceptSwap(button) {
    const row = button.parentElement.parentElement;
    row.querySelector("td:nth-child(5)").textContent = "Accepted"; // update Status
    alert("Swap accepted!");
  }
  
  // Reject swap
  function rejectSwap(button) {
    const row = button.parentElement.parentElement;
    row.querySelector("td:nth-child(5)").textContent = "Rejected"; // update Status
    alert("Swap rejected!");
  }

  // Delete a message
function deleteMessage(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    alert("Message deleted successfully!");
  }

  
  // ----------------- Users & Items Edit/Delete -----------------

// Delete row
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    alert("Row deleted successfully!");
  }
  
  // Edit row
  function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");
  
    for (let i = 1; i < cells.length - 1; i++) { // skip ID and Actions
      const currentText = cells[i].textContent;
      const input = document.createElement("input");
      input.value = currentText;
      cells[i].textContent = "";
      cells[i].appendChild(input);
    }
  
    // Change buttons to Save / Cancel
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
      <button onclick="saveRow(this)">Save</button>
      <button onclick="cancelEdit(this)">Cancel</button>
    `;
  }
  
  // Save row after edit
  function saveRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");
  
    for (let i = 1; i < cells.length - 1; i++) {
      const input = cells[i].querySelector("input");
      cells[i].textContent = input.value;
    }
  
    // Restore Edit/Delete buttons
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
      <button onclick="editRow(this)">Edit</button>
      <button onclick="deleteRow(this)">Delete</button>
    `;
  }
  
  // Cancel edit
  function cancelEdit(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll("td");
  
    for (let i = 1; i < cells.length - 1; i++) {
      const input = cells[i].querySelector("input");
      cells[i].textContent = input.defaultValue;
    }
  
    // Restore Edit/Delete buttons
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
      <button onclick="editRow(this)">Edit</button>
      <button onclick="deleteRow(this)">Delete</button>
    `;
  }
  
  // ----------------- Swap Requests -----------------
  
  // Accept swap
  function acceptSwap(button) {
    const row = button.parentElement.parentElement;
    row.querySelector("td:nth-child(5)").textContent = "Accepted"; // Status
    alert("Swap accepted!");
  }
  
  // Reject swap
  function rejectSwap(button) {
    const row = button.parentElement.parentElement;
    row.querySelector("td:nth-child(5)").textContent = "Rejected"; // Status
    alert("Swap rejected!");
  }
  
  // ----------------- Messages -----------------
  
  // Delete a message
  function deleteMessage(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    alert("Message deleted successfully!");
  }
  