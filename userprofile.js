import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';

// Your Firebase configuration (the same as in your auth.js)
const firebaseConfig = {
  // Replace with your actual Firebase configuration
  apiKey: "AIzaSyCRtPZ34Y1J-p5b7FJxEUagYg3h_D6PbhM",
    authDomain: "igsfogstudio-df541.firebaseapp.com",
    projectId: "igsfogstudio-df541",
    storageBucket: "igsfogstudio-df541.firebasestorage.app",
    messagingSenderId: "206722625476",
    appId: "1:206722625476:web:c222830b5404f87bf57e91",
    measurementId: "G-1JL82Z0FK0"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Get DOM elements
const profileLogoElement = document.getElementById('profileLogo');
const profileLogoInput = document.getElementById('profileLogoInput');
const userNameInput = document.getElementById('userName');
const studioNameInput = document.getElementById('studioName');
const saveProfileButton = document.getElementById('saveProfileButton');
const uploadedGamesContainer = document.getElementById('uploadedGames');
const profileContainer = document.getElementById('profileContainer');
const loadingMessage = document.getElementById('loadingMessage');
const notLoggedInMessage = document.getElementById('notLoggedInMessage');
const uploadCountElement = document.getElementById('uploadCount');
const logoutButton = document.getElementById('logoutButton');

// Function to fetch user profile data from Firestore
async function fetchUserProfile(uid) {
    try {
        const userDocRef = doc(db, 'users', uid); // Assuming you have a 'users' collection
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data(); // Contains userName, studioName, profileLogoUrl, etc.
        } else {
            console.log('No user profile data found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// Function to fetch uploaded games for a user
async function fetchUploadedGames(uid) {
    try {
        const gamesCollectionRef = collection(db, 'games'); // Assuming you have a 'games' collection
        const q = query(gamesCollectionRef, where('uploaderId', '==', uid));
        const querySnapshot = await getDocs(q);
        const games = [];
        querySnapshot.forEach((doc) => {
            games.push({ id: doc.id, ...doc.data() }); // Include game ID
        });
        return games;
    } catch (error) {
        console.error('Error fetching uploaded games:', error);
        return [];
    }
}

// Function to display uploaded games in the UI
function displayUploadedGames(games) {
    uploadedGamesContainer.innerHTML = ''; // Clear previous content
    if (games.length > 0) {
        const ul = document.createElement('ul');
        games.forEach((game) => {
            const li = document.createElement('li');
            li.textContent = game.name || game.title || 'Untitled Game'; // Adjust based on your game data structure
            ul.appendChild(li);
        });
        uploadedGamesContainer.appendChild(ul);
    } else {
        uploadedGamesContainer.textContent = 'No games uploaded yet.';
    }
}

// Function to update the UI based on the user's authentication state
async function updateUI(user) {
    loadingMessage.style.display = 'none';
    if (user) {
        profileContainer.style.display = 'block';
        notLoggedInMessage.style.display = 'none';

        const profileData = await fetchUserProfile(user.uid);
        if (profileData) {
            userNameInput.value = profileData.userName || '';
            studioNameInput.value = profileData.studioName || '';
            if (profileData.profileLogoUrl) {
                profileLogoElement.src = profileData.profileLogoUrl;
            } else {
                profileLogoElement.src = 'placeholder-logo.png'; // Fallback
            }
        } else {
            userNameInput.value = '';
            studioNameInput.value = '';
            profileLogoElement.src = 'placeholder-logo.png';
        }

        const uploadedGames = await fetchUploadedGames(user.uid);
        uploadCountElement.textContent = uploadedGames.length;
        displayUploadedGames(uploadedGames);

    } else {
        profileContainer.style.display = 'none';
        notLoggedInMessage.style.display = 'block';
        // Optionally redirect to the login page
        window.location.href = '/auth.html';
    }
}

// Event listener for saving profile changes
saveProfileButton.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        const newUserName = userNameInput.value;
        const newStudioName = studioNameInput.value;

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                userName: newUserName,
                studioName: newStudioName
                // Add other fields you want to update
            });
            alert('Profile updated successfully!');
            // Optionally refresh user data in UI
            const updatedProfileData = await fetchUserProfile(user.uid);
            if (updatedProfileData) {
                userNameInput.value = updatedProfileData.userName || '';
                studioNameInput.value = updatedProfileData.studioName || '';
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
        }
    } else {
        alert('Not logged in.');
    }
});

// Event listener for profile logo upload
profileLogoInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const user = auth.currentUser;
        if (user) {
            const storageRef = ref(storage, `profile-logos/${user.uid}/${file.name}`);

            try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Update Firestore with the new logo URL
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                    profileLogoUrl: downloadURL
                });

                // Update the UI immediately
                profileLogoElement.src = downloadURL;
            } catch (error) {
                console.error('Error uploading profile logo:', error);
                alert('Error uploading profile logo.');
            }
        } else {
            alert('Not logged in.');
        }
    }
});

// Event listener for logout
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
        // The onAuthStateChanged listener will be triggered, updating the UI
        // and redirecting the user.
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
});

// Listen for changes in the authentication state
onAuthStateChanged(auth, async (user) => {
    await updateUI(user);
});

// Initially show a loading message
loadingMessage.style.display = 'block';
profileContainer.style.display = 'none';
notLoggedInMessage.style.display = 'none';
