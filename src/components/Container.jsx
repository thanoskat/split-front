import '../style/Container.css'


const Container = ({ children, className}) => {



  return (
    <div className={`container-component ${className}`}>{children}</div>
  )
}

export default Container
