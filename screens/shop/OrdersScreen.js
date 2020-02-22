import React, { useEffect, useState } from 'react';
import { FlatList, Text, Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { fetchOrders } from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  useEffect(()=>{
    const loadOrders = async() => {
      setLoading(true)
      await dispatch(fetchOrders())
      setLoading(false)
    }
    loadOrders();
  },[])

  const orders = useSelector(state => state.orders.orders);

  if(loading){
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  }

  if(orders.length<=0){
    return <View style={styles.centered}>
      <Text style={styles.msg}>No orders yet</Text>
    </View>
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  msg:{
    fontWeight:'bold'
  }
})

export default OrdersScreen;