import React from "react";
import config from "../config";
import BookmarksContext from "../BookmarksContext";
import PropTypes from "prop-types";
import "./EditBookmark.css";

export default class EditBookmark extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }),
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  static contextType = BookmarksContext;

  state = {
    id: "",
    title: "",
    url: "",
    rating: 1,
    description: "",
    error: null
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));

        return res.json;
      })
      .then(res => {
        this.setState({
          id: res.id,
          title: res.title,
          url: res.url,
          description: res.description,
          rating: res.rating
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  }

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value });
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value });
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating };
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "PATCH",
      body: JSON.stringify(newBookmark),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
      })
      .then(() => {
        this.resetFields(newBookmark);
        this.context.updateBookmark(newBookmark);
        this.props.history.push("/");
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = newFields => {
    this.setState({
      id: newFields.id || "",
      title: newFields.title || "",
      url: newFields.url || "",
      description: newFields.description || "",
      rating: newFields.rating || ""
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  render() {
    const { title, url, description, rating } = this.state;
    return (
      <section>
        <div className="edit-bookmarks-section">
          <h2>Edit Article</h2>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="title">title{""}</label>
            <input
              type="text"
              name="title"
              placeholder="Great article"
              id="title"
              value={title}
              onChange={this.handleChangeTitle}
            />
            <label htmlFor="URL">URL:</label>
            <input
              type="text"
              name="url"
              id="url"
              value={url}
              onChange={this.handleChangeUrl}
            />
            <label htmlFor="rating">rating:</label>
            <input
              type="number"
              min="1"
              max="5"
              name="rating"
              id="rating"
              value={rating}
              onChange={this.handleChangeRating}
            />
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              name="description"
              id="description"
              value={description}
              onChange={this.handleChangeDescription}
            />
            <button type="submit">Edit</button>
            <button onClick={this.handleClickCancel}>Cancel</button>
          </form>
        </div>
      </section>
    );
  }
}
