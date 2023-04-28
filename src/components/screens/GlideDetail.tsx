import { Component, Show, createResource, onMount } from 'solid-js';
import MainLayout from '../layouts/MainLayout';
import { useParams } from '@solidjs/router';
import { getGlideById } from '../../api/glide';
import GlidePost from '../glides/GlidePost';
import { CenteredDataLoader } from '../utils/DataLoader';
import { FaSolidArrowLeft } from 'solid-icons/fa';
import Messenger from '../utils/Messenger';
import { User } from '../../types/User';

const GlideDetail: Component = () => {
  const params = useParams();

  const [data] = createResource(() => getGlideById(params.id, params.uid));
  const user = () => data()?.user as User;

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
          <Messenger onGlideAdded={() => {}} showAvatar={false} />
        </div>
      </Show>
    </MainLayout>
  );
};
export default GlideDetail;
