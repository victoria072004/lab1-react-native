import images from "../assets/images";

export default function Inventory({ items = [], onRemove}) {
  return (
    <div
      className="panel inventory"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        
      }}
    >
      <h3>Inventar</h3>
      <div className="inventory-list">
        {items.length === 0 && <div className="empty">(gol)</div>}
        {items.map((name, idx) => (
          <div
            key={idx}
            className="inventory-item"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({ from: "inventory", index: idx, value: name })
              )
            }
          >
            <img src={images[name]} alt={name} className="inv-img" />
            <button className="small-btn" onClick={() => onRemove(idx)}>
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
