
try {
  let articleContent = newsInput.trim();

  if (inputType === "url") {
    setError(
      "URL analysis is not implemented yet. Please select Article Text and paste the news article."
    );
    return;
  }

  
const response = await axios.post(
  inputType === "url"
    ? "http://127.0.0.1:8000/analyze-url"
    : "http://127.0.0.1:8000/analyze",
  inputType === "url"
    ? { url: articleContent }
    : { content: articleContent }
);


  console.log("Backend response:", response.data);

  navigate("/results", {
    state: {
      analysis: response.data,
      inputType,
      originalInput: articleContent,
    },
  });
} catch (error) {
  console.error("Analysis error:", error);

  setError(
    "Unable to connect to the NewsAI backend. Please make sure the backend is running."
  );
} finally {
  setLoading(false);
}
