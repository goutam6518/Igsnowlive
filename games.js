import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { getFirestore, collection, getDocs, query, orderBy, startAt, endAt } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';

// Your Firebase configuration (the same as in your other files)
const firebaseConfig = {
  apiKey: "AIzaSyCRtPZ34Y1J-p5b7FJxEUagYg3h_D6PbhM",
    authDomain: "igsfogstudio-df541.firebaseapp.com",
    databaseURL: "https://igsfogstudio-df541-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "igsfogstudio-df541",
    storageBucket: "igsfogstudio-df541.firebasestorage.app",
    messagingSenderId: "206722625476",
    appId: "1:206722625476:web:c222830b5404f87bf57e91",
    measurementId: "G-1JL82Z0FK0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const gameListContainer = document.getElementById('gameList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const noGamesMessage = document.getElementById('noGamesMessage');
const adminEmail = 'gautamsingh77784@gmail.com'; // Optional: You might want to filter by admin uploads

let allGames = []; // Store all fetched games for searching

async function fetchAdminUploadedGames() {
    gameListContainer.innerHTML = ''; // Clear existing games
    noGamesMessage.style.display = 'none';
    try {
        const gamesCollectionRef = collection(db, 'games');
        // Optional: Filter by admin uploads if you want to only show those
        // const q = query(gamesCollectionRef, where('uploaderEmail', '==', adminEmail));
        const querySnapshot = await getDocs(gamesCollectionRef);
        allGames = [];
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const game = doc.data();
                allGames.push({ id: doc.id, ...game });
                displayGame(game);
            });
        } else {
            noGamesMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching games:', error);
        gameListContainer.textContent = 'Failed to load games.';
    }
}

function displayGame(game) {
    const gameItem = document.createElement('div');
    gameItem.classList.add('game-item');

    const logoContainer = document.createElement('div');
    logoContainer.classList.add('game-logo-container');
    const logoImg = document.createElement('img');
    logoImg.src = game.logoUrl || 'placeholder-game.png';
    logoImg.alt = game.name || 'Game Logo';
    logoImg.classList.add('game-logo');
    logoContainer.appendChild(logoImg);
    gameItem.appendChild(logoContainer);

    const gameName = document.createElement('p');
    gameName.classList.add('game-name');
    gameName.textContent = game.name || 'Untitled Game';
    gameItem.appendChild(gameName);

    gameListContainer.appendChild(gameItem);
}

function searchGames() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    gameListContainer.innerHTML = '';
    noGamesMessage.style.display = 'none';

    if (searchTerm) {
        const searchResults = allGames.filter(game =>
            (game.name || '').toLowerCase().includes(searchTerm)
        );

        if (searchResults.length > 0) {
            searchResults.forEach(displayGame);
        } else {
            noGamesMessage.style.display = 'block';
        }
    } else {
        // If search term is empty, display all games
        allGames.forEach(displayGame);
    }
}

onAuthStateChanged(auth, async (user) => {
    // You might want to check if the user is logged in here, but for displaying
    // all games, it's not strictly necessary.
    await fetchAdminUploadedGames();
});

searchButton.addEventListener('click', searchGames);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchGames();
    }
});
