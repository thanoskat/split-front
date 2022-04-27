import IonIcon from '@reacticons/ionicons'

const Label = ({ text, color, icon, selected, onClick }) => {
  return(
    <div
    className={`label ${selected ? 'selected' : 'deselected' } flex row shadow pointer t5 alignitems-center regular`}
    style={selected ? {backgroundColor: color, borderColor: color} : {color: color, borderColor: color}}
    onClick={onClick}>
      {text}
      {icon && <IonIcon name={icon}/>}
    </div>
  )
}

export default Label
