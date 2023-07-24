import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../db';
import { Glide, UserGlide } from '../types/Glide';
import { User } from '../types/User';
import { UploadImage } from '../types/Form';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// Функция для загрузки изображения на сервер и получения ссылки на него
const uploadImage = async (image: UploadImage) => {
  const storage = getStorage();
  const storageRef = ref(storage, image.name);

  const uploadResult = await uploadBytes(storageRef, image.buffer);
  const downloadUrl = await getDownloadURL(uploadResult.ref);

  return downloadUrl;
};

// Функция для получения информации о гайде по его id и uid пользователя
const getGlideById = async (id: string, uid: string) => {
  const userDocRef = doc(db, 'users', uid);
  const userGlideRef = doc(userDocRef, 'glides', id);

  const userGlideSnap = await getDoc(userGlideRef);
  const userGlide = userGlideSnap.data() as UserGlide;
  const glideSnap = await getDoc(userGlide.lookup);
  const userDocSnap = await getDoc(userDocRef);

  const glide = {
    ...glideSnap.data(),
    user: userDocSnap.data(),
    id: glideSnap.id,
    lookup: glideSnap.ref.path,
  } as Glide;

  return glide;
};

// Функция для получения списка гайдов пользователя или пользователей, на которых он подписан
const getGlides = async (
  loggedInUser: User,
  lastGlide: QueryDocumentSnapshot | null,
) => {
  const _loggedInUserDoc = doc(db, 'users', loggedInUser.uid);
  const constraints: QueryConstraint[] = [orderBy('date', 'desc'), limit(10)];

  if (loggedInUser.following.length > 0) {
    constraints.push(
      where('user', 'in', [...loggedInUser.following, _loggedInUserDoc]),
    );
  } else {
    constraints.push(where('user', '==', _loggedInUserDoc));
  }

  if (!!lastGlide) {
    constraints.push(startAfter(lastGlide));
  }

  const q = query(collection(db, 'glides'), ...constraints);

  const qSnapshot = await getDocs(q);
  const _lastGlide = qSnapshot.docs[qSnapshot.docs.length - 1];

  const glides = await Promise.all(
    qSnapshot.docs.map(async (doc) => {
      const glide = doc.data() as Glide;
      const userSnap = await getDoc(glide.user as DocumentReference);
      glide.user = userSnap.data() as User;

      return { ...glide, id: doc.id, lookup: doc.ref.path };
    }),
  );

  return { glides, lastGlide: _lastGlide };
};

// Функция для получения подгайдов (ответов) на определенный гайд
const getSubglides = async (
  glideLookup: string,
  lastGlide: QueryDocumentSnapshot | null,
) => {
  const ref = doc(db, glideLookup);
  const _collection = collection(ref, 'glides');

  const constraints: QueryConstraint[] = [orderBy('date', 'desc'), limit(10)];
  if (lastGlide !== null) {
    constraints.push(startAfter(lastGlide));
  }
  const q = query(_collection, ...constraints);
  const qSnapshot = await getDocs(q);
  const _lastGlide = qSnapshot.docs[qSnapshot.docs.length - 1];

  const glides = await Promise.all(
    qSnapshot.docs.map(async (doc) => {
      const glide = doc.data() as Glide;
      const userSnap = await getDoc(glide.user as DocumentReference);
      glide.user = userSnap.data() as User;

      return { ...glide, id: doc.id, lookup: doc.ref.path };
    }),
  );
  return {
    glides,
    lastGlide: _lastGlide,
  };
};

// Функция для подписки на гайды пользователей, на которых пользователь подписан
const subscribeToGlides = (
  loggedInUser: User,
  getCallback: (g: Glide[]) => void,
) => {
  const _collection = collection(db, 'glides');

  const contraints = [
    where('date', '>', Timestamp.now()),
    where('user', 'in', loggedInUser.following),
  ];

  const q = query(_collection, ...contraints);

  return onSnapshot(q, async (querySnapshot) => {
    const glides = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const glide = doc.data() as Glide;
        const userSnap = await getDoc(glide.user as DocumentReference);
        glide.user = userSnap.data() as User;
        return { ...glide, id: doc.id, lookup: doc.ref.path };
      }),
    );

    getCallback(glides);
  });
};

// Функция для получения коллекции гайдов, на которые отвечает определенный гайд
const getGlideCollection = (answerTo?: string) => {
  let glideCollection;

  if (!!answerTo) {
    const ref = doc(db, answerTo);
    glideCollection = collection(ref, 'glides');
  } else {
    glideCollection = collection(db, 'glides');
  }

  return glideCollection;
};

// Функция для создания нового гайда или ответа на существующий гайд
const createGlide = async (
  form: {
    content: string;
    uid: string;
  },
  answerTo?: string,
): Promise<Glide> => {
  const userRef = doc(db, 'users', form.uid);

  const glideCollection = getGlideCollection(answerTo);

  const glideToStore = {
    ...form,
    user: userRef,
    likesCount: 0,
    subglidesCount: 0,
    date: Timestamp.now(),
  };

  if (!!answerTo) {
    const ref = doc(db, answerTo);
    await updateDoc(ref, {
      subglidesCount: increment(1),
    });
  }

  const added = await addDoc(glideCollection, glideToStore);

  const userGlideRef = doc(userRef, 'glides', added.id);
  await setDoc(userGlideRef, { lookup: added });

  return { ...glideToStore, id: added.id, lookup: added.path };
};

// Экспорт функций для использования в других частях приложения
export {
  createGlide,
  getGlides,
  subscribeToGlides,
  getGlideById,
  getSubglides,
  uploadImage,
};
