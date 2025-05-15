import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';

// Your Firebase configuration (the same as in your other files)
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
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

const uploadForm = document.getElementById('uploadForm');
const adminAccessDenied = document.getElementById('adminAccessDenied');
const uploadErrorMessage = document.getElementById('uploadErrorMessage');
const adminEmail = 'gautamsingh77784@gmail.com';

onAuthStateChanged(auth, (user) => {
    if (user && user.email === adminEmail) {
        uploadForm.classList.add('admin-only');
        adminAccessDenied.style.display = 'none';
    } else {
        uploadForm.style.display = 'none';
        adminAccessDenied.style.display = 'block';
    }
});

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const gameName = document.getElementById('gameName').value.trim();
    const studioName = document.getElementById('studioName').value.trim();
    const apkFile = document.getElementById('apkFile').files[0];
    const gameLogoFile = document.getElementById('gameLogo').files[0];

    if (!gameName || !studioName || !apkFile || !gameLogoFile) {
        uploadErrorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    uploadErrorMessage.textContent = 'Uploading...';

    try {
        const user = auth.currentUser;
        if (!user) {
            uploadErrorMessage.textContent = 'User not authenticated.';
            return;
        }

        const apkStorageRef = ref(storage, `games/apk/${gameName}-${Date.now()}.apk`);
        const logoStorageRef = ref(storage, `games/logo/${gameName}-${Date.now()}-logo.${gameLogoFile.type.split('/')[1]}`);

        const [apkSnapshot, logoSnapshot] = await Promise.all([
            uploadBytes(apkStorageRef, apkFile),
            uploadBytes(logoStorageRef, gameLogoFile)
        ]);

        const [apkUrl, logoUrl] = await Promise.all([
            getDownloadURL(apkSnapshot.ref),
            getDownloadURL(logoSnapshot.ref)
        ]);

        await addDoc(collection(db, 'games'), {
            name: gameName,
            studioName: studioName,
            apkUrl: apkUrl,
            logoUrl: logoUrl,
            uploaderId: user.uid,
            uploaderName: user.displayName || user.email, // Or fetch from profile
            uploadDate: serverTimestamp()
        });

        uploadForm.reset();
        uploadErrorMessage.textContent = 'Game uploaded successfully!';
    } catch (error) {
        console.error('Error uploading game:', error);
        uploadErrorMessage.textContent = `Upload failed: ${error.message}`;
    }
});
