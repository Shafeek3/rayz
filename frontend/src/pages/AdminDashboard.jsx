import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "", description: "", isBestSeller: false, isNewArrival: false });
  const [editId, setEditId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const token = localStorage.getItem("token");
const API_URL = import.meta.env.VITE_API_URL || "";
  // Fetch products, users, orders
  useEffect(() => {
    fetch(`${API_URL}/products/new-arrivals`).then((res) => setData(res.data));
    fetch(`${API_URL}/products`).then(res => res.json()).then(setProducts);
    fetch(`${API_URL}/auth/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => setUsers(data.users));
    fetch(`${API_URL}/auth/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => setOrders(data.orders));
  }, []);

  // Filtered products
  const filteredProducts = products.filter(p => {
    let match = true;
    if (filterCategory && p.category !== filterCategory) match = false;
    if (filterType === "new" && !p.isNewArrival) match = false;
    if (filterType === "best" && !p.isBestSeller) match = false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) match = false;
    return match;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // Add product
  const handleAddProduct = async () => {
    const res = await fetch(`${API_URL}/products/admin/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setProducts([...products, data.product]);
      setForm({ name: "", price: "", image: "", category: "", description: "", isBestSeller: false, isNewArrival: false });
    }
  };

  // Edit product
  const handleEditProduct = async () => {
    const res = await fetch(`${API_URL}/products/admin/edit/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setProducts(products.map(p => p._id === editId ? data.product : p));
      setEditId(null);
      setForm({
          name:  "",
          price:  "",
          image:"",
          category:"",
          description: "",
          isBestSeller: false,
          isNewArrival: false
});
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    await fetch(`${API_URL}/products/admin/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(products.filter(p => p._id !== id));
    setSelectedProducts(selectedProducts.filter(pid => pid !== id));
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    for (const id of selectedProducts) {
      await fetch(`${API_URL}/products/admin/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setProducts(products.filter(p => !selectedProducts.includes(p._id)));
    setSelectedProducts([]);
  };

  // Bulk mark best seller/new arrival
  const handleBulkMark = async (field, value) => {
    for (const id of selectedProducts) {
      const product = products.find(p => p._id === id);
      if (product) {
        await fetch(`${API_URL}/products/admin/edit/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...product, [field]: value }),
        });
      }
    }
    // Refetch products
    fetch(`${API_URL}/products`).then(res => res.json()).then(setProducts);
    setSelectedProducts([]);
  };

  // Clear all products
  const handleClearProducts = async () => {
    await fetch(`${API_URL}/products/admin/clear`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts([]);
    setSelectedProducts([]);
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    await fetch(`${API_URL}/auth/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter(u => u._id !== id));
  };

  // Delete order
  const handleDeleteOrder = async (userContact, orderId) => {
    await fetch(`${API_URL}/auth/admin/order/${userContact}/${orderId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(orders.filter(o => o.contact !== userContact || o._id !== orderId));
  };

  // Toggle selection for bulk actions
  const toggleSelectProduct = (id) => {
    setSelectedProducts(selectedProducts.includes(id)
      ? selectedProducts.filter(pid => pid !== id)
      : [...selectedProducts, id]);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      {/* Product Filter Controls */}
      <div className="mb-4 flex flex-wrap space-x-4 items-center">
        <label>
          Category:
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="ml-2 border rounded px-2 py-1">
            <option value="">All</option>
            <option value="rings">Rings</option>
            <option value="earrings">Earrings</option>
            <option value="bracelets">Bracelets</option>
            <option value="necklace">Necklace</option>
            <option value="bangles">Bangles</option>
            <option value="anklets">Anklets</option>
          </select>
        </label>
        <label>
          Type:
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="ml-2 border rounded px-2 py-1">
            <option value="">All</option>
            <option value="new">New Arrivals</option>
            <option value="best">Best Sellers</option>
          </select>
        </label>
        <label>
          Search:
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Product name"
            className="ml-2 border rounded px-2 py-1"
          />
        </label>
        <button onClick={() => { setFilterCategory(""); setFilterType(""); setSearchTerm(""); }} className="ml-2 px-2 py-1 border rounded">Clear Filters</button>
      </div>
      {/* Bulk Actions */}
      <div className="mb-2 flex space-x-2">
        <button onClick={handleBulkDelete} disabled={selectedProducts.length === 0} className="bg-red-500 text-white px-2 py-1 rounded">Bulk Delete</button>
        <button onClick={() => handleBulkMark("isBestSeller", true)} disabled={selectedProducts.length === 0} className="bg-yellow-500 text-white px-2 py-1 rounded">Mark Best Seller</button>
        <button onClick={() => handleBulkMark("isNewArrival", true)} disabled={selectedProducts.length === 0} className="bg-green-500 text-white px-2 py-1 rounded">Mark New Arrival</button>
        <button onClick={handleClearProducts} className="bg-red-700 text-white px-2 py-1 rounded">Clear All Products</button>
      </div>
      {/* Product Management */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
        <h3 className="font-semibold mb-2">Products</h3>
        <h1>({products.length})</h1>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <label className="flex items-center ml-2">
            <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({ ...form, isBestSeller: e.target.checked })} />
            <span className="ml-1">Best Seller</span>
          </label>
          <label className="flex items-center ml-2">
            <input type="checkbox" checked={form.isNewArrival} onChange={e => setForm({ ...form, isNewArrival: e.target.checked })} />
            <span className="ml-1">New Arrival</span>
          </label>
          {editId ? (
            <button onClick={handleEditProduct} className="bg-blue-500 text-white px-2 py-1 rounded ml-2">Update</button>
          ) : (
            <button onClick={handleAddProduct} className="bg-green-500 text-white px-2 py-1 rounded ml-2">Add</button>
          )}
        </div>
    <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-300">
    <thead className="bg-gray-100 text-left">
      <tr className="text-sm font-semibold text-gray-700">
        <th className="px-4 py-2 border">Select</th>
        <th className="px-4 py-2 border">Image</th>
        <th className="px-4 py-2 border">Name</th>
        <th className="px-4 py-2 border">Price</th>
        <th className="px-4 py-2 border">Category</th>
        <th className="px-4 py-2 border">Best Seller</th>
        <th className="px-4 py-2 border">New Arrival</th>
        <th className="px-4 py-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginatedProducts.map(p => (
        <tr key={p._id} className="text-sm text-gray-800 border-t">
          <td className="px-4 py-2 text-center">
            <input
              type="checkbox"
              checked={selectedProducts.includes(p._id)}
              onChange={() => toggleSelectProduct(p._id)}
            />
          </td>
          <td className="px-4 py-2 text-center">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded mx-auto" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </td>
          <td className="px-4 py-2">{p.name}</td>
          <td className="px-4 py-2">₹{p.price}</td>
          <td className="px-4 py-2">{p.category}</td>
          <td className="px-4 py-2 text-center">{p.isBestSeller ? "✔️" : ""}</td>
          <td className="px-4 py-2 text-center">{p.isNewArrival ? "✔️" : ""}</td>
          <td className="px-4 py-2">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditId(p._id);
                  setForm({
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    category: p.category,
                    description: p.description,
                    isBestSeller: !!p.isBestSeller,
                    isNewArrival: !!p.isNewArrival
                  });
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(p._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Pagination Controls */}
        <div className="mt-2 flex space-x-2">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-2 py-1 border rounded">Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-2 py-1 border rounded">Next</button>
        </div>
      </div>
      {/* User Management */}
    <div className="mb-8">
  <h3 className="font-semibold mb-2">Users</h3>
  <ul>
    {users.map(u => (
      <li key={u._id} className="mb-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="col-span-1">
            <span className="font-medium">
              {u.name} ({u.contact}) {u.isAdmin && <b className="text-red-600">[Admin]</b>}
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleDeleteUser(u._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

      {/* Order Management */}
      <div>
        <h3 className="font-semibold mb-2">Orders</h3>
        <ul>
          {orders.map(o => (
            <li key={o._id} className="mb-2">
              <span>{o.user} ({o.contact}) - ₹{o.total} - {o.status}</span>
              <button onClick={() => handleDeleteOrder(o.contact, o._id)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

