
import { db } from "@/lib/firebase-config";
import { collection, addDoc, getDocs, doc, query } from "firebase/firestore";
import type { Client } from "@/lib/types";
import type { NewClientFormData } from "@/app/clients/new/page";

const CLIENTS_COLLECTION = 'clients';

// Function to add a new client to Firestore
export async function addClient(clientData: NewClientFormData): Promise<string> {
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

// Function to get all clients from Firestore
export async function getClients(): Promise<Client[]> {
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
