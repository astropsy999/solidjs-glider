import { ParentComponent, createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store";

export type SnackbarMessage = {
    message: string,
    type: "success" | "warning" | "error"
    id?: string
}

type UIState = {
    snackbars: SnackbarMessage[]
}

const UIStateContext = createContext<UIState>();

const defaultState = (): UIState => ({
  snackbars: [
    { message: 'Hello Wold', type: 'success' },
    { message: 'Oops', type: 'error' },
    { message: 'Double check', type: 'warning' },
  ],
});

const UIProvider: ParentComponent = (props) => {
    const [store, setStore] = createStore(defaultState());
    return (
        <UIStateContext.Provider value={store}>
            {props.children}
        </UIStateContext.Provider>
    )
}

export const useUIState = () => useContext(UIStateContext);

export default UIProvider