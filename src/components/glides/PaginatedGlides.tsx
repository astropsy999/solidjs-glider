import { Accessor, Component, For, Show, onCleanup, onMount } from "solid-js";
import GlidePost from "./GlidePost";
import { Glide } from "../../types/Glide";
import { CenteredDataLoader } from "../utils/DataLoader";

type Props = {
    page: Accessor<number>
    pages: {[key: string]: {glides: Glide[]}}
    loading: boolean
    loadMoreGlides: () => Promise<void>
}

const PaginatedGlides: Component<Props> = (props) => {
  let lastItemRef: HTMLDivElement

  onMount(()=> {
    window.addEventListener('scroll', loadNewItems)
  })

  onCleanup(()=> {
    window.removeEventListener('scroll', loadNewItems);
  })

  const loadNewItems = () => {
    if(lastItemRef.getBoundingClientRect().top <= window.innerHeight) {
      if(!props.loading) {
        //add additional glides
        props.loadMoreGlides()
      }
    }

  }
    return (
      <>
        <For each={Array.from({ length: props.page() })}>
          {(_, i) => (
            <For each={props.pages[i() + 1]?.glides}>
              {(glide) => <GlidePost glide={glide} />}
            </For>
          )}
        </For>
        <Show when={props.loading}><CenteredDataLoader/></Show>
        <div ref={lastItemRef!}></div>
        <div class="h-96"></div>
      </>
    );
}
export default PaginatedGlides