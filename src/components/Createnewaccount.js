import React from 'react'
import { useReducer } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { SignUp } from '.'
import './createnewaccount.css';

const exampleReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { open: true, dimmer: action.dimmer }
    case 'CLOSE_MODAL':
      return { open: false }
    default:
      throw new Error()
  }
}

function Createnewaccount() {

  const [state, dispatch] = useReducer(exampleReducer, {
    open: false,
    dimmer: undefined,
  })

  const { open, dimmer } = state
  return (
    <div>

      <Button
        color="green"
        onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'inverted' })}>
        Create New Account
      </Button>

      <Modal id="signupmodal"
        dimmer={dimmer}
        open={open}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      >
        <Modal.Header>
          <div className="header">Sign Up</div>
          <div className="paragraph">
            It's quick and easy
          </div>
        </Modal.Header>
        <Modal.Content>
          <SignUp />
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default Createnewaccount;
