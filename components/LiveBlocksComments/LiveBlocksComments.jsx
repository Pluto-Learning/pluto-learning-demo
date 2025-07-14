import React, { useState, useEffect } from 'react';
import { createClient } from '@liveblocks/client';
import { RoomProvider, useOthers, useMyPresence, useRoom } from '@liveblocks/react';

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});

const LiveBlocksComments = ({ roomId }) => {
  const [comment, setComment] = useState('');
  const { usersCount } = useRoom();
  const others = useOthers();
  const [state, updateMyPresence] = useMyPresence();

  useEffect(() => {
    updateMyPresence({ comment });
  }, [comment, updateMyPresence]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save the comment to the LiveBlocks room
    setComment('');
  };

  return (
    <RoomProvider client={client} id={roomId}>
      <div className="live-blocks-comments-container">
        <div className="live-blocks-comments-header">
          <h4>Live Comments ({usersCount})</h4>
        </div>
        <div className="live-blocks-comments-content">
          {Object.values(others).map((user) => (
            <div key={user.id} className="live-blocks-comment">
              <div className="live-blocks-comment-avatar">
                <img src={user.presence.avatar} alt={user.presence.name} />
              </div>
              <div className="live-blocks-comment-content">
                <div className="live-blocks-comment-author">
                  {user.presence.name}
                </div>
                <div className="live-blocks-comment-text">
                  {user.presence.comment}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="live-blocks-comments-form">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={handleCommentChange}
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </RoomProvider>
  );
};

export default LiveBlocksComments;
