// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUv3PMj3na-rNONPAYEzaLNAWy68fhtcY",
  authDomain: "wahala-gist.firebaseapp.com",
  projectId: "wahala-gist",
  storageBucket: "wahala-gist.firebasestorage.app",
  messagingSenderId: "457107992368",
  appId: "1:457107992368:web:6d9978d72ef26fa36d62f5"
};
// auth.js
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Admin Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => window.location.href = "dashboard.html")
      .catch(err => document.getElementById("login-error").innerText = err.message);
  });
}

// Admin Dashboard
if (window.location.pathname.includes("dashboard.html")) {
  auth.onAuthStateChanged(user => {
    if (!user) return (window.location.href = "login.html");

    const postForm = document.getElementById("post-form");
    const postsDiv = document.getElementById("admin-posts");

    // Add Post
    postForm.addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      db.collection("posts").add({ title, content, timestamp: Date.now() });
      postForm.reset();
    });

    // Load Posts
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      postsDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const post = doc.data();
        postsDiv.innerHTML += `
          <div class="post-item">
            <h4>${post.title}</h4>
            <button onclick="deletePost('${doc.id}')">Delete</button>
          </div>`;
      });
    });
  });
}

function deletePost(id) {
  db.collection("posts").doc(id).delete();
}

function logout() {
  firebase.auth().signOut().then(() => (window.location.href = "login.html"));
}