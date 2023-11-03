document.addEventListener("DOMContentLoaded", async function () {

    const result1 = await fetch('/api/getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    console.log(result1)
    if(result1.success){
        const rider_filename = result1.Rlist[0].filename;
        const horse_filename = result1.Hlist[0].filename;
        document.getElementById("rider_filename").innerHTML = `<a href="../files/${rider_filename}" download="${rider_filename}">${rider_filename}</a>`
        document.getElementById("horse_filename").innerHTML = `<a href="../files/${horse_filename}" download="${horse_filename}">${horse_filename}</a>`
        let classesList,hclassesList;
        let classList = [] , hclassList = [];
        result1.Rlist.forEach((data,index)=>{
            classList.push(data.class)
           // classesList += `<option value="${data.class}">${data.class}</option>`;
        });
        var classes = [...new Set(classList)];
        classes.forEach((data,index)=>{
            classesList += `<option value="${data}">${data}</option>`;
        });

        
        result1.Hlist.forEach((data,index)=>{
            if(data.class != null){

            
            hclassList.push(data.class)
            }
           // classesList += `<option value="${data.class}">${data.class}</option>`;
        });
        var hclasses = [...new Set(hclassList)];
        hclasses.forEach((data,index)=>{
            hclassesList += `<option value="${data}">${data}</option>`;
        });

        document.getElementById("classes").innerHTML = `<option hidden>Select Class</option>`+classesList
        document.getElementById("h-classes").innerHTML = `<option hidden>Select Class</option>`+hclassesList
        document.getElementById("add-class-options").innerHTML = `<option hidden>Select Class</option>`+classesList
        document.getElementById("add-hclass-options").innerHTML = `<option hidden>Select Class</option>`+hclassesList
        var selectElement = document.getElementById('add-hclass-options');
        var selectize = $(selectElement).selectize({
            maxItems: 20,
            plugins: ['remove_button']
        });
        result1.Rlist.forEach((data,index) => {
            const rideridCell = data.riderid !== null ? data.riderid : '-';
            const nameCell = data.name !== null ? data.name : '-';
            const schoolCell = data.school !== null ? data.school : '-';
            const heightCell = data.height !== null ? data.height : '-';
            const weightCell = data.weight !== null ? data.weight : '-';
            const experienceCell = data.experience !== null ? data.experience : '-';
            const remarksCell = data.remarks !== null ? data.remarks : '-';
            const placingCell = data.placing !== null ? data.placing : '-';
            const ohowCell = data.oh_ow !== null ? data.oh_ow : '-';
            const classCell = data.class !== null ? data.class : '-';
            const editButton = `<button  class="edit-button" onclick="editRow('${data.ID}')">Edit</button>`;
            const deleteButton = `<button class="delete-button" onclick="deleteRow('${data.ID}')">Delete</button>`;
            const saveButton = `<button class="save-button" style="display: none;" onclick="saveRow('${data.ID}')">Save</button>`;
            const temp = `<tr  id="${data.ID}">
                <td>${rideridCell}</td>
                <td>${nameCell}</td>
                <td>${schoolCell}</td>
                <td>${heightCell}</td>
                <td>${weightCell}</td>
                <td>${experienceCell}</td>
                <td>${remarksCell}</td>
                <td>${placingCell}</td>
                <td>${ohowCell}</td>
                <td>${classCell}</td>
                <td>${editButton} ${saveButton}</td>
                <td>${deleteButton}</td>
            </tr>`;
          document.getElementById('tabletr').innerHTML += temp;
        });
        result1.Hlist.forEach((data,index) => {
            const nameCell = data.name !== null ? data.name : '-';
            const providerCell = data.provider !== null ? data.provider : '-';
            const spurCell = data.spur !== null ? data.spur : '-';
            const reinHoldCell = data.rein_hold !== null ? data.rein_hold : '-';
            const remarksCell = data.remarks !== null ? data.remarks : '-';
            const isStrongCell = data.isStrong !== null ? data.isStrong : '-';
            const classCell = data.class !== null ? data.class : '-';
            const editButton = `<button  class="edit-button" onclick="edithRow('${data.ID}')">Edit</button>`;
            const deleteButton = `<button class="delete-button" onclick="deletehRow('${data.ID}')">Delete</button>`;
            const saveButton = `<button class="save-button" style="display: none;" onclick="savehRow('${data.ID}')">Save</button>`;
            const temp = `<tr id="h-${data.ID}">
            <td>${nameCell}</td>
            <td>${providerCell}</td>
            <td>${spurCell}</td>
            <td>${reinHoldCell}</td>
            <td>${remarksCell}</td>
            <td>${isStrongCell}</td>
            <td>${classCell}</td>
            <td>${editButton} ${saveButton}</td>
            <td>${deleteButton}</td>
            </tr>`;
          document.getElementById('tableth').innerHTML += temp;
        });
    }

    
    const addRiderBtn = document.getElementById('addRiderBtn');
    const addHorseBtn = document.getElementById('addHorseBtn');
    const riderPopup = document.getElementById('riderPopup');
    const horsePopup = document.getElementById('horsePopup');
    const closePopupBtn = document.getElementById('closePopup');
    const closehPopupBtn = document.getElementById('closehPopup');
    const riderForm = document.getElementById('riderForm');
    const horseForm = document.getElementById('horseForm');
    addRiderBtn.addEventListener('click', function () {
        riderPopup.style.display = 'block';
    });
    closePopupBtn.addEventListener('click', function () {
        riderPopup.style.display = 'none';
    });

    riderForm.addEventListener('submit',async function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("file_id", result1.Rlist[0].file_id)
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
      console.log(formDataObject);
      const addRider = await fetch('/api/addRider', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject)
    }).then((res) => res.json())
    console.log(addRider);
    if(addRider.success){
        riderPopup.style.display = 'none';
        alert(addRider.success);
        location.reload();
    } else {
        riderPopup.style.display = 'none';
        alert(addRider.errorMessage);
        location.reload();
    }
    });

    addHorseBtn.addEventListener('click', function () {
        horsePopup.style.display = 'block';
      
    });
    closehPopupBtn.addEventListener('click', function () {
        horsePopup.style.display = 'none';
    });

    horseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("file_id", result1.Hlist[0].file_id)
        const formDataObject = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'horseclass') {
                const selectElement = document.getElementById('add-hclass-options');
                const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
                formDataObject[key] = selectedOptions;
            } else {
                formDataObject[key] = value;
            }
        }
        console.log(formDataObject);
      const addHorse = await fetch('/api/addHorse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject)
    }).then((res) => res.json())
    console.log(addHorse);
    if(addHorse.success){
        horsePopup.style.display = 'none';
        alert(addHorse.success);
        location.reload();
    } else {
        horsePopup.style.display = 'none';
        alert(addHorse.errorMessage);
        location.reload();
    }
    });
});

