const urlApi = 'http://localhost/Forem_Api/';
const jobList = document.querySelector('.add_training__job');
const centerList = document.querySelector('.add_training__center');
const instructorList = document.querySelector('.add_training__instructor');

//Fonction pour récupérer les job
const GetJob = async () => {
  try {
    let response = await fetch(urlApi + 'job');
    let data = await response.json();
    let template = '';
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

GetJob();