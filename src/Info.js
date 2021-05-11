/*global chrome*/
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css';
import logo from './llave.png';
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
                            {_data.password}:
                        </div>
                    </div>
                </div>
            )
        })
        return datas
    }

    return (
        
        <div className="App">
            <header className="App-header">
                <div className="App-name">
                    {url}
                </div>
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            {parseData()}
        </div>
    )
}

export default Info