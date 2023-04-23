import { DocumentReference, Timestamp, addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore"
import { db } from "../db"
import { Glide } from "../types/Glide"
import { User } from "../types/User"

export const getGlides =async () => {
    const constraints = [
        orderBy("date", "desc"),
        limit(10)
    ]
   const q = query(collection(db, 'glides'), ...constraints);
   const qSnapshot = await getDocs(q)

  const glides = await Promise.all(qSnapshot.docs.map(async doc => {
    const glide = doc.data() as Glide

    const userSnap = await getDoc(glide.user as DocumentReference)

    glide.user = userSnap.data() as User
    return {...glide, id: doc.id}
  }))

  return {glides}
}

export const createGlide = async (form: {
    content: string, uid: string
}): Promise<Glide> => {
    const userRef = doc(db, "users", form.uid)
    const glideToStore = {
        ...form,
        user: userRef,
        likesCount: 0,
        subglidesCount: 0,
        date: Timestamp.now()
    }

    const glidesCollection = collection(db, "glides")

    const added = await addDoc(glidesCollection, glideToStore)

    return {...glideToStore, id: added.id}
}