import { Stock  } from '@/constants/Interface';
import React, { createContext } from 'react';


export const StockDataDisplay = createContext<{
    listItem : Stock[]|null|string;
    listItemDelete : number[];
    setListItemDelete :React.Dispatch<React.SetStateAction<number[]>>; 
  }>({
    listItem: null,
    listItemDelete: [], 
    setListItemDelete: () => {}, 
  });
  
  
  
  export const ModifierDataDisplay = createContext<{
    listSelectedItem:Stock[]|null|string;
    totalSum:number|null;
  }>({
      listSelectedItem : null,
      totalSum: null
  })