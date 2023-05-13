import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import { renderForm } from './view.js';

const validate = (url, list) => {
  const formSchema = yup.string()
    .url()
    .notOneOf(list);

  return formSchema.validate(url);
};

const locale = 'ru';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: locale,
    debug: true,
    resources,
  });

  yup.setLocale({
    string: {
      url: i18nInstance.t('errorUrl.url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('errorUrl.notOneOf'),
    },
  });

  const state = {
    form: {
      state: 'filing',
      errors: [],
    },
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form') {
      renderForm(value, i18nInstance);
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
          errors: ex.errors,
          state: 'errorUrl',
        };
      });
  });
};
