import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
let socket;
export default function Chat({ location }) {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'localhost:5000'
    useEffect(() => {
        const { name, room } = queryString.parse(location.search)
        setName(name);
        setRoom(room);
        socket = io(ENDPOINT);
        console.log(socket)
        socket.emit('viet', { name, room }, (error) => {
            if (error) {
                alert(error)
            }
        })
        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [ENDPOINT, location])
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message])
        })
    }, [messages])
    const sendMessage = (e) => {
        e.preventDefault()
        if (message) {
            socket.emit('sendMessage', message, () => {
                setMessage('')

            })
        }
    }
    console.log(message, messages)
    return (
        <div className="outerContainer">
            <div className="container">
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null} />
            </div>
        </div>
    )
}
