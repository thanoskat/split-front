import './App.css';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Icon, Image} from 'semantic-ui-react'


const CustomCard = (props) =>{


return(<Card>
    <Image src='' wrapped ui={false} />
    <Card.Content>
      <Card.Header>Signed in as: 
        <Card.Meta>
        <span className='nickname'>{ props.nickname}</span>
      </Card.Meta> 
      </Card.Header>
      <Card.Description>
      
      </Card.Description>
      <Card.Header>Email: 
        <Card.Meta>
        <span className='email'>{ props.email}</span>
      </Card.Meta> 
      </Card.Header>
      <Card.Description>
      
      </Card.Description>
      <Card.Header>Unique Id: 
        <Card.Meta>
        <span className='_id'>{ props._id}</span>
      </Card.Meta> 
      </Card.Header>
      
      <Card.Description>
        //
      </Card.Description>
      
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon disabled name='users' />
         Member of {props.length} Groups
      </a>
    </Card.Content>
  </Card>)

}

export default CustomCard;