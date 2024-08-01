import React, { useRef, useState,useEffect } from 'react';
import { Navigate, parsePath, useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatWindow = () => {
    const location = useLocation();

    // const chatText = location.state.conversation
    const topic = location.state.topic  
    const pairedList = [];

    const [conversation, setConversation] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [display, setDisplay] = useState('');
    const [redirect, setRedirect]= useState(false);
    const [loading, setLoading]= useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        axios.get("/get_chat_history").then(data => {
            // console.log(data.data.history.split("\n"))
            setConversation(data.data.history)
        })
        
        if(conversation) {  
            // Split by lines and process
            const lines = conversation.trim().split('\n');
            const conversationParts = {
                Human: [],
                AI: []
            };

            let currentSpeaker = null;
            let currentText = [];

            lines.forEach(line => {
                if (line.startsWith('Human:')) {
                    if (currentSpeaker) {
                        conversationParts[currentSpeaker].push(currentText.join(' ').trim());
                    }
                    currentSpeaker = 'Human';
                    currentText = [line.slice('Human:'.length).trim()];
                    } else if (line.startsWith('AI:')) {
                    if (currentSpeaker) {
                        conversationParts[currentSpeaker].push(currentText.join(' ').trim());
                    }
                    currentSpeaker = 'AI';
                    currentText = [line.slice('AI:'.length).trim()];
                    } else if (currentSpeaker) {
                    currentText.push(line.trim());
                    }
                });

            // Append the last accumulated text
                if (currentSpeaker) {
                    conversationParts[currentSpeaker].push(currentText.join(' ').trim());
                }
            setDisplay(conversationParts)
        }
      }, [conversation]); // Update when messages array changes

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        
      }, [display])

    if(display){
        for (let i = 0; i < display.Human.length; i++) {
            pairedList.push({ user: display.Human[i], system: display.AI[i] });
        }
    }
    console.log(pairedList)

    async function chatting(e){
        e.preventDefault();

        try {
            setLoading(true)
            await axios.post("/chat", {
                topic,
                newMessage
            }).then(data=> {
                setLoading(false)
                setConversation(data.data.history)
                setNewMessage('')
            })
          }
          catch(e){
            console.log(e);
          }
    }

    function newchat(){
        axios.get('/newChat')
        setRedirect(true)
    }

    function changeColorSet(){

    }

    if(redirect){
        return <Navigate to='/' />
    }

    return (
       <div className='flex gap-20'>
        {/* Chat Window */}
            <div className="chat-window">
                <div className='window-top'>
                    <h1> {topic}</h1>
                    <hr className='py-4'/>
                </div>
                <div ref={chatContainerRef} className='window-chat scroll-smooth focus:scroll-auto'>
                    {pairedList.map((ele, key) => (
                            <div className='flex flex-col px-14' key={key}>
                                <div className='user max-w-1/2 self-end' >
                                    <p className='px-7'>
                                        {ele.user}
                                    </p>
                                </div>
                                <div className='system self-start'>
                                    <div className='px-7'>     
                                        {ele.system.split("\n").map((e,k) => (
                                            <p key={k}> 
                                                {e} 
                                                <br/><br/>
                                            </p>
                                        ))} 
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
                {loading && (
                    <div className='flex px-14 py-5'><h3 className='text-2xl px-10'>...</h3></div>
                )}
                              
            
                 <div className='window-bottom mb-10 flex justify-center gap-10'>
                    <form onSubmit={chatting}>
                        <input type="text" value={newMessage} onChange={(e)=> setNewMessage(e.target.value)}/>
                    </form>
                    <h5 onClick={newchat} className='rounded-full p-4 cursor-pointer'>New chat</h5>
                </div>
            </div>

            {/* Side buttons */}
            {/* <div className='flex flex-col justify-center gap-6'>
                <h6 onClick={changeColorSet} className='rounded-full p-4 cursor-pointer'>Color Set 1</h6>
                <h6 onClick={changeColorSet} className='rounded-full p-4 cursor-pointer'>Color Set 2</h6>
            </div> */}
       </div> 
    );
};

export default ChatWindow;
