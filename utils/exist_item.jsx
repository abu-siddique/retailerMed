export default function existItem(cartItems, productID) {
    return cartItems.find(item => item.productID === productID);
  }