import React from "react";
import Rating from "../Rating/Rating";
import BookmarksContext from "../BookmarksContext";
import config from "../config";
import "./BookmarkItem.css";
import { Link } from "react-router-dom";

function deleteBookmarkRequest(bookmarkId, cb) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${config.API_KEY}`
    }
  })
    .then(res => {
      if (!res.ok) {
        // get the error message from the response,
        return res.json().then(error => {
          // then throw it
          throw error;
        });
      }
      return res.json();
    })
    .then(data => {
      // call the callback when the request is successful
      // this is where the App component can remove it from state
      cb(bookmarkId);
    })
    .catch(error => {
      console.error(error);
    });
}

export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {context => (
        <li className="BookmarkItem">
          <div className="BookmarkItem__row">
            <h3 className="BookmarkItem__title">
              <a href={props.url} target="_blank" rel="noopener noreferrer">
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className="BookmarkItem__description">{props.description}</p>
          <div className="BookmarkItem__buttons">
            <Link to={`/edit-bookmark/${props.id}`}>Edit Article</Link>
            <button
              className="BookmarkItem__description"
              onClick={() => {
                deleteBookmarkRequest(props.id, context.deleteBookmark);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      )}
    </BookmarksContext.Consumer>
  );
}
