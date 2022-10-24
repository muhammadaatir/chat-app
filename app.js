var loginHeader = document.querySelector('[data-button="gs-neumorphic-login"]');
var signupHeader = document.querySelector('[data-button="gs-neumorphic-signup"]');
var loginContainer = loginHeader.parentElement;
var signupContainer = signupHeader.parentElement;

loginHeader.addEventListener('click', function handleClick(event) {
  loginContainer.classList.add("gs-open");
  loginHeader.classList.add("gs-open");
  signupHeader.classList.remove("gs-open");

  loginContainer.classList.add("gs-form-open");
  signupContainer.classList.remove("gs-form-open");
});

signupHeader.addEventListener('click', function handleClick(event) {
  loginContainer.classList.remove("gs-open");
  loginHeader.classList.remove("gs-open");
  signupHeader.classList.add("gs-open");

  loginContainer.classList.remove("gs-form-open");
  signupContainer.classList.add("gs-form-open");
});

var signupBtn = document.getElementById("SignUpBtn")
var fName = document.getElementById("fullName")
var phone = document.getElementById("phoneNo")
var email = document.getElementById("email")
var password = document.getElementById("password")
var conPass = document.getElementById("conPass")


// window.onload = async () => {
//   const auth = getAuth();
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       swal("User Signed In", "You have already signed in","success")
//       window.location.href = "profile.html"
//     }
//   });

// }


function signUp() {
  event.preventDefault();
  document.getElementById("loader").classList.remove("hidden")
  if (/^\s*[0-9a-zA-Z][0-9a-zA-Z ]*$/.test(fName.value)) {
    if (/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/.test(phone.value)) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
        if (/^(?=.*[0-9])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(password.value)) {
          if (password.value === conPass.value) {
            console.log("User done")
            registerUser();
          } else {
            swal("Incorrect Password!", "Confirm Password did not match your previous password.", "error");
            document.getElementById("loader").classList.add("hidden")
          }
        } else {
          swal("Incorrect Password!", "Enter Password in Correct Format. Password be 8 Character long and shorter than 16 character and must contain 1 number", "error");
          document.getElementById("loader").classList.add("hidden")
        }
      } else {
        swal("Incorrect Email!", "Enter Email in Correct Format", "error");
        document.getElementById("loader").classList.add("hidden")
      }
    } else {
      swal("Incorrect Phone Number!", "Enter Phone Number in Correct Format", "error");
      document.getElementById("loader").classList.add("hidden")
    }
  } else {
    swal("Incorrect Name!", "Enter Name in Correct Format", "error");
    document.getElementById("loader").classList.add("hidden")
  }

}

signupBtn.addEventListener("click", signUp);



import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { doc, setDoc, getFirestore, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";

var img = {
  url: "",
}


const firebaseConfig = {
  apiKey: "AIzaSyDUBvn5UgU8V5XxaHn3o4jdV9KujyS0y50",
  authDomain: "aatir-chat-app.firebaseapp.com",
  projectId: "aatir-chat-app",
  storageBucket: "aatir-chat-app.appspot.com",
  messagingSenderId: "339313631186",
  appId: "1:339313631186:web:084d65bc1e5373c669b20b"
};

// let uploadBtn = document.getElementById("upload_btn");

// uploadBtn.addEventListener("click", async () => {
//   event.preventDefault();
//   let myFile = document.getElementById("my_file");
//   let file = myFile.files[0];
//   const auth = getAuth();
//   let uid = auth.currentUser.uid;
//   let url = await uploadFiles(file);
//   console.log(url)
//   img.url = url;

// });

// const uploadFiles = (file) => {
//   event.preventDefault();
//   return new Promise((resolve, reject) => {
//     const storage = getStorage();
//     const auth = getAuth();
//     let uid = auth.currentUser.uid;
//     const storageRef = ref(storage, `users/${uid}.png`);
//     const uploadTask = uploadBytesResumable(storageRef, file);
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log("Upload is " + progress + "% done");
//         switch (snapshot.state) {
//           case "paused":
//             console.log("Upload is paused");
//             break;
//           case "running":
//             console.log("Upload is running");
//             break;
//         }
//       },
//       (error) => {
//         reject(error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           resolve(downloadURL);
//         });
//       }
//     );
//   });
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
function registerUser() {
  event.preventDefault();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("user ==> ", user)
      console.log(email.value, "registered")
      sendEmailVerification(auth.currentUser)
        .then((a) => {
          console.log("Email verification sent!", a)
          // ...
        })
        .catch((b) => {
          console.log("error sending verification email", b)
        });
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          console.log(uid);
        } else {
        }
      });
      await setDoc(doc(db, "users", user.uid), {
        name: fName.value,
        email: email.value,
        phoneNo: phone.value,
        profile: img.url,
      });
      fName.value = "";
      phone.value = "";
      email.value = "";
      password.value = "";
      conPass.value = "";
      my_file.value = "";
      document.getElementById("loader").classList.add("hidden")
      swal("User Registered", "User Have Succesfully Signed Up", "success")
      console.log(img.url);
      // window.location.href = "profile.html"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      console.log("error ==> " + errorMessage)
      alert(errorMessage)
      document.getElementById("loader").classList.add("hidden")
    });

}

var logEmail = document.getElementById("email_login")
var logPass = document.getElementById("pass_login")
var btn = document.getElementById("loginBtn")
btn.addEventListener("click", function login() {
  event.preventDefault();
  document.getElementById("loader").classList.remove("hidden")

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(logEmail.value)) {
    if (/^(?=.*[0-9])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(logPass.value)) {

      signInWithEmailAndPassword(auth, logEmail.value, logPass.value)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user)
          document.getElementById("loader").classList.add("hidden")
          window.location.href = "profile.html"
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
          document.getElementById("loader").classList.add("hidden")
          swal(errorCode, "", "error")
        });


    } else {
      swal("Incorrect Password!", "Enter Password in Correct Format.", "error");
    }
  } else {
    swal("Incorrect Email!", "Enter Email in Correct Format.", "error");
  }
})

