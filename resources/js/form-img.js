export function formImg() {
  // Preview image(s)
  document.addEventListener('DOMContentLoaded', () => {
    // Single image
    const imageInput = document.getElementById('image-input')
    const previewContainer = document.getElementById('image-preview')

    if (imageInput && previewContainer) {
      imageInput.addEventListener('change', (e) => {
        previewContainer.innerHTML = '' // Reset

        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const img = document.createElement('img')
            img.src = event.target.result
            img.className = 'w-48 rounded border-2 border-gray-300'
            previewContainer.appendChild(img)
          }
          reader.readAsDataURL(file)
        }
      })
    }

    // Multiple images
    const imagesInput = document.getElementById('images-input')
    const addImagesBtn = document.getElementById('add-images-btn')
    const imagesPreviewContainer = document.getElementById('images-preview')
    const dropZone = document.getElementById('drop-zone')

    if (imagesInput && imagesPreviewContainer) {
      let selectedFiles = []
      // Réinitialise l'input pour permettre de sélectionner le même fichier à nouveau
      imagesInput.addEventListener('click', () => {
        imagesInput.value = ''
      })
      // Quand l'input change
      imagesInput.addEventListener('change', (e) => {
        // Fusionne les nouveaux fichiers avec les anciens (au lieu de remplacer)
        selectedFiles = [...selectedFiles, ...Array.from(e.target.files)]
        updateImagesPreview()
        updateFileInput()
      })

      // Drag and drop
      if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault()
          dropZone.classList.add('border-blue-500', 'bg-blue-50')
        })

        dropZone.addEventListener('dragleave', () => {
          dropZone.classList.remove('border-blue-500', 'bg-blue-50')
        })

        dropZone.addEventListener('drop', (e) => {
          e.preventDefault()
          dropZone.classList.remove('border-blue-500', 'bg-blue-50')

          const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith('image/')
          )

          if (files.length > 0) {
            selectedFiles = [...selectedFiles, ...files]
            updateImagesPreview()
            updateFileInput()
          }
        })
      }

      function updateImagesPreview() {
        imagesPreviewContainer.innerHTML = '' // Reset

        selectedFiles.forEach((file, index) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            // Wrapper pour l'image
            const wrapper = document.createElement('div')
            wrapper.className = 'relative'

            // Image
            const img = document.createElement('img')
            img.src = event.target.result
            img.className = 'w-32 h-32 object-cover rounded border-2 border-gray-300'

            // Bouton delete
            const deleteBtn = document.createElement('button')
            deleteBtn.type = 'button'
            deleteBtn.innerHTML = '✕'
            deleteBtn.className =
              'absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700'
            deleteBtn.addEventListener('click', (e) => {
              e.preventDefault()
              selectedFiles.splice(index, 1) // Supprime du tableau
              updateImagesPreview() // Rafraîchit
              updateFileInput() // Met à jour l'input
            })

            wrapper.appendChild(img)
            wrapper.appendChild(deleteBtn)
            imagesPreviewContainer.appendChild(wrapper)
          }
          reader.readAsDataURL(file)
        })
      }

      function updateFileInput() {
        // Crée un nouveau FileList avec les fichiers restants
        const dataTransfer = new DataTransfer()
        selectedFiles.forEach((file) => dataTransfer.items.add(file))
        imagesInput.files = dataTransfer.files
      }
    }
  })
}
