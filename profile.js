import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js';
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const profileContent = document.getElementById('profileContent');
const notLoggedInDiv = document.getElementById('notLoggedIn');
const profileLogoElement = document.getElementById('profileLogo');
const profileLogoInput = document.getElementById('profileLogoInput');
const userNameInput = document.getElementById('userName');
const studioNameInput = document.getElementById('studioName');
const uploadCountElement = document.getElementById('uploadCount');
const uploadedGamesList = document.getElementById('uploadedGamesList');
const logoutButton = document.getElementById('logoutButton');
const saveProfileButton = document.getElementById('saveProfileButton');
const loadingMessage = document.getElementById('loadingMessage');

// Function to fetch user profile data
async function fetchUserProfile(uid) {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// Function to fetch uploaded games for the user
async function fetchUploadedGames(uid) {
    try {
        const gamesCollectionRef = collection(db, 'games');
        const q = query(gamesCollectionRef, where('uploaderId', '==', uid));
        const querySnapshot = await getDocs(q);
        const games = [];
        querySnapshot.forEach((doc) => {
            games.push({ id: doc.id, ...doc.data() });
        });
        return games;
    } catch (error) {
        console.error('Error fetching uploaded games:', error);
        return [];
    }
}

// Function to display uploaded games
function displayUploadedGames(games) {
    uploadedGamesList.innerHTML = '';
    if (games.length > 0) {
        games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = game.name || 'Untitled Game';
            uploadedGamesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No games uploaded yet.';
        uploadedGamesList.appendChild(li);
    }
    uploadCountElement.textContent = games.length;
}

// Function to update UI based on auth state
onAuthStateChanged(auth, async (user) => {
    loadingMessage.style.display = 'none';
    if (user) {
        notLoggedInDiv.style.display = 'none';
        profileContent.style.display = 'block';

        const profileData = await fetchUserProfile(user.uid);
        if (profileData) {
            userNameInput.value = profileData.userName || '';
            studioNameInput.value = profileData.studioName || '';
            if (profileData.profileLogoUrl) {
                profileLogoElement.src = profileData.profileLogoUrl;
            } else {
                profileLogoElement.src = 'placeholder-logo.png';
            }
        } else {
            userNameInput.value = '';
            studioNameInput.value = '';
            profileLogoElement.src = 'placeholder-logo.png';
        }

        const uploadedGames = await fetchUploadedGames(user.uid);
        displayUploadedGames(uploadedGames);

    } else {
        notLoggedInDiv.style.display = 'block';
        profileContent.style.display = 'none';
    }
});

// Event listener for logout
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        // onAuthStateChanged will handle UI update
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out.');
    }
});

// Event listener for saving profile changes
saveProfileButton.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        const newUserName = userNameInput.value.trim();
        const newStudioName = studioNameInput.value.trim();

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                userName: newUserName,
                studioName: newStudioName
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.'); // This is the alert you're seeing
        }
    } else {
        alert('Not logged in.');
    }
});

    }
});

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
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                    profileLogoUrl: downloadURL
                });
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
