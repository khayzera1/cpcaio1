import { collection, addDoc, getDocs, query, type Firestore, type DocumentReference, serverTimestamp, orderBy } from "firebase/firestore";
import type { Client } from "@/lib/types";

export interface ClientFormData {
  clientName: string;
}

const CLIENTS_COLLECTION = 'clients';

// Função para adicionar um novo cliente, recebendo a instância 'db'.
export async function addClient(db: Firestore, clientData: ClientFormData): Promise<string> {
  try {
    const docRef: DocumentReference = await addDoc(collection(db, CLIENTS_COLLECTION), {
      ...clientData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Could not add client");
  }
}

// Função para obter clientes, recebendo a instância 'db'.
export async function getClients(db: Firestore): Promise<Client[]> {
  try {
    const q = query(collection(db, CLIENTS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const clients: Client[] = [];
    querySnapshot.forEach((doc) => {
      clients.push({
        id: doc.id,
        ...doc.data(),
      } as Client);
    });
    return clients;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw new Error("Could not retrieve clients");
  }
}
