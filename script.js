/**************************************************
 * 1) FETCHING ARTICLES FROM NEWS API
 **************************************************/
// Replace YOUR_NEWS_API_KEY with your actual NewsAPI.org key
// or integrate with any other news API of your choice.
const NEWS_API_KEY = "2dc45dc7649c4533a789b8a39531a7da";
const NEWS_API_URL =
  "https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=" +
  NEWS_API_KEY;

/**************************************************
 * 2) MOCK BIAS CALCULATOR
 **************************************************/
function mockCalculateBias(articleText) {
  // Typically, you'd call your AI model or ML classifier here.
  // We'll just randomly generate percentages for demonstration.
  const left = Math.floor(Math.random() * 50);
  const center = Math.floor(Math.random() * (100 - left));
  const right = 100 - (left + center);

  return { left, center, right };
}

/**************************************************
 * 3) RENDER ARTICLES
 **************************************************/
function renderArticle(article) {
  // For bias calculation, you might pass article.content
  // or combine title + description.
  const biasResult = mockCalculateBias(article.title || "");

  const articleCard = document.createElement("div");
  articleCard.classList.add("article-card");

  // Image
  const image = document.createElement("img");
  image.classList.add("article-image");
  image.src =
    article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image";
  image.alt = article.title || "News Image";

  // Info container
  const info = document.createElement("div");
  info.classList.add("article-info");

  // Title
  const title = document.createElement("h3");
  title.textContent = article.title || "Untitled";

  // Description
  const description = document.createElement("p");
  description.textContent = article.description || "No description available.";

  // Link (source)
  const readMore = document.createElement("a");
  readMore.href = article.url;
  readMore.target = "_blank";
  readMore.textContent = "Read more";
  readMore.style.color = "#e74c3c";
  readMore.style.fontWeight = "bold";

  // Bias bars
  const biasContainer = document.createElement("div");
  biasContainer.classList.add("article-bias");

  const leftBar = document.createElement("div");
  leftBar.classList.add("bias-bar", "bias-left");
  leftBar.textContent = `Left ${biasResult.left}%`;

  const centerBar = document.createElement("div");
  centerBar.classList.add("bias-bar", "bias-center");
  centerBar.textContent = `Center ${biasResult.center}%`;

  const rightBar = document.createElement("div");
  rightBar.classList.add("bias-bar", "bias-right");
  rightBar.textContent = `Right ${biasResult.right}%`;

  // Append elements
  biasContainer.appendChild(leftBar);
  biasContainer.appendChild(centerBar);
  biasContainer.appendChild(rightBar);

  info.appendChild(title);
  info.appendChild(description);
  info.appendChild(readMore);

  articleCard.appendChild(image);
  articleCard.appendChild(info);
  articleCard.appendChild(biasContainer);

  return articleCard;
}

/**************************************************
 * 4) FETCH & DISPLAY ARTICLES
 **************************************************/
async function fetchNewsArticles() {
  try {
    const response = await fetch(NEWS_API_URL);
    const data = await response.json();

    const articlesContainer = document.getElementById("articlesContainer");
    articlesContainer.innerHTML = ""; // Clear previous articles

    if (data.articles && data.articles.length > 0) {
      data.articles.forEach((article) => {
        const articleCard = renderArticle(article);
        articlesContainer.appendChild(articleCard);
      });
    } else {
      articlesContainer.innerHTML = "<p>No news found.</p>";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    const articlesContainer = document.getElementById("articlesContainer");
    articlesContainer.innerHTML = "<p>Error fetching news articles.</p>";
  }
}

/**************************************************
 * 5) EVENT LISTENERS
 **************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const fetchNewsBtn = document.getElementById("fetchNewsBtn");
  fetchNewsBtn.addEventListener("click", () => {
    fetchNewsArticles();
  });
});
