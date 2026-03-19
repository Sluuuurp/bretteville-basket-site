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
        <div class='border-y border-gray-400 py-1'>
          <span class='font-bold'>${item.name}</span>&nbsp; - &nbsp; Taille:&nbsp; <span class='font-bold'>${item.size}</span>&nbsp;&nbsp; | &nbsp;&nbsp; Qte:&nbsp; <span class='font-bold'>${item.quantity}</span> &nbsp;&nbsp; | &nbsp;&nbsp; ${item.price * item.quantity}€  &nbsp; &nbsp; &nbsp;

          <input type="hidden" name="items[${index}][articleId]" value="${item.articleId}">
          <input type="hidden" name="items[${index}][size]" value="${item.size}">
          <input type="hidden" name="items[${index}][quantity]" value="${item.quantity}">

          <button type="button" class="remove-item bg-red-500 text-sm px-1 rounded text-white" data-id="${item.id}">✕ </button>
        </div>
      `
      )

      document.querySelectorAll('.remove-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          removeItem(Number(btn.dataset.id))
        })
      })
    })
    document.getElementById('cart-total').textContent = `Total : ${totalCart} €`
  }

  function removeItem(id) {
    const index = cart.findIndex((item) => item.id === id)
    if (index !== -1) {
      cart.splice(index, 1)
    }
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
          id: Date.now() + Math.random(),
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