async function showclass(){
    const classname = document.getElementById("classes").value;
    const result2 = await fetch('/api/getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    if(result2.success){
        document.getElementById('tabletr').innerHTML = "";
        result2.Rlist.forEach((data,index) => {
            if(data.class == classname){
                const rideridCell = data.riderid !== null ? data.riderid : '-';
                const nameCell = data.name !== null ? data.name : '-';
                const schoolCell = data.school !== null ? data.school : '-';
                const heightCell = data.height !== null ? data.height : '-';
                const weightCell = data.weight !== null ? data.weight : '-';
                const experienceCell = data.experience !== null ? data.experience : '-';
                const remarksCell = data.remarks !== null ? data.remarks : '-';
                const placingCell = data.placing !== null ? data.placing : '-';
                const ohowCell = data.oh_ow !== null ? data.oh_ow : '-';
                const classCell = data.class !== null ? data.class : '-';
                const editButton = `<button  class="edit-button" onclick="editRow('${data.ID}')">Edit</button>`;
                const deleteButton = `<button class="delete-button" onclick="deleteRow('${data.ID}')">Delete</button>`;
                const saveButton = `<button class="save-button" style="display: none;" onclick="saveRow('${data.ID}')">Save</button>`;
                const temp = `<tr id="${data.ID}">
                    <td>${rideridCell}</td>
                    <td>${nameCell}</td>
                    <td>${schoolCell}</td>
                    <td>${heightCell}</td>
                    <td>${weightCell}</td>
                    <td>${experienceCell}</td>
                    <td>${remarksCell}</td>
                    <td>${placingCell}</td>
                    <td>${ohowCell}</td>
                    <td>${classCell}</td>
                    <td>${editButton} ${saveButton}</td>
                    <td>${deleteButton}</td>
                </tr>`;
          document.getElementById('tabletr').innerHTML += temp;
        }
        });
    }

}

