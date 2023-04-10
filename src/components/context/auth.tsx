import { Accessor, Component, ParentComponent, Show, createContext, createSignal, onCleanup, onMount, useContext } from "solid-js";
import {createStore} from 'solid-js/store'
import Loader from "../utils/Loader";

type AuthStateCtxValues = {
    isAuthenticated: boolean
    loading: boolean

}

const initialState = () => ({
 isAuthenticated: false,
 loading: true
}
)
const AuthStateContext = createContext<AuthStateCtxValues>();

const AuthProvider: ParentComponent = (props) => {

    const [store, setStore] = createStore(initialState())

onMount(async () => {
  try {
    await authenticateUser();
     setStore('isAuthenticated', true);
  } catch (error: any) {
    console.log(error);
     setStore('isAuthenticated', false);  
  } finally {
    setStore('loading', false)
  }
})

const authenticateUser = async() => {
  return new Promise((res, rej) => {
    setTimeout(() => {
        // res(true)
        rej("problem")
    }, 1000)
  })
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