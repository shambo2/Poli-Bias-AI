/**************************************************
 * 1) CONFIGURE NEWS API
 **************************************************/
const NEWS_API_KEY = "2dc45dc7649c4533a789b8a39531a7da";
const NEWS_API_URL =
  "https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=" +
  NEWS_API_KEY;

document.getElementById("fetchNewsBtn").addEventListener("click", fetchNews);

function fetchNews() {
  // Example fetch request to your Flask backend
  fetch("/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: "Example article text" }),
  })
    .then((response) => response.json())
    .then((data) => {
      const articlesContainer = document.getElementById("articlesContainer");
      articlesContainer.innerHTML = ""; // Clear existing articles

      // Example article data
      const article = {
        title: "Example Article Title",
        summary: "Example article summary...",
        image: "example-image.jpg",
        bias_scores: data.bias_scores,
      };

      // Create article card
      const articleCard = document.createElement("div");
      articleCard.className = "article-card";

      // Add article image
      const articleImage = document.createElement("img");
      articleImage.src = article.image;
      articleImage.alt = "Article Image";
      articleImage.className = "article-image";
      articleCard.appendChild(articleImage);

      // Add article info
      const articleInfo = document.createElement("div");
      articleInfo.className = "article-info";

      const articleTitle = document.createElement("h3");
      articleTitle.textContent = article.title;
      articleInfo.appendChild(articleTitle);

      const articleSummary = document.createElement("p");
      articleSummary.textContent = article.summary;
      articleInfo.appendChild(articleSummary);

      // Add bias bars
      const articleBias = document.createElement("div");
      articleBias.className = "article-bias";

      const biasLeft = document.createElement("div");
      biasLeft.className = "bias-bar bias-left";
      biasLeft.style.width = `${article.bias_scores.Left}%`;
      biasLeft.textContent = `Left: ${article.bias_scores.Left}%`;
      articleBias.appendChild(biasLeft);

      const biasCenter = document.createElement("div");
      biasCenter.className = "bias-bar bias-center";
      biasCenter.style.width = `${article.bias_scores.Center}%`;
      biasCenter.textContent = `Center: ${article.bias_scores.Center}%`;
      articleBias.appendChild(biasCenter);

      const biasRight = document.createElement("div");
      biasRight.className = "bias-bar bias-right";
      biasRight.style.width = `${article.bias_scores.Right}%`;
      biasRight.textContent = `Right: ${article.bias_scores.Right}%`;
      articleBias.appendChild(biasRight);

      articleInfo.appendChild(articleBias);
      articleCard.appendChild(articleInfo);
      articlesContainer.appendChild(articleCard);
    })
    .catch((error) => console.error("Error fetching news:", error));
}

/**************************************************
 * 2) CALL THE FLASK BACKEND FOR BIAS ANALYSIS
 **************************************************/
async function analyzeWithAI(articleText) {
  try {
    // Adjust to match your Flask endpoint
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
    // Example data:
    // {
    //   "text": "...",
    //   "bias_scores": {
    //     "Left": 15.43,
    //     "Center": 46.14,
    //     "Right": 38.43
    //   }
    // }
    return data;
  } catch (error) {
    console.error("Network/CORS error:", error);
    return { bias_scores: null };
  }
}

/**************************************************
 * 3) GET BIAS SCORES (HELPER FUNCTION)
 **************************************************/
async function realCalculateBias(articleText) {
  const result = await analyzeWithAI(articleText);
  if (result.bias_scores) {
    return {
      left: result.bias_scores["Left"] || 0,
      center: result.bias_scores["Center"] || 0,
      right: result.bias_scores["Right"] || 0,
    };
  } else {
    return { left: 0, center: 0, right: 0 };
  }
}

/**************************************************
 * 4) RENDER ARTICLES
 **************************************************/
async function renderArticle(article) {
  const articleCard = document.createElement("div");
  articleCard.classList.add("article-card");

  // IMAGE
  const image = document.createElement("img");
  image.classList.add("article-image");
  image.src =
    article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image";
  image.alt = article.title || "News Image";

  // INFO CONTAINER
  const info = document.createElement("div");
  info.classList.add("article-info");

  // Title
  const title = document.createElement("h3");
  title.textContent = article.title || "Untitled";

  // Description
  const description = document.createElement("p");
  description.textContent = article.description || "No description available.";

  // Read more link
  const readMore = document.createElement("a");
  readMore.href = article.url;
  readMore.target = "_blank";
  readMore.textContent = "Read more";

  info.appendChild(title);
  info.appendChild(description);
  info.appendChild(readMore);

  // BIAS ANALYSIS
  const articleText = (article.title || "") + " " + (article.description || "");
  const { left, center, right } = await realCalculateBias(articleText);

  // Single bar container
  const biasBarContainer = document.createElement("div");
  biasBarContainer.classList.add("bias-bar-container");

  // Left segment (with text inside)
  const leftSegment = document.createElement("div");
  leftSegment.classList.add("bias-segment", "bias-left");
  leftSegment.style.width = left + "%";
  // Show "Left XX%" in the bar
  leftSegment.textContent = `Left ${left.toFixed(2)}%`;

  // Center segment
  const centerSegment = document.createElement("div");
  centerSegment.classList.add("bias-segment", "bias-center");
  centerSegment.style.width = center + "%";
  centerSegment.textContent = `Center ${center.toFixed(2)}%`;

  // Right segment
  const rightSegment = document.createElement("div");
  rightSegment.classList.add("bias-segment", "bias-right");
  rightSegment.style.width = right + "%";
  rightSegment.textContent = `Right ${right.toFixed(2)}%`;

  // Append segments
  biasBarContainer.appendChild(leftSegment);
  biasBarContainer.appendChild(centerSegment);
  biasBarContainer.appendChild(rightSegment);

  // BUILD THE CARD
  articleCard.appendChild(image);
  articleCard.appendChild(info);
  articleCard.appendChild(biasBarContainer);

  return articleCard;
}

/**************************************************
 * 5) FETCH & DISPLAY ARTICLES FROM NEWS API
 **************************************************/
async function fetchNewsArticles() {
  try {
    const response = await fetch(NEWS_API_URL);
    const data = await response.json();

    const container = document.getElementById("articlesContainer");
    container.innerHTML = ""; // Clear previous

    if (data.articles && data.articles.length > 0) {
      for (const article of data.articles) {
        const articleCard = await renderArticle(article);
        container.appendChild(articleCard);
      }
    } else {
      container.innerHTML = "<p>No news found.</p>";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    const container = document.getElementById("articlesContainer");
    container.innerHTML = "<p>Error fetching news articles.</p>";
  }
}

/**************************************************
 * 6) EVENT LISTENERS
 **************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const fetchBtn = document.getElementById("fetchNewsBtn");
  fetchBtn.addEventListener("click", () => {
    fetchNewsArticles();
  });
});
