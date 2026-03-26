import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // messages génériques
  required: 'Le champ {{field}} est obligatoire',
  email: 'Le champ {{field}} doit être une adresse email valide',
  minLength: 'Le champ {{field}} doit contenir au moins {{min}} caractères',
  maxLength: 'Le champ {{field}} ne peut pas dépasser {{max}} caractères',
  confirmed: 'La confirmation de {{field}} ne correspond pas',
  alpha: 'Le champ {{field}} ne peut contenir que des lettres',
  numeric: 'Le champ {{field}} doit être un nombre',
  url: 'Le champ {{field}} doit être une URL valide',
  number: 'Le champ {{field}} doit être un nombre valide',
  min: 'Le champ {{field}} doit être supérieur ou égal à {{min}}',
  max: 'Le champ {{field}} doit être inférieur ou égal à {{max}}',
  string: 'Le champ {{field}} doit être une chaîne de caractères',
})
