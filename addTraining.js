const urlApi = 'http://localhost/Forem_Api/';
const addTrainingForm = document.querySelector('.add_training');
const jobList = document.querySelector('.add_training__job');
const centerList = document.querySelector('.add_training__center');
const instructorList = document.querySelector('.add_training__instructor');

//--------------DECLARATION DES FONCTIONS----------------------

//----Fonction pour récupérer les job
const GetJob = async () => {
  try {
    let response = await fetch(urlApi + 'job');
    let data = await response.json();
    let template = '';
    //console.log(data);
    data.datas.forEach(job => {
      template +=`
      <option value="${job.id_job}" class="add_training__job_item">${job.title}</option>
      `
    });
    jobList.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour récupérer les centres
//console.log(centerList);
const GetCenter = async () => {
  try {
    let response = await fetch(urlApi + 'center');
    let data = await response.json();
    let template = '';
    //console.log(data);
    data.info.forEach(center => {
      template +=`
      <option value="${center.id_center}" class="add_training__center_item">${center.organisation}</option>
      `
    });
    centerList.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour récupérer les formateurs
const GetInstructor = async () => {
  try {
    let response = await fetch(urlApi + 'user?type=instructor');
    let datas = await response.json();
    let template = '';
    datas.data.forEach(instructor => {
      template +=`
      <option value="${instructor.id_user}" class="add_training__instructor_item">${instructor.name} ${instructor.firstname}</option>
      `
    });
    instructorList.innerHTML = template;
  }
  catch (error) {
    console.log(error)
  }
}

//----Fonction pour ajouter un training
//---------------------------------------A retravailler car ne reprend pas les values des inputs!
const AddTraining = async () => {
  try {
    let response = await fetch(urlApi + 'training', {
      method: 'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify({
        id_job: jobList.value,
        label: addTrainingForm.querySelector('.add_training__name').value,
        start_date: addTrainingForm.querySelector('.add_training__date').value,
        id_center: centerList.value,
        id_instructor: instructorList.value,
        token: localStorage.token
      })
    })
    let data = await response.json();
    console.log(data);
    if(data.code === 200){
      alert('post added');
      window.location.href = 'inscription.html';
    } else {
      alert('token error');
      window.location.href = 'connexion.html';
    }
  }
  catch(error) {
    console.log(error);
  }
};

//--------------APPLICATION DES FONCTIONS----------------
GetJob();
GetCenter();
GetInstructor();

addTrainingForm.addEventListener('submit', e => {
  e.preventDefault();
  AddTraining();
})