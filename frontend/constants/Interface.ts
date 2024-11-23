



export interface Stock {
    id?: number; 
    designation?: string; 
    lot?: number; 
    quantite?: number | null;
  }


  export interface SearchResult{
    designation: string;
    lot: number;
  }


  export interface SearchQuantite{
    quantite:number|null;
  }