# 🎥 VeeTube - Backend

This is the **Backend API** for VeeTube — a full-stack, video-sharing platform like YouTube but custom-built with a modern, minimal design and complete media support.

---

## 🌐 Live App

- 🔗 Frontend: [https://vee-tube-frontend.vercel.app](https://vee-tube-frontend.vercel.app)
- 🛠️ Frontend Repo: [VeeTube Frontend](https://github.com/vsaini7351/VeeTube-Frontend)

---

## 🚀 Features

- User authentication with JWT (access + refresh)
- Upload videos, thumbnails, and images to Cloudinary
- Like/dislike system for videos and comments
- Comments CRUD with like toggle
- User channel with profile, cover, stats, tweets
- Playlist creation, update, delete
- Fully RESTful API with clean structure
- Pagination, search, sort, and filtering
- Express.js with modular controllers/routes
- CORS + secure config for frontend-backend connection

---

## 🛠️ Tech Stack

| Layer     | Tech Used                   |
|-----------|-----------------------------|
| Server    | Node.js + Express           |
| Database  | MongoDB + Mongoose          |
| Auth      | JWT (Access + Refresh)      |
| Media     | Cloudinary                  |
| Env Mgmt  | dotenv                      |
| Utility   | cookie-parser, cors, etc.   |
| Deploy    | Render                      |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/VeeTube-Backend.git
cd VeeTube-Backend


2. Install Dependencies
bash
Copy
Edit
npm install

3. Setup Environment Variables
Create a .env file in the root directory:

env
Copy
Edit
VITE_SERVER=https://veetube-backend.onrender.com
✅ Make sure your backend allows CORS from the frontend domain.

4. Start Development Server
bash
Copy
Edit
npm run dev
Visit: http://localhost:5173

📁 Folder Structure
bash
Copy
Edit
VeeTube-Frontend/
│
├── public/                 # Static files (favicon, etc.)
├── src/
│   ├── assets/             # Logos, images, thumbnails
│   ├── components/         # Reusable components (Navbar, VideoCard, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page-level components (Home, Search, Playlist)
│   ├── utils/              # Axios instance, authContext, helper functions
│   ├── App.jsx             # App root and routes
│   └── main.jsx            # Entry point
│
├── .env                    # Environment variables
├── package.json            # Project metadata and scripts
└── tailwind.config.js      # Tailwind configuration
📡 API Reference
All endpoints are prefixed with:

arduino
Copy
Edit
https://veetube-backend.onrender.com/api/v1
🔐 Auth
Method	Endpoint	Description
POST	/user/register	Register a new user
POST	/user/login	Login and receive tokens
GET	/user/me	Get logged-in user profile

📹 Video
Method	Endpoint	Description
POST	/video/publish-video	Upload & publish video
GET	/video/	Fetch all/search videos
GET	/video/:videoId	Get single video info
PATCH	/video/:videoId	Update video details
DELETE	/video/:videoId	Delete video

💬 Comments
Method	Endpoint	Description
POST	/comment/video/:videoId	Add a new comment
PATCH	/comment/:commentId	Edit a comment
DELETE	/comment/:commentId	Delete a comment
POST	/like/c/:commentId	Like/Unlike comment
GET	/like/c/:commentId	Fetch like status

📁 Playlist
Method	Endpoint	Description
POST	/playlist/	Create playlist
GET	/playlist/	Get user playlists
PATCH	/playlist/:playlistId	Update playlist
DELETE	/playlist/:playlistId	Delete playlist

📊 Dashboard
Method	Endpoint	Description
GET	/dashboard/:channelId/stats	Channel stats
GET	/dashboard/:channelId/videos	All channel videos
GET	/dashboard/:channelId/tweets	Channel tweets

📌 For full backend documentation, refer to: VeeTube Backend

🤝 Contributing
Contributions, feedback, and ideas are welcome!

Steps to contribute:

Fork this repository

Create your feature branch: git checkout -b feature/my-feature

Commit your changes: git commit -m "Add feature"

Push to the branch: git push origin feature/my-feature

Open a Pull Request

👨‍💻 Author
Made with 💜 by Vansh Saini
GitHub: @vsaini7351

📜 License
This project is licensed under the MIT License.

🔮 Roadmap & Upcoming Features
🔁 Infinite scrolling on search & feed

🌗 Theme switcher: Neon / Light / Dark

🧠 Video recommendation engine

🔔 Real-time notifications

💰 Channel monetization support

⭐️ Support the Project
If you like VeeTube, please consider giving it a ⭐ on GitHub.
Sharing it with others or contributing would mean a lot!