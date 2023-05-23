const initRender = (i18nInstance) => {
  document.getElementById('main-title').textContent = i18nInstance.t('main.title');
  document.getElementById('main-lead').textContent = i18nInstance.t('main.lead');
  document.getElementById('main-example').textContent = i18nInstance.t('example');
  document.getElementById('form-submit-button').textContent = i18nInstance.t('form.submitButton');
  document.getElementById('form-input-label').textContent = i18nInstance.t('form.labelText');
};

const renderForm = (st, i18nInstance) => {
  const formEl = document.querySelector('form');
  const input = formEl.querySelector('input');
  const feedback = document.querySelector('.feedback');
  if (st.state === 'loadedUrl') {
    input.classList.remove('is-invalid');
    feedback.textContent = i18nInstance.t('loadedUrl');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  }
  if (st.state === 'errorUrl') {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');

    feedback.textContent = st.errors.join('\n');
  }
};

const renderFeeds = (st, i18nInstance) => {
  const feeds = document.querySelector('.feeds');

  feeds.textContent = '';

  const feedsDiv = document.createElement('div');
  feedsDiv.classList.add('card', 'border-0');

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('card-body');

  const feedsTitle = document.createElement('h2');
  feedsTitle.textContent = i18nInstance.t('feeds');
  feedsTitle.classList.add('card-title', 'h4');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  st.forEach((el) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = el.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = el.description;

    li.append(h3);
    li.append(p);
    ul.append(li);
  });

  titleDiv.append(feedsTitle);
  titleDiv.append(ul);
  feedsDiv.append(titleDiv);
  feeds.append(feedsDiv);
};

const renderPosts = (st, visitedPostsId, i18nInstance) => {
  const posts = document.querySelector('.posts');
  posts.textContent = '';
  if (st.length === 0) {
    return;
  }

  const postsDiv = document.createElement('div');
  postsDiv.classList.add('card', 'border-0');

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('card-body');

  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18nInstance.t('posts.title');
  postsTitle.classList.add('card-title', 'h4');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  st.forEach((el) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    if (visitedPostsId.includes(el.id.toString())) {
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
    }
    a.setAttribute('href', `${el.link}`);
    a.setAttribute('data-id', `${el.id}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = el.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', `${el.id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18nInstance.t('posts.postsButton');

    li.append(a);
    li.append(button);
    ul.append(li);
  });

  titleDiv.append(postsTitle);
  titleDiv.append(ul);
  postsDiv.append(titleDiv);
  posts.append(postsDiv);
};

const renderModal = (currentPostId, st, i18nInstance) => {
  const currentPostLink = document.querySelector(`[data-id ="${currentPostId}"]`);
  currentPostLink.classList.remove('fw-bold');
  currentPostLink.classList.add('fw-normal', 'link-secondary');

  const post = st.filter(({ id }) => id.toString() === currentPostId);
  const [{ title, description, link }] = post;

  const closeButton = document.getElementById('modal-close');
  closeButton.textContent = i18nInstance.t('modal.closeButton');

  const readAllLink = document.getElementById('modal-read-all');
  readAllLink.textContent = i18nInstance.t('modal.openLink');

  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = title;

  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = description;

  const modalLink = document.querySelector('.modal-footer>a');
  modalLink.setAttribute('href', link);
};

export {
  renderForm, renderFeeds, renderPosts, renderModal, initRender,
};
