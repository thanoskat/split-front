import { Outlet, } from 'react-router-dom'
import { useSelector } from 'react-redux'
import currency from 'currency.js'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import { useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { SettleUp, BreakDown } from '.'

const TabMembers = () => {
  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [menuParams, setMenuParams] = useState({
    openBreakDown: false,
    open: false,
    amount: null,
    receiverName: '',
    receiverId: '',
    senderName: '',
    senderId: ''
  })

  // console.log(menuParams)
  // Array.prototype.move = function (from, to) {
  //   this.splice(to, 0, this.splice(from, 1)[0]);
  // };

  const memberInfoConstructor = (selectedGroup) => {
    let members = []
    selectedGroup?.members.forEach((member) => {
      let pendingTotalAmount = currency(0)
      let total = currency(0)
      let toFrom = []
      let isSenderReceiverSettled
      const isGuest = member.guest
      selectedGroup.expenses.forEach(expense => {
        if (expense.spender._id === member._id) {
          total = total.add(expense.amount)
        }
      })
      selectedGroup.pendingTransactions.forEach((tx) => {
        if (tx.sender?._id === member?._id) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          toFrom.push({ _id: tx.receiver._id, name: tx.receiver.nickname, amount: tx.amount })
          isSenderReceiverSettled = 1 //sender->1
        } else if (tx.receiver._id === member._id) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          toFrom.push({ _id: tx.sender?._id, name: tx.sender?.nickname, amount: tx.amount })
          isSenderReceiverSettled = 2 //receiver->2
        }
      })
      members.push({
        _id: member._id,
        name: member.nickname,
        isSenderReceiverSettled,
        toFrom,
        pendingTotalAmount: pendingTotalAmount.value,
        totalSpent: total.value,
        isGuest: isGuest
      })
    })
    return (members)
  }

  const memberInfo = memberInfoConstructor(selectedGroup)
  const userNoMembers = memberInfo.filter(member => member._id === sessionData.userId)
  const membersNoUser = memberInfo.filter(member => member._id !== sessionData.userId)

  const Tree = ({ toFrom, isSenderReceiverSettled, id, isGuest, name }) => {

    return (
      <div className='tree' style={{ bottom: '10px', margin: '0 0 -15px 0' }}>
        <ul>
          {toFrom?.map((member, index) => (
            <li key={member._id}>
              {isSenderReceiverSettled === 1 ?
                <div className='flex row justcont-spacebetween'>
                  <div className='flex row alignitems-center whiteSpace-initial'>
                    <div style={{ color: 'var(--pink)' }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;
                    </div> to &nbsp;
                    {member._id === sessionData.userId ? <strong>You</strong> : <strong>{member.name}</strong>}
                  </div>
                  &nbsp;
                  {id === sessionData.userId || isGuest ?  //only show buttons in You or guest section
                    <div id='settleUp-pill' className='pointer shadow'
                      onClick={() => setMenuParams({
                        open: true,
                        amount: member.amount,
                        receiverId: member._id,
                        receiverName: member.name,
                        senderId: id,
                        senderName: name
                      })}>Settle Up</div> : ''}
                </div>
                : isSenderReceiverSettled === 2 ?

                  <div className='flex row alignitems-center justcont-spacebetween'>
                    <div className='flex row alignitems-center'>
                      <div style={{ color: 'var(--green)' }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;
                      </div>
                      <div>
                        from
                      </div>
                      &nbsp;
                      {member._id === sessionData.userId ? <strong>You</strong> : <strong>{member.name}</strong>}
                    </div>
                    {index === toFrom.length - 1 && id === sessionData.userId ?

                      <div id='settleUp-pill' className='pointer shadow' onClick={() => setMenuParams({ openBreakDown: true })} >
                        <div className='flex row justcont-spacebetween gap6'>
                          <i className='pie chart icon'></i>
                          <div>Breakdown</div>
                        </div>
                      </div>

                      : ""}
                  </div>
                  : <></>}
            </li>))}
        </ul>
      </div >
    )
  }

  const Member = ({ id, name, isSenderReceiverSettled, toFrom, pendingTotalAmount, totalSpent, isGuest }) => {
    //console.log(name, id)
    return (
      <div id='expense' className={`flex column`}>
        <div className='nameIDandTotal flex row justcont-spacebetween'>
          <div className='name-ID flex row gap8 alignitems-center '>
            <div className='name medium t25 white'>
              {id === sessionData.userId ? 'You' : isGuest ?
                <div className='flex row alignitems-center'>
                  {name}&nbsp;
                  <div style={{ fontSize: '13px', color: 'var(--label-color-6)' }}>
                    Guest
                  </div>
                </div> :
                name}
            </div>
          </div>
          <div >
            Total spent
          </div>
        </div>
        <div className=' flex row justcont-spacebetween alignitems-center'>
          {isSenderReceiverSettled === 1 ?
            <div className=' flex row alignitems-center'>
              {id === sessionData.userId ? 'owe' : 'owes'}<div style={{ color: 'var(--pink)' }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp; </div>
              {toFrom.length === 1 ? <div>to {String(toFrom[0]._id) === String(sessionData.userId) ? <strong>You</strong> : <strong>{toFrom[0].name}</strong>} &nbsp;</div> : <div>in total &nbsp;</div>}
            </div> : isSenderReceiverSettled === 2 ?
              <div className='flex row alignitems-center' >
                {id === sessionData.userId ? 'are owed' : 'is owed'}<div style={{ color: 'var(--green)' }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div>
                {toFrom.length === 1 ? <div>from {String(toFrom[0]._id) === String(sessionData.userId) ? <strong>You</strong> : <strong>{toFrom[0].name}</strong>} &nbsp;</div> : <div>in total &nbsp;</div>}
              </div> :
              <div className='flex row alignitems-center'>
                <div>
                  {id === sessionData.userId ? 'are' : 'is'} settled
                </div>
                <IonIcon name='checkmark-sharp' className='t1' style={{ color: 'var(--green)', fontSize: '22px', fontWeight: '500' }} />
              </div>}
          <div className=' medium t25 white'>
            {` ${currency(totalSpent, { symbol: '€', decimal: ',', separator: '.' }).format()}`}
          </div>
        </div>
        {isSenderReceiverSettled === 2 && toFrom.length === 1 && id === sessionData.userId ?
          <div className='flex justcont-start'>
            <div id='settleUp-pill' className='pointer shadow'>
              <div className='flex row justcont-spacebetween gap6'>
                <i className='pie chart icon'></i>
                <div>Breakdown</div>
              </div>
            </div>
          </div> : ""}

        {(id === sessionData.userId && isSenderReceiverSettled === 1 && toFrom.length === 1) || (isGuest && isSenderReceiverSettled === 1 && toFrom.length === 1) ?
          <div className='flex justcont-spacebetween'>
            <div id='settleUp-pill' className='pointer shadow' onClick={() =>
              setMenuParams({
                open: true,
                amount: toFrom[0].amount,
                receiverId: toFrom[0]._id,
                receiverName: toFrom[0].name,
                senderId: id,
                senderName: name
              })}>Settle Up</div>
            {id === sessionData.userId ? <div id='settleUp-pill' className='pointer shadow'>
              <div className='flex row justcont-spacebetween gap6'>
                <i className='pie chart icon'></i>
                <div>Breakdown</div>
              </div>
            </div> : ""}
          </div>
          : ''}
        {toFrom.length === 1 || isSenderReceiverSettled === undefined ? <></> :
          <Tree
            id={id}
            name={name}
            toFrom={toFrom}
            isSenderReceiverSettled={isSenderReceiverSettled}
            isGuest={isGuest} />
        }
        {toFrom.length > 1 && isSenderReceiverSettled === 1 && id === sessionData.userId ?
          <div className='flex justcont-start'>
            <div id='settleUp-pill' className='pointer shadow'>
              <div className='flex row justcont-spacebetween gap6'>
                <i className='pie chart icon'></i>
                <div>Breakdown</div>
              </div>
            </div>
          </div> : ""}
      </div>
    )
  }

  return (
    <div className='flex flex-1 column overflow-hidden'>
      <div id='expenses' className='flex flex-1 column overflow-auto'>
        {userNoMembers.map((member) => (
          <div key={member._id} className='overflow-visible'>
            <Member
              key={member._id}
              id={member._id}
              name={member.name}
              isSenderReceiverSettled={member.isSenderReceiverSettled}
              toFrom={member.toFrom}
              pendingTotalAmount={member.pendingTotalAmount}
              totalSpent={member.totalSpent} />
          </div>
        ))}
        {membersNoUser.map((member) => (
          <div key={member._id} className='overflow-visible'>
            <Member
              key={member._id}
              id={member._id}
              name={member.name}
              isSenderReceiverSettled={member.isSenderReceiverSettled}
              toFrom={member.toFrom}
              pendingTotalAmount={member.pendingTotalAmount}
              totalSpent={member.totalSpent}
              isGuest={member.isGuest} />
          </div>

        ))}

        <div style={{ marginBottom: '80px' }}>
        </div>
      </div>
      <Outlet />
      <CSSTransition
        onClick={() => setMenuParams({ open: false })} //this simply adds dark background
        in={menuParams.open === true}
        timeout={0}
        unmountOnExit
      >
        <div style={{
          position: 'fixed',
          height: '100%',
          width: '100%',
          top: '0px',
          right: '0px',
          backgroundColor:
            'black',
          opacity: '0.7'
        }}
        />
      </CSSTransition>

      <CSSTransition
        in={menuParams.open === true}
        timeout={300}
        classNames='bottomslide'
        unmountOnExit
      >
        <SettleUp
          setMenuParams={setMenuParams}
          name={menuParams.receiverName}
          amount={menuParams.amount}
          receiverId={menuParams.receiverId}
          senderName={menuParams.senderName}
          senderId={menuParams.senderId}
        />
      </CSSTransition>

      <CSSTransition
        in={menuParams.openBreakDown === true}
        timeout={0}
        unmountOnExit
      >
        <BreakDown 
        setMenuParams={setMenuParams}
        />
      </CSSTransition>

    </div>
  )
}

export default TabMembers
