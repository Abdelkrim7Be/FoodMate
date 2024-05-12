module.exports = (temp, product) => {
  // So basically here we replace the placeholder that exists in a givern template with data retrieved from the Json file
  let output = temp.replace(/{% PRODUCTNAME %}/g, product.productName);
  output = output.replace(/{% IMAGE %}/g, product.image);
  output = output.replace(/{% PRICE %}/g, product.price);
  output = output.replace(/{% ORIGINS %}/g, product.from);
  output = output.replace(/{% NUTRIENTS %}/g, product.nutrients);
  output = output.replace(/{% QUANTITY %}/g, product.quantity);
  output = output.replace(/{% ID %}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{% NOT-ORGANIC %}/g, "not-organic");
  }

  return output;
};
