import React, { useContext } from "react";
import { Link , NavLink , useNavigate} from "react-router-dom";
import logo from '../assets/images/logo.png'
import { AuthContext, } from "../context/AuthContext";
// import { logOutUser } from "../../../ProfessionBackend/src/controllers/user.controller";
function Header(){
    const navigate = useNavigate()
     const {user,logout} = useContext(AuthContext)
     const logOutUser = async(e)=>{
        e.preventDefault();
        const loggedOut =  await fetch("http://localhost:3000/api/v1/users/logout" ,{
            method:"GET"
        });
        if(loggedOut){ 
            logout();
            navigate("/")
        }
         else{ alert("failed to logOut")
        }
     }
    return(
<>
<header className="shadow sticky z-50 top-0">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <img
                            src={logo}
                            className="mr-3 h-12"
                            alt="Logo"
                        />
                    </Link>
                    { !user ? <div className="if">
                    <div className="flex items-center lg:order-2">
                        <Link
                            to="/login"
                            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/login"
                            className="text-black bg-green-300 hover:bg-white-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Get started
                        </Link>
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink 
                                to="/"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-indigo-600" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-indigo-800 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                to="/about"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-indigo-600" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-indigo-800 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/contact"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-indigo-600" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-indigo-800 lg:p-0`
                                    }
                                >
                                    Contact Me
                                </NavLink>
                            </li>
                            {/* <li>
                                <NavLink 
                                to="/My-Projects"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-orange-500" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-orange-700 lg:p-0`
                                    }
                                >
                                   My Projects
                                </NavLink>
                            </li>  */}
                            <li>
                                {/* <NavLink 
                                to="/Git-Hub"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-orange-500" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-orange-700 lg:p-0`
                                    }
                                >
                                   Git Hub
                                </NavLink> */}
                            </li> 
                        </ul>
                    </div>
                  </div> : <div className="else">
                    
                    <div className="flex items-center lg:order-2">
                        <Link
                            to="/profile"
                            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Profile
                        </Link>
                        <Link
                            onClick={logOutUser}
                            className="text-black bg-green-300 hover:bg-white-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            logout
                        </Link>
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink 
                                to="/"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-indigo-600" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-indigo-800 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                to="/about"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-indigo-600" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-indigo-800 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                to="/contact"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-indigo-600" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-indigo-800 lg:p-0`
                                    }
                                >
                                    Contact Me
                                </NavLink>
                            </li>
                            {/* <li>
                                <NavLink 
                                to="/My-Projects"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-orange-500" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-orange-700 lg:p-0`
                                    }
                                >
                                   My Projects
                                </NavLink>
                            </li>  */}
                            <li>
                                {/* <NavLink 
                                to="/Git-Hub"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b
                                    ${isActive ? "text-orange-500" :"text-gray-600"}
                                     border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                      hover:text-orange-700 lg:p-0`
                                    }
                                >
                                   Git Hub
                                </NavLink> */}
                            </li> 
                        </ul>
                    </div>


                     </div> 
} 
                </div>
            </nav>
        </header>
</>
    )
}

export default Header