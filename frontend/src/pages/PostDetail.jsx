import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  const loadPost = () => api.getPost(id).then(setPost);

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleLike = async () => {
    await api.toggleLike(id);
    loadPost();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await api.addComment(id, commentText);
    setCommentText("");
    loadPost();
  };

  const handleDelete = async () => {
    if (confirm("Delete this post?")) {
      await api.deletePost(id);
      navigate("/");
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <h2>{post.title}</h2>
      <p style={{ opacity: 0.7 }}>
        by{" "}
        <Link to={`/profile/${post.user.username}`}>{post.user.username}</Link>{" "}
        · {new Date(post.created_at).toLocaleDateString()}
      </p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          style={{ maxWidth: "100%", borderRadius: "6px" }}
        />
      )}
      <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

      <button onClick={handleLike}>
        {post.liked_by_me ? "❤️ Liked" : "🤍 Like"} ({post.like_count})
      </button>

      {user?.username === post.user.username && (
        <button onClick={handleDelete} style={{ marginLeft: "1rem" }}>
          Delete Post
        </button>
      )}

      <h3 style={{ marginTop: "2rem" }}>Comments</h3>
      <form onSubmit={handleComment}>
        <input
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ width: "80%" }}
        />
        <button type="submit">Post</button>
      </form>

      {post.comments?.map((c) => (
        <div
          key={c.id}
          style={{ borderTop: "1px solid #333", padding: "0.5rem 0" }}
        >
          <strong>{c.user.username}</strong>: {c.text}
        </div>
      ))}
    </div>
  );
}
