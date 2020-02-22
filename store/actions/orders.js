import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = "SET_ORDERS";

export const addOrder = (cartItems, totalAmount) => async (dispatch, getState) => {
  try {
    const userId = getState().auth.userId
    const token = getState().auth.token
    const today = new Date().toISOString()
    const res = await fetch(`https://native-shopapp-f4694.firebaseio.com/orders/${userId}.json?auth=${token}`,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date: today
      })
    })

    if(!res.ok){
      throw new Error('Something went wrong')
    }
    const data = await res.json();

    dispatch({
      type: ADD_ORDER,
      orderData: { id:data.name, items: cartItems, amount: totalAmount, date:today }
    });

  } catch (err) {
    throw err
  }
  
};

export const fetchOrders = () => async (dispatch, getState) => {
  try {
    const userId = getState().auth.userId
    const res = await fetch(`https://native-shopapp-f4694.firebaseio.com/orders/${userId}.json`);

    if(!res.ok){
      throw new Error('Something went wrong')
    }

    const orders = await res.json();
    const toLoad = [];
    for (let key in orders){
      toLoad.push(new Order(
        key,
        orders[key].cartItems, 
        orders[key].totalAmount, 
        new Date(orders[key].date),
      ))
    }
    dispatch({type: SET_ORDERS, orders: toLoad})

  } catch (err) {
    throw err
  }
}