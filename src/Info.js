/*global chrome*/
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css';
import logo from './llave.png';
import icon from './icon.png'
import { BsClipboardData } from "react-icons/bs";
import CopyToClipboard from 'react-copy-to-clipboard'

const Info = (props) => {

    const [url,setUrl] = useState("")
    const [data,setData] = useState([])

    const getUrl = async() => {
        let queryOptions = { active: true, currentWindow: true };
        chrome.tabs.query(queryOptions, tabs => {
            tabs.forEach( tab => {
                setUrl(tab.url)
            });
        });
    }

    const fetchUrl = async() => {
        if(url.length !== 0){
            try{
                const config = {
                    headers: {
                        accessToken:props.accessToken
                    },
                    params: {
                        url: url.substring(0, url.length - 1)
                    }
                }

               const response = await axios.get("https://keypax-api.sytes.net/private/infobyurl",config)
            
               switch(response.status){
                    case 401:
                       props.closeSession()
                    break;
                    case 403:
                        props.closeSession()
                    break;
                    case 200:
                        setData(response.data)
                    break;  
               }
            }catch(err){
                props.closeSession()
            }
        }
    }

    useEffect(()=>{
        getUrl()
    },[])

    useEffect(()=>{
        fetchUrl()
    },[url])

    const parseData = () => {
        let datas = []
        data.forEach((_data)=>{
            datas.push(
                <div className="data-container">
                    <div className="data">
                        <div className="data-right">
                            {_data.username}:
                        </div>
                        <div className="data-left">
                        <CopyToClipboard text={_data.password}>
                            <button className="clip">
                                <BsClipboardData/>
                            </button>
                        </CopyToClipboard>
                            
                        </div>
                    </div>
                </div>
            )
        })

        if (datas.length === 0) {
            return <div className="icon-container">
                <div className="App-name">
                        {url}
                </div>
                <img src={icon} className="icon"></img>
                <div className="icon-text">
                    No se han encontrado contraseñas para esta pagina web
                </div>
            </div>
        }else{
            datas.unshift(
                <header className="App-header">
                    <div className="App-name">
                        {url}
                    </div>
                    <img src={logo} className="App-logo" alt="logo" />
                </header>
            )
        }
        return datas
    }

    return (
        
        <div className="App">
            {parseData()}
        </div>
    )
}

export default Info