import axios from "axios";

export default {

    // Gets all articles
    getSavedArticles: function() {
        return axios.get("/api/articles");
    },
    // Gets the book with the given id
    getSavedArticle: function(id) {
        return axios.get("/api/articles/" + id);
    },
    // Deletes the book with the given id
    deleteSavedArticle: function(id) {
        return axios.delete("/api/articles/" + id);
    },
    // Saves an article to the database
    saveArticle: function(articleData) {
        return axios.post("/api/articles", articleData);
    }
};