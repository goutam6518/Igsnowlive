<script type="module">
    import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';

    // Your Firebase configuration (replace with your actual config)
    const firebaseConfig = {
   apiKey: "AIzaSyCRtPZ34Y1J-p5b7FJxEUagYg3h_D6PbhM",
    authDomain: "igsfogstudio-df541.firebaseapp.com",
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
        const gameLogo = document.getElementById('gameLogo');
        const gameNameElement = document.getElementById('gameName');
        const uploaderNameElement = document.getElementById('uploaderName');
        const downloadLink = document.getElementById('downloadLink');

        // Function to get the game ID from the URL query parameters
        function getGameIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }

        const gameId = getGameIdFromUrl();

        if (gameId) {
            try {
                const gameDocRef = doc(db, 'games', gameId);
                const gameDocSnap = await getDoc(gameDocRef);

                if (gameDocSnap.exists()) {
                    const gameData = gameDocSnap.data();

                    gameLogo.src = gameData.gameLogoUrl || 'placeholder-game.png';
                    gameLogo.alt = gameData.gameName + " Logo";
                    gameNameElement.textContent = gameData.gameName || 'Untitled Game';

                    // Fetch uploader's username from the 'users' collection
                    const userDocRef = doc(db, 'users', gameData.uploaderId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists() && userDocSnap.data().userName) {
                        uploaderNameElement.textContent = userDocSnap.data().userName;
                    } else {
                        uploaderNameElement.textContent = 'Unknown User';
                    }

                    downloadLink.href = gameData.gameApkUrl || '#'; // Set the actual download URL
                    downloadLink.download = (gameData.gameName || 'game').toLowerCase().replace(/ /g, '_') + ".apk";
                } else {
                    console.log('No such game!');
                    // Optionally display an error message on the page
                    const container = document.querySelector('.container');
                    container.innerHTML = '<p>Game not found!</p>';
                }
            } catch (error) {
                console.error('Error fetching game data:', error);
                // Optionally display an error message on the page
                const container = document.querySelector('.container');
                container.innerHTML = '<p>Failed to load game details.</p>';
            }
        } else {
            console.log('No game ID specified in the URL.');
            // Optionally display a message indicating no game was selected
            const container = document.querySelector('.container');
            container.innerHTML = '<p>No game selected.</p>';
        }
    });
</script>
