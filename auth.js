import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
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

// DOM Elements
const loginSection = document.getElementById('loginSection');
const createAccountSection = document.getElementById('createAccountSection');
const switchToCreate = document.getElementById('switchToCreate');
const switchToLogin = document.getElementById('switchToLogin');
const loginButton = document.getElementById('loginButton');
const createAccountButton = document.getElementById('createAccountButton');
const errorMessage = document.getElementById('errorMessage');
const createUsernameInput = document.getElementById('createUsername');
const createEmailInput = document.getElementById('createEmail');
const createPasswordInput = document.getElementById('createPassword');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');

// Function to switch between login and create account forms
function showLogin() {
    loginSection.classList.add('active');
    createAccountSection.classList.remove('active');
    errorMessage.textContent = '';
}

function showCreateAccount() {
    createAccountSection.classList.add('active');
    loginSection.classList.remove('active');
    errorMessage.textContent = '';
}

// Event listeners to switch forms
switchToCreate.addEventListener('click', showCreateAccount);
switchToLogin.addEventListener('click', showLogin);

// Event listener for creating a new account
createAccountButton.addEventListener('click', async () => {
    const username = createUsernameInput.value.trim();
    const email = createEmailInput.value.trim();
    const password = createPasswordInput.value;

    if (!username || !email || !password) {
        errorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user's display name (username)
        await updateProfile(user, {
            displayName: username
        });

        // Save additional user info to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            userName: username,
            email: email,
            studioName: '' // Initialize other fields as needed
            // profileLogoUrl will be handled in profile settings
        });

        errorMessage.textContent = 'Account created successfully! Redirecting...';
        setTimeout(() => {
            window.location.href = '/profile.html'; // Redirect to profile page
        }, 1500);

    } catch (error) {
        errorMessage.textContent = getErrorMessage(error.code);
        console.error('Error creating account:', error);
    }
});

// Event listener for logging in
loginButton.addEventListener('click', async () => {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;

    if (!email || !password) {
        errorMessage.textContent = 'Please enter your email and password.';
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        errorMessage.textContent = 'Logged in successfully! Redirecting...';
        setTimeout(() => {
            window.location.href = '/profile.html'; // Redirect to profile page
        }, 1500);
    } catch (error) {
        errorMessage.textContent = getErrorMessage(error.code);
        console.error('Error logging in:', error);
    }
});

// Function to get a user-friendly error message
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Email address is already in use.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/user-not-found':
            return 'User not found with this email.';
        default:
            return 'An error occurred. Please try again.';
    }
}

// Initially show the login form
showLogin();
