import { onAuthStateChanged } from "firebase/auth";
import { ParentComponent, Show, createContext, onCleanup, onMount, useContext } from "solid-js";
import { createStore } from 'solid-js/store';
import { fbAuth } from "../../db";
import { User } from '../../types/User';
import Loader from "../utils/Loader";
import { useLocation, useNavigate } from "@solidjs/router";
import { getUser } from "../../api/auth";

type AuthStateCtxValues = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
};

type AuthDispatch = {
  updateUser: (u: Partial<User>) => void
}

const initialState = () => ({
 isAuthenticated: false,
 loading: true,
 user: null
}
)
const AuthStateContext = createContext<AuthStateCtxValues>();
const AuthDispatchContext = createContext<AuthDispatch>()

const AuthProvider: ParentComponent = (props) => {

    const [store, setStore] = createStore<AuthStateCtxValues>(initialState());
    const location = useLocation()
    const navigate = useNavigate()

onMount(() => {
  setStore('loading', true)
  listenToAuthChanges()
})


const listenToAuthChanges = () => {
  onAuthStateChanged(fbAuth, async (user) => {
    if (!!user) {
      const glideUser = await getUser(user.uid)
      setStore('isAuthenticated', true);
      setStore('user', glideUser);
      if(location.pathname.includes('/auth')) {
        navigate('/', {replace: true})
      }
    } else {
      setStore('isAuthenticated', false);
      setStore('user', null);
    }

     setStore('loading', false);
  });
}
const updateUser = (user: Partial<User>) => {
  Object.keys(user).forEach(userKey => {
    const key = userKey as keyof User
    setStore('user', key, user[key]!);
  })
}

return (
  <AuthStateContext.Provider value={store}>
    <AuthDispatchContext.Provider value={{updateUser}}>
      <Show when={store.loading} fallback={props.children}>
        <Loader size={100} />
      </Show>
    </AuthDispatchContext.Provider>
  </AuthStateContext.Provider>
);
};

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)

export default AuthProvider;