import { useEffect, useState } from "react"
import { Download } from "lucide-react";

export default function InstallPWA() {
    const [installPrompt,setInstallPrompt]=useState(null)
    const [installed,setInstalled]=useState(false);

    useEffect(()=>{
        const handleInstallPrompt = (e)=>{
            e.preventDefault();
            setInstallPrompt(e)
        };

        const handleInstalled =()=>{
            setInstalled(true)
            setInstallPrompt(null)
        }

        window.addEventListener("appinstalled",handleInstalled);
        
        return ()=>{
            window.removeEventListener('beforeinstallprompt',handleInstallPrompt),

            window.removeEventListener("appinstalled",handleInstalled);
        }
    },[]);

    const handleInstall = async ()=>{
        if(!installPrompt) return;
        await installPrompt.prompt();

        const result = await installPrompt.userChoice;

        if(result.outcome === 'accepted'){
            setInstallPrompt(null)
        }

        if(installed || !installPrompt) return null;
    }
    return (
        <button
        type="button"
        onClick={handleInstall}
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-muted px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
        <Download size={18} />
        Install CropPay
        </button>
    );
}
