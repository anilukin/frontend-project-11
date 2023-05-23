import onChange from 'on-change';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';
import {
  renderForm, renderFeeds, renderPosts, renderModal, initRender,
} from './view.js';

const locale = 'ru';

const getBrushedUrl = (url) => {
  const lastSymb = url.trim().slice(-1);
  if (lastSymb === '/') {
    return url.trim().slice(0, -1);
  }
  return url.trim();
};

const validate = (url, list) => {
  const formSchema = yup.string()
    .url()
    .notOneOf(list);

  return formSchema.validate(url);
};

const parseDataFromRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  if (!doc.querySelector('rss')) {
    throw new Error('errorUrl.invalidRss');
  }
  const items = [...doc.querySelectorAll('rss>channel>item')].map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    return { title, link, description };
  });

  return {
    title: doc.querySelector('rss>channel>title').textContent,
    description: doc.querySelector('rss>channel>description').textContent,
    items,
  };
};

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: locale,
    debug: true,
    resources,
  });

  initRender(i18nInstance);

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
    feeds: [],
    posts: [],
    currentPostId: null,
    visitedPostsId: [],
  };

  const delay = 5000;

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form') {
      renderForm(value, i18nInstance);
    }
    if (path === 'feeds') {
      renderFeeds(value, i18nInstance);
    }
    if (path === 'posts') {
      renderPosts(value, state.visitedPostsId, i18nInstance);
    }
    if (path === 'currentPostId') {
      renderModal(value, state.posts, i18nInstance);
    }
  });

  const getDataFromRss = (u) => {
    const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(u)}`;
    return axios.get(url)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('errorUrl.invalidRss');
        }
        const xmlStr = response.data.contents;
        return parseDataFromRss(xmlStr);
      })
      .catch((ex) => {
        if (ex instanceof axios.AxiosError) {
          throw new Error('errorUrl.network');
        }
        throw ex;
      });
  };

  const formEl = document.querySelector('form');

  let nextFeedId = 0;

  const makeFeed = (d, url) => {
    const feed = {};
    feed.id = nextFeedId;
    nextFeedId += 1;
    feed.title = d.title;
    feed.link = url;
    feed.description = d.description;
    return feed;
  };

  let id = 0;

  const makePosts = (d) => d.items.map((item) => {
    const newItem = { ...item, id, feedId: nextFeedId - 1 };
    id += 1;
    return newItem;
  });

  const updPosts = () => {
    const promise = Promise.all(state.feeds.map(({ link }) => getDataFromRss(link)
      .then((data) => makePosts(data))));
    promise.then((prom) => {
      const existingLinks = watchedState.posts.map(({ link }) => link);
      const newPosts = prom.flat().filter((p) => !existingLinks.includes(p.link));
      watchedState.posts = watchedState.posts.concat(newPosts);
    });
    setTimeout(updPosts, delay);
  };

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUrl = getBrushedUrl(formData.get('url'));
    const rssLinks = state.feeds.map((feed) => feed.link);
    validate(newUrl, rssLinks)
      .then(() => {
        getDataFromRss(newUrl).then((data) => {
          watchedState.form = {
            state: 'loadedUrl',
          };
          watchedState.feeds = watchedState.feeds.concat(makeFeed(data, newUrl));
          watchedState.posts = watchedState.posts.concat(makePosts(data));
          e.target.reset();
        })
          .catch((ex) => {
            watchedState.form = {
              errors: [i18nInstance.t(ex.message)],
              state: 'errorUrl',
            };
          });
      })
      .catch((ex) => {
        watchedState.form = {
          errors: ex.errors ?? [i18nInstance.t(ex.message)],
          state: 'errorUrl',
        };
      });
  });

  updPosts();

  const postsContainer = document.querySelector('.posts');
  postsContainer.addEventListener('click', (e) => {
    if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'A') {
      const postId = e.target.getAttribute('data-id');
      watchedState.currentPostId = postId;
      watchedState.visitedPostsId.push(postId);
    }
  });
};
