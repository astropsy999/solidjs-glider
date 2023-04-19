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

const initialState = () => ({
 isAuthenticated: false,
 loading: true,
 user: null
}
)
const AuthStateContext = createContext<AuthStateCtxValues>();

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

onCleanup(() => {

})

return (
  <AuthStateContext.Provider value={store}>
    <Show when={store.loading} fallback={props.children}>
      <Loader size={100} />
    </Show>
  </AuthStateContext.Provider>
);
};

export const useAuthState = () => useContext(AuthStateContext)

export default AuthProvider;