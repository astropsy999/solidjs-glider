import { FirebaseError } from "firebase/app"
import { createSignal, onMount } from "solid-js"
import { getUsers } from "../api/users"
import { useAuthState } from "../components/context/auth"
import { useUIDispatch } from "../components/context/ui"
import { User } from "../types/User"

const useUsers = () => {
    const {user} = useAuthState()!
    const [users, setUsers] = createSignal<User[]>([])
    const [loading, setLoading] = createSignal(true)
    const {addSnackbar} = useUIDispatch()

    onMount(() => {
        loadUsers()
    })

    const loadUsers = async () => {
        try {
            const users = await getUsers(user!)
            setUsers(users)

        } catch (error) {
            const message = (error as FirebaseError).message
            addSnackbar({message, type: "error"})
        }finally {
            setLoading(false)
        }
    }

    return {
        loading,
        users
    }
}

export default useUsers