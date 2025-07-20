import { Outlet } from "react-router-dom"
import Navbar from "./Components/Header/Navbar"
import { useState } from "react";
import Sidebar from "./Components/LeftSideBar";
import { ToastContainer } from "react-toastify";
// function App() {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-black">
//       {/* Navbar */}
//       <div className="fixed top-0 left-0 right-0 z-50">
//         <Navbar onHamburgerClick={() => setSidebarOpen(true)} />
//       </div>

//       <div className="flex pt-[70px]">
//         {/* Desktop Sidebar */}
//         <div className="hidden md:block w-64 fixed top-[70px] bottom-0 bg-black z-40">
//           <Sidebar />
//         </div>

//         {/* Mobile Sidebar (overlay) */}
//         <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />


//         {/* Main Content */}
//         <div className="w-full ml-0 md:ml-64 px-4 pb-4">

//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar onHamburgerClick={() => setSidebarOpen(true)} />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed top-[70px] bottom-0 left-0 w-64 z-40">
          <Sidebar />
        </div>

        {/* Mobile Sidebar (only shows when isOpen=true) */}
        {isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main content area */}
        <div className="flex-1 pt-[70px] md:ml-64 px-4 pb-4">
          <Outlet />
        </div>

          <ToastContainer
        position="top-right" // or top-center as needed
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
        
      </div>
    </div>
  );
}




export default App
