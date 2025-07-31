import { collection, addDoc, getDocs, query, Firestore } from "firebase/firestore";
import type { Client } from "@/lib/types";
import type { NewClientFormData } from "@/components/clients/new-client-page";

const CLIENTS_COLLECTION = 'clients';

// Function to add a new client to Firestore, receiving the 'db' instance
export async function addClient(db: Firestore, clientData: NewClientFormData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
      clientName: clientData.clientName,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Could not add client");
  }
}

// Function to get all clients from Firestore, receiving the 'db' instance
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
