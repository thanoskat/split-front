import './App.css';
import { Card, Icon, Image, Accordion,List} from 'semantic-ui-react'
import NotficationLabel from './Notification';

const CustomCard = (props) =>{
  const panels = [
    {
      key: 'show-groups',
      title: {
        content: 'Show Groups',
        icon: 'users',
      },
      content: {
        icon: 'search',
        content: (
          <List verticalAlign="bottom" >
            {props.groupInfo.map(group=>(
            <List.Item > {group.title}  </List.Item>

          ))}
          </List>
        ),
      },
    },
  ]


return(

<Card>
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
      </Card.Description>

    </Card.Content>

    <Card.Content extra>
      <a>
        <Icon disabled name='users' />
         Member of {props.length} Groups
      </a>
      <Accordion defaultActiveIndex={0} panels={panels} />

    </Card.Content>

  </Card>)

}

export default CustomCard;