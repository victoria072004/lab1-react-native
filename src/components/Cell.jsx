import React from "react";
import images from "../assets/images";

export default function Cell({ value, index, onDropOnCell, onDragStartFromCell }) {
  return (
    <div
      className="cell"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropOnCell(e, index)}
    >
      {value && ( 
        <img
          src={images[value]}
          alt={value}
          className="cell-img"
          draggable
          onDragStart={(e) => onDragStartFromCell(e, index, value)}
        />
      )}
    </div>
  );
}