import { useParams } from '@solidjs/router';
import { FaSolidArrowLeft } from 'solid-icons/fa';
import { Component, Show, createEffect, createResource } from 'solid-js';
import { getGlideById } from '../../api/glide';
import useSubglides from '../../hooks/useSubglides';
import { User } from '../../types/User';
import GlidePost from '../glides/GlidePost';
import MainLayout from '../layouts/MainLayout';
import { CenteredDataLoader } from '../utils/DataLoader';
import Messenger from '../utils/Messenger';
import PaginatedGlides from '../glides/PaginatedGlides';
import { Glide } from '../../types/Glide';

const GlideDetail: Component = () => {
  const params = useParams();
  const { store, page, loadGlides, addGlide } = useSubglides()!;
  console.log('store: ', store);
  const [data, { mutate }] = createResource(() =>
    getGlideById(params.id, params.uid),
  );
  const user = () => data()?.user as User;

  createEffect(() => {
    const glide = data();
    if (!data.loading && !!glide && !!glide.lookup) {
      loadGlides(glide.lookup);
    }
  });

  const onGlideAdded = (newGlide?: Glide) => {
    const glide = data()!;
    mutate({
      ...glide,
      subglidesCount: glide.subglidesCount + 1,
    });
    addGlide(newGlide);
  };

  return (
    <MainLayout
      pageTitle={
        <div onClick={() => history.back()}>
          <div class="flex-it flex-row items-center text-xl cursor-pointer">
            <FaSolidArrowLeft />
            <div class="ml-5 font-bold">Back</div>
          </div>
        </div>
      }
    >
      <Show when={!data.loading} fallback={<CenteredDataLoader />}>
        <GlidePost glide={data()!} />
        <div class="p-4 border-b-1 border-solid border-gray-700">
          <div class="text-sm italic text-gray-300 underline mb-2">
            Answering to {user().nickName}
          </div>
          <Messenger
            onGlideAdded={onGlideAdded}
            showAvatar={false}
            answerTo={data()?.lookup}
          />
        </div>
      </Show>
      <PaginatedGlides
        page={page}
        pages={store.pages}
        loading={store.loading}
        loadMoreGlides={() => Promise.resolve()}
      />
    </MainLayout>
  );
};
export default GlideDetail;
