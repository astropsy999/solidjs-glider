import { Outlet, useNavigate } from "@solidjs/router";
import { Component, onMount } from "solid-js";
import { useAuthState } from "../../components/context/auth";

const AuthLayout: Component<{}> = (props) => {
  const authState = useAuthState()!
  const navigate = useNavigate()

  onMount(()=> {
    if (authState.isAuthenticated) {
      navigate('/', { replace: true });
    }
  })

  return <Outlet/>
};

export default AuthLayout;