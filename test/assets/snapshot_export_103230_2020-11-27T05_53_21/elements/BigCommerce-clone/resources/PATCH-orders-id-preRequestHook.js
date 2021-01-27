var request = request_body_map;

if(request && request.shipping_addresses && !Array.isArray(request.shipping_addresses)){
  let new_shipping_addresses = [];
  new_shipping_addresses.push(request.shipping_addresses);
  request['shipping_addresses'] = new_shipping_addresses;
} 

if(request && request.order_products){
  request['products'] = request.order_products;
  delete request.order_products;
}

done({
  request_vendor_body: request 
});
