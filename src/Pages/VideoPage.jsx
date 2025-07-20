import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import VideoSection from "../Components/VideoElement/VideoSection";
import DescriptionSection from "../Components/VideoElement/DescriptionSection";
import CommentSection from "../Components/VideoElement/CommentSection";
import { useAuth } from "../utils/authContext";
import VideoActions from "../Components/VideoElement/VideoActions";


export default function VideoPage() {
  const {auth} = useAuth()
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/video/${videoId}`);
      setVideo(res.data.data);
    })();

    (async () => {
      const res = await axios.get(`/comment/video/${videoId}`);
      setComments(res.data.data.comments);
    })();
  }, [videoId]);

  useEffect(()=>{
    ;(async ()=>{
      if(auth){
    try {
      const watch= await axios.post(`/video/${videoId}/addtowatch`)
      if(watch) console.log("video added to watch history successfully!")
    } catch (error) {
      console.log("unbale to add to watch history- ",error)
    }
  }
    })()
  },[auth,videoId])

  

  if (!video) return <div className="text-white p-8">Loading...</div>;

  
  



  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <VideoSection video={video[0]} /> 
      {/* as aggregate use kar liya na to array diya */}
      <VideoActions video={video[0]} />
      <DescriptionSection video={video[0]} />
      <CommentSection comments={comments} videoId={video[0]._id} />
    </div>
  );
}
