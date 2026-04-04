import Carousel from "./components/Carousel";
import Accordion from "./components/Accordion";
import ShoppingList from "./components/ShoppingList";
import "./App.css";

function App() {
  return (
    <div className="container">
      <h1>🛍️ ShopEasy</h1>
      <p className="subtitle">Simple, modern shopping showcase built with React components.</p>

      <section className="section">
        <Carousel />
      </section>

      <section className="section">
        <ShoppingList />
      </section>

      <section className="section">
        <Accordion />
      </section>
    </div>
  );
}

export default App;