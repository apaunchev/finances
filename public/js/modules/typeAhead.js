import axios from 'axios';

// https://github.com/wesbos/Learn-Node/blob/master/stepped-solutions/45%20-%20Finished%20App/public/javascripts/modules/typeAhead.js

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function () {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = searchResultsHTML(res.data);
          return;
        }

        searchResults.innerHTML = `No results for ${this.value}.`;
      })
      .catch(err => console.error(err));
  });
}

function searchResultsHTML(transactions) {
  return transactions.map(transaction => {
    return `
      <a href="/transaction/${transaction._id}/edit" class="search__result">
        <strong>${transaction.description}</strong>
      </a>
    `;
  }).join('');
}

export default typeAhead;
