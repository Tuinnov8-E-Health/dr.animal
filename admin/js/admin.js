/* Admin-specific styles */

function switchCrmTab(tab) {
  document.querySelectorAll('.crm-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('crm-'+tab).classList.add('active');
  document.querySelectorAll('.crm-tab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
}

function showAdminSection(section) {
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById('admin-'+section);
  if(el) el.classList.add('active');
  document.querySelectorAll('.admin-nav-item').forEach(item=>{
    item.classList.toggle('active', item.getAttribute('onclick')?.includes("'"+section+"'"));
  });
  if(section === 'products-admin') renderAdminProducts();
}

function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-table');
  if(!tbody) return;
  tbody.innerHTML = products.map(p=>`
    <tr><td>${p.name}</td><td><span class="tag tag-blue">${p.cat}</span></td><td>KES ${p.price.toLocaleString()}</td><td>${Math.floor(Math.random()*20+1)}</td>
    <td><button class="action-btn">Edit</button><button class="action-btn danger" onclick="showNotif('Product removed','success')">Delete</button></td></tr>`).join('');
}

function addProduct() {
  const name = document.getElementById('new-product-name').value;
  const cat = document.getElementById('new-product-cat').value;
  const price = parseInt(document.getElementById('new-product-price').value)||0;
  const desc = document.getElementById('new-product-desc').value;
  if(!name) { showNotif('Product name required','error'); return; }
  products.push({id:products.length+1,name,cat,price,desc,icon:'📦'});
  closeModal('modal-add-product');
  showNotif('Product added!','success');
  renderAdminProducts();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  renderAdminProducts();
});
