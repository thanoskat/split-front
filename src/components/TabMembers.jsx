const TabMembers = () => {



  const Member = ({name})=>{
    return(
      <div className='member flex column justcont-spacebetween gap8'>
      {name}
      </div>
    )
  }



  return (
    <div className='flex flex-1 column overflow-hidden '>
      <div className='t4 flex row justcont-spacebetween'>
      </div>

      <div className='expenses-tab t5  top-radius flex flex-1 column overflow-hidden'>
        <div className='overflow-auto'>
 
               <Member name={"Christos"}/>
                <div className='separator-2 padding0014' />

                <Member name={"Stratos"}/>
                <div className='separator-2 padding0014' />

          <div style={{ height: '120px' }} />
        </div>
      </div>
    </div>
  );
}

export default TabMembers;
