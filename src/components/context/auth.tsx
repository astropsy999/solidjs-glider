import { Accessor, Component, ParentComponent, createContext, createSignal, onCleanup, onMount, useContext } from "solid-js";
import {createStore} from 'solid-js/store'

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
  } catch (error: any) {
    console.log(error);
  } finally {
    setStore('loading', false)
  }
})

const authenticateUser = async() => {
  return new Promise((res, rej) => {
    setTimeout(() => {
        setStore("isAuthenticated", true)
        // res(true)
        rej("problem")
    }, 1000)
  })
}

onCleanup(() => {

})

return (
  <AuthStateContext.Provider
    value={store}
  >
    {props.children}
  </AuthStateContext.Provider>
);
};

export const useAuthState = () => useContext(AuthStateContext)

export default AuthProvider;