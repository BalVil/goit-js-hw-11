const searchFormRef = document.querySelector('#search-form');

searchFormRef.addEventListener('submit', onHandleSubmit);

function onHandleSubmit(evt) {
  evt.preventDefault();

  const searchQuery = evt.currentTarget.elements.searchQuery.value;
  console.log(searchQuery);
}
