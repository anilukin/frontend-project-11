const renderForm = (st) => {
  const formEl = document.querySelector('form');
  const input = formEl.querySelector('input');
  const feedback = document.querySelector('.feedback');
  if (st.state === 'loadedUrl') {
    input.classList.remove('border-danger');
    feedback.textContent = 'RSS успешно загружен';
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  }
  if (st.state === 'errorUrl') {
    input.classList.add('border-danger');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    if (st.errorType === 'url') {
      feedback.textContent = 'Ссылка должна быть валидным URL';
    }
    if (st.errorType === 'notOneOf') {
      feedback.textContent = 'RSS уже существует';
    }
  }
};

export { renderForm };
