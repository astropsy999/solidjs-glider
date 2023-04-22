import { Component, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Glide } from '../../types/Glide';
import GlidePost from '../glides/GlidePost';
import MainLayout from '../layouts/MainLayout';
import Messenger from '../utils/Messenger';

const HomeScreen: Component = () => {
  const [glides, setGlides] = createStore({
    items: [] as Glide[]
  });

 

  return (
    <MainLayout>
      <Messenger/>
      <div class="h-px bg-gray-700 my-1" />
      <For each={glides.items}>{(glide) => <GlidePost glide={glide} />}</For>
    </MainLayout>
  );
};

export default HomeScreen;
