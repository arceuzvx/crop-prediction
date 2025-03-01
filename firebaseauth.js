// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signInWithPhoneNumber, RecaptchaVerifier, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoPaEYG9fklgLulXVOQlY7fkGOvYR5NEY",
    authDomain: "crop-prediction-fbf5e.firebaseapp.com",
    projectId: "crop-prediction-fbf5e",
    storageBucket: "crop-prediction-fbf5e.firebasestorage.app",
    messagingSenderId: "382689789443",
    appId: "1:382689789443:web:485337a46c7819744a3036"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email & Password Sign In
window.signIn = function() {
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Signed in successfully!");
            console.log(userCredential.user);
        })
        .catch((error) => {
            alert(error.message);
        });
};

// Email & Password Signup
window.signUp = function() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("signup-email").value;
    const phone = document.getElementById("signup-phone").value;
    const state = document.getElementById("state").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!validatePassword(password)) {
        alert("Password does not meet security requirements!");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Account created successfully!");
            console.log(userCredential.user);
        })
        .catch((error) => {
            alert(error.message);
        });
};

// Phone OTP Sign-In
window.getOtp = function() {
    const phoneNumber = document.getElementById("phone").value;
    const appVerifier = new RecaptchaVerifier(auth, "phone", { size: "invisible" });

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            const otp = prompt("Enter OTP:");
            return confirmationResult.confirm(otp);
        })
        .then((result) => {
            alert("Phone sign-in successful!");
            console.log(result.user);
        })
        .catch((error) => {
            alert(error.message);
        });
};

// Password Validation
function validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// Check if user is signed in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User signed in: ", user);
    } else {
        console.log("No user signed in.");
    }
});
