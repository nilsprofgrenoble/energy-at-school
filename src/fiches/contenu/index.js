import { production1 } from './production1';

export const FICHES = { 'production-1': production1 };
export const aFiche = page => (FICHES[page] || []).length > 0;
