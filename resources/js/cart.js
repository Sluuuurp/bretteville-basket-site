//*************************** Reservation *************************/
export function initCart() {
  const cart = []

  const cartContainer = document.getElementById('cart')

  const emptyCart = document.getElementById('empty-cart')

  function renderCart() {
    let totalCart = 0
    cartContainer.innerHTML = ''
    emptyCart.style.display = cart.length ? 'none' : 'block'
    cart.forEach((item, index) => {
      totalCart += item.price * item.quantity

      cartContainer.insertAdjacentHTML(
        'beforeend',
        `
        <div>
          ${item.name} - ${item.size} × ${item.quantity}

          <input type="hidden" name="items[${index}][articleId]" value="${item.articleId}">
          <input type="hidden" name="items[${index}][size]" value="${item.size}">
          <input type="hidden" name="items[${index}][quantity]" value="${item.quantity}">

          <button type="button" class="remove-item" data-index="${index}">✕</button>
        </div>
      `
      )

      document.querySelectorAll('.remove-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          removeItem(Number(btn.dataset.index))
        })
      })
    })
    document.getElementById('cart-total').textContent = `Total : ${totalCart} €`
  }

  function removeItem(index) {
    cart.splice(index, 1)
    renderCart()
  }

  //add au panier;

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.article-card')

      const articleId = card.dataset.id
      const name = card.dataset.name
      const price = Number(card.dataset.price)

      const size = card.querySelector('.select-size').value
      const quantity = Number(card.querySelector('.select-qty').value)

      const existingItem = cart.find((item) => item.articleId === articleId && item.size === size)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({
          articleId,
          name,
          size,
          quantity,
          price,
        })
      }

      renderCart()
    })
  })
}
