const API_KEY = "9d25509d";

// SEARCH
async function searchMovie() {
    const movie = document.getElementById("searchBox").value;

    if (!movie) return alert("Enter movie name");

    document.getElementById("loading").style.display = "block";

    const res = await fetch(`https://www.omdbapi.com/?s=${movie}&apikey=${API_KEY}`);
    const data = await res.json();

    document.getElementById("loading").style.display = "none";

    if (data.Response === "False") {
        document.getElementById("movieContainer").innerHTML = "Not found";
        return;
    }

    displayMovies(data.Search);
}

// TRENDING
async function getTrending() {
    const res = await fetch(`https://www.omdbapi.com/?s=batman&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Search) displayMovies(data.Search);
}

// ⭐ UPDATED FUNCTION
function displayMovies(movies) {
    const container = document.getElementById("movieContainer");

    container.innerHTML = movies.map(movie => `
        <div class="movie">
            <h3>${movie.Title}</h3>
            <img src="${movie.Poster}">
            <p>${movie.Year}</p>

            <button onclick='addToFavorites(${JSON.stringify(movie)})'>
                ❤️ Save
            </button>

            <a href="details.html?title=${movie.Title}">
                <button>View Details</button>
            </a>
        </div>
    `).join("");
}

// FAVORITES
function addToFavorites(movie) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    favs.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favs));
}

function loadFavorites() {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const container = document.getElementById("favorites");

    container.innerHTML = favs.map(m => `
        <div class="movie">
            <h3>${m.Title}</h3>
            <img src="${m.Poster}">
        </div>
    `).join("");
}