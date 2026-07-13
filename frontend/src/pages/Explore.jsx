import { useEffect, useState } from "react";
import { api } from "../api";
import PostCard from "../components/PostCard";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .getPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.user.username.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Explore</h2>
      <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
        Discover posts from everyone on Pixora
      </p>

      <input
        placeholder="Search by title or username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "0.6rem", margin: "1rem 0" }}
      />

      {filteredPosts.length === 0 && <p>No posts found.</p>}
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
