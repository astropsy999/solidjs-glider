import { createSignal } from "solid-js"
import { AuthType, authenticate } from "../api/auth"
import { AuthForm } from "../types/Form"
import { FirebaseError } from "firebase/app"

const useAuth = (authType: AuthType) => {

    const [loading, setLoading] = createSignal(false)
    const authUser = async (form: AuthForm) => {
        setLoading(true)
        try {
            await authenticate(form, authType);
        } catch (error) {
            const message = (error as FirebaseError).message
            console.log('message: ', message);
        }
       setLoading(false)
    }

    return {
      authUser,
      loading,
    };
}

export default useAuth