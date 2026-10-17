const session_Expired_Event ="CropPay:session-expired";

export function emitSessionExpired(){
    if (typeof window !== "undefined"){
        window.dispatchEvent(
            new CustomEvent(session_Expired_Event)
        );
    }
}

//React authentication context reaction to expired session
export function onSession_Expiry(callback){
    if(typeof window === "undefined"){
        return ()=>{};
    }
    window.addEventListener(session_Expired_Event,callback)

    return()=>{
        window.removeEventListener(
            session_Expired_Event,callback
        );
    };
}