import { FirebaseError } from 'firebase/app';
import { createStore } from 'solid-js/store';
import { GliderInputEvent, MessengerForm, UploadImage } from '../types/Form';
import { useAuthState } from '../components/context/auth';
import { useUIDispatch } from '../components/context/ui';
import { createSignal } from 'solid-js';
import { createGlide, uploadImage } from '../api/glide';

const defaultImage = () => ({
  buffer: new ArrayBuffer(0),
  name: '',
  previewUrl: '',
});

const useMessenger = (answerTo?: string) => {
  const [form, setForm] = createStore<MessengerForm>({
    content: '',
  });
  const [loading, setLoading] = createSignal(false);
  const { addSnackbar } = useUIDispatch();
  const [image, setImage] = createSignal<UploadImage>(defaultImage());

  const { isAuthenticated, user } = useAuthState()!;

  const handleInput = (e: GliderInputEvent) => {
    const { name, value } = e.currentTarget;
    setForm(name, value);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      addSnackbar({ message: 'You are not authenticated!', type: 'error' });
      return;
    }

    setLoading(true);

    const glideForm = {
      ...form,
      uid: user!.uid,
    };
    try {
      //check if image is attached
      if (image().buffer.byteLength > 0) {
        const downloadUrl = await uploadImage(image());
        glideForm.mediaUrl = downloadUrl;
      }
      //upload image
      //return url where the image is uploaded

      const newGlide = await createGlide(glideForm, answerTo);

      newGlide.user = {
        nickName: user?.nickName,
        avatar: user?.avatar,
      };
      addSnackbar({ message: 'Glide added', type: 'success' });
      setForm({ content: '' });
      setImage(defaultImage());
      return newGlide;
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return { handleInput, handleSubmit, form, loading, image, setImage };
};

export default useMessenger;
