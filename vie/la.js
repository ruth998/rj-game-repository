const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const results = document.getElementById("results");

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();

  if (query === "") {
    message.textContent = "Please enter a search term.";
    results.innerHTML = "";
    return;
  }

  message.textContent = "Loading...";
  results.innerHTML = "";

  const url = `https://search.com/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    const data = await response.json();

    if (!data.search || data.search.length === 0) {
      message.textContent = "No results found.";
      return;
    }

    message.textContent = `Found ${data.search.length} result(s).`;

    results.innerHTML = data.search
      .map(
        (item) => `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.description || ""}</p>
        <img src="${item.image || ''}" alt="${item.title}" width="200" />
      </div>
    `
      )
      .join("");

  } catch (error) {
    console.error(error);
    message.textContent = "Something went wrong while searching.";
  } finally {
    console.log("Search request finished.");
  }
});
