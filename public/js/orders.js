document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  const tableBody = document.querySelector('#ordersTable tbody');

  // Load existing orders and enable delete buttons
  fetch('/orders/api')
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = '';
      data.forEach((order, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${order.customerName}</td>
          <td>${order.item}</td>
          <td>${order.quantity}</td>
          <td>${new Date(order.pickupDate).toLocaleDateString()}</td>
          <td>${order.status}</td>
                    <td><button class="btn btn-sm btn-danger delete-btn" data-id="${order._id}">Delete</button></td>
        `;
        tableBody.appendChild(row);
      });
    });

  // Submit new order (Create functionality)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const order = {
      customerName: document.getElementById('customerName').value,
      customerEmail: document.getElementById('customerEmail').value,
      item: document.getElementById('item').value,
      quantity: document.getElementById('quantity').value,
      pickupDate: document.getElementById('pickupDate').value,
      notes: document.getElementById('notes').value
    };

    const res = await fetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    const result = await res.json();
    if (res.ok) {
      alert('✅ Order saved!');
      location.reload();
    } else {
      alert('❌ Error: ' + result.error);
    }
  });

  // Clear form
  document.getElementById('resetFormBtn').addEventListener('click', () => {
    form.reset();
  });

  // Handle Delete button clicks (Delete functionality)
  tableBody.addEventListener('click', async (e) => {
    // Check if the clicked element is a delete button
    if (e.target.classList.contains('delete-btn')) {
      
      // Confirmation dialog
      if (!confirm('Are you sure you want to delete this order?')) {
        return;
      }

      // Get the order ID from the data attribute
      const orderId = e.target.getAttribute('data-id');
      
      // Send DELETE request to the API
      const res = await fetch(`/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('🗑️ Order deleted!');
        location.reload(); // Reload to refresh the displayed table
      } else {
        // Try to read the error message from the response
        const result = await res.json();
        alert('❌ Error deleting order: ' + (result.error || res.statusText));
      }
    }
  });
});