import { useEffect, useState } from "react";
import axios from "../utils/axios";
import SearchVideoCard from "../Components/VideoCard/SearchVideoCard";
import Loading from "../Components/PreLoader/Loading";

const LikedVideosPage = () => {
    const [likedVideos, setlikedVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Pagination Settings
    const LIMIT = 10;

    useEffect(() => {
        const fetchlikedVideos = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/like/videos?page=${page}&limit=${LIMIT}`);
                const likedVideosvideos = res?.data?.data?.videos || []
                setlikedVideos((prev) => [...prev, ...likedVideosvideos]);
            } catch (err) {
                console.error("Failed to fetch Liked videos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchlikedVideos();
    }, [page]);

    const handleInfiniteScroll = async () => {
        try {
            if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight &&
                !loading) {

                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.log("infinte scroll error", error);
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);

        return () => window.removeEventListener("scroll", handleInfiniteScroll)
    }, [])

    return (
        <div className="min-h-screen px-4 md:px-10 py-10 bg-[#0f0f0f] text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-400 underline underline-offset-8">
                Liked Videos
            </h2>

            {

                likedVideos.length === 0 ? (
                    <p className="text-gray-400">No watch history available.</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {likedVideos.map((video) => (
                            <SearchVideoCard key={video.video._id} video={video.video} />
                        ))}
                    </div>
                )}

            <div className="h-20 flex justify-center items-center">
                {loading && <Loading />}
            </div>

        </div>
    );
};

export default LikedVideosPage;
