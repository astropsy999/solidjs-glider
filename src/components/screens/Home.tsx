import { Component } from 'solid-js';
import useGlides from '../../hooks/useGlides';
import MainLayout from '../layouts/MainLayout';
import Messenger from '../utils/Messenger';
import PaginatedGlides from '../glides/paginatedGlides';

const HomeScreen: Component = () => {
  
  const {store, page, addGlide, loadGlides} = useGlides()

  return (
    <MainLayout>
      <Messenger onGlideAdded={addGlide} />
      <div class="h-px bg-gray-700 my-1" />
      <PaginatedGlides page={page} pages={store.pages} loading={store.loading} loadMoreGlides={loadGlides}/>
    </MainLayout>
  );
};

export default HomeScreen;
