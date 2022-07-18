const urlApi = 'http://localhost/Forem_Api/'
const connectForm = document.querySelector('.connexion')
const deconnectLink = document.querySelector('.nav_deconnect')

deconnectLink.addEventListener('click', (e) => {
  e.preventDefault()
  fetch(urlApi + 'deconnect')
    .then(response => response.json())
    .then(response => {
      console.log(response)
    })
    .catch(error => console.error(error))
})


connectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let userIdent = {
    email: connectForm.querySelector('.email').value,
    password: connectForm.querySelector('.password').value
  }
  //console.log(userIdent);
          
  fetch(urlApi + 'auth', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    //mode: 'no-cors',
    body: JSON.stringify(userIdent)
  })
  .then(response => response.json())
  .then(response => {
    console.log(response)
    if(response.code == 200) {
      localStorage.setItem('token', response.token);
      //localStorage.setItem('id_users', response.id_users);
    }
  })
  .catch(error => console.error(error))
            
})