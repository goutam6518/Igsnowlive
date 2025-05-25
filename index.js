<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
  import { getFirestore, collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';
  import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

  const firebaseConfig = {
    apiKey: "AIzaSyCRtPZ34Y1J-p5b7FJxEUagYg3h_D6PbhM",
    authDomain: "igsfogstudio-df541.firebaseapp.com",
    databaseURL: "https://igsfogstudio-df541-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "igsfogstudio-df541",
    storageBucket: "igsfogstudio-df541.appspot.com",
    messagingSenderId: "206722625476",
    appId: "1:206722625476:web:c222830b5404f87bf57e91",
    measurementId: "G-1JL82Z0FK0"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const logoImage = document.getElementById('logo');
  const youtubeIframe = document.getElementById('youtubePlayer');
  const gameListContainer = document.getElementById('gameList');

  // Extract YouTube video ID
  function extractYoutubeId(url) {
    const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  }

  // Load logo and video from Firestore
  async function loadIndexData() {
    try {
      const indexDoc = doc(collection(db, 'index'), 'config');
      const snapshot = await getDoc(indexDoc);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.logoUrl) {
          logoImage.src = data.logoUrl;
        }
        if (data.videoUrl) {
          const videoId = extractYoutubeId(data.videoUrl);
          youtubeIframe.src = `https://www.youtube.com/embed/${videoId}`;
        }
      } else {
        console.warn('No config document found in index collection.');
      }
    } catch (error) {
      console.error('Error loading index data:', error);
    }
  }

  // Load games from Firestore
  async function loadGames() {
    try {
      gameListContainer.innerHTML = '';
      const gamesCollectionRef = collection(db, 'games');
      const querySnapshot = await getDocs(gamesCollectionRef);

      if (querySnapshot.empty) {
        gameListContainer.textContent = 'No games available.';
        return;
      }

      querySnapshot.forEach(docSnap => {
        const game = docSnap.data();
        const gameItem = document.createElement('a');
        gameItem.href = `gamed.html?id=${docSnap.id}`;
        gameItem.className = 'game-item';

        const logoContainer = document.createElement('div');
        logoContainer.className = 'game-logo-container';

        const logoImg = document.createElement('img');
        logoImg.className = 'game-logo';
        logoImg.src = game.gameLogoUrl || 'placeholder.png';
        logoImg.alt = game.gameName || 'Game';

        logoContainer.appendChild(logoImg);
        gameItem.appendChild(logoContainer);

        const title = document.createElement('p');
        title.textContent = game.gameName || 'Untitled';
        gameItem.appendChild(title);

        const uploader = document.createElement('p');
        uploader.textContent = `By ${game.uploaderName || 'Unknown'}`;
        gameItem.appendChild(uploader);

        gameListContainer.appendChild(gameItem);
      });

    } catch (error) {
      console.error('Error loading games:', error);
      gameListContainer.textContent = 'Failed to load games.';
    }
  }

  // Init
  onAuthStateChanged(auth, async () => {
    await loadIndexData();
    await loadGames();
  });
</script>
