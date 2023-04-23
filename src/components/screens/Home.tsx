import { Component, For } from 'solid-js';
import GlidePost from '../glides/GlidePost';
import MainLayout from '../layouts/MainLayout';
import Messenger from '../utils/Messenger';
import useGlides from '../../hooks/useGlides';

const HomeScreen: Component = () => {
  
  const {store, page, addGlide} = useGlides()

  return (
    <MainLayout>
      <Messenger onGlideAdded={addGlide} />
      <div class="h-px bg-gray-700 my-1" />
      <For each={Array.from({ length: page() })}>
        {(_, i) => (
          <For each={store.pages[i() + 1]?.glides}>
            {(glide) => <GlidePost glide={glide} />}
          </For>
        )}
      </For>
    </MainLayout>
  );
};

export default HomeScreen;
