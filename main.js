// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUv3PMj3na-rNONPAYEzaLNAWy68fhtcY",
  authDomain: "wahala-gist.firebaseapp.com",
  projectId: "wahala-gist",
  storageBucket: "wahala-gist.firebasestorage.app",
  messagingSenderId: "457107992368",
  appId: "1:457107992368:web:6d9978d72ef26fa36d62f5"
};
// main.js
const firebaseConfig = {
  // Paste your Firebase config here
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load blog posts on index.html or blog.html
document.addEventListener("DOMContentLoaded", () => {
  const blogList = document.getElementById("blog-posts") || document.getElementById("latest-posts");
  if (blogList) {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      blogList.innerHTML = "";
      snapshot.forEach(doc => {
        const post = doc.data();
        blogList.innerHTML += `
          <div class="post-item">
            <h3><a href="post.html?id=${doc.id}">${post.title}</a></h3>
            <p>${post.content.substring(0, 100)}...</p>
          </div>`;
      });
    });
  }

  const postPage = document.getElementById("post-content");
  if (postPage) loadPost();
});

// Load single post and comments
function loadPost() {
  const id = new URLSearchParams(window.location.search).get("id");
  const postRef = db.collection("posts").doc(id);

  postRef.get().then(doc => {
    const post = doc.data();
    document.getElementById("post-content").innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>`;
  });

  const commentsDiv = document.getElementById("comments");
  postRef.collection("comments").orderBy("timestamp", "asc").onSnapshot(snapshot => {
    commentsDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const comment = doc.data();
      commentsDiv.innerHTML += `
        <div class="comment"><strong>${comment.name}:</strong> ${comment.text}</div>`;
    });
  });

  document.getElementById("comment-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const text = document.getElementById("comment").value;
    postRef.collection("comments").add({ name, text, timestamp: Date.now() });
    e.target.reset();
  });
}