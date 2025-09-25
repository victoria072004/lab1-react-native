import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import Inventory from "./Inventory";
import DiscoveryPanel from "./DiscoveryPanel";
import recipes from "../recipes.json";
import images from "../assets/images";


const BASE_RESOURCES = ["Aer", "Apa", "Foc", "Pamant"];

export default function GameBoard() {
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem("inventory")) || []);
  const [grid, setGrid] = useState(() => JSON.parse(localStorage.getItem("grid")) || Array(9).fill(null));
  const [discovered, setDiscovered] = useState(() => JSON.parse(localStorage.getItem("discovered")) || []);
  const [win, setWin] = useState(false);

  useEffect(() => { localStorage.setItem("inventory", JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem("grid", JSON.stringify(grid)); }, [grid]);
  useEffect(() => { 
    localStorage.setItem("discovered", JSON.stringify(discovered)); 
    setWin(discovered.length === recipes.length);   
  }, [discovered]);

  const addToInventory = (name) => setInventory(p => [...p, name]);

  const matchRecipe = (g) => {
    for (const r of recipes) {
      if (r.pattern.flat().every((v,i)=>v===null||v===g[i])) return r.result;
    }
    return null;
  };

  const handleDrop = (raw, targetIndex=null, target="grid") => {
    if (!raw) return;
    let payload; try { payload = JSON.parse(raw); } catch { return; }
    if (!payload?.from) return;

    if (target==="grid" && targetIndex!==null) {
      setGrid(prev=>{
        const next=[...prev];
        if(payload.from==="grid") next[payload.index]=null;
        next[targetIndex]=payload.value;
        return next;
      });
      if(payload.from==="inventory") setInventory(prev=>prev.filter((_,i)=>i!==payload.index));
    } else if (target==="inventory") {
      if(payload.from==="grid") setGrid(prev=>{ const copy=[...prev]; copy[payload.index]=null; return copy; });
      setInventory(p=>[...p,payload.value]);
    } else if(target==="garbage") {
      if(payload.from==="grid") setGrid(prev=>{ const copy=[...prev]; copy[payload.index]=null; return copy; });
      if(payload.from==="inventory") setInventory(prev=>prev.filter((_,i)=>i!==payload.index));
    }
  };

  const confirmCraft = () => {
    const res = matchRecipe(grid);
    if(!res) return;
    setInventory(p=>[...p,res.name]);
    setDiscovered(p=>p.includes(res.name)?p:[...p,res.name]);
    setGrid(Array(9).fill(null));
  };

  const resetGame = () => { setInventory([]); setGrid(Array(9).fill(null)); setDiscovered([]); setWin(false); localStorage.clear(); };

  const currentResult = matchRecipe(grid);

  return (
    <div className="game-board-root">
      <div className="layout">
        <Inventory items={inventory} onRemove={i=>setInventory(p=>p.filter((_,idx)=>idx!==i))} 
          onDropToInventory={p=>handleDrop(JSON.stringify(p),"","inventory")} />

        <div className="center-column panel">
          <div className="grid-title">Zona de crafting (3×3)</div>
          <div className="grid">
  {grid.map((cell, idx) => (
    <Cell
      key={idx}
      value={cell}
      index={idx}
      onDropOnCell={(e, index) => handleDrop(e.dataTransfer.getData("text/plain"), index, "grid")}
      onDragStartFromCell={(e, index, value) =>
        e.dataTransfer.setData("text/plain", JSON.stringify({ from: "grid", index, value }))
      }
    />
  ))}
</div>


          <div className="preview-area">
            {currentResult ? (
              <>
                <div>Rezultat posibil: <strong>{currentResult.name}</strong></div>
                <img src={images[currentResult.name]} alt={currentResult.name} className="preview-img"/>
                <button className="confirm-btn" onClick={confirmCraft}>Confirmă</button>
              </>
            ) : <div className="empty">Nicio combinație validă</div>}
          </div>

          <div className="garbage" onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e.dataTransfer.getData("text/plain"),null,"garbage")}>🗑️ Aruncă</div>

          <div className="base-resources">
            <div>Resurse de bază (trage sau click pentru inventar)</div>
            <div className="base-list">
              {BASE_RESOURCES.map(r=>
                <img key={r} src={images[r]} alt={r} className="res-img" draggable
                  onDragStart={e=>e.dataTransfer.setData("text/plain",JSON.stringify({from:"resource",value:r}))}
                  onClick={()=>addToInventory(r)} />
              )}
            </div>
          </div>

          <button className="reset-btn" onClick={resetGame}>Reset Game</button>
          {win && <div className="win-banner">🎉 Ai descoperit toate rețetele! Ai câștigat! 🎉</div>}
        </div>

        <DiscoveryPanel items={discovered} />
      </div>
    </div>
  );
}
