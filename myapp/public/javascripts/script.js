//NavBar
function hideIconBar() {
  var iconBar = document.getElementById("iconBar");
  var navigation = document.getElementById("navigation");
  iconBar.setAttribute("style", "display:none;");
  navigation.classList.remove("hide");
}

function showIconBar() {
  var iconBar = document.getElementById("iconBar");
  var navigation = document.getElementById("navigation");
  iconBar.setAttribute("style", "display:block;");
  navigation.classList.add("hide");
}

//Comment
function showComment() {
  var commentArea = document.getElementById("comment-area");
  commentArea.classList.remove("hide");
}

//Reply
function showReply() {
  var replyArea = document.getElementById("reply-area");
  replyArea.classList.remove("hide");
}

function vote(button) {
  console.log("upvote");
  let icon = document.querySelector("i");
  icon.classList.toggle('bi-hand-thumbs-up');
  icon.classList.toggle('bi-hand-thumbs-up-fill');
}

function unvote(button) {
  let icon = button.querySelector("i");
  icon.classList.toggle('bi-hand-thumbs-down');
  icon.classList.toggle('bi-hand-thumbs-down-fill');
}
