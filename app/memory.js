const posts = [];

async function getPosts() {
  return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

async function addPost(post) {
  posts.unshift(post);
}

module.exports = { getPosts, addPost };
