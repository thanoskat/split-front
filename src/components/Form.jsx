import { SlidingBox } from './'
import "../style/FormBox.css"

function Form({ headline, submit, close, children }) {

  return (
    <SlidingBox close={close}>
      {headline && <div className='form-headline'>{headline}</div>}
      <div className='input-field-section'>
        {children}
      </div>
      <div className='submit-button' onClick={submit}>OK</div>
    </SlidingBox>
  );
}

function InputField({ value, label, maxLength, required, onChange }) {

  const checkLengthAndChange = (e) => {
    if(maxLength) {
      if(e.target.value.length <= maxLength) {
        return onChange(e)
      }
    }
    else {
      return onChange(e)
    }
  }

  return (
    <div className='single-input-section'>
      <input
        className='input-field'
        value={value}
        onChange={checkLengthAndChange}
        spellCheck="false"
      />
      <div className='input-label-section'>
        <div className='input-label'>{label}</div>
        {maxLength &&
          <div
            className='input-right-label'
            style={required && value.length == 0 ? {color:'red'} : {}}
          >
            {`${value.length}/${maxLength}`}
          </div>
        }
      </div>
    </div>
  )
}

Form.InputField = InputField;
export default Form;
