import "../style/AddExpenseModal.css";
import React from 'react'
import useAxios from "../utility/useAxios"
import { useState, useEffect } from "react/cjs/react.development";

export default function AddExpenseModal({ showExp, onCloseExp, userInfoID }) {

    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("");
    const [groupID, setGroupID] = useState()

    const api = useAxios()

    //fetching first group by default. Without this function, on a single refresh of the app the Add Expense would not work because
    //it would not be able to pass the group ID to the child without clicking. We want this to happen automatically
    //hence the fetchGroupID function

    const fetchGroupID = async () => {
        const response = await api.get('/getusers/profile');
        setGroupID(response.data.groups[0]._id)
        console.log(response.data.groups[0]._id)
    }

    useEffect(() => {
        fetchGroupID()
    }, [])

    const addExp = async () => {
        onCloseExp()
        try {
            const addExpense = await api.post('/expense/addexpense', { userID: userInfoID, groupID: groupID, amount, description })
            return addExpense.status === 200

        } catch (error) {
            console.dir(error)
        }
    }

    if (!showExp) {
        return null
    }
    return (
        <div className="addexp-modal" onClick={onCloseExp}>

            <div className="addexp-content" onClick={e => e.stopPropagation()}>
                <div className="addexp-header">
                    <h4 className="addexp-title">Add expense</h4>
                    <button className="addexp-exit-button" onClick={onCloseExp}>
                        <i className="times icon x"></i>
                    </button>
                </div>
                <div className="addexp-body">

                    <div className="addexp-amount">
                        <div className="input-amount-section">
                            <input className="amnt" placeholder="Amount..."
                                onChange={event => { setAmount(event.target.value) }} />
                        </div>

                        <div className="currency-selector">
                            <select>
                                <option>$</option>
                                <option>£</option>
                                <option>€</option>
                                <option>¥</option>
                            </select>
                        </div>
                    </div>

                    <div className="addexp-description">
                        <div className="descr-amount-section">
                            <input className="descr" placeholder="Description..."
                                onChange={event => { setDescription(event.target.value) }} />
                        </div>
                        <div className="dummy">
                            <i className="pencil alternate icon"></i>
                        </div>
                    </div>


                </div>
                <div className="addexp-decision-buttons">
                    <button className="addexp-decison-button" type="submit" onClick={addExp} >Add Expense</button>
                    <button className="addexp-decison-button" type="button" onClick={onCloseExp}>Cancel</button>

                </div>

            </div>

        </div>
    )
}
