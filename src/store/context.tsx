import React, { createContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";

export interface Campi {
  id: number;
  Name: string;
  isOccupated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prenotazioni {
  Data:string;
  Start_Time: string;
  End_Time:string;
  campo_id:number
}

interface ContextType {
  campi: Campi[];
  prenotazioni: Prenotazioni[];
  addPrenotazione: (obj:Prenotazioni)=>void;
  loading:boolean;
}

const Context = createContext<ContextType | undefined>(undefined)

interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider:React.FC<ContextProviderProps>=({children})=>{
    const [campi,setCampi]=useState<Campi[]>([])
    const [prenotazioni, setPrenotazioni] = useState<Prenotazioni[]>([]);
    const [loading,setLoading]=useState<boolean>(false)


    useEffect(() => {
    fetchCampi();
    fetchPrenotazioni();
    }, []);

     const fetchCampi = async () => {
       try {
         const response = await axios.get("http://localhost:8000/api/campi");
         if (response.data.status === "success") {
           setCampi(response.data.results);
         }
       } catch (error) {
         console.error("Errore operazione:", error);
       }
     };
    const fetchPrenotazioni = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/prenotazioni"
        );
        if (response.data.status === "success") {
          setPrenotazioni(response.data.results);
        }
      } catch (error) {
        console.error("Errore operazione:", error);
      }
    };

   const addPrenotazione = async (obj: Prenotazioni) => {
     try {
       setLoading(true)
       const response = await axios.post(
         `http://localhost:8000/api/prenotazioni`,
         obj,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       if (response.status !== 201) {
         throw new Error("Fail Created");
         setLoading(false);
       }

       // A questo punto, puoi aggiornare lo stato delle prenotazioni o gestire la risposta
       const updatePrenot = response.data; 
       setPrenotazioni((prev) => [...prev, updatePrenot]); 
        setLoading(false);
       return updatePrenot;
     } catch (error) {
        setLoading(false);
       console.error("Errore nell'update:", error);
     }
   };


    const value ={campi,prenotazioni, addPrenotazione,loading};
    
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default Context;