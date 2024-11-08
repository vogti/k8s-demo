const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data",  "posts.json");

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

function readPosts() {
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function writePosts(posts) {
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}

module.exports = {
    async getPosts() {
        return readPosts();
    },
    
    async addPost(post) {
        const posts = readPosts();
        posts.unshift(post);
        writePosts(posts);
    }
};
