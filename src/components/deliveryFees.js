import { useState, useEffect } from 'react'
import axios from 'axios';
import { Add, Close, Delete, Edit } from '@material-ui/icons';

function DeliveryFeeCard({ props, saveDeliveryFee, newDeliveryPrice }) {
    let [state, setState] = useState({
        state: "",
        area: "",
        price: "",
        _id: "",
    });
    function handleInput(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        if (!newDeliveryPrice) {
            setState({
                ...state,
                state: props.state,
                area: props.area,
                price: props.price,
                _id: props._id
            })
        }
    }, [])

    return (<div styles={{ padding: "0 0 20px 0" }}>
        <div className="deliveryFeeCard">
            <div className="inputs">
                <input placeholder="State" value={state.state} name="state" onChange={handleInput} />
                <input placeholder="Area" value={state.area} name="area" onChange={handleInput} />
                <input placeholder="Price" type="number" value={state.price} name="price" onChange={handleInput} />
            </div>
            <div className="buttons">
                <button onClick={() => {
                    saveDeliveryFee({
                        _id: state._id,
                        state: state.state,
                        area: state.area,
                        price: state.price
                    }, newDeliveryPrice)
                }}>Save</button>
            </div>
        </div>
    </div>
    )
}

function BlankCard({ props, deleteDeliveryFee, switchToEdit }) {
    return <div className="blankCard">
        <p>{props.state}</p>
        <p>{props.area}</p>
        <p>{props.price}</p>
        <Edit onClick={() => { switchToEdit(props) }} />
        <Delete onClick={() => { deleteDeliveryFee(props._id) }} />
    </div>
}

let api, store;

export default function DeliveryFees({ baseURL, showLoginAgain }) {

    let [state, setState] = useState({
        deliveryFees: [],
        selectedCard: {},
        createOrEdit: false
    })

    async function switchToEdit(fee) {
        await setState({ ...state, createOrEdit: true, selectedCard: fee })
    }

    async function checkAuth(err) {
        if (err.message.includes("401")) {
            showLoginAgain();
        } if (err.message.includes("422")) {
            alert("Record already exists")
        }
    }

    async function saveDeliveryFee(props, fresh) {
        if (props.state && props.area && props.price) {
            if (fresh) {
                api.post(baseURL + '/deliveryFees', props)
                    .then(async res => {
                        getDeliveryFees()
                    })
                    .catch(err => {
                        checkAuth(err)
                    })
            } else {
                if (window.confirm("Are you sure you want to update this record?")) {
                    api.patch(baseURL + '/deliveryFees', props)
                        .then(res => {
                            getDeliveryFees()
                        })
                        .catch(err => {
                            checkAuth(err)
                        })
                }
            }
        }
        else { alert("Please fill all the fields") }
    }

    async function deleteDeliveryFee(id) {
        if (window.confirm("Are You Sure You Want to Delete Delivery Fee?")) {
            api.delete(baseURL + '/deliveryFees' + "/" + id)
                .then(res => {
                    getDeliveryFees()
                }).catch(err => {
                    checkAuth(err)
                })
        }
    }

    async function getDeliveryFees() {
        api.get(baseURL + '/deliveryFees')
            .then(async res => {
                setState({
                    ...state, deliveryFees: res.data.fees,
                    selectedCard: {},
                    createOrEdit: false
                });
            })
            .catch(err => { console.log(err) })
    }

    useEffect(() => {
        const ac = new AbortController();
        store = JSON.parse(window.localStorage.getItem("teenahStores"));
        if (store) {
            api = axios.create({
                url: baseURL,
                headers: { Authorization: `Bearer ${store.token}` },
            });
            getDeliveryFees();
        }
        return () => ac.abort();
    }, []);


    return (
        <div className="deliveryFeesRoot">
            <div className="headerDiv">
                <h3>Manage delivery locations and pricing</h3>
            </div>
            <div className="deliveryFeesContainer">
                {
                    state.createOrEdit ? <DeliveryFeeCard props={state.selectedCard}
                        saveDeliveryFee={saveDeliveryFee}
                        newDeliveryPrice={!Boolean(state.selectedCard.state)} /> :
                        state.deliveryFees.map((deliveryFee, index) => {
                            return <BlankCard key={index} props={deliveryFee}
                                deleteDeliveryFee={deleteDeliveryFee}
                                switchToEdit={switchToEdit} />
                        })
                }
            </div>

            <div className="addNew"
                onClick={() => {
                    state.createOrEdit
                        ? setState({ ...state, createOrEdit: false, selectedCard: {} })
                        : setState({ ...state, createOrEdit: true })

                }}>
                {state.createOrEdit ? <Close /> : <Add />}
            </div>
        </div>)
}