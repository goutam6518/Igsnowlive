// Import the Firebase SDK (make sure you've added it to your HTML)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

// Your Firebase configuration
const firebaseConfig = {
  // Replace with your actual Firebase configuration
  apiKey: "AIzaSyCRtPZ34Y1J-p5b7FJxEUagYg3h_D6PbhM",
    authDomain: "igsfogstudio-df541.firebaseapp.com",
    projectId: "igsfogstudio-df541",
    storageBucket: "igsfogstudio-df541.firebasestorage.app",
    messagingSenderId: "206722625476",
    appId: "1:206722625476:web:9ab922dc4853418af57e91",
    measurementId: "G-71VB7K6QS6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get DOM elements
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const switchToLogin = document.getElementById('switchToLogin');
const switchToSignup = document.getElementById('switchToSignup');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupErrorMessage = document.getElementById('signupErrorMessage');
const loginErrorMessage = document.getElementById('loginErrorMessage');
const signupPasswordInput = document.getElementById('signupPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Function to switch between forms
function showSignupForm() {
    signupContainer.classList.add('active');
    loginContainer.classList.remove('active');
}

function showLoginForm() {
    loginContainer.classList.add('active');
    signupContainer.classList.remove('active');
}

// Event listeners to switch forms
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = signupPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        signupErrorMessage.textContent = "Passwords do not match.";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Account created:", user);
        signupErrorMessage.textContent = "Account created successfully! You can now log in.";
        signupForm.reset();
        showLoginForm(); // Optionally switch to login form after successful signup
    } catch (error) {
        console.error("Error creating account:", error);
        signupErrorMessage.textContent = getFirebaseErrorMessage(error.code);
    }
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Logged in:", user);
        loginErrorMessage.textContent = "Logged in successfully!";
        // Redirect to your application's main page here
        window.location.href = '/index.html'; // Replace with your actual dashboard URL
    } catch (error) {
        console.error("Error logging in:", error);
        loginErrorMessage.textContent = getFirebaseErrorMessage(error.code);
    }
});

// Function to get user-friendly Firebase error messages
function getFirebaseErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'The email address is already in use by another account.';
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/weak-password':
            return 'The password is too weak.';
        case 'auth/wrong-password':
            return 'The password you entered is incorrect.';
        case 'auth/user-not-found':
            return 'There is no user record corresponding to this email.';
        default:
            return 'An error occurred. Please try again later.';
    }
}

// Initially show the signup form
showSignupForm();
