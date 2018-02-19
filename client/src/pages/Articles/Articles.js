import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";
import moment from "moment";


const axios = require("axios");
const authKey = "b9f91d369ff59547cd47b931d8cbc56b:0:74623931";
const url =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
    authKey;

class Articles extends Component {
    state = {
        articles: [],
        newArticles: [],
        topic: "",
        begin: "",
        end: "",
        foundTopic: "",
        status: " Search Results",
    };

    componentDidMount() {
        this.loadSavedArticles();
    }

    loadSavedArticles = () => {
        API.getSavedArticles()
            .then(res =>
                this.setState({
                    articles: res.data,
                    topic: "",
                    title: "",
                    date: "",
                    URL: ""
                })
            )
            .catch(err => console.log(err));
    };

    deleteSavedArticle = id => {
        API.deleteSavedArticle(id)
            .then(res => this.loadSavedArticles())
            .catch(err => console.log(err));
    };

    saveArticle = articleData => {

        document.getElementById(articleData.btnId).disabled = 'true';
        API.saveArticle(articleData)
            .then(res => this.loadSavedArticles())
            .catch(err => console.log(err));
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault();

        if (this.state.begin === "")
            alert("Please enter the start date!");
        else if (this.state.end === "")
            alert("Please enter the end date!");
        else
        {
            const queryURL = (`${url}&q=${this.state.topic}&begin_date=${this.state.begin}0101&end_date=${this.state.end}1231`);
            console.log('queryURL', queryURL)
            axios
                .get(queryURL, {
                    query: {
                        q: this.state.topic,
                        begin_date: this.state.begin + "0101",
                        end_date: this.state.end + "0101"
                    }
                })
                .then(response => {
                    console.log("this is response", response.data.response.docs);
                    const statusStr = "Found " + response.data.response.docs.length + " Articles";
                    const topicResult = "about " + this.state.topic;

                    this.setState({
                        newArticles: response.data.response.docs,
                        topic: "",
                        begin: "",
                        end: "",
                        status: statusStr,
                        foundTopic: topicResult
                    });
                });
        }    

    };

    render() {
        return (
            <Container>
                <Row>
                    <Col size="lg-12">
                        <Jumbotron>
                            <h1> Search Articles </h1>
                            <form>
                                <Input
                                    value={this.state.topic}
                                    onChange={this.handleInputChange}
                                    name="topic"
                                    placeholder="Topic (required)"
                                />

                                <Input
                                    value={this.state.begin}
                                    onChange={this.handleInputChange}
                                    name="begin"
                                    placeholder="Start Year (Required)"
                                />

                                <Input
                                    value={this.state.end}
                                    onChange={this.handleInputChange}
                                    name="end"
                                    placeholder="End Year (Required)"
                                />

                                <FormBtn
                                    disabled={!this.state.topic || !this.state.begin || !this.state.end}
                                    onClick={this.handleFormSubmit}
                                >
                                    Search for Articles
                                </FormBtn>
                            </form>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row>
                    <Col size="lg-12">
                        <Jumbotron>
                            <h1>{this.state.status}</h1>{" "}
                            <h4>{this.state.foundTopic}</h4>{" "}
                            {this.state.newArticles.length ? (
                                <List>
                                    {" "}
                                    {this.state.newArticles.map(newArticle => (
                                        <ListItem key={newArticle._id}> 
                                            <Link to={newArticle.web_url} target={"_blank"}>
                                                <strong>
                                                    {moment(newArticle.pub_date).format("MMM Do YY")}{" - "}{newArticle.headline.main}{" "}
                                                </strong>
                                             </Link>{" "}
                                            <button className="btn" id={newArticle._id} onClick={() => this.saveArticle({title: newArticle.headline.main, 
                                                                                                                         date: newArticle.pub_date,
                                                                                                                          URL: newArticle.web_url,
                                                                                                                           btnId: newArticle._id})}> Save </button>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <h3> No Results to Display </h3>
                            )}{" "}
                        </Jumbotron>
                    </Col>

                    <Col size="lg-12">
                        <Jumbotron>
                            <h1> Saved Articles </h1>{" "}
                            {this.state.articles.length ? (
                                <List>
                                    {" "}
                                    {this.state.articles.map(article => (
                                        <ListItem key={article._id}>
                                            <Link to={article.URL} target={"_blank"}>
                                                <strong>
                                                    {moment(article.date).format("MMM Do YY")}{" - "}{article.title}{" "}
                                                </strong>
                                            </Link>{" "}
                                            <DeleteBtn
                                                onClick={() =>
                                                    this.deleteSavedArticle(
                                                        article._id
                                                    )
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <h3> No Results to Display </h3>
                            )}{" "}
                        </Jumbotron>
                    </Col>
                </Row>{" "}
            </Container>
        );
    }
}

export default Articles;