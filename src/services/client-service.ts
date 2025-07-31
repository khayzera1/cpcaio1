import { collection, addDoc, getDocs, query, type Firestore, type DocumentReference } from "firebase/firestore";
import type { Client } from "@/lib/types";
import type { NewClientFormData } from "@/app/clients/new/page";

const CLIENTS_COLLECTION = 'clients';

// Função para adicionar um novo cliente, recebendo a instância 'db'.
export async function addClient(db: Firestore, clientData: NewClientFormData): Promise<string> {
  try {
    const docRef: DocumentReference = await addDoc(collection(db, CLIENTS_COLLECTION), {
      clientName: clientData.clientName,
      createdAt: new Date(),
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
    const q = query(collection(db, CLIENTS_COLLECTION));
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
