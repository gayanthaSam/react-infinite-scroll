import React, { useState, useEffect, useRef } from "react";
import Post from "./components/Post";

// TODO: Config on AWS
const API_URL = "http://localhost:1323/";

interface Post {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
}

interface ApiResponse {
  has_next: boolean;
  end_cursor: string;
  posts: Post[];
}

const App: React.FC = () => {
  // State to manage posts, loading status, and pagination
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [endCursor, setEndCursor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Trottle fuction
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean = false;
    return function (this: any, ...args: any[]) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  };

  // Ref for the intersection observer and throttled function
  const observer = useRef<IntersectionObserver | null>(null);
  const throttledLoadMorePosts = useRef(throttle(loadMorePosts, 1000)); // Throttle to 1 second

  // Function to load more posts from the backend
  async function loadMorePosts() {
    if (!hasNext || isLoading) return;
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}?after=${endCursor}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setHasNext(data.has_next);
      setEndCursor(data.end_cursor);
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Intersection observer callback to trigger loading more posts
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNext) {
      throttledLoadMorePosts.current(); // Use the throttled function
    }
  };

  // Effect to initialize and clean up the intersection observer
  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    if (observer.current) {
      observer.current.observe(
        document.getElementById("intersection-trigger")!
      );
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [endCursor, hasNext]);

  // Effect to load more posts on initial render
  useEffect(() => {
    // Initial load
    loadMorePosts();
  }, []); // Run only once on mount

  // Rendering
  return (
    <div className="App">
      {/* Navigation  */}
      <nav className="bg-white p-6">
        <div className="container mx-auto">
          <a href="#" className="text-xl font-semibold text-gray-800">
            Infinite Scroll
          </a>
        </div>
      </nav>
      {/* Begining of Posts */}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {/* Intersection trigger for infinite scroll */}
      <div
        id="intersection-trigger"
        className="loading-indicator"
        aria-busy={isLoading}
        aria-live="polite"
      >
        {isLoading && (
          <div className="spinner-border text-primary" role="status"></div>
        )}
      </div>
    </div>
  );
};

export default App;
