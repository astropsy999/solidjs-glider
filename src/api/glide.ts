import { Timestamp, addDoc, collection, doc } from "firebase/firestore"
import { db } from "../db"
import { Glide } from "../types/Glide"

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