//constantes
const urlApi = 'http://localhost/Forem_Api/';
const trainingList = document.querySelector('.training_selection__select');
const evaluationForm = document.querySelector('.evaluation')

let idJob;
let idTraining;
let idUser = localStorage.id_user;
let themesLabel = {
  "analyse": "Esprit d'analyse",
  "interest": "Curiosité intellectuelle",
  "autonomy": "Autonomie",
  "organized": "Sens de l'organisation",
  "criticism": "acceptation de la critique",
  "motivation": "motivation"};
let nbHitsCount;
//déclaration des variables pour linker theme et level
let evaluationQuestion = [];
//get date
const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${year}-${month}-${day}`;

//------------DECLARATION DES FONCTIONS--------------------
//----Fonction pour récupérer les training
const GetTraining = async () => {
  try {
    let response = await fetch(urlApi + `inscription?id_user=${idUser}`);
    let info = await response.json();
    let template = '';
    //console.log(data);
    info.data.forEach(training => {
      template +=`
      <option value="${training.id_job}" data-training="${training.id_training}" class="training_selection__option">${training.label}</option>
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
    let response = await fetch(urlApi + `knowhow?id_job=${trainingList.value}`);
    let info = await response.json();
    let template = `<h2 class="text-xl">Evaluation</h2>`;
    info.knowhow.forEach(question => {
      template +=`
      <fieldset class="evaluation__Q p-2 m-1 border-b-2 grid">
        <div class="evaluation__Q_header">
          <h3 class="evaluation__Q_title text-xl font-semibold">${themesLabel[question.theme]}</h3>
          <p>${question.description}
          </p>
        </div>`
      info.behavior.data.forEach(answer => {
        if(answer.id_knowhow === question.id_knowhow) {
          template +=`
          <label for="" class="m-2 flex items-center">
            <input type="radio" name="${question.theme}" data-level="${answer.level}" class="evaluation__Q_A mx-2 radio radio-primary">
            ${answer.label}
          </label>`
        }
      })
      template += `
      </fieldset>
      `
    });
    template += `<button class="evaluation__submit btn btn-primary btn-outline w-fit">Soumettre l'évaluation</button>`
    evaluationForm.innerHTML = template;
  }
  catch(error) {
    console.log(error);
  }
};

//----Fonction de check si nb hits dans mes éval est > 2
const GetEvalHits = async () => {
  try {
    let response = await fetch(urlApi + `evaluation?id_user=${idUser}&id_training=${idTraining}`);
    let info = await response.json();
    let template = '';
    //Imprimer l'évaluation que si nb hits de éval < 3
    if(info.nb_hits > 2){
      //Pas d'évaluation dispo
      template += `
        <h2 class="text-lg">Désolé, pas d'évaluation disponible</h2>
      `
      evaluationForm.innerHTML = template;
    }
    else {
      PrintQuestion();
      nbHitsCount = info.nb_hits +1;
    }
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour post une éval
const AddEvaluation = async (userResponse) => {
  try {
    let response = await fetch(urlApi + 'evaluation', {
      method: 'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify({
        date_evaluation: currentDate, //today
        id_training: idTraining,
        id_user: idUser, //localstorage
        count: nbHitsCount, //nb hits +1
        analyse: userResponse.analyse, //lier theme et level
        interest: userResponse.interest,
        autonomy: userResponse.autonomy,
        criticism: userResponse.criticism,
        organized: userResponse.organized,
        motivation: userResponse.motivation,
        token: localStorage.token
      })
    })
    let data = await response.json();
    //console.log(data);
    if(data.code === 200){
      alert('New evaluation');
      //window.location.href = 'addTraining.html';
    } else {
      alert('token error');
      //window.location.href = 'connexion.html';
    }
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
  idTraining = trainingList.querySelector('option:checked').dataset.training;
  //fetch => si nb hits > 2 ? sorry : PrintEvaluation
  GetEvalHits();
  console.log(nbHitsCount)
});

evaluationForm.addEventListener('submit', e => {
  e.preventDefault();
  evaluationQuestion = evaluationForm.querySelectorAll('input:checked');
  if(evaluationQuestion.length === 6) {
    console.log(evaluationQuestion);
    let response = {}
    evaluationQuestion.forEach(item => {
      response[item.name] = item.dataset.level
    })
    console.log(response)
    AddEvaluation(response);
  } else {
    //to do: error message
  }
  //console.log(evaluationForm.querySelector('input:checked').getAttribute('name'));
  //console.log(evaluationForm.querySelector('input:checked').dataset.level);

})
