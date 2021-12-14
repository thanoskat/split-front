import axios from 'axios'
import { useState, useEffect } from 'react'

function About() {
  const [text, setText] = useState('')
  useEffect(() => {
    lala()
  }, [])

  const lala = async () => {
    try{
      const res = await axios.get('http://localhost:4000')
      setText(res.data)
    }
    catch(error){
      console.dir("ABOUT: ", error)
      setText(error.message)
    }
  }

  return (
    <div style={{backgroundColor: 'black'}}>
      <h1  style={{color: 'white'}}>{text}</h1>
    </div>
  );
}

export default About;