async function showhorseclass(){
    const classname = document.getElementById("h-classes").value;
    const result2 = await fetch('/api/getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    if(result2.success){
        document.getElementById('tableth').innerHTML = "";
        result2.Hlist.forEach((data,index) => {
            if(data.class == classname){
                const nameCell = data.name !== null ? data.name : '-';
                const providerCell = data.provider !== null ? data.provider : '-';
                const spurCell = data.spur !== null ? data.spur : '-';
                const reinHoldCell = data.rein_hold !== null ? data.rein_hold : '-';
                const remarksCell = data.remarks !== null ? data.remarks : '-';
                const isStrongCell = data.isStrong !== null ? data.isStrong : '-';
                const classCell = data.class !== null ? data.class : '-';
                const editButton = `<button  class="edit-button" onclick="edithRow('${data.ID}')">Edit</button>`;
                const deleteButton = `<button class="delete-button" onclick="deletehRow('${data.ID}')">Delete</button>`;
                const saveButton = `<button class="save-button" style="display: none;" onclick="savehRow('${data.ID}')">Save</button>`;
                const temp = `<tr id="h-${data.ID}">
                  <td>${nameCell}</td>
                  <td>${providerCell}</td>
                  <td>${spurCell}</td>
                  <td>${reinHoldCell}</td>
                  <td>${remarksCell}</td>
                  <td>${isStrongCell}</td>
                  <td>${classCell}</td>
                  <td>${editButton} ${saveButton}</td>
                  <td>${deleteButton}</td>
                </tr>`;
          document.getElementById('tableth').innerHTML += temp;
        }
        });
    }
}
const riderDropArea = document.getElementById('rider-drop-area');
const horseDropArea = document.getElementById('horse-drop-area');
const riderFileInput = document.getElementById('rider-file-input');
const horseFileInput = document.getElementById('horse-file-input');
const fileStatus = document.getElementById('status');
const riderUploadProgress = document.getElementById('rider-upload-progress');
const horseUploadProgress = document.getElementById('horse-upload-progress');
const riderUploadDetails = document.getElementById('rider-upload-details');
const horseUploadDetails = document.getElementById('horse-upload-details');

riderDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    riderDropArea.classList.add('dragover');
});

riderDropArea.addEventListener('dragleave', () => {
    riderDropArea.classList.remove('dragover');
});

riderDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    riderDropArea.classList.remove('dragover');
    handleRiderFiles(e.dataTransfer.files);
});

horseDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    horseDropArea.classList.add('dragover');
});

horseDropArea.addEventListener('dragleave', () => {
    horseDropArea.classList.remove('dragover');
});

horseDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    horseDropArea.classList.remove('dragover');
    handleHorseFiles(e.dataTransfer.files);
});

riderFileInput.addEventListener('change', () => {
    handleRiderFiles(riderFileInput.files);
});

horseFileInput.addEventListener('change', () => {
    handleHorseFiles(horseFileInput.files);
});


