//constantes
const urlApi = 'http://localhost/Forem_Api/';
const trainingList = document.querySelector('.training_selection__select');
const evaluationForm = document.querySelector('.evaluation')

let idJob;

//------------DECLARATION DES FONCTIONS--------------------
//----Fonction pour récupérer les training
const GetTraining = async () => {
  try {
    let response = await fetch(urlApi + 'training');
    let data = await response.json();
    let template = '';
    //console.log(data);
    data.data.forEach(training => {
      template +=`
      <option value="${training.id_job}" class="training_selection__option">${training.label}</option>
      `
    });
    trainingList.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour afficher les savoirs et comportements
const PrintQuestion = async () => {
  try {
    let response = await fetch(urlApi + `knowhow?id_job=${idJob}`);
    let info = await response.json();
    let template = `<h2 class="text-xl">Evaluation</h2>`;
    info.knowhow.forEach(question => {
      template +=`
      <fieldset class="evaluation__Q1 p-2 m-1 border-b-2 grid">
        <div class="evaluation__Q1_header">
          <h3 class="evaluation__Q1_title">${question.theme}</h3>
          <p>${question.description}
          </p>
        </div>`
      info.behavior.data.forEach(answer => {
        if(answer.id_knowhow === question.id_knowhow) {
          template +=`
          <label for="" class="m-2 flex items-center">
            <input type="radio" class="evaluation__Q1A mx-2 radio radio-primary">
            ${answer.label}
          </label>`
        }
      })
      template += `
      </fieldset>
      `
    });
    evaluationForm.innerHTML = template;
  }
  catch(error) {
    console.log(error);
  }
};


//--------------APPEL DES FONCTIONS--------------------------
GetTraining();

//----déclencher affichage de la liste quand training sélectionné
trainingList.addEventListener('input', e => {
  idJob = e.target.value;
  console.log(idJob);
  console.log(trainingList.value);
  PrintQuestion();
})