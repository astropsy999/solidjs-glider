import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

type PersistanceStore = { [key: string]: any };

type PersistenceContextType = {
  setValue: (key: string, value: any) => void;
  getValue: <T>(key: string) => T;
  useRevalidate: <T>(key: string, getData: () => Promise<T>) => Promise<T>;
};

const PersistenceContext = createContext<PersistenceContextType>();

const PersistenceProvider: ParentComponent = (props) => {
  const [store, setStore] = createStore<PersistanceStore>();
  const setValue = (key: string, value: any) => {
    setStore(
      produce((store) => {
        store[key] = value;
      }),
    );
  };
  const getValue = (key: string) => store[key];

  const hasValue = (key: string) => !!store[key];

  const useRevalidate = async <T,>(key: string, getData: () => Promise<T>) => {
    if (hasValue(key)) {
      const value = getValue(key);
      return value;
    }
    const result = await getData();
    return result;
  };
  return (
    <PersistenceContext.Provider value={{ setValue, getValue, useRevalidate }}>
      {props.children}
    </PersistenceContext.Provider>
  );
};

export const usePersistence = () => useContext(PersistenceContext);

export default PersistenceProvider;
