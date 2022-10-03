import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
    doc,
    getDoc,
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
    orderBy,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBwbVeXvM9JrN3iGGN7__5qsNpFdscMggI",
    authDomain: "login-signup-7f2d1.firebaseapp.com",
    projectId: "login-signup-7f2d1",
    storageBucket: "login-signup-7f2d1.appspot.com",
    messagingSenderId: "155318254759",
    appId: "1:155318254759:web:ca654eaeca23d2a0156f82"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();


window.onload = async () => {
    document.getElementById("loader").classList.remove("hidden")
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            getDocumentFromDatabase(user.uid)
        } else {
            swal("Please Sign In","", "error")
        }
    });

}

const getDocumentFromDatabase = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        console.log(docSnap.data().name);
        document.getElementById("main_div").innerHTML += `
        <div id="user">
        <div class="user_img" >
        <img src="images/user.png" class="image">
        <button id="close_btn" onclick="closeProf()" > <i class="fa-solid fa-xmark"></i> </button>
        </div>
        <h1> Name: ${docSnap.data().name} </h1>
        <h1> Email: ${docSnap.data().email} </h1>
        <h1> Phone No: ${docSnap.data().phoneNo} </h1>
        <div id="close" >
        </div>
        </div>
        `
        getAllUsers(docSnap.data().email, uid, docSnap.data().name)

    } else {
        console.log("No such document!");
    }
}

function myProfile() {
    var user = document.getElementById("user")
    console.log
    user.style.display = "block";
}

window.myProfile = myProfile;

function closeProf() {
    var user = document.getElementById("user")
    user.style.display = "none";

}

window.closeProf = closeProf;

var signOutBtn = document.getElementById("signout_btn")

signOutBtn.addEventListener("click", function () {

    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("SignOut Successful")
        window.location.href = "index.html";
    }).catch((error) => {
        // An error happened.
    });
})

const getAllUsers = async (email, myId, myName) => {
    const q = query(collection(db, "users"), where("email", "!=", email));
    const querySnapshot = await getDocs(q);
    let users = document.getElementById("users")
    document.getElementById("loader").classList.add("hidden")

    querySnapshot.forEach((doc) => {
        users.innerHTML += `
        <li onclick='startChat("${doc.id}","${doc.data().name}","${myId}","${myName}")' id="chat_btn">
        <img src="images/user.png" class="userImg" /> <div id="user_name" >${doc.data().name}</div></li>
        `
        console.log(doc.id, " => ", doc.data());
    });
    const mine = document.getElementById("myself")
    mine.innerHTML = `
    <img src="images/user.png" class="userImg" />
    <h4> ${myName} </h4>
    `
}

let unsubscribe;


let startChat = (id, name, currentId, currentName,) => {
    if (unsubscribe) {
        unsubscribe();
    }
    let chatWith = document.getElementById("chat_with")
    chatWith.innerHTML = `
    <img src="images/user.png" class="userImg" />
    <h4> ${name} </h4>
    `
    let sendBtn = document.getElementById("send_btn")
    let message = document.getElementById("message")
    let chatId;
    if (id < currentId) {
        chatId = `${id}${currentId}`;
    } else {
        chatId = `${currentId}${id}`;
    }
    sendBtn.addEventListener("click", async () => {
        let messageList = document.getElementById("message_list")
        messageList.innerHTML = "";
        if (message.value.trim() !== "") {
            await addDoc(collection(db, "messages"), {
                sender_name: currentName,
                receiver_name: name,
                sender_id: currentId,
                receiver_id: id,
                chat_id: chatId,
                message: message.value,
                timestamp: new Date(),
            });
            message.value = "";
            loadAllChats(chatId, currentId);
        } else {
            swal("Incorrect message!", "Write a valid message", "error");
        }
    });
}

window.startChat = startChat;

const loadAllChats = (chatId, myId) => {
    try {
        const q = query(
            collection(db, "messages"),
            where("chat_id", "==", chatId),
            // orderBy("timestamp", "asc")
        );
        let messageList = document.getElementById("message_list");
        unsubscribe = onSnapshot(q, (querySnapshot) => {
            let textMessage = document.getElementById("text_message")
            let message = document.getElementById("message")
            message.value = "";
            messageList.innerHTML = "";
            querySnapshot.forEach((doc) => {
                let className =
                    doc.data().sender_id === myId ? "my_message" : "sender_message";
                messageList.innerHTML += `<li id="text_message" class="${className}" ><div id="${className}" > ${doc.data().message} </div></li>`;
            });
        });
    }
    catch (err) {
        console.log(err)
    }
}