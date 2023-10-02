

document.addEventListener("DOMContentLoaded", async function () {

    const result1 = await fetch('/admin/api/getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    console.log(result1)
    if(result1.success){
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

        // Horses class
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
        result1.Rlist.forEach((data,index) => {
            const rideridCell = data.riderid !== null ? data.riderid : '-';
            const nameCell = data.name !== null ? data.name : '-';
            const schoolCell = data.school !== null ? data.school : '-';
            const heightCell = data.height !== null ? data.height : '-';
            const weightCell = data.weight !== null ? data.weight : '-';
            const experienceCell = data.experience !== null ? data.experience : '-';
            const remarksCell = data.remarks !== null ? data.remarks : '-';
            const placingCell = data.placing !== null ? data.placing : '-';

            const temp = `<tr>
                <td>${rideridCell}</td>
                <td>${nameCell}</td>
                <td>${schoolCell}</td>
                <td>${heightCell}</td>
                <td>${weightCell}</td>
                <td>${experienceCell}</td>
                <td>${remarksCell}</td>
                <td>${placingCell}</td>
            </tr>`;


          document.getElementById('tabletr').innerHTML += temp;
        });
        result1.Hlist.forEach((data,index) => {
            const nameCell = data.name !== null ? data.name : '-';
            const providerCell = data.provider !== null ? data.provider : '-';
            const spurCell = data.spur !== null ? data.spur : '-';
            const reinHoldCell = data.rein_hold !== null ? data.rein_hold : '-';
            const remarksCell = data.remarks !== null ? data.remarks : '-';
            
            const temp = `<tr>
            <td>${nameCell}</td>
            <td>${providerCell}</td>
            <td>${spurCell}</td>
            <td>${reinHoldCell}</td>
            <td>${remarksCell}</td>
            </tr>`;
          document.getElementById('tableth').innerHTML += temp;
        });
    }
});

async function showclass(){
    const classname = document.getElementById("classes").value;
    const result2 = await fetch('/admin/api/getData', {
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
    
                const temp = `<tr>
                    <td>${rideridCell}</td>
                    <td>${nameCell}</td>
                    <td>${schoolCell}</td>
                    <td>${heightCell}</td>
                    <td>${weightCell}</td>
                    <td>${experienceCell}</td>
                    <td>${remarksCell}</td>
                    <td>${placingCell}</td>
                </tr>`;
          document.getElementById('tabletr').innerHTML += temp;
        }
        });
    }

}

async function showhorseclass(){
    const classname = document.getElementById("h-classes").value;
    const result2 = await fetch('/admin/api/getData', {
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
                
                const temp = `<tr>
                  <td>${nameCell}</td>
                  <td>${providerCell}</td>
                  <td>${spurCell}</td>
                  <td>${reinHoldCell}</td>
                  <td>${remarksCell}</td>
                </tr>`;
          document.getElementById('tableth').innerHTML += temp;
        }
        });
    }
}

/*
document.getElementById('formData').addEventListener('submit',  async(e) => {
    e.preventDefault();
    const classname = document.getElementById("class").value,
          riderid = document.getElementById("riderid").value,
          ridername = document.getElementById("ridername").value,
          school = document.getElementById("school").value,
          horsename = document.getElementById("horsename").value,
          provider = document.getElementById("provider").value;

          console.log(riderid, ridername,school,horsename,provider);

          const result = await fetch('/admin/api/addData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                classname : classname,
                riderid : riderid,
                ridername : ridername,
                school : school,
                horsename : horsename,
                provider :provider
            })
        })
        .then((res) => res.json());
        if(result.message){
            document.getElementById("uploadbtn").innerHTML = "Success";
            document.getElementById("uploadbtn").style.backgroundColor = "#4CBB17";
            setTimeout(() => {
                window.location.reload(true);
            }, 5000);

        // Reset the form
        document.getElementById('formData').reset();
        }
})  */

const riderDropArea = document.getElementById('rider-drop-area');
const horseDropArea = document.getElementById('horse-drop-area');
const riderFileInput = document.getElementById('rider-file-input');
const horseFileInput = document.getElementById('horse-file-input');
const fileStatus = document.getElementById('status');

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


async function handleRiderFiles(files) {
    for (const file of files) {
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {

            const formData = new FormData();
            formData.append("riders", file);

            const result = await axios.post('/admin/api/uploadRider', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              });
              console.log(result);
        } else {
            fileStatus.textContent = `${file.name} is not a valid Excel file.`;
        }
    }
}

async function handleHorseFiles(files) {
    for (const file of files) {
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {

            const formData = new FormData();
            formData.append("horses", file);
    
            const result = await axios.post('/admin/api/uploadHorse', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              });
              console.log(result);
              if(result.data){
                alert(result.data);
              }else{
                alert(result.errorMessage);
              }
        } else {
            fileStatus.textContent = `${file.name} is not a valid Excel file.`;
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

