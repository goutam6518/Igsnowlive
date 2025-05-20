import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';

// Your Firebase configuration (REPLACE WITH YOUR ACTUAL CONFIG)
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

document.addEventListener('DOMContentLoaded', async () => {
    // Get references to all necessary HTML elements
    const gameLogoElement = document.getElementById('gameLogo');
    const gameNameElement = document.getElementById('gameName');
    const uploaderNameElement = document.getElementById('uploaderName');
    const downloadLinkElement = document.getElementById('downloadLink');
    const trailerVideoElement = document.getElementById('trailerVideo');
    const videoPlaceholderElement = document.getElementById('videoPlaceholder');
    const errorMessageElement = document.getElementById('errorMessage');
    const loadingMessageElement = document.getElementById('loadingMessage');

    // Initially hide elements that depend on fetched data
    gameLogoElement.src = 'placeholder-game.png'; // Set a default placeholder
    gameLogoElement.alt = 'Loading Game Logo';
    gameNameElement.textContent = 'Loading Game Details...';
    uploaderNameElement.textContent = ''; // Clear initial
    downloadLinkElement.style.display = 'none';
    videoPlaceholderElement.style.display = 'none';
    errorMessageElement.style.display = 'none';
    loadingMessageElement.style.display = 'block'; // Ensure loading message is visible

    // Function to extract game ID from URL query parameters
    function getGameIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        console.log('Extracted Game ID from URL:', id); // Debugging
        return id;
    }

    const gameId = getGameIdFromUrl();

    if (gameId) {
        try {
            const gameDocRef = doc(db, 'games', gameId);
            console.log('Attempting to fetch document for ID:', gameId); // Debugging
            const gameDocSnap = await getDoc(gameDocRef);

            if (gameDocSnap.exists()) {
                const gameData = gameDocSnap.data();
                console.log('Game Data fetched:', gameData); // Debugging

                // Update Game Logo
                if (gameData.gameLogoUrl) {
                    gameLogoElement.src = gameData.gameLogoUrl;
                    gameLogoElement.alt = (gameData.gameName || 'Game') + " Logo";
                } else {
                    gameLogoElement.src = 'placeholder-game.png'; // Fallback
                    gameLogoElement.alt = 'Game Logo (URL missing)';
                    console.warn('Game logo URL is missing for game ID:', gameId);
                }

                // Update Game Name
                gameNameElement.textContent = gameData.gameName || 'Untitled Game';

                // Update Uploader Name
                // Assuming 'uploaderName' is directly in the 'games' document now for simplicity
                // If you still want to fetch from 'users' collection, keep the old logic:
                // const userDocRef = doc(db, 'users', gameData.uploaderId);
                // const userDocSnap = await getDoc(userDocRef);
                // if (userDocSnap.exists() && userDocSnap.data().userName) {
                //     uploaderNameElement.textContent = userDocSnap.data().userName;
                // } else {
                //     uploaderNameElement.textContent = 'Unknown User';
                //     console.warn('Uploader user data or userName missing for uploaderId:', gameData.uploaderId);
                // }
                uploaderNameElement.textContent = gameData.uploaderName || 'Unknown Uploader'; // Using direct field


                // Update Download Link
                if (gameData.downloadUrl) {
                    downloadLinkElement.href = gameData.downloadUrl;
                    downloadLinkElement.target = '_blank'; // Open in a new tab
                    downloadLinkElement.download = (gameData.gameName || 'game').toLowerCase().replace(/ /g, '_') + '.zip'; // Suggest a filename
                    downloadLinkElement.style.display = 'inline-block'; // Show the button
                } else {
                    downloadLinkElement.style.display = 'none'; // Hide if no download URL
                    console.warn('Download URL is missing for game ID:', gameId);
                }

                // Update Trailer Video
                if (gameData.trailerVideoLink) {
                    const videoId = getYoutubeVideoId(gameData.trailerVideoLink);
                    if (videoId) {
                        trailerVideoElement.src = `https://www.youtube.com/embed/${videoId}?rel=0`; // Use secure HTTPS
                        trailerVideoElement.title = `YouTube video player for ${gameData.gameName || 'Game'} Trailer`; // Add a title for accessibility
                        trailerVideoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"; // Ensure permissions
                        videoPlaceholderElement.style.display = 'block'; // Show video container
                    } else {
                        videoPlaceholderElement.style.display = 'none';
                        console.warn('Could not extract YouTube video ID from link:', gameData.trailerVideoLink);
                    }
                } else {
                    videoPlaceholderElement.style.display = 'none'; // Hide if no trailer link
                    console.warn('Trailer video link is missing for game ID:', gameId);
                }

                // Hide loading message and any error messages
                loadingMessageElement.style.display = 'none';
                errorMessageElement.style.display = 'none';

            } else {
                // Game document does not exist
                console.log('No such game document found in Firestore for ID:', gameId); // Debugging
                loadingMessageElement.style.display = 'none';
                errorMessageElement.textContent = 'Game not found! Please check the game ID.';
                errorMessageElement.style.display = 'block';
                gameNameElement.textContent = 'Game Not Found';
                // Hide specific game elements
                gameLogoElement.src = 'placeholder-game.png';
                gameLogoElement.alt = 'Game Not Found';
                uploaderNameElement.textContent = '';
                downloadLinkElement.style.display = 'none';
                videoPlaceholderElement.style.display = 'none';
            }
        } catch (error) {
            // Error during Firebase fetch operation
            console.error('Error fetching game data:', error); // Log the full error object
            loadingMessageElement.style.display = 'none';
            errorMessageElement.textContent = `Failed to load game details. Error: ${error.message || 'Unknown error'}. Check console for more info.`;
            errorMessageElement.style.display = 'block';
            gameNameElement.textContent = 'Error Loading Game';
            // Hide specific game elements
            gameLogoElement.src = 'placeholder-game.png';
            gameLogoElement.alt = 'Error Loading';
            uploaderNameElement.textContent = '';
            downloadLinkElement.style.display = 'none';
            videoPlaceholderElement.style.display = 'none';
        }
    } else {
        // No game ID provided in the URL
        console.warn('No game ID specified in the URL. Please provide an ID like: game.html?id=YOUR_GAME_ID'); // Debugging
        loadingMessageElement.style.display = 'none';
        errorMessageElement.textContent = 'No game selected. Please return to the home page and select a game.';
        errorMessageElement.style.display = 'block';
        gameNameElement.textContent = 'No Game Selected';
        // Hide specific game elements
        gameLogoElement.src = 'placeholder-game.png';
        gameLogoElement.alt = 'No Game Selected';
        uploaderNameElement.textContent = '';
        downloadLinkElement.style.display = 'none';
        videoPlaceholderElement.style.display = 'none';
    }
});

// Helper function to extract YouTube video ID
function getYoutubeVideoId(url) {
    if (!url) return null; // Handle null or empty URL gracefully
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    console.log(`Attempted to get YouTube ID from "${url}":`, videoId); // Debugging
    return videoId;
}
