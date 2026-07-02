document.addEventListener('click', function (e) {
  // Intercept any link click that happens INSIDE the terminal container
  const link = e.target.closest('.terminal-container a');
  
  // If no link was clicked, or it's an external link (http), let it go
  if (!link || link.getAttribute('href').startsWith('http') || link.getAttribute('href').startsWith('#')) {
    return;
  }

  const url = link.getAttribute('href');
  e.preventDefault();

  // Visual feedback that the "command" is running
  const body = document.querySelector('.terminal-body');
  body.style.opacity = '0.5';

// Add this inside your click listener, right before the fetch()
document.querySelector('.terminal-body').innerHTML = '<span class="cmd">Fetching data from server...</span><span class="cursor">█</span>';

    fetch(url)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Grab the new content from the fetched page's terminal-body
      const newContent = doc.querySelector('.terminal-body').innerHTML;
      
      body.innerHTML = newContent;
      body.style.opacity = '1';
      
      // Update the URL so the back button works and the terminal stays open
      // We append #terminal to the URL so the CSS :target stays active!
      history.pushState(null, '', url + '#terminal');
      
      // Scroll to top of terminal body for long posts
      body.scrollTop = 0;
    })
    .catch(err => {
      console.error('Fetch error:', err);
      window.location.href = url; // Fallback: just go to the page if fetch fails
    });
});

window.addEventListener('popstate', function () {
  // If the user hits 'back', just reload the page to be safe
  // or you could re-run the fetch logic here for a truly smooth experience.
  window.location.reload();
});