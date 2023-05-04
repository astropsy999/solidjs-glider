import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import _, { isEqual } from 'lodash';

type PersistanceStore = { [key: string]: any };

type Map = { [key: string]: any };

type PersistenceContextType = {
  setValue: (key: string, value: any) => void;
  getValue: <T>(key: string) => T;
  useRevalidate: <T extends Map>(
    key: string,
    getData: () => Promise<T>,
    callback?: (latestData: T) => void,
  ) => Promise<T>;
};

const PersistenceContext = createContext<PersistenceContextType>();

const PERSISTANCE_LIMIT = 1000;

const PersistenceProvider: ParentComponent = (props) => {
  const [store, setStore] = createStore<PersistanceStore>();
  const clear = () => {
    setStore(
      produce((store) => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
    );
  };
  const setValue = (key: string, value: any) => {
    if (Object.keys(store).length > PERSISTANCE_LIMIT) {
      clear();
    }
    setStore(
      produce((store) => {
        store[key] = value;
      }),
    );
  };

  const getValue = <T,>(key: string) => store[key] as T;

  const hasValue = (key: string) => !!store[key];

  const revalidate = async <T extends Map>(
    key: string,
    getData: () => Promise<T>,
    persistedData: T,
    callback?: (latestData: T) => void,
  ) => {
    const latestData = await getData();

    const isEqual = Object.keys(persistedData).every((property) =>
      _.isEqual(latestData[property], persistedData[property]),
    );

    if (!isEqual) {
      setValue(key, latestData);
      if (!!callback) {
        callback(latestData);
      }
    }

    return latestData;
  };

  const useRevalidate = async <T extends Map>(
    key: string,
    getData: () => Promise<T>,
    callback?: (latestData: T) => void,
  ) => {
    if (hasValue(key)) {
      const value = getValue<T>(key);
      revalidate(key, getData, value, callback);
      return value;
    }
    const result = await getData();
    setValue(key, result);
    ``;
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
