iImport the functions you need from the SDKs you need

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const analytics = getAnalytics(app););

// --- Sign Up Functionality ---

async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Sign up successful:', user);
    // You can redirect the user to your app's main page or perform other actions
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Sign up error:', errorCode, errorMessage);
    // Handle specific error codes (e.g., email-already-in-use, weak-password)
    throw error; // Re-throw the error for the calling function to handle
  }
}

// Example usage for Sign Up (assuming you have input fields with IDs 'signupEmail' and 'signupPassword' and a button with ID 'signupButton')
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm'); // Assuming you have a form with this ID
  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission
      const emailInput = document.getElementById('signupEmail');
      const passwordInput = document.getElementById('signupPassword');

      if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
          await signUp(email, password);
          // Optionally clear the form or show a success message
          signupForm.reset();
        } catch (error) {
          // Display the error message to the user
          alert(`Sign up failed: ${error.message}`);
        }
      } else {
        console.error('Signup email or password input fields not found.');
      }
    });
  }
});

// --- Login Functionality ---

async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Login successful:', user);
    // You can redirect the user to your app's main page or perform other actions
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Login error:', errorCode, errorMessage);
    // Handle specific error codes (e.g., user-not-found, wrong-password)
    throw error; // Re-throw the error for the calling function to handle
  }
}

// Example usage for Login (assuming you have input fields with IDs 'loginEmail' and 'loginPassword' and a button with ID 'loginButton')
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm'); // Assuming you have a form with this ID
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission
      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');

      if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
          await login(email, password);
          // Optionally clear the form or show a success message
          loginForm.reset();
        } catch (error) {
          // Display the error message to the user
          alert(`Login failed: ${error.message}`);
        }
      } else {
        console.error('Login email or password input fields not found.');
      }
    });
  }
});

// --- Sign Out Functionality ---

async function signOutUser() {
  try {
    await signOut(auth);
    console.log('Sign out successful');
    // You can redirect the user to the login page or perform other actions
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Example usage for Sign Out (assuming you have a button with ID 'signOutButton')
document.addEventListener('DOMContentLoaded', () => {
  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', signOutUser);
  }
});

// --- Observe Authentication State (Optional but Recommended) ---

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log('User is signed in:', user);
    // Update your UI to reflect the logged-in state (e.g., hide login/signup forms, show user dashboard)
  } else {
    // User is signed out
    console.log('User is signed out');
    // Update your UI to reflect the logged-out state (e.g., show login/signup forms, hide user dashboard)
  }
});
