import { onAuthStateChanged } from "firebase/auth";
import { ParentComponent, Show, createContext, onCleanup, onMount, useContext } from "solid-js";
import { createStore } from 'solid-js/store';
import { fbAuth } from "../../db";
import { User } from '../../types/User';
import Loader from "../utils/Loader";

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

    const [store, setStore] = createStore(initialState())

onMount(() => {
  setStore('loading', true)
  listenToAuthChanges()
})

const authenticateUser = async() => {

}

const listenToAuthChanges = () => {
  onAuthStateChanged(fbAuth, (user) => {
    if (!!user) {
      setStore('isAuthenticated', true);
      setStore('user', user as any);
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