//constantes
const urlApi = 'http://localhost/Forem_Api/';
const trainingList = document.querySelector('.training_selection__select');
const profilInfo = document.querySelector('.profile_infos__table_add');
const trainingInfo = document.querySelector('.training_infos__table_add');
const evalInfo = document.querySelector('.my_evaluation__list_add');

let idUser = localStorage.id_user;
let idTraining;

//------------DECLARATION DES FONCTIONS--------------------
//----Fonction pour récupérer les training si inscrit
const GetTraining = async () => {
  try {
    let response = await fetch(urlApi + `inscription?id_user=${idUser}`);
    let info = await response.json();
    let template = '';
    //console.log(data);
    info.data.forEach(training => {
      template +=`
      <option value="${training.id_training}" class="training_selection__option">${training.label}</option>
      `
    });
    trainingList.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour récupérer les données user
const PrintTrainee = async () => {
  try {
    let response = await fetch(urlApi + 'user/' + idUser);
    let infos = await response.json();
    console.log(infos.data)
    let template = `
      <td>${infos.data[0].name}</td>
      <td>${infos.data[0].firstname}</td>
    `
    console.log(template)
    profilInfo.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour récupérer données training
const PrintTraining = async () => {
  try{
    let response = await fetch(urlApi + `training?id_training=${idTraining}`);
    let datas = await response.json();
    let template = `
      <td>${datas.data[0].start_date}</td>
      <td>${datas.data[0].organisation}</td>
      <td>${datas.data[0].firstname} ${datas.data[0].name}</td>
    `
    trainingInfo.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour récupérer les données des éval
const PrintEval = async () => {
  try {
    let response = await fetch(urlApi + `evaluation??id_user=${idUser}&id_training=${idTraining}`);
    let datas = await response.json();
    let template = '';
    datas.data.forEach(eval => {
      template += `
        <tr>
          <td>${eval.date_evaluation}</td>
          <td>${eval.analyse}</td>
          <td>${eval.interest}</td>
          <td>${eval.autonomy}</td>
          <td>${eval.criticism}</td>
          <td>${eval.organized}</td>
          <td>${eval.motivation}</td>
        </tr>
      `
    })
    evalInfo.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}


//--------------APPEL DES FONCTIONS--------------------------
GetTraining();
PrintTrainee();

//----déclencher affichage de la liste quand training sélectionné
trainingList.addEventListener('input', e => {
  idTraining = e.target.value;
  PrintTraining();
  PrintEval();
});