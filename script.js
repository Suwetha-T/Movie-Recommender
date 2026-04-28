const API_KEY="9d25509d";

// AUTH
if(!window.location.pathname.includes("login.html")){
    if(localStorage.getItem("loggedIn")!=="true"){
        window.location.href="login.html";
    }
}

// DISPLAY ROW
function displayRow(movies,id){
    let c=document.getElementById(id);

    c.innerHTML=movies.map(m=>`
        <div class="movie">
            <img src="${m.Poster}" onclick="getMovieDetails('${m.Title}')">
            <button onclick="addToFavorites('${m.imdbID}')">❤️</button>
        </div>
    `).join("");
}

// SEARCH
async function searchMovie(){
    let movie=document.getElementById("searchBox").value;
    let res=await fetch(`https://www.omdbapi.com/?s=${movie}&apikey=${API_KEY}`);
    let data=await res.json();
    displayRow(data.Search||[],"movieContainer");
}

// TRENDING
async function loadTrending(){
    let res=await fetch(`https://www.omdbapi.com/?s=avengers&apikey=${API_KEY}`);
    let data=await res.json();
    displayRow(data.Search||[],"trendingRow");
}

// CATEGORY
async function loadCategory(type,id){
    let res=await fetch(`https://www.omdbapi.com/?s=${type}&apikey=${API_KEY}`);
    let data=await res.json();
    displayRow(data.Search||[],id);
}

// DETAILS
async function getMovieDetails(title){
    let res=await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
    let m=await res.json();

    document.getElementById("movieDetails").innerHTML=`
        <div class="details-box">
            <img src="${m.Poster}">
            <div class="details-text">
                <h2>${m.Title}</h2>
                <p><b>⭐ Rating:</b> ${m.imdbRating}</p>
                <p><b>Genre:</b> ${m.Genre}</p>
                <p><b>Released:</b> ${m.Released}</p>
                <p><b>Description:</b> ${m.Plot}</p>
            </div>
        </div>
    `;

    document.getElementById("movieDetails").scrollIntoView({behavior:"smooth"});
}

// FAVORITES
async function addToFavorites(id){
    let res=await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
    let movie=await res.json();

    let favs=JSON.parse(localStorage.getItem("favorites"))||[];

    if(!favs.some(f=>f.imdbID===movie.imdbID)){
        favs.push(movie);
        localStorage.setItem("favorites",JSON.stringify(favs));
    }
}

// LOAD FAVORITES
function loadFavorites(){
    let favs=JSON.parse(localStorage.getItem("favorites"))||[];
    let c=document.getElementById("favorites");

    c.innerHTML=favs.map(m=>`
        <div class="movie fav-card">
            <img src="${m.Poster}" onclick="getMovieDetails('${m.Title}')">
            <h4>${m.Title}</h4>
            <p>⭐ ${m.imdbRating}</p>
        </div>
    `).join("");
}

// FAVORITE BASED
function loadFavRecommend(){
    let favs=JSON.parse(localStorage.getItem("favorites"))||[];
    if(favs.length===0) return;

    let key=favs[0].Title.split(" ")[0];

    fetch(`https://www.omdbapi.com/?s=${key}&apikey=${API_KEY}`)
    .then(res=>res.json())
    .then(data=>{
        displayRow(data.Search||[],"favRow");
    });
}

// TOP RATED
async function loadTopRated(){
    let res = await fetch(`https://www.omdbapi.com/?s=batman&apikey=${API_KEY}`);
    let data = await res.json();

    let c = document.getElementById("topMovies");

    let movies = await Promise.all(
        (data.Search || []).slice(0,8).map(async m=>{
            let r = await fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${API_KEY}`);
            return await r.json();
        })
    );

    movies.sort((a,b)=> b.imdbRating - a.imdbRating);

    c.innerHTML = movies.map(m=>`
        <div class="movie fav-card">
            <img src="${m.Poster}" onclick="getMovieDetails('${m.Title}')">
            <h4>${m.Title}</h4>
            <p>⭐ ${m.imdbRating}</p>
        </div>
    `).join("");
}

// CONTACT
function sendMessage(e){
    e.preventDefault();
    document.getElementById("contactMsg").innerText="Message Sent!";
}

// INIT
window.onload=()=>{
    loadTrending();
    loadCategory("action","actionRow");
    loadFavRecommend();
};

// LOGOUT
function logout(){
    localStorage.clear();
    window.location.href="login.html";
}