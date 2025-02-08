// Mock function simulating a backend AI call
// In a real scenario, you would call your AI model endpoint with fetch or axios.
function mockAnalyzeBias(articleText) {
  // Simplified mock logic: random selection
  // Replace with actual logic from your AI model
  const biases = ["Left-Leaning", "Right-Leaning", "Center", "Uncertain"];
  const randomIndex = Math.floor(Math.random() * biases.length);
  return biases[randomIndex];
}

document.addEventListener("DOMContentLoaded", () => {
  const checkBiasBtn = document.getElementById("checkBiasBtn");
  const resultsBox = document.getElementById("results");

  checkBiasBtn.addEventListener("click", () => {
    // Get the user inputs
    const articleInput = document.getElementById("articleInput").value.trim();
    const articleURL = document.getElementById("articleURL").value.trim();

    // Clear previous results
    resultsBox.textContent = "";

    // Basic validation
    if (!articleInput && !articleURL) {
      resultsBox.textContent = "Please paste text or enter a URL.";
      return;
    }

    // For demonstration, if there's a URL, we might fetch the text from that URL.
    // This requires a backend or CORS allowances, so here we’ll just treat it similarly.

    // Mock analysis
    const result = mockAnalyzeBias(articleInput || articleURL);
    resultsBox.textContent = `Detected Political Bias: ${result}`;
  });
});
