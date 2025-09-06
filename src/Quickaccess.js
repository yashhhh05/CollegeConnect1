import React from "react";
import Card from "./components/Card";

function QuickAccess() {
  const cards = [
    { title: "My Projects", link: "/projects" },
    { title: "Events", link: "/events" },
    { title: "Analytics", link: "/analytics" },
  ];

  return (
    <section className="quick-access">
      <h2>Quick Access</h2>
      <div className="card-container">
        {cards.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>
    </section>
  );
}

export default QuickAccess;
