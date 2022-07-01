import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const SocketIOTest = () => {

  const socket = io.connect('http://192.168.88.200:3000')
  const [message, setMessage] = useState('')
  const [messageReceived, setMessageReceived] = useState('')

  const sendMessage = () => {
    socket.emit('send_message', { message })
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageReceived(data.message)
    })
  }, [socket])

  return (
    <div className='flex row justcont-center'>
      <div>
        <input placeholder='Message...' onChange={(event) => {setMessage(event.target.value)}} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <h1>{messageReceived}</h1>
    </div>
  )
}

export default SocketIOTest
