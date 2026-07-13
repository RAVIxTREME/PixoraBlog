import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);

  const loadProfile = () => api.getProfile(username).then(setData);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const handleFollow = async () => {
    await api.toggleFollow(username);
    loadProfile();
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <h2>{data.user.username}</h2>
      <p>
        {data.followers_count} followers · {data.following_count} following
      </p>

      {user?.username !== username && (
        <button onClick={handleFollow}>
          {data.is_following ? "Unfollow" : "Follow"}
        </button>
      )}

      <h3 style={{ marginTop: "2rem" }}>Posts</h3>
      {data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
