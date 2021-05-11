import React, { useEffect, useState } from 'react'
import LogIn from './Login';
import Info from './Info'

function App() {

  const [token,setToken] = useState(null)

  useEffect(()=>{
    try{
      const _token = localStorage.getItem('token')
      setToken(_token)
    }catch(err){
      setToken(null)
    }
  },[])

  const closeSession = () => {
      localStorage.removeItem('token')
      setToken(null)
  }
  
  return (
    <>
    {token === null ? 
        <LogIn setToken={setToken}/>
      :
        <Info accessToken={token} closeSession={closeSession}/>
    }
    </>
  );
}

export default App;
