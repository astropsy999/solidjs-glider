import { Component, Show, onCleanup, onMount } from 'solid-js';
import useGlides from '../../hooks/useGlides';
import MainLayout from '../layouts/MainLayout';
import Messenger from '../utils/Messenger';
import PaginatedGlides from '../glides/PaginatedGlides';
import { Portal } from 'solid-js/web';
import Button from '../utils/Button';

const HomeScreen: Component = () => {
  const {
    store,
    page,
    addGlide,
    loadGlides,
    subscribeToGlides,
    unsubscribeFromGlides,
    displayFreshGlides,
  } = useGlides();
  onMount(() => {
    subscribeToGlides();
  });
  onCleanup(() => {
    unsubscribeFromGlides();
  });

  return (
    <MainLayout pageTitle="Home">
      <Messenger onGlideAdded={addGlide} />
      <div class="h-px bg-gray-700 my-1" />
      <Show when={store.freshGlides.length >= 3}>
        <Portal>
          <div class="fixed top-2 z-100 left-2/4 -translate-x-1/2">
            <Button onClick={displayFreshGlides}>
              <span>Read New glides</span>
            </Button>
          </div>
        </Portal>
      </Show>
      <PaginatedGlides
        page={page}
        pages={store.pages}
        loading={store.loading}
        loadMoreGlides={loadGlides}
      />
    </MainLayout>
  );
};

export default HomeScreen;
