import { useState } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';


export default function Start() {
    const [fectchAssistance, setFectchAssistance]= useState('');
    const [assistance, setAssistance] = useState('');
    const [askAssistance, setAskAssistance]= useState('');
    const [redirect, setRedirect]= useState(false);
    const [intro, setIntro] = useState([]);
  
    async function getAssistance(e){
        e.preventDefault()
      try {
            await axios.post("/fetch_assistance", {fectchAssistance}).then(data=> {
              setIntro(data.data.introduction)
              setAssistance(data.data.topic)
            })
        }
        catch(e){
            console.log(e);
        }
    }

  async function askingAssistance(e){
    e.preventDefault()
    try {
      await axios.post("/chat", {
        'topic':assistance,
        'newMessage':askAssistance,
      }).then(data=> {
        setRedirect(true);
      })
    }
    catch(e){
      console.log(e);
    }

  }

  console.log(intro)

  if(redirect) {
    return <Navigate to="/chatWindow" state = {{topic : assistance}} />

    // return <Navigate to="/chatWindow" state={{ conversation: conversation,topic: assistance }} />
    // return <Navigate to="/chatWindow" state={{ topic: assistance, system: system, user: user }} />
  }

  return (
    <div className="start">
        {!assistance  && (
           <form onSubmit={getAssistance}>
            <h1 className="mb-5">What would you like me to be?</h1>
            <input type="text" value={fectchAssistance} onChange={(e)=> setFectchAssistance(e.target.value)}></input>
          </form>
        )}

        {assistance && (
          <form onSubmit={askingAssistance}>
            <h1>{intro}</h1>
            <h2>How can I help you?</h2>
            <input type="text" value={askAssistance} onChange={(e)=> setAskAssistance(e.target.value)}></input>
          </form>
        )}
    </div>
  )
}
