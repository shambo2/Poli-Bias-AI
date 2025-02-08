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
 * 2) CALL THE FLASK BACKEND FOR BIAS ANALYSIS
 **************************************************/
// This function sends article text to your local Flask server,
// which runs the facebook/bart-large-mnli zero-shot classification.
async function analyzeWithAI(articleText) {
  try {
    // Adjust if your backend is at a different IP/port
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: articleText }),
    });

    if (!response.ok) {
      console.error("Server error:", response.statusText);
      return { bias_scores: null };
    }

    const data = await response.json();
    // data should look like:
    // {
    //   "text": "article text here",
    //   "bias_scores": {
    //     "Left": 45.32,
    //     "Center": 30.11,
    //     "Right": 20.57,
    //     "Uncertain": 4.00
    //   }
    // }
    return data;
  } catch (error) {
    console.error("Network or CORS error:", error);
    return { bias_scores: null };
  }
}

/**************************************************
 * 3) GET BIAS SCORES (HELPER FUNCTION)
 **************************************************/
async function realCalculateBias(articleText) {
  const result = await analyzeWithAI(articleText);
  if (result.bias_scores) {
    // Convert to a simpler shape for our UI
    return {
      left: result.bias_scores["Left"] || 0,
      center: result.bias_scores["Center"] || 0,
      right: result.bias_scores["Right"] || 0,
      uncertain: result.bias_scores["Uncertain"] || 0,
    };
  } else {
    // Fallback if the API call fails
    return { left: 0, center: 0, right: 0, uncertain: 100 };
  }
}

/**************************************************
 * 4) RENDER ARTICLES
 **************************************************/
// We make renderArticle asynchronous to await the AI results.
async function renderArticle(article) {
  const articleCard = document.createElement("div");
  articleCard.classList.add("article-card");

  // IMAGE
  const image = document.createElement("img");
  image.classList.add("article-image");
  image.src =
    article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image";
  image.alt = article.title || "News Image";

  // TEXT INFO
  const info = document.createElement("div");
  info.classList.add("article-info");

  // Title
  const title = document.createElement("h3");
  title.textContent = article.title || "Untitled";

  // Description
  const description = document.createElement("p");
  description.textContent = article.description || "No description available.";

  // "Read more" link
  const readMore = document.createElement("a");
  readMore.href = article.url;
  readMore.target = "_blank";
  readMore.textContent = "Read more";
  readMore.style.color = "#e74c3c";
  readMore.style.fontWeight = "bold";

  // APPEND title, desc, link
  info.appendChild(title);
  info.appendChild(description);
  info.appendChild(readMore);

  // BIAS ANALYSIS
  // We combine the title + description as the text for the AI to analyze.
  const articleText = (article.title || "") + " " + (article.description || "");
  const biasResult = await realCalculateBias(articleText);

  // Create the bias container
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

  const uncertainBar = document.createElement("div");
  uncertainBar.classList.add("bias-bar");
  uncertainBar.style.backgroundColor = "#7f8c8d"; // or any color for "Uncertain"
  uncertainBar.textContent = `Uncertain ${biasResult.uncertain}%`;

  biasContainer.appendChild(leftBar);
  biasContainer.appendChild(centerBar);
  biasContainer.appendChild(rightBar);
  biasContainer.appendChild(uncertainBar);

  // BUILD THE ARTICLE CARD
  articleCard.appendChild(image);
  articleCard.appendChild(info);
  articleCard.appendChild(biasContainer);

  return articleCard;
}

/**************************************************
 * 5) FETCH & DISPLAY ARTICLES FROM NEWS API
 **************************************************/
async function fetchNewsArticles() {
  try {
    const response = await fetch(NEWS_API_URL);
    const data = await response.json();

    const articlesContainer = document.getElementById("articlesContainer");
    articlesContainer.innerHTML = ""; // Clear previous

    if (data.articles && data.articles.length > 0) {
      // Render each article in sequence
      for (const article of data.articles) {
        const articleCard = await renderArticle(article);
        articlesContainer.appendChild(articleCard);
      }
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
 * 6) EVENT LISTENERS
 **************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const fetchNewsBtn = document.getElementById("fetchNewsBtn");
  fetchNewsBtn.addEventListener("click", () => {
    fetchNewsArticles();
  });
});
