import { Accessor, Component, ParentComponent, createContext, createSignal, onCleanup, onMount, useContext } from "solid-js";

type AuthStateCtxValues = {
    isAuthenticated: Accessor<boolean>
    loading: Accessor<boolean>

}

const AuthStateContext = createContext<AuthStateCtxValues>();

const AuthProvider: ParentComponent = (props) => {

    const [isAuthenticated, setIsAuthenticated] = createSignal(false)
    const [loading, setLoading] = createSignal(true)

onMount(() => {
})

onCleanup(() => {

})

return (
  <AuthStateContext.Provider
    value={{
      isAuthenticated,
      loading,
    }}
  >
    {props.children}
  </AuthStateContext.Provider>
);
};

export const useAuthState = () => useContext(AuthStateContext)

export default AuthProvider;