import 'font-awesome/css/font-awesome.min.css';
import IonIcon from '@reacticons/ionicons';
var FontAwesome = require('react-fontawesome');

const TabExpense = ({ expenses }) => {

  const Expense = ({ description, amount, tags, spender, participants, timestamp }) => {
    return(
      <div className='expense flex column justcont-spacebetween'>
        <div className='flex row justcont-spacebetween'>
          <div className='t3 white'>{description}</div>
          <div className='t3 white'>{`$ ${amount}`}</div>
        </div>
        <div className='flex row justcont-flexstart' style={{ gap: '10px' }}>
          {/* <ExpenseTag text='Tickets' color='#6490E5'/> */}
          <ExpenseTag text='Tickets' color='#86dda0'/>
          <ExpenseTag text='Shopping' color='#F29A7E'/>
          <ExpenseTag text='Food' color='#FFE897'/>
        </div>
        <div className='flex row justcont-spacebetween'>
          <div className='flex row alignitems-center expense-stat'>
            <IonIcon name='person-sharp' className='t3 expense-stat-icon'/>
            {/* <i className='user icon expense-stat-icon'/> */}
            <span className='t5 expense-stat-text'>{spender}</span>
          </div>
          <div className='flex row alignitems-center expense-stat'>
            <IonIcon name='time' className='t3 expense-stat-icon'/>
            {/* <i className='clock icon expense-stat-icon'/> */}
            <span className='t5 expense-stat-text'>3 hours ago</span>
          </div>
          <div className='flex row alignitems-center expense-stat'>
            <IonIcon name='people-sharp' className='t3 expense-stat-icon'/>
            {/* <i className='users icon expense-stat-icon'/> */}
            <span className='t5 expense-stat-text'>{participants.length}</span>
          </div>
          <div className='flex row alignitems-center'>
            <IonIcon name='ellipsis-vertical' className='t3 expense-options-icon'/>
            {/* <i className='ellipsis vertical icon expense-options-icon'/> */}
          </div>
        </div>
      </div>
    )
  }

  const ExpenseTag = ({ text, color }) => {
    return(
      <div className='t5 expense-tag flex row shadow cursor-pointer' style={{ backgroundColor: `${color}` }}>
        {text}
      </div>
    )
  }

  return (
    <div className='expenses-tab t5 flex flex-1 column overflow-hidden'>
      <div className='overflow-auto'>
        {expenses?.map(expense => (
          <div key={expense._id}>
            <Expense
              description={expense._id.slice(expense._id.length - 15)}
              amount={expense.amount}
              spender={expense.sender.nickname}
              participants={expense.tobeSharedWith}
            />
            <div className='separator-2'/>
          </div>
        ))}
      <div className='expense'/>
      </div>
      <div className='floating-button cursor-pointer flex row shadow justcont-center alignitems-center'>
        {/* <i className='icon plus'/> */}
        {/* <i className='fa fa-plus'/> */}
        {/* <i className="fa fa-plus-circle"></i> */}
        {/* <FontAwesome
          className='super-crazy-colors'
          name='plus'
          size='lg'
        /> */}
        <IonIcon name='add' className='floating-button-icon'/>
        <div className='floating-button-text'>New</div>
      </div>
    </div>
  )
}

export default TabExpense;
