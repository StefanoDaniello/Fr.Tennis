import { useContext } from "react";
import Context from "./context";


export const useContextApp=()=>{
    const context = useContext(Context)
    if(!context) {
        throw new Error ('Errore nello useContextApp')
    }
    return context;
}
