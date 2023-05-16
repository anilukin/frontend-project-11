import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';
import { renderForm, renderFeeds, renderPosts } from './view.js';

const validate = (url, list) => {
  const formSchema = yup.string()
    .url()
    .notOneOf(list);

  return formSchema.validate(url);
};

const locale = 'ru';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: locale,
  debug: true,
  resources,
});

const parseDataFromRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  const items = [...doc.querySelectorAll('rss>channel>item')].map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    return { title, link };
  });

  return {
    title: doc.querySelector('rss>channel>title').textContent,
    description: doc.querySelector('rss>channel>title').textContent,
    items,
  };
};

export default () => {
  yup.setLocale({
    string: {
      url: i18nInstance.t('errorUrl.url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('errorUrl.notOneOf'),
    },
  });

  let nextFeedId = 0;

  const state = {
    form: {
      state: 'filing',
      errors: [],
    },
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form') {
      renderForm(value, i18nInstance);
    }
    if (path === 'feeds') {
      renderFeeds(value);
    }
    if (path === 'posts') {
      renderPosts(value);
    }
  });

  const getDataFromRss = (u) => {
    const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(u)}`;
    return axios.get(url)
      .then((response) => {
        console.log(response);
        if (response.data.status.http_code !== 200) {
          throw new Error('errorUrl.invalidRss');
        }
        const xmlStr = response.data.contents;
        return parseDataFromRss(xmlStr);
      })
      .catch((er) => {
        console.log('GGGG', er.message);
      });
  };

  const formEl = document.querySelector('form');

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUrl = formData.get('url');
    const rssLinks = state.feeds.map((feed) => feed.link);
    validate(newUrl, rssLinks)
      .then(() => {
        const makeFeed = (d) => {
          const feed = {};
          feed.id = nextFeedId;
          nextFeedId += 1;
          feed.title = d.title;
          feed.link = newUrl;
          feed.description = d.description;
          return feed;
        };

        const makePosts = (d) => {
          let id = 0;
          return d.items.map((item) => {
            const newItem = { ...item, id, feedId: nextFeedId - 1 };
            id += 1;
            return newItem;
          });
        };
        try {
          getDataFromRss(newUrl).then((data) => {
            watchedState.form = {
              state: 'loadedUrl',
            };
            watchedState.feeds = watchedState.feeds.concat(makeFeed(data));
            watchedState.posts = watchedState.posts.concat(makePosts(data));
            e.target.reset();
          });
        } catch (ex) {
          console.log('AAA', ex.message);
        }
      })
      .catch((ex) => {
        console.log('!!!!', ex);
        watchedState.form = {
          errors: ex.errors,
          state: 'errorUrl',
        };
      });
  });
};
