import "./addexpensemodal.css";
import React from 'react'

export default function AddExpenseModal({ showExp, onCloseExp }) {


    const addExp = async () => {

        try {
            if ("res.status === 200") {

                onCloseExp()

            }
        } catch (error) {
            console.dir(error)
        }
    }

    if (!showExp) {
        return null
    }
    return (
        <div className="addexp-modal" onClick={onCloseExp}>
            <form>
                <div className="addexp-content" onClick={e => e.stopPropagation()}>
                    <div className="addexp-header">
                        <h4 className="addexp-title">Add expense</h4>
                        <button className="addexp-exit-button" onClick={onCloseExp}>
                            <i className="times icon x"></i>
                        </button>
                    </div>
                    <div className="addexp-body">
                        <div className="addexp-amount">
                            <label for="amnt">Amount</label>
                            <input type="text" id="amnt" name="amount" placeholder="Amount..." />

                        </div>
                        <div className="addexp-description">
                            <label for="descr">Description</label>
                            <input type="text" id="descr" name="description" placeholder="Description..." />
                        </div>

                    </div>
                    <div className="addexp-decision-buttons">
                        <button className="addexp-decison-button" onClick={addExp}>Add Expense</button>
                        <button className="addexp-decison-button" onClick={onCloseExp}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
