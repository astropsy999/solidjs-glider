import { FaRegularImage } from 'solid-icons/fa';
import { Component, createSignal, createUniqueId, For } from 'solid-js';
import GlidePost from '../glides/GlidePost';
import MainLayout from '../layouts/MainLayout';
import { Glide } from '../../types/Glide';
import { createStore, produce } from 'solid-js/store';
import { useAuthState } from '../context/auth';
import { useDispatch } from '../context/ui';

const HomeScreen: Component = () => {
  const {user} = useAuthState()!
  const {addSnackbar} = useDispatch()
  const [content, setContent] = createSignal('');
  const [glides, setGlides] = createStore({
    items: [] as Glide[]
  });

  const creatGlide = () => {
    const glide = {
      id: createUniqueId(),
      content: content(),
      user: {
        nicName: 'Yevhen',
        avatar:
          'https://yt3.ggpht.com/oW_ksWUfj0om18aSwMiv-WT6XJeIvzw1AilLXWQfpWWJifS5q96MebQEeCBNh7oU9K_xRITAuA=s88-c-k-c0x00ffffff-no-rj-mo',
      },
      likesCount: 0,
      subglidesCount: 0,
      date: new Date(),
    };

    // setGlides("items", produce((items)=> {
    //   items.push(glide)
    // }));

    // setGlides(produce((glides) => {
    //   glides.items.unshift(glide)
    // }))
    addSnackbar({message: "Glide added successfully", type: "success"})
    setContent('');

    // console.log(JSON.stringify(glides()));
  };

  return (
    <MainLayout>
      {/* HOME PAGE START */}
      <div class="flex-it py-1 px-4 flex-row">
        <div class="flex-it mr-4">
          <div class="w-12 h-12 overflow-visible cursor-pointer transition duration-200 hover:opacity-80">
            <img
              class="rounded-full"
              src={user?.avatar}
            ></img>
          </div>
        </div>
        {/* MESSENGER START */}
        <div class="flex-it flex-grow">
          <div class="flex-it">
            <textarea
              value={content()}
              onInput={(e) => {
                setContent(e.currentTarget.value);
              }}
              name="content"
              rows="1"
              id="glide"
              class="bg-transparent resize-none overflow-hidden block !outline-none !border-none border-transparent focus:border-transparent focus:ring-0 text-gray-100 text-xl w-full p-0"
              placeholder={"What's new?"}
            />
          </div>
          <div class="flex-it mb-1 flex-row xs:justify-between items-center">
            <div class="flex-it mt-3 mr-3 cursor-pointer text-white hover:text-blue-400 transition">
              <div class="upload-btn-wrapper">
                <FaRegularImage class="cursor-pointer" size={18} />
                <input type="file" name="myfile" />
              </div>
            </div>
            <div class="flex-it w-32 mt-3 cursor-pointer">
              <button
                onClick={creatGlide}
                type="button"
                class="
                            disabled:cursor-not-allowed disabled:bg-gray-400
                            bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full flex-it transition duration-200"
              >
                <div class="flex-it flex-row text-sm font-bold text-white items-start justify-center">
                  <span>Glide It</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* MESSENGER END */}
      </div>
      <div class="h-px bg-gray-700 my-1" />
      <For each={glides.items}>{(glide) => <GlidePost glide={glide} />}</For>

      {/* HOME PAGE END */}
    </MainLayout>
  );
};

export default HomeScreen;
