// gamed.js

Import necessary Firebase services (if not already globally available or imported in a separate file)
 For Firebase SDK v9+ (modular):
 import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';

Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
apiKey: "AIzaSyCRtPZ34Y1J-p5b7FJxEUagYg3h_D6PbhM",
    authDomain: "igsfogstudio-df541.firebaseapp.com",
    databaseURL: "https://igsfogstudio-df541-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "igsfogstudio-df541",
    storageBucket: "igsfogstudio-df541.firebasestorage.app",
    messagingSenderId: "206722625476",
    appId: "1:206722625476:web:c222830b5404f87bf57e91",
    measurementId: "G-1JL82Z0FK0"

Initialize Firebase (if not already initialized)
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);

 Assuming Firebase `db` instance is available globally or imported
 For simplicity, I'll assume `db` is accessible.
 If using modular SDK, ensure you `import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';`
 and then `const db = getFirestore();` after `initializeApp`.

document.addEventListener('DOMContentLoaded', () => {
    const gameId = new URLSearchParams(window.location.search).get('id');

    if (gameId) {
        fetchGameDetails(gameId);
    } else {
        console.error("No game ID found in URL.");
        // Optionally, redirect to an error page or home
        // window.location.href = 'index.html';
    }

    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', handleDownload);
    }
});

async function fetchGameDetails(gameId) {
    try {
        // Reference to your Firestore document
        // Assuming your Firestore collection is named 'games'
        const gameRef = firebase.firestore().collection('games').doc(gameId); // For Firebase SDK v8 compatibility
        // For Firebase SDK v9 modular: const gameRef = doc(db, 'games', gameId);

        const docSnap = await gameRef.get(); // For v8
        // For v9 modular: const docSnap = await getDoc(gameRef);

        if (docSnap.exists) {
            const gameData = docSnap.data();
            updatePageContent(gameData);
        } else {
            console.warn("No such document!");
            // Handle case where game is not found
            document.getElementById('gamePageTitle').textContent = 'Game Not Found';
            document.getElementById('gameName').textContent = 'Game Not Found';
            document.getElementById('gameLogo').src = 'placeholder-error.png'; // Provide an error image
            document.getElementById('uploaderName').textContent = 'N/A';
            document.getElementById('gameSize').textContent = 'N/A';
            document.getElementById('downloadCount').textContent = '0';
            document.getElementById('gameplayVideo').src = ''; // Clear video
            document.getElementById('downloadButton').disabled = true;
        }
    } catch (error) {
        console.error("Error fetching game details:", error);
        // Display an error message to the user
    }
}

function updatePageContent(gameData) {
    document.getElementById('gamePageTitle').textContent = gameData.gameName + ' - Download';
    document.getElementById('gameLogo').src = gameData.gameLogoUrl;
    document.getElementById('gameLogo').alt = gameData.gameName + ' Logo';
    document.getElementById('gameName').textContent = gameData.gameName;
    document.getElementById('uploaderName').textContent = gameData.uploaderName;
    document.getElementById('gameSize').textContent = gameData.gameSize;
    document.getElementById('downloadCount').textContent = gameData.downloadCount || 0; // Default to 0 if not set

    // Set YouTube video URL
    if (gameData.youtubeVideoId) {
        document.getElementById('gameplayVideo').src = `https://www.youtube.com/embed/${gameData.youtubeVideoId}`;
    } else {
        document.getElementById('gameplayVideo').src = ''; // Clear if no video ID
    }

    // Set download link
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.dataset.downloadUrl = gameData.downloadLink; // Store the download URL in a data attribute
    downloadButton.dataset.gameId = new URLSearchParams(window.location.search).get('id'); // Store game ID
}

async function handleDownload() {
    const downloadButton = document.getElementById('downloadButton');
    const downloadUrl = downloadButton.dataset.downloadUrl;
    const gameId = downloadButton.dataset.gameId;

    if (!downloadUrl || !gameId) {
        console.error("Download URL or Game ID missing.");
        return;
    }

    try {
        // Increment download count in Firestore
        const gameRef = firebase.firestore().collection('games').doc(gameId); // For Firebase SDK v8 compatibility
        // For Firebase SDK v9 modular: const gameRef = doc(db, 'games', gameId);

        // Fetch current count to increment (or use Firestore's increment field value)
        const docSnap = await gameRef.get(); // For v8
        // For v9 modular: const docSnap = await getDoc(gameRef);

        if (docSnap.exists) {
            const currentCount = docSnap.data().downloadCount || 0;
            // For Firebase SDK v8:
            await gameRef.update({
                downloadCount: currentCount + 1
            });
            // For Firebase SDK v9 modular (using FieldValue.increment):
            // import { increment } from 'firebase/firestore'; // at the top
            // await updateDoc(gameRef, {
            //     downloadCount: increment(1)
            // });

            document.getElementById('downloadCount').textContent = currentCount + 1;
        }

        // Trigger the download
        window.open(downloadUrl, '_blank'); // Opens the download link in a new tab/window

    } catch (error) {
        console.error("Error handling download:", error);
        alert("There was an error initiating the download. Please try again.");
    }
}
