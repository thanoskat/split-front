import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/Input.css"

function Input({ headline, inputArray, submit, close }) {

  const [inputs, setInputs] = useState(inputArray)

  const changeUserInput = (index, text) => {
    if(text.length <= inputs[index].maxLength) {
      const tempArray = inputs
      tempArray[index].userInput = text
      setInputs([...tempArray])
    }
  }

  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={close} className='input-gray-box'/>
      <div className={'input'}>
        {headline && <div className='input-headline'>{headline}</div>}
        <div className='inputs-section'>

          {inputs.map((input, index) => (
            <div key={index} className='single-input-section'>
              <input className='input-field' value={input.userInput} onChange={e => changeUserInput(index, e.target.value)} spellCheck="false"/>
              <div className='input-label-section'>
                <div className='input-label'>{input.label}</div>
                <div className='input-right-label'>{`${input.userInput.length}/${input.maxLength}`}</div>
              </div>
            </div>
          ))}

        </div>
        <div className='input-button' onClick={() => submit(inputs)}>OK</div>
      </div>
    </div>
  );
}

export default Input;
