import axios from "../../utils/axios.js";
import { useAuth } from "../../utils/authContext.jsx";
import { useEffect,useState } from "react";
import VideoCard from "../VideoCard/VideoCard";

import Loading from "../PreLoader/Loading.jsx";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate=useNavigate()
  const {auth}=useAuth()
  const [hero,setHero]=useState(auth);
  const [cards,setCards]=useState([])
  const [page,setPage]=useState(1);
  const [loading,setLoading]=useState(true);
 
useEffect(()=>{
  setHero(auth);
},[auth])
  useEffect(()=>{
    ;(async () => {
    try {
      const res = await axios.get(`/video/?page=${page}`);
      // const res = await axios.get(`http://localhost:8000/api/v1/video/?page=${page}`);
      const videos = res?.data?.data?.videos || [];
      console.log(res)
        setCards((prev) => [...prev, ...videos]);
        setLoading(false);
      
    } 
    catch (error) {
      console.error("Failed to fetch videos", error);
    }
  })()
  },[page])


  const handleInfiniteScroll= async()=>{
    try {
      if(window.innerHeight+document.documentElement.scrollTop+1>=document.documentElement.scrollHeight){
        setLoading(true);
        setPage((prev)=>prev+1);
      }
    } catch (error) {
      console.log("infinte scroll error",error);
    }
  }

  useEffect(()=>{
    window.addEventListener("scroll",handleInfiniteScroll);

    return ()=> window.removeEventListener("scroll",handleInfiniteScroll)
  },[])

  
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* Hero Section */}
      { !hero && 
 (<section className="text-center py-16 px-4 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
  {/* Glowing background behind logo */}
  <div className="relative flex justify-center items-center mb-2">
    <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-purple-500 blur-3xl opacity-30 rounded-full z-0"></div>
    <img
      src="/LandingPageMiddleLogo.svg"
      alt="App Icon"
      className="relative w-48 h-48 sm:w-52 sm:h-52 z-10"
    />
  </div>

  <p className="text-2xl sm:text-3xl font-audiowide">
    Stream, Share & Shine <span className="animate-pulse">✨</span>
  </p>
  <p className="mt-1 text-gray-400 text-sm sm:text-base">
    Create, connect and explore
  </p>

  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
    <button onClick={()=> navigate('/user/signup')} className="bg-purple-600 px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition w-full sm:w-auto font-audiowide">
      Sign Up
    </button>
    <button onClick={()=>{setHero((prev)=>!prev)}} className="border border-purple-500 px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition w-full sm:w-auto font-audiowide">
      Explore Videos
    </button>
  </div>
</section>)
      }
     

     {/* Video Grid */}
<section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 sm:p-6">
  {cards.map((card)=>(<VideoCard key={card._id} video={card}/>))}
</section>

{/* Loading Placeholder */}
<div className="h-20 flex justify-center items-center">
  {loading && <Loading />}
</div>


</div>
  );
}
