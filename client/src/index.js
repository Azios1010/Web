import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ReactDOM from 'react-dom/client';
import './app.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : ''; // Empty for production

const EMOTES = ['like', 'haha', 'sad', 'wow'];
const EMOTE_ICONS = {
  like: '❤️',
  haha: '😂',
  sad: '😢',
  wow: '😮'
};

function App() {
  const [text, setText] = useState('');
  const [confessions, setConfessions] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchConfessions();
  }, []);

  

  const fetchConfessions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/confessions`);
      setConfessions(res.data);

      // Fetch comments for each confession
      const allComments = {};
      for (let c of res.data) {
        const commentRes = await axios.get(`${API_URL}/api/comments/${c._id}`);
        allComments[c._id] = commentRes.data;
      }
      setComments(allComments);
    } catch (error) {
      console.error("Failed to fetch confessions:", error);
    }
  };

  const submitConfession = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post(`${API_URL}/api/confessions`, { text });
    setText('');
    fetchConfessions();
  };

  const reactToConfession = async (id, type) => {
    await axios.post(`${API_URL}/api/confessions/${id}/react`, { type });
    fetchConfessions();
  };

  const submitComment = async (confessionId) => {
    const text = newComments[confessionId];
    if (!text?.trim()) return;
    await axios.post(`${API_URL}/api/comments`, { confessionId, text });
    setNewComments({ ...newComments, [confessionId]: '' });
    fetchConfessions();
  };


  

  return (
    <div className="App" >
      <h1>Anonymous Confession</h1>

      <div className='container'>
        <form onSubmit={submitConfession}>
          <textarea
            className='wantToShare'
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="3"
            cols="50"
            placeholder="Tell me something..."
          />
          <br />
          <button type="submit">Confess</button>
        </form>

        <hr />

        <h2 className='recent-confess'>
          Recent Confessions
        </h2>
        {confessions.map((c) => (
          <div className='confession-card' key={c._id} style={{ border: '1px solid #ccc', padding: 15}}>
            <p className='content'>{c.text}</p>
            <small className='date-time'>{new Date(c.createdAt).toLocaleString()}</small>
            <div style={{ marginTop: 10 }}>
              {EMOTES.map((type) => (
                <button key={type} onClick={() => reactToConfession(c._id, type)}>
                  {EMOTE_ICONS[type]} {c.reactions?.[type] || 0}
                </button>
              ))}
            </div>
            <div className='comment-input'>
              <strong className='cmt'>Comments:</strong>
              <ul className='list-comment'>
                {(comments[c._id] || []).map((com) => (
                  <li className='cmt-content' key={com._id}>
                    {com.text} <small className='cmt-date-time'>({new Date(com.createdAt).toLocaleString()})</small>
                  </li>
                ))}
              </ul>
              <div className="comment-input-wrapper">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComments[c._id] || ''}
                  onChange={(e) => setNewComments({ ...newComments, [c._id]: e.target.value })}
                />
                <button className="send-icon" onClick={() => submitComment(c._id)}>
                  <i className="fas fa-paper-plane"></i>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
