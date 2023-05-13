const renderForm = (st, i18nInstance) => {
  const formEl = document.querySelector('form');
  const input = formEl.querySelector('input');
  const feedback = document.querySelector('.feedback');
  if (st.state === 'loadedUrl') {
    input.classList.remove('border-danger');
    feedback.textContent = i18nInstance.t('loadedUrl');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  }
  if (st.state === 'errorUrl') {
    input.classList.add('border-danger');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');

    feedback.textContent = st.errors.join('\n');
  }
};

export { renderForm };
