import React, { useState } from 'react'
import axios from 'axios'
import logo from './llave.png';
import './App.css';
import { Modal } from 'react-bootstrap';

function LogIn(props) {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [_2faToken,set_2faToken] = useState(null)
  const [_2faAuth,set_2faAuth] = useState("")
  const [err,setErr] = useState(false)

  const submit = async () => {  
    try {
      const body = { email, password }
      const response = await axios.post("https://keypax-api.sytes.net/public/login", body)

      switch (response.status) {
        case 200:
          setErr(false)
          set_2faToken(response.data._2faToken)
          break;
        default:
          setErr(true)
          break;
      }
      

      }catch (error) {
        setErr(true)
    }
  }

  const access = async() => {
    try {
        const body = { _2faToken: _2faToken, code: _2faAuth }
        const response = await axios.post("https://keypax-api.sytes.net/public/2fa", body)
        localStorage.setItem('token',response.data.accessToken)
        props.setToken(response.data.accessToken)
    }
    catch (error) {     
    }
  }
  return (
    <div className="App">
        <Modal
        	show={_2faToken!==null}
        	backdrop="static"
			keyboard={false}
			dialogClassName="full_modal"
        >
            <div className="modal">
        	    <div className="modal-header">
			    	<Modal.Title className="modal-title">Introduce codigo 2fa</ Modal.Title>
			    </div>
                <div className="input">
                    <input className="input-class" type="text"  placeholder="Código" value={_2faAuth} onChange={(e) => set_2faAuth(e.target.value)} required/>  
                </div>
                <button  className="button" onClick={access}>
                  ENTER
                </button>
            </div>
        </Modal>
      <header className="App-header">
        <div className="App-name">
          KeyPax
        </div>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {err === true ? 
      <>
        <div className="input">
          <input className="input-error" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>  
        </div>
        <div className="input">
          <input className="input-error" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}required/>  
        </div>
      </>
      :
      <>
        <div className="input">
          <input className="input-class" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>  
        </div>
        <div className="input">
          <input className="input-class" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}required/>  
        </div>
      </>
    }
      
      <div className="input">
        <button  className="button" onClick={submit}>
          SUBMIT
        </button>
      </div>
    </div>
  );
}

export default LogIn