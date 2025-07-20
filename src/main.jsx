
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingPage from './Pages/LandingPage.jsx'
import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider } from 'react-router-dom'


import Login from './Components/LoginForm.jsx'
import VideoPage from './Pages/VideoPage.jsx'

import { AuthProvider } from './utils/authContext.jsx'
import ChannelDashboard from './Components/Dashboard/dashboard.jsx'
import VideoPublish from './Pages/VideoPublish.jsx'
import AddTweet from './Pages/AddTweet.jsx'
import SearchPage from './Pages/SearchPage.jsx'
import WatchHistoryPage from './Pages/WatchHistory.jsx'
import PlaylistPage from './Components/Playlist/PlaylistsPage.jsx'
import PlaylistVideoPage from './Components/Playlist/PlaylistVideoPage.jsx'
import LikedVideosPage from './Pages/LikedVideos.jsx'
import YourVideosPage from './Pages/YourVideos.jsx'
import SubscriptionPage from './Pages/SubscriptionPage.jsx'
import UpdateUserDetailsPage from './Components/UpdateChannel/UpdateUserDetails.jsx'
import UpdateAvatarPage from './Components/UpdateChannel/UpdateUserAvatar.jsx'
import UpdateCoverPage from './Components/UpdateChannel/UpdateUserCover.jsx'
import TweetPage from './Pages/TweetPage.jsx'
import LikedTweets from './Pages/LikedTweets.jsx'






const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}  errorElement={<h1>Something went wrong.</h1>}>
      <Route index element={<LandingPage />} />
      <Route path='/user/:params' element={<Login/>} />
      <Route path='/video/:videoId' element={<VideoPage/>} />
      {/* <Route path='/tweet/:tweetId' element={<TweetPage/>} /> */}
      <Route path='/channel/:channelId' element={<ChannelDashboard/>} />
      <Route path='/video/publish' element={<VideoPublish/>} />
      <Route path='/tweet/add' element={<AddTweet/>} />
      <Route path='/search' element={<SearchPage/>} />
      <Route path='/watch-history' element={<WatchHistoryPage/>} />
      <Route path='/liked-videos' element={<LikedVideosPage/>} />
      <Route path='liked-tweets' element={<LikedTweets/>} />
      <Route path='/your-videos' element={<YourVideosPage/>} />
      <Route path='/your-videos' element={<YourVideosPage/>} />
      <Route path='/subscriptions' element={<SubscriptionPage/>} />
      <Route path='/playlists' element={<PlaylistPage/>} />
      <Route path='/playlist/:playlistId' element={<PlaylistVideoPage/>} />
      <Route path='/user/update-details' element={<UpdateUserDetailsPage/>} />
      <Route path='/user/update-avatar' element={<UpdateAvatarPage/>} />
      <Route path='/user/update-cover' element={<UpdateCoverPage/>} />
      
      

      
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
 
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
    
    
  
)
