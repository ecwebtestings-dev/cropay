import { useCallback, useEffect, useState } from "react";

const Key ="theme"

function getIntialsTheme(){
    try {
        return localStorage.getItem(Key) === 'dark'?"dark":"light";
    } catch  {
        return "light";
    }
}



export default function UseTheme() {
    const [theme,setTheme]=useState(getIntialsTheme);
    
    useEffect(()=>{
        document.documentElement.setAttribute('data-theme',theme)
        try {
            localStorage.setItem(Key,theme)
        } catch {
            //
        }
    },[theme]);

    //TURN OFF/ON
    const ToggleTheme =useCallback(()=>setTheme((current)=>(current === 'dark'?"light":"dark")),[]);


  return {theme,isDark:theme === 'dark',ToggleTheme}
  
}
