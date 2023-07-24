import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { AuthForm, RegisterForm } from '../types/Form';
import { db, fbAuth } from '../db';
import { User } from '../types/User';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Тип для определения типа авторизации: "register" (регистрация) или "login" (вход в систему)
export type AuthType = 'register' | 'login';

// Функция для регистрации нового пользователя
const register = async (form: RegisterForm) => {
  // Создание пользователя с помощью метода createUserWithEmailAndPassword из Firebase
  const { user: registeredUser } = await createUserWithEmailAndPassword(
    fbAuth,
    form.email,
    form.password,
  );

  // Создание объекта User для сохранения в базу данных
  const user: User = {
    uid: registeredUser.uid,
    fullName: form.fullName,
    nickName: form.nickName,
    email: form.email,
    avatar: form.avatar,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
  };

  // Сохранение объекта User в базу данных с помощью метода setDoc из Firebase
  setDoc(doc(db, 'users', registeredUser.uid), user);
  return registeredUser;
};

// Функция для входа пользователя в систему
const login = async (loginForm: AuthForm) => {
  // Вход пользователя с помощью метода signInWithEmailAndPassword из Firebase
  const { user } = await signInWithEmailAndPassword(
    fbAuth,
    loginForm.email,
    loginForm.password,
  );
  return user;
};

// Функция для аутентификации, которая вызывает функцию login или register в зависимости от типа авторизации
const authenticate = (form: AuthForm, type: AuthType) => {
  return type === 'login' ? login(form) : register(form as RegisterForm);
};

// Функция для выхода пользователя из системы
const logout = () => {
  return signOut(fbAuth);
};

// Функция для получения информации о пользователе по его uid
const getUser = async (uid: string) => {
  // Получение документа с информацией о пользователе из базы данных
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as User;
};

// Экспорт функций для использования в других частях приложения
export { register, logout, login, authenticate, getUser };
