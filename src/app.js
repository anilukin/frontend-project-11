import onChange from 'on-change';
import * as yup from 'yup';
import { renderForm } from './view.js';

const validate = (url, list) => {
  const formSchema = yup.string()
    .url()
    .notOneOf(list);

  return formSchema.validate(url);
};

export default () => {
  const state = {
    form: {
      state: 'filing',
      errorType: null,
    },
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form') {
      renderForm(value);
    }
  });

  const formEl = document.querySelector('form');

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUrl = formData.get('url');
    validate(newUrl, state.posts)
      .then(() => {
        state.posts.push(newUrl);
        watchedState.form = {
          state: 'loadedUrl',
        };
        e.target.reset();
      })
      .catch((ex) => {
        watchedState.form = {
          errorType: ex.type,
          state: 'errorUrl',
        };
      });
  });
};