function editRow(ID) {
    const row = document.getElementById(ID);
    const editButton = row.querySelector('.edit-button');
    const saveButton = row.querySelector('.save-button');
    const deleteButton = row.querySelector('.delete-button');
    const tdElements = row.querySelectorAll('td');
    const editableTdElements = Array.from(tdElements).filter((td) => {
      const isButton = td.querySelector('.edit-button') || td.querySelector('.save-button') || td.querySelector('.delete-button');
      return !isButton;
    });

    editableTdElements.forEach((td) => {
      td.contentEditable = true;
    });
    deleteButton.setAttribute('disabled', 'disabled');
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
  }
  
  function edithRow(ID) {
    const row = document.getElementById(`h-${ID}`);
    const editButton = row.querySelector('.edit-button');
    const saveButton = row.querySelector('.save-button');
    const deleteButton = row.querySelector('.delete-button');
    const tdElements = row.querySelectorAll('td');
    const editableTdElements = Array.from(tdElements).filter((td) => {
      const isButton = td.querySelector('.edit-button') || td.querySelector('.save-button') || td.querySelector('.delete-button');
      return !isButton;
    });

    editableTdElements.forEach((td) => {
      td.contentEditable = true;
    });
    deleteButton.setAttribute('disabled', 'disabled');
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
  }

 async function saveRow(ID) {
    const row = document.getElementById(ID);
    const editButton = row.querySelector('.edit-button');
    const saveButton = row.querySelector('.save-button');
    const deleteButton = row.querySelector('.delete-button');
    const tdElements = row.querySelectorAll('td'); 
    const editableTdElements = Array.from(tdElements).filter((td) => {
      const isButton = td.querySelector('.edit-button') || td.querySelector('.save-button') || td.querySelector('.delete-button');
      return !isButton;
    });
    editableTdElements.forEach((td) => {
      td.contentEditable = false;
    });
    deleteButton.removeAttribute('disabled');
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';
    const updatedData = {
      riderid: tdElements[0].textContent,
      name: tdElements[1].textContent,
      school: tdElements[2].textContent,
      height: tdElements[3].textContent,
      weight: tdElements[4].textContent,
      experience: tdElements[5].textContent,
      remarks: tdElements[6].textContent,
      placing: tdElements[7].textContent,
      oh_ow: tdElements[8].textContent,
      classname: tdElements[9].textContent,
      primary_key: ID,
    };
  
    
    console.log('Updated data:', updatedData);
    const confirmEdit=confirm("Are you sure want to save?");
    if(confirmEdit){
    const updateRider = await fetch('/api/editRider', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    }).then((res) => res.json())
    console.log(updateRider);
    if(updateRider.message){
        alert(updateRider.message);
        location.reload();
    } else {
        alert(updateRider.errorMessage);
        location.reload();
    }
    } else {
        location.reload();
    }
  }
  async function savehRow(ID) {
    const row = document.getElementById(`h-${ID}`);
    const editButton = row.querySelector('.edit-button');
    const saveButton = row.querySelector('.save-button');
    const deleteButton = row.querySelector('.delete-button');
    const tdElements = row.querySelectorAll('td');
    const editableTdElements = Array.from(tdElements).filter((td) => {
      const isButton = td.querySelector('.edit-button') || td.querySelector('.save-button') || td.querySelector('.delete-button');
      return !isButton;
    });
    editableTdElements.forEach((td) => {
      td.contentEditable = false;
    });
    deleteButton.removeAttribute('disabled');
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';
    const updatedData = {
      name: tdElements[0].textContent,
      provider: tdElements[1].textContent,
      spur: tdElements[2].textContent,
      rein_hold: tdElements[3].textContent,
      remarks: tdElements[4].textContent,
      isStrong: tdElements[5].textContent,
      classname: tdElements[6].textContent,
      primary_key: ID,
    };
    console.log('Updated data:', updatedData);
    const confirmEdit=confirm("Are you sure want to save changes?");
    if(confirmEdit){
    const updateHorse = await fetch('/api/editHorse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    }).then((res) => res.json())
    console.log(updateHorse);
    if(updateHorse.message){
        alert(updateHorse.message);
        location.reload();
    } else {
        alert(updateHorse.errorMessage);
        location.reload();
    }
    } else {
        location.reload();
    }
  }
  
async function deleteRow(ID) {
    const confirmEdit=confirm("Are you sure you want to delete?");
    if(confirmEdit){
        console.log('Delete button clicked for riderid: ' , ID);

        const deleteRider = await fetch('/api/deleteRider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ID : ID})
        }).then((res) => res.json())
        console.log(deleteRider);
        if(deleteRider.message){
            alert(deleteRider.message);
            location.reload();
        } else {
            alert(deleteRider.errorMessage);
            location.reload();
        }
    }

}

