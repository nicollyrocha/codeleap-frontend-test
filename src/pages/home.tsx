import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Layout } from "../components/layout";
import { TextArea } from "../components/text-area";
import type { Post } from "../types/post";
import { createPost, deletePost, getPosts, updatePost } from "../../server/api";
import { CardPost } from "../components/card-post";

export const Home = () => {
  const username = localStorage.getItem("username") || "User";
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);
  const [likes, setLikes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data.results);
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    const data = await createPost(username, title, content);
    setPosts((prevPosts) => [data, ...prevPosts]);
    setTitle("");
    setContent("");
  };

  const handleDeletePost = async (id: number) => {
    setLoadingModal(true);
    setTimeout(async () => {
      const data = await deletePost(id);
      if (data)
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setLoadingModal(false);
    }, 1000);
  };

  const handleEditPost = async (id: number, title: string, content: string) => {
    setLoadingModal(true);
    setTimeout(async () => {
      await updatePost(id, title, content);
      await getPosts().then((res) => {
        if (res) {
          console.log(res);
          setPosts(res.results);
          setLoadingModal(false);
        }
      });
    }, 1000);
  };

  const handleLike = (postId: number) => {
    setLikes((prevLikes) => {
      const newLikes = new Set(prevLikes);
      if (newLikes.has(postId)) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }
      return newLikes;
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-6 mt-10 px-5 md:px-0">
        <Card>
          <div className="flex flex-col gap-5">
            <div className="text-[22px] font-bold">What's on your mind?</div>
            <Input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              value={title}
              label="Title"
              placeholder="Hello world"
            />
            <TextArea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content here"
            />
            <div className="flex justify-end">
              <Button
                text="Create"
                onClick={handleCreatePost}
                disabled={title === "" || content === ""}
              />
            </div>
          </div>
        </Card>

        {posts.length > 0 && (
          <div className="flex flex-col gap-6 items-center w-full">
            {posts.map((post) => (
              <CardPost
                key={post.id}
                post={post}
                handleDelete={handleDeletePost}
                handleEdit={handleEditPost}
                loading={loadingModal}
                liked={likes.has(post.id)}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
