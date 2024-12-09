const currentPath = window.location.pathname;
let cart = [];

// Function to add items to the cart
function addItem(nameofitem, quantofitem, price) {
  // Create a cart object
  let item = {
    description: nameofitem,
    quantity: quantofitem,
    price: price,
    total: quantofitem * price
  };
  cart.push(item);
  // Save cart in sessionStorage to persist it across pages
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the total amount
function updateTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.total;
  });
  total = total.toFixed(2);
  console.log(total)
  // document.getElementById('invoice-total').innerHTML = `${total.toFixed(2)}`;
  sessionStorage.setItem('total',total)
}

// Event handling when on the "index.html" page
if (currentPath.includes("index.html")) {
  // Add to Cart Section
  const buttoncart = document.querySelectorAll('.btn-cart');
  const price = document.querySelectorAll('.price');
  const bill = document.getElementsByClassName('cta-button')[0];

  buttoncart.forEach((Element) => {
    Element.addEventListener('click', (event) => {
      event.preventDefault();

      let pricevalue = Number(Element.parentElement.previousElementSibling.innerHTML.slice(1));  // Extract price value
      let nameofitem = Element.parentElement.parentElement.firstElementChild.innerHTML;  // Get the item name
      let quantofitem = 1;  // Default quantity of 1

      if (Element.innerHTML === 'Buy Now') {
        Element.innerHTML = 'Added in cart';
        Element.classList = 'onclick-button';

        // Add item to the cart
        addItem(nameofitem, quantofitem, pricevalue);

        updateTotal(); // Update total after adding the item
        console.log(cart);
      } else {
        Element.innerHTML = 'Buy Now';
        Element.classList = 'btn-cart';
        
        // Find the item index and remove it from the cart
        let itemIndex = cart.findIndex(item => item.description === nameofitem);
        if (itemIndex !== -1) {
          cart.splice(itemIndex, 1);
          sessionStorage.setItem('cart', JSON.stringify(cart));  // Update cart in sessionStorage
          updateTotal(); // Recalculate and update total
        }
      }
    });
  });

  // Checkout Section - Proceed to Billing
  bill.addEventListener('click', (event) => {
    event.preventDefault();
    if (cart.length > 0) {
      // Store the total in sessionStorage
      sessionStorage.setItem('total', JSON.stringify(cart.reduce((total, item) => total + item.total, 0)));
      window.location.href = "/billing.html";  // Redirect to billing page
    } else {
      alert("Your cart is empty!");
    }
  });
} 

// Event handling when on the "billing.html" page
else if (currentPath.includes("billing.html")) {
  // Retrieve cart data from sessionStorage
  cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
  const cartContainer = document.getElementById('invoice-items');
  
  // Function to display cart items in the invoice table
  function displayCartItems() {
    cartContainer.innerHTML = ''; // Clear previous content
    cart.forEach((item, index) => {
      let cartItemHTML = `
        <tr class="cart-item">
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
        </tr>
      `;
      cartContainer.innerHTML += cartItemHTML;
    });
  }

  // Display cart items and total on the billing page
  displayCartItems();
  updateTotal();

  // Event listener for removing items from the cart
  const removeButtons = document.querySelectorAll('.remove-item');
    document.getElementById('invoice-total').innerHTML = `${sessionStorage.getItem('total')}`;
  removeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      // Remove item from cart array
      cart.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(cart));  // Update cart in sessionStorage
      displayCartItems();  // Refresh cart display
      updateTotal(); // Update total
    });
  });

}
