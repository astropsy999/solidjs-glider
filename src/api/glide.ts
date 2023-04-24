import { DocumentReference, QueryConstraint, QueryDocumentSnapshot, Timestamp, addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore"
import { db } from "../db"
import { Glide } from "../types/Glide"
import { User } from "../types/User"

export const getGlides =async (lastGlide: QueryDocumentSnapshot | null) => {
    const constraints: QueryConstraint[] = [
        orderBy("date", "desc"),
        limit(10)
    ]

    if(!!lastGlide) {
        constraints.push(startAfter(lastGlide))
    }
   const q = query(collection(db, 'glides'), ...constraints);
   const qSnapshot = await getDocs(q)
   const _lastGlide = qSnapshot.docs[qSnapshot.docs.length - 1]

  const glides = await Promise.all(qSnapshot.docs.map(async doc => {
    const glide = doc.data() as Glide

    const userSnap = await getDoc(glide.user as DocumentReference)

    glide.user = userSnap.data() as User
    return {...glide, id: doc.id}
  }))

  return { glides, lastGlide: _lastGlide };
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