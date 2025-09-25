import React, { createContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import recipes from '../data/recipes.json';
import resources from '../data/resources.json';


const GameContext = createContext(null);

export function GameProvider({ children }) {
const initial = {
inventory: [],
craftingSlots: Array(9).fill(null),
craftedItems: [],
craftedItem: null
};


const [state, setState] = useLocalStorage('lab1-game', initial);

const addBase = (id) => {
const itemDef = resources.base.find(r => r.id === id);
if(!itemDef) return;
const newItem = { id: cryptoRandomId(), name: itemDef.name, ref: itemDef.id, image: itemDef.image, description: itemDef.description };
setState(prev => ({ ...prev, inventory: [...prev.inventory, newItem] }));
};


const resetGame = () => {
setState(initial);
};


const value = useMemo(() => ({ state, setState, recipes, resources, addBase, resetGame }), [state]);


return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}


function cryptoRandomId() {
return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}