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

  document.getElementById('add-to-cart').addEventListener('click', () => {
    const articleSelect = document.getElementById('select-article')
    const articleId = articleSelect.value
    const name = articleSelect.options[articleSelect.selectedIndex].text
    const size = document.getElementById('select-size').value
    const price = Number(articleSelect.options[articleSelect.selectedIndex].dataset.price)
    const quantity = Number(document.getElementById('select-qty').value)

    const existingItem = cart.find((item) => item.articleId === articleId && item.size === size)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        articleId: articleId,
        name: name,
        size: size,
        quantity: quantity,
        price: price,
      })
    }

    renderCart()
  })
}
