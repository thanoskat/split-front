import { Outlet, } from 'react-router-dom'
import { useSelector } from 'react-redux'
import currency from 'currency.js'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import { useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import useAxios from '../utility/useAxios'
import { SettleUp, BreakDown } from '.'

const TabMembers = () => {

  const api = useAxios()
  const abortControllerRef = useRef(null)
  const sessionData = store.getState().authReducer.sessionData
  const toggle = useSelector(state => state.mainReducer.toggle)
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [menuParams, setMenuParams] = useState({
    openBreakDown: false,
    open: false,
    amount: null,
    receiverName: '',
    receiverId: '',
    senderName: '',
    senderId: ''
  })

  const getGroupPendingTransactions = async () => {
    //setIsloading(true)
    try {
      const response = await api.post('/transaction/pending', { groupId: selectedGroup.id }, { signal: abortControllerRef.current.signal });
      setPendingTransactions(response.data)
      console.log("rendered members ",response)
      //setIsloading(false)
    }
    catch (error) {
      //setIsloading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    getGroupPendingTransactions()
    return () => {

      abortControllerRef.current.abort()
    }
  }, [toggle])

  const userStatus = {
    SENDER: 1,
    RECEIVER: 2,
    SETTLED: 0
  }

  const memberInfoConstructor = (selectedGroup) => {
    let members = []
    selectedGroup?.members.forEach((member) => {

      let pendingTotalAmount = currency(0)
      let total = currency(0)
      let transactionMemberDetails = []
      let status
      const isGuest = member.memberType === "Guest"

      pendingTransactions.forEach((tx) => {
        if (tx.senderId === member?.memberId) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          transactionMemberDetails.push({ id: tx.receiverId, name: tx.receiverName, amount: tx.amount })
          status = userStatus.SENDER  //sender->1
        } else if (tx.receiverId === member.memberId) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          transactionMemberDetails.push({ id: tx.senderId, name: tx.senderName, amount: tx.amount })
          status = userStatus.RECEIVER  //receiver->2
        }
      })
      members.push({
        memberId: member.memberId,
        name: member.name,
        status,
        transactionMemberDetails,
        pendingTotalAmount: pendingTotalAmount.value,
        totalSpent: 0, //total.value,
        isGuest: isGuest
      })
    })
    return (members)
  }

  const memberInfo = memberInfoConstructor(selectedGroup)
  const userNoMembers = memberInfo.filter(member => member.memberId === sessionData.userId)
  const membersNoUser = memberInfo.filter(member => member.memberId !== sessionData.userId)


  const Tree = ({ transactionMemberDetails, status, id, isGuest, name }) => {

    return (
      <div className='tree' style={{ bottom: '10px', margin: '0 0 -15px 0' }}>
        <ul>
          {transactionMemberDetails?.map((transactionMember, index) => (
            <li key={transactionMember.id}>
              {status === userStatus.SENDER ?
                <div className='flex row justcont-spacebetween'>
                  <div className='flex row alignitems-center whiteSpace-initial'>
                    <div style={{ color: 'var(--pink)' }}>{` ${currency(transactionMember.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;
                    </div> to &nbsp;
                    {selectedGroup.members.find(member => member.memberId === transactionMember.id).userId === sessionData.userId ? <strong>You</strong> : <strong>{transactionMember.name}</strong>}
                  </div>
                  &nbsp;
                  {selectedGroup.members.find(member => member.memberId === transactionMember.id).userId === sessionData.userId || isGuest ?  //only show buttons in You or guest section
                    <div id='settleUp-pill' className='pointer shadow'
                      onClick={() => setMenuParams({
                        open: true,
                        amount: transactionMember.amount,
                        receiverId: transactionMember.id,
                        receiverName: transactionMember.name,
                        senderId: id,
                        senderName: name
                      })}>Settle Up</div> : ''}
                </div>
                : status === userStatus.RECEIVER ?

                  <div className='flex row alignitems-center justcont-spacebetween'>
                    <div className='flex row alignitems-center'>
                      <div style={{ color: 'var(--green)' }}>{` ${currency(transactionMember.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;
                      </div>
                      <div>
                        from
                      </div>
                      &nbsp;
                      {selectedGroup.members.find(member => member.memberId === transactionMember.id).userId === sessionData.userId ? <strong>You</strong> : <strong>{transactionMember.name}</strong>}
                    </div>
                    {index === transactionMemberDetails.length - 1 && selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ?

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

  const Member = ({ id, name, status, transactionMemberDetails, pendingTotalAmount, totalSpent, isGuest }) => {
    //console.log(name, id)
    return (
      <div id='expense' className={`flex column`}>
        <div className='nameIDandTotal flex row justcont-spacebetween'>
          <div className='name-ID flex row gap8 alignitems-center '>
            <div className='name medium t25 white'>
              {selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ? 'You' : isGuest ?
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
          {status === userStatus.SENDER ?
            <div className=' flex row alignitems-center'>
              {selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ? 'owe' : 'owes'}<div style={{ color: 'var(--pink)' }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp; </div>
              {transactionMemberDetails.length === 1 ? <div>to {String(selectedGroup.members.find(member => member.memberId === transactionMemberDetails[0].id).userId) === String(sessionData.userId) ? <strong>You</strong> : <strong>{transactionMemberDetails[0].name}</strong>} &nbsp;</div> : <div>in total &nbsp;</div>}
            </div> : status === userStatus.RECEIVER ?
              <div className='flex row alignitems-center' >
                {selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ? 'are owed' : 'is owed'}<div style={{ color: 'var(--green)' }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div>
                {transactionMemberDetails.length === 1 ? <div>from {String(selectedGroup.members.find(member => member.memberId === transactionMemberDetails[0].id).userId) === String(sessionData.userId) ? <strong>You</strong> : <strong>{transactionMemberDetails[0].name}</strong>} &nbsp;</div> : <div>in total &nbsp;</div>}
              </div> :
              <div className='flex row alignitems-center'>
                <div>
                  {selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ? 'are' : 'is'} settled
                </div>
                <IonIcon name='checkmark-sharp' className='t1' style={{ color: 'var(--green)', fontSize: '22px', fontWeight: '500' }} />
              </div>}

          <div className=' medium t25 white'>
            {` ${currency(totalSpent, { symbol: '€', decimal: ',', separator: '.' }).format()}`}
          </div>

        </div>
        {status !== userStatus.SENDER && status !== userStatus.RECEIVER && selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ?
          <div className='flex justcont-start'>
            <div id='settleUp-pill' className='pointer shadow' onClick={() => setMenuParams({ openBreakDown: true })}>
              <div className='flex row justcont-spacebetween gap6'>
                <i className='pie chart icon'></i>
                <div>Breakdown</div>
              </div>
            </div>
          </div> : ""}

        {status === userStatus.RECEIVER && transactionMemberDetails.length === 1 && selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ?
          <div className='flex justcont-start'>
            <div id='settleUp-pill' className='pointer shadow' onClick={() => setMenuParams({ openBreakDown: true })}>
              <div className='flex row justcont-spacebetween gap6'>
                <i className='pie chart icon'></i>
                <div>Breakdown</div>
              </div>
            </div>
          </div> : ""}

        {(selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId && status === userStatus.SENDER && transactionMemberDetails.length === 1) || (isGuest && status === userStatus.SENDER && transactionMemberDetails.length === 1) ?
          <div className='flex justcont-spacebetween'>
            <div id='settleUp-pill' className='pointer shadow' onClick={() =>
              setMenuParams({
                open: true,
                amount: transactionMemberDetails[0].amount,
                receiverId: transactionMemberDetails[0].id,
                receiverName: transactionMemberDetails[0].name,
                senderId: id,
                senderName: name
              })}>Settle Up</div>
            {selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ? <div id='settleUp-pill' className='pointer shadow'>
              <div className='flex row justcont-spacebetween gap6' onClick={() => setMenuParams({ openBreakDown: true })}>
                <i className='pie chart icon'></i>
                <div>Breakdown</div>
              </div>
            </div> : ""}
          </div>
          : ''}
        {transactionMemberDetails.length === 1 || status === userStatus.SETTLED ? <></> : //status === undefined
          <Tree
            id={id}
            name={name}
            transactionMemberDetails={transactionMemberDetails}
            status={status}
            isGuest={isGuest} />
        }
        {transactionMemberDetails.length > 1 && status === userStatus.SENDER && selectedGroup.members.find(member => member.memberId === id).userId === sessionData.userId ?
          <div className='flex justcont-start'>
            <div id='settleUp-pill' className='pointer shadow' onClick={() => setMenuParams({ openBreakDown: true })}>
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
          <div key={member.memberId} className='overflow-visible'>
            <Member
              key={member.memberId}
              id={member.memberId}
              name={member.name}
              status={member.status}
              transactionMemberDetails={member.transactionMemberDetails}
              pendingTotalAmount={member.pendingTotalAmount}
              totalSpent={member.totalSpent} />
          </div>
        ))}
        {membersNoUser.map((member) => (
          <div key={member.memberId} className='overflow-visible'>
            <Member
              key={member.memberId}
              id={member.memberId}
              name={member.name}
              status={member.status}
              transactionMemberDetails={member.transactionMemberDetails}
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
