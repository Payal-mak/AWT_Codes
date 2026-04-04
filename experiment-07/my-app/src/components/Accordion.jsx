import { useState } from "react";
import "./Accordion.css";

const data = [
  {
    question: "What is your return policy?",
    answer: "Return within 7 days."
  },
  {
    question: "Do you offer COD?",
    answer: "Yes, on selected products."
  },
  {
    question: "Delivery time?",
    answer: "3-5 business days."
  }
];

export default function Accordion() {
  const [active, setActive] = useState(null);

  return (
    <div className="faq">
      <h2>FAQs</h2>

      {data.map((item, i) => (
        <div key={i} className={`faq-item ${active === i ? "open" : ""}`}>
          <button
            type="button"
            className="faq-question"
            onClick={() => setActive(active === i ? null : i)}
            aria-expanded={active === i}
          >
            {item.question}
          </button>
          {active === i && <p>{item.answer}</p>}
        </div>
      ))}
    </div>
  );
}