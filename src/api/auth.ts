import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { AuthForm, RegisterForm } from "../types/Form";
import { db, fbAuth } from "../db";
import { User } from "../types/User";
import { doc, setDoc } from "firebase/firestore";

const register = async(form: RegisterForm) => {
    const {user: registeredUser} = await createUserWithEmailAndPassword(fbAuth, form.email, form.password)

    const user: User = {
        uid: registeredUser.uid,
        fullName: form.fullName,
        nickName: form.nickName,
        email: form.email,
        avatar: form.avatar,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0
    }

    setDoc(doc(db, "users", registeredUser.uid), user)
    return registeredUser
}

const login = async (loginForm: AuthForm) => {
    const {user} = await signInWithEmailAndPassword(fbAuth, loginForm.email, loginForm.password);
    return user
}

const logout = () => {
    return signOut(fbAuth)
}

export { register, logout, login };