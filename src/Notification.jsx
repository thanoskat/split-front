import react from "react";
import {Icon, Label, Menu} from 'semantic-ui-react'

const NotficationLabel=()=>{
    return(
        <Menu compact >
            <Menu.Item as='a'>
            <Icon name='bell' /> Group requests
            <Label color='red' floating >
               1
            </Label>
            </Menu.Item>
      </Menu>
    )
}

export default NotficationLabel