import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <h3>
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </h3>
      <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
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
      <p>
        {post.content.slice(0, 150)}
        {post.content.length > 150 ? "..." : ""}
      </p>
      <p style={{ fontSize: "0.85rem" }}>
        ❤️ {post.like_count} · 💬 {post.comment_count}
      </p>
    </div>
  );
}
