export interface Client {
  id: string;
  clientName: string;
  createdAt: any; // Mantido como any para compatibilidade com serverTimestamp
}
