import React from "react";
import images from "../assets/images";

export default function DiscoveryPanel({ items = [] }) {
  return (
    <div className="panel discovery">
      <h3>Descoperite</h3>
      <div className="discovered-list">
        {items.length === 0 && <div className="empty">(nu sunt descoperiri)</div>}
        {items.map((name, i) => (
          <div key={i} className="discovered-item">
            <img src={images[name]} alt={name} className="inv-img" />
            <div className="disc-name">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
