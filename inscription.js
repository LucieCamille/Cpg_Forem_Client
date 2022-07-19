//constantes
const urlApi = 'http://localhost/Forem_Api/';
const inscriptionForm = document.querySelector('.inscription__form');
const trainingList = document.querySelector('.inscription__training_select');
const searchTrainee = document.querySelector('.inscription__trainee_search');
const searchList = document.querySelector('.inscription__trainee_list');
const inscriptionList = document.querySelector('.inscription__list_container');

//variables pour cibler l'input de la query
let keyword = '';
let idTraining;
//console.log(keyword);

//---------------DECLARATION DES FONCTIONS---------------
//----Fonction pour récupérer les training
const GetTraining = async () => {
  try {
    let response = await fetch(urlApi + 'training');
    let data = await response.json();
    let template = '';
    //console.log(data);
    data.data.forEach(training => {
      template +=`
      <option value="${training.id_training}" class="inscription__training_option">${training.label}</option>
      `
    });
    trainingList.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour search un stagiaire
const GetTrainee = async () => {
  try {
    let response = await fetch(urlApi + `user?search=${keyword}&type=trainee`);
    let data = await response.json();
    //console.log(data);
    if(data.nb_hits > 0){
      let template = '';
      data.data.forEach(trainee => {
        template +=`
        <option data-id="${trainee.id_user}" value="${trainee.name} ${trainee.firstname}">
        `
      });
      //console.log(template);
      searchList.innerHTML = template;
    }
  }
  catch (error) {
    console.log(error)
  }
}

//console.log(searchList.querySelector('option[data-id]').dataset.id);

//----Fonction ajouter nouvelle inscription
const AddInscription = async () => {
  try {
    let response = await fetch(urlApi + 'inscription', {
      method: 'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify({
        id_training: trainingList.value,
        id_user: searchList.querySelector('option[data-id]').dataset.id,
        token: localStorage.token
      })
    })
    let data = await response.json();
    //console.log(data);
    if(data.code === 200){
      alert('New inscription');
      //window.location.href = 'addTraining.html';
    } else {
      alert('token error');
      window.location.href = 'connexion.html';
    }
  }
  catch(error) {
    console.log(error);
  }
};

//----Fonction pour afficher les inscrits dans la liste en dessus
const PrintInscription = async () => {
  try {
    let response = await fetch(urlApi + `inscription?id_training=${idTraining}`);
    let info = await response.json();
    let template = '';
    info.data.forEach(inscription => {
      template +=`
      <li data-id="${inscription.id_user}" class="inscription__list_item">${inscription.name} ${inscription.firstname}</li>
      `
    });
    inscriptionList.innerHTML = template;
  }
  catch(error) {
    console.log(error);
  }
}


//--------------APPEL DES FONCTIONS----------------

GetTraining();
//GetTrainee();

//----déclencher fonction search stagiaire quand keyup
searchTrainee.addEventListener('keyup', e => {
  //console.log(e);
  keyword = e.target.value;
  //console.log(keyword);
  if(keyword.length >= 2) {
    GetTrainee();
  };
  //console.log(searchList.querySelector('option[data-id]').dataset.id);
});

//----déclencher fonction nouvelle inscription quand form submit
inscriptionForm.addEventListener('submit', e => {
  e.preventDefault();
  AddInscription();
});
//----MIEUX déclencher fonction lors que click sur l'option (e.target.tagname('option'))


//----déclencher affichage de la liste quand training sélectionné
trainingList.addEventListener('input', e => {
  idTraining = e.target.value;
  console.log(idTraining);
  console.log(trainingList.value);
  PrintInscription();
})