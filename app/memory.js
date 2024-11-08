const posts = [];

async function getPosts() {
  return posts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

async function addPost(post) {
  posts.unshift(post);
}

module.exports = { getPosts, addPost };
