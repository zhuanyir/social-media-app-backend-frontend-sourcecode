import { createContext, useState} from "react";
import { useEffect } from "react";

export const DarkModeContext = createContext()

export const DarkModeContextProvider = ({children})=>{
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);

    const toggle =() => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);
    
    return (
        <DarkModeContext.Provider value={{ darkMode, toggle }}>{children}</DarkModeContext.Provider>
    )

    };