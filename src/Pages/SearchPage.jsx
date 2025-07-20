import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import SearchVideoCard from "../Components/VideoCard/SearchVideoCard";
import Loading from "../Components/PreLoader/Loading";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Local state for infinite scroll

  const getQueryParam = (key) => {
    const params = new URLSearchParams(location.search);
    return params.get(key);
  };

  const query = getQueryParam("query") || "";

  // Reset page and videos when query changes
  useEffect(() => {
    setPage(1);
    setVideos([]);
  }, [query]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/video/", {
        params: {
          query,
          page,
          limit: 10,
          sortBy: "createdAt",
          sortType: "desc",
        },
      });

      const newVideos = res?.data?.data?.videos || [];

      setVideos((prev) => (page === 1 ? newVideos : [...prev, ...newVideos]));
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchVideos();
  }, [query, page]);

  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto text-white">
      <h2 className="text-2xl font-semibold mb-6">
        Results for: <span className="text-purple-500">"{query}"</span>
      </h2>

      {videos.length > 0 ? (
        videos.map((video) => <SearchVideoCard key={video._id} video={video} />)
      ) : !loading ? (
        <p className="text-center text-gray-500">No results found.</p>
      ) : null}

      {/* Loading Placeholder */}
      {loading && (
        <div className="h-20 flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
