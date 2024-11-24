import React, {createContext } from 'react';



export const SetQrData = createContext<{
    setQrDataDesignation: React.Dispatch<React.SetStateAction<string | null>>;
    setQrDataLot: React.Dispatch<React.SetStateAction<string | null>>;
  }>({ setQrDataDesignation: () => {}, setQrDataLot: () => {} });
  
  export const FillFormDataQrCode = createContext<{
    qrDataDesignation :string | null;
    qrDataLot: string | null;
    quantite: string | null;
    setQuantite: React.Dispatch<React.SetStateAction<string | null>>
  }>({
    qrDataDesignation: null,
    qrDataLot: null,
    quantite: null,
    setQuantite: () => {},
  });
  