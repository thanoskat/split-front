import { useState, useEffect } from 'react'
// import WebSocket from 'ws'
const ws = new WebSocket('ws://localhost:8999')
// const client = new W3CWebSocket('ws://localhost:8999')

const WebSocketTest = () => {

  const [message, setMessage] = useState('')
  const [messageReceived, setMessageReceived] = useState('')


  ws.onopen = () => {
    console.log('onopen')
  }

  const sendMessage = () => {
    ws.send(message, {binary: false})
  }

  useEffect(() => {
    ws.addEventListener('message', (event) => {
      // console.log(event)
      setMessageReceived(event.data.toString())
    })
    return ws.removeEventListener('message', (event) => setMessageReceived(event.data))
  }, [])

  return (
    <div className='flex column alignitems-center justcont-center'>
      <div>
        <input placeholder='Message...' onChange={(event) => {setMessage(event.target.value)}} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <h1>{messageReceived}</h1>
    </div>
  )
}

export default WebSocketTest
