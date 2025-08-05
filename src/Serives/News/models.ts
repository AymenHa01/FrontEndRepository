export interface Formation {
    id?: number;
    // Add other formation properties as needed
}

export interface Evenement {
    id?: number;
    // Add other evenement properties as needed
}

export interface Tableau {
    id?: number;
    // Add other tableau properties as needed
}

export interface Atelier {
    id?: number;
    // Add other atelier properties as needed
}

export interface LatestNews {
    formations: Formation[];
    evenements: Evenement[];
    tableaux: Tableau[];
    ateliers: Atelier[];
}
