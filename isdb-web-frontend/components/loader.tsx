import { Loader2 } from "lucide-react";

export default function PageLoader(){
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
            </div>
        </div>
    );
}