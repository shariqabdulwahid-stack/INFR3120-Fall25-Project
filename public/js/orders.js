document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  const tableBody = document.querySelector('#ordersTable tbody');
  const orderIdField = document.getElementById('orderId');

  let ordersData = []; // Store orders for edit lookup

  // Load existing orders
  fetch('/orders/api', { credentials: 'include' }) // include cookies
    .then(res => res.json())
    .then(data => {
      ordersData = data;
      tableBody.innerHTML = '';
      data.forEach((order, i) => {
        const row = document.createElement('tr');

        const editButton = isLoggedIn
          ? `<button class="btn btn-sm btn-warning edit-btn me-1" data-id="${order._id}">Edit</button>`
          : '';

        const deleteButton = isLoggedIn
          ? `<button class="btn btn-sm btn-danger delete-btn" data-id="${order._id}">Delete</button>`
          : '';

        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${order.customerName}</td>
          <td>${order.item}</td>
          <td>${order.quantity}</td>
          <td>${new Date(order.pickupDate).toLocaleDateString()}</td>
          <td>${order.status || 'pending'}</td>
          <td>${editButton}${deleteButton}</td>
        `;
        tableBody.appendChild(row);
      });
    });

  // Submit new or updated order
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

    const orderId = orderIdField.value;
    const url = orderId ? `/orders/${orderId}` : '/orders';
    const method = orderId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      credentials: 'include' // include cookies
    });

    const result = await res.json();
    if (res.ok) {
      alert(orderId ? 'Order updated!' : 'Order saved!');
      form.reset();
      orderIdField.value = '';
      location.reload();
    } else {
      alert('Error: ' + result.error);
    }
  });

  // Clear form
  document.getElementById('resetFormBtn').addEventListener('click', () => {
    form.reset();
    orderIdField.value = '';
  });

  // Handle Edit and Delete button clicks
  tableBody.addEventListener('click', async (e) => {
    const target = e.target;

    // Edit button clicked
    if (target.classList.contains('edit-btn')) {
      const id = target.getAttribute('data-id');
      const order = ordersData.find(o => o._id === id);
      if (!order) return;

      document.getElementById('customerName').value = order.customerName;
      document.getElementById('customerEmail').value = order.customerEmail;
      document.getElementById('item').value = order.item;
      document.getElementById('quantity').value = order.quantity;
      document.getElementById('pickupDate').value = order.pickupDate.split('T')[0];
      document.getElementById('notes').value = order.notes || '';
      orderIdField.value = order._id;
    }

    // Delete button clicked
    if (target.classList.contains('delete-btn')) {
      if (!confirm('Are you sure you want to delete this order?')) return;

      const id = target.getAttribute('data-id');
      const res = await fetch(`/orders/${id}`, {
        method: 'DELETE',
        credentials: 'include' // include cookies
      });

      const result = await res.json();
      if (res.ok) {
        alert('Order deleted!');
        location.reload();
      } else {
        alert(result.error === 'You must be logged in to perform this action.'
          ? 'You must be logged in to delete orders.'
          : 'Error deleting order: ' + (result.error || res.statusText));
      }
    }
  });
});