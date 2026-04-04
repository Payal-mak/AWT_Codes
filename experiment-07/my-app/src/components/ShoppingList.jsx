import { useState } from "react";
import "./ShoppingList.css";

const products = [
  {
    name: "Shirt",
    category: "Clothing",
    price: 500,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Phone",
    category: "Electronics",
    price: 15000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
  }
];

export default function ShoppingList() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? products
      : products.filter(p => p.category === filter);

  return (
    <div>
      <h2>Products</h2>

      <div className="filters">
        <button
          type="button"
          className={filter === "All" ? "active" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          type="button"
          className={filter === "Clothing" ? "active" : ""}
          onClick={() => setFilter("Clothing")}
        >
          Clothing
        </button>
        <button
          type="button"
          className={filter === "Electronics" ? "active" : ""}
          onClick={() => setFilter("Electronics")}
        >
          Electronics
        </button>
      </div>

      <div className="grid">
        {filtered.map((p, i) => (
          <div className="card" key={i}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button type="button">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}