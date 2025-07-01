
// import './App.css'
import "./style.scss";
import Register from './pages/register/Register';
import Login from "./pages/login/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router";

import NavBar from "./components/navBar/NavBar";
import LeftBar from './components/leftBar/LeftBar';
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';



function App() {

const {currentUser}= useContext(AuthContext);

const {darkMode} = useContext(DarkModeContext)

const queryClient = new QueryClient();


  const Layout = ()=>{
  return (
    <QueryClientProvider client={queryClient}>    
    <div className={`theme-${darkMode? "dark" : "light"}`}>
      <NavBar />
      <div style={{display:"flex"}}>
        <LeftBar />
        <div className="mainContent">
        <Outlet />
        </div>
        <RightBar />

      </div>
    </div>
    </QueryClientProvider>  
  );
  };

  const ProtecteRoute =({children}) =>{
    if(!currentUser){
      return <Navigate to="/login" />;
    }

    return children;
  };


const router = createBrowserRouter([
  {
    path:"/",
    element:(<ProtecteRoute><Layout/></ProtecteRoute>),
    children:[
      {
        path:"/",
        element:<Home />
      },
       {
        path:"profile/:id",
        element:<Profile />
      }
    ]
  },
 
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

    return <RouterProvider router={router} />
}

export default App;
