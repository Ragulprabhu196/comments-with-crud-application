import React, { useState, useEffect } from 'react';
import './App.css';
import axios from"axios"
import comments from "./comments"

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments');
        if (response.ok) {
          const data = await response.json();
          
          const filteredComments = data.filter(comment => comment.postId === 1)
            .map(({ id, name, email, body }) => ({ id, name, email, body }));
          setComments(filteredComments);
        } else {
          console.error('Error fetching data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addComment = (content) => {
    const newCommentObj = {
      id: comments.length + 1,
      name: 'New User', 
      email: 'newuser@example.com', 
      body: content
    };
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const editComment = (commentId, updatedContent) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId ? { ...comment, body: updatedContent } : comment
    );
    setComments(updatedComments);
    setEditingComment(null);
  };

  const deleteComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    setEditingComment(null);
  };

  return (
    <div className="App">
      <h1>Comments</h1>
      <div className="comment-section">
        <ul className="comment-list">
          {comments.map(comment => (
            <li key={comment.id}>
              {editingComment === comment.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editComment(comment.id, e.target.updatedComment.value);
                  }}
                >
                  <input name="updatedComment" defaultValue={comment.body}></input>
                  <button type="submit">Save</button>
                </form>
              ) : (
                <>
                  <p><strong>ID:</strong> {comment.id}</p>
                  <p><strong>Name:</strong> {comment.name}</p>
                  <p><strong>Email:</strong> {comment.email}</p>
                  <p><strong>Body:</strong> {comment.body}</p>
                </>
              )}
              <div>
                {editingComment !== comment.id && (
                  <>
                    <button onClick={() => setEditingComment(comment.id)}>Edit</button>
                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="add-comment-form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addComment(newComment);
          }}
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Enter your comment"
          ></textarea>
          <br />
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
}

export default App;
