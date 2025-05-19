import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs, limit } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const gameListContainer = document.getElementById('gameList');
const privateSection = document.getElementById('privateSection');
const beforeLoginSection = document.getElementById('beforeLoginSection');
const adminEmail = 'gautamsingh77784@gmail.com'; // The admin's email

async function displayUserUploadedGames(userId) {
    gameListContainer.innerHTML = ''; // Clear existing games
    try {
        const gamesCollectionRef = collection(db, 'gamed'); // Assuming 'games' collection
        const q = query(gamesCollectionRef, where('uploaderId', '==', userId), limit(10)); // Limit to 10 games
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const game = doc.data();
                const gameItem = document.createElement('div');
                gameItem.classList.add('game-item');

                const logoContainer = document.createElement('div');
                logoContainer.classList.add('game-logo-container');
                const logoImg = document.createElement('img');
                logoImg.src = game.logoUrl || 'placeholder-game.png'; // Use actual logo URL
                logoImg.alt = game.name || 'Game Logo';
                logoImg.classList.add('game-logo');
                logoContainer.appendChild(logoImg);
                gameItem.appendChild(logoContainer);

                const gameName = document.createElement('p');
                gameName.textContent = game.name || 'Untitled Game';
                gameItem.appendChild(gameName);

                // Assuming you store uploader's name in the game document
                const userName = document.createElement('p');
                userName.textContent = `By ${game.uploaderName || 'Unknown User'}`;
                gameItem.appendChild(userName);

                gameListContainer.appendChild(gameItem);
            });
        } else {
            gameListContainer.textContent = 'No games uploaded yet.';
        }
    } catch (error) {
        console.error('Error fetching user uploaded games:', error);
        gameListContainer.textContent = 'Failed to load games.';
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        await displayUserUploadedGames(user.uid);
        beforeLoginSection.classList.add('hidden'); // Hide after login

        // Check if the current user is the admin
        if (user.email === adminEmail) {
            privateSection.classList.add('admin-only');
        } else {
            privateSection.style.display = 'none';
        }
    } else {
        gameListContainer.textContent = 'Please log in to see your uploaded games.';
        privateSection.style.display = 'none';
        beforeLoginSection.classList.remove('hidden'); // Show before login
    }
});

// Placeholder for upload button functionality
const uploadButton = document.querySelector('.upload-button');
uploadButton.addEventListener('click', () => {
    alert('Upload functionality will be implemented here.');
    // You would typically navigate to an upload page or trigger a modal
});