async function deletehRow(ID) {
    const confirmEdit=confirm("Are you sure you want to delete?");
        if(confirmEdit){
    console.log('Delete button clicked for horseid: ' , ID);
    
    const deleteRider = await fetch('/api/deleteHorse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ID : ID})
    }).then((res) => res.json())
    console.log(deleteRider);
    if(deleteRider.message){
        alert(deleteRider.message);
        location.reload();
    } else {
        alert(deleteRider.errorMessage);
        location.reload();
    }
    }
    
    }



async function handleRiderFiles(files) {
        for (const file of files) {
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
                riderUploadDetails.textContent = `Uploading ${file.name} (${file.size} bytes)...`;
                const formData = new FormData();
                formData.append("riders", file);
    
                const result = await axios.post('/api/uploadRider', formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      },
                      onUploadProgress: function(progressEvent) {
                        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) - 10;
                        riderUploadProgress.style.width = percentCompleted + '%';
                        riderUploadProgress.textContent = percentCompleted + '%';
                    }
                });
                  console.log(result);
                  if(result.data.success){
                    riderUploadProgress.style.backgroundColor = 'green';
                    riderUploadProgress.style.width = '100%';
                    riderUploadProgress.textContent = '100%';
                    riderUploadDetails.textContent = ' Upload successful!';
                    setTimeout(() => {
                        alert("Uploaded Successfully");
                        window.location.reload(true);
                        
                    }, 5000);
                    
                    //alert("Uploaded Successfully");
                  }else{
                    riderUploadProgress.style.backgroundColor = 'red';
                    riderUploadProgress.style.width = '90%';
                    riderUploadProgress.textContent = '90%';
                    riderUploadDetails.textContent = ' Upload failed: ' + result.data.errorMessage;
                    setTimeout(() =>{
                        riderUploadProgress.style.width = '0%';
                        riderUploadProgress.textContent = '0%';
                    }, 4000);
                   // alert(result.errorMessage);
                   setTimeout(() => {
                   // alert("Uploaded Successfully");
                    window.location.reload(true);  
                }, 6000);
                  }
            } else {
                riderUploadDetails.textContent = `${file.name} is not a valid Excel file.`;
            }
        }
    }
    
    async function handleHorseFiles(files) {
        for (const file of files) {
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
                horseUploadDetails.textContent = `Uploading ${file.name} (${file.size} bytes)...`;
                const formData = new FormData();
                formData.append("horses", file);
    
                const result = await axios.post('/api/uploadHorse', formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      },
                      onUploadProgress: function(progressEvent) {
                        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) -10;
                        horseUploadProgress.style.width = percentCompleted + '%';
                        horseUploadProgress.textContent = percentCompleted + '%';
                    }
                  });
    
                  console.log(result);
                  if(result.data.success){
                    horseUploadProgress.style.backgroundColor = 'green';
                    horseUploadProgress.style.width = '100%';
                    horseUploadProgress.textContent = '100%';
                    horseUploadDetails.textContent = ' Upload successful!';
                    setTimeout(() => {
                        alert("Uploaded Successfully");
                        window.location.reload(true);
                        
                    }, 5000);
                  }else{
                    horseUploadProgress.style.backgroundColor = 'red';
                    horseUploadProgress.style.width = '90%';
                    horseUploadProgress.textContent = '90%';
                    horseUploadDetails.textContent = ' Upload failed: ' + result.data.errorMessage;
                    setTimeout(() =>{
                        horseUploadProgress.style.width = '0%';
                        horseUploadProgress.textContent = '0%';
                    }, 4000);
                   // alert(result.errorMessage);
                   setTimeout(() => {
                   // alert("Uploaded Successfully");
                    window.location.reload(true);  
                }, 6000);
                  }
            } else {
                horseUploadDetails.textContent = `${file.name} is not a valid Excel file.`;
            }
        }
    }

async function uploadFileToBackend(file) {

    console.log(file)

    const formData = new FormData();
            formData.append("riders", file);
 
            const result = await axios.post('/riderUpload', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              });
              console.log(result);
}

function selectRiderFiles() {
    document.getElementById('rider-file-input').click();
}

function selectHorseFiles() {
    document.getElementById('horse-file-input').click();
}

