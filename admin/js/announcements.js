
document.addEventListener('DOMContentLoaded', async function () {

    const announcementsList = await fetch('/admin/api/fetchAnnouncements', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())
    console.log(announcementsList);
    const announcements = document.getElementById('announcements');
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    if(announcementsList.announcements){
    announcementsList.announcements.forEach((data, index) => {

        var announcement = `<div class="row announcement-item">
        <div class="col-lg-8">
          <div class="announcement-content">
            <h3>${data.title}</h3>
            <p>${data.message}</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="announcement-date"> ${monthNames[data.date.substr(5,2)-1]} ${data.date.substr(8,2)}, ${data.date.substr(0,4)}</div>
          <div class="announcement-buttons">
            <button class="btn btn-primary" onclick="editData('${index}')">Edit Announcement</button>
            <button class="btn btn-danger" onclick="deleteData('${index}')">Delete Announcement</button>
          </div>
        </div>
      </div>`;
        announcements.innerHTML += announcement;
       // console.log(announcement);
        });
    }

    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');

    const announcementPopup = document.getElementById('announcementPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const announcementForm = document.getElementById('announcementForm');
    const announcementTitle = document.getElementById('announcementTitle');
    const announcementMessage = document.getElementById('announcementMessage');
    const announcementDate = document.getElementById('announcementDate');

    addAnnouncementBtn.addEventListener('click', function () {
        announcementPopup.style.display = 'block';
        announcementTitle.value = "";
        announcementMessage.value = "";
    });

    closePopupBtn.addEventListener('click', function () {
        announcementPopup.style.display = 'none';
    });

    announcementForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = announcementTitle.value;
        const message = announcementMessage.value;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().toString().substring(0,10);
        const username = sessionStorage.getItem("username");

        console.log('Title:', title);
        console.log('Message:', message);
        console.log('Date:', formattedDate);
        console.log("username: ", username);

        fetch('/admin/api/addAnnouncements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                message: message,
                date: formattedDate,
                userName: username,
            }),
        })
        .then(response => response.json())
        .then(responseData => {
     
            if(responseData.message){
                alert("Announcement added!");
                console.log(responseData);
                location.reload();
            }else{
                console.log(responseData)
                responseData.errorMessage ?  alert(responseData.errorMessage) : alert("Something gone wrong :) ");
            }
        })
        .catch(error => {
            console.error('Error sending data to the backend:', error);
            // Handle errors here (if needed)
        });
      //  announcementPopup.style.display = 'none';
        // You can also reset the input fields here if needed.
    });
});


async function editData(index){
    console.log(index);
    const result = await fetch(`/admin/api/edit?id=${index}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())
    console.log(result);
    if(result.idAnnouncement){
       
        var editpopup = `<div id="editannouncementPopup" class="editpopup">
        <div class="editpopup-content">
            <span class="editclose" id="editclosePopup">&times;</span>
            <h5>Edit Announcement</h5>
            <form id="editAnnouncementForm">
                <label for="announcementTitle">Title:</label>
                <input type="text" id="editannouncementTitle" value="${result.idAnnouncement.title}" required>
                <label for="announcementMessage">Message:</label>
                <textarea id="editannouncementMessage"  required>${result.idAnnouncement.message}</textarea>              
                <input type="submit" value="Save">
            </form>
        </div>
    </div>`;
    
    document.getElementById('editAnnouncement').innerHTML= editpopup
    //console.log(editpopup);
    editannouncementPopup.style.display = 'block';
    const editclosePopup = document.getElementById('editclosePopup');
    editclosePopup.addEventListener('click', function () {
        editannouncementPopup.style.display = 'none';
    });

    document.getElementById('editAnnouncementForm').addEventListener('submit', async (e)=>{
        e.preventDefault();
        const title = editannouncementTitle.value;
        const message = editannouncementMessage.value;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().toString().substring(0,10);
        const username = sessionStorage.getItem("username");

        console.log('previousTitle:',  result.idAnnouncement.title);
        console.log('Message:', message);
        console.log('Date:', formattedDate);
        console.log("username: ", username);

        const saveResult = await fetch('/admin/api/saveAnnouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                previousTitle : result.idAnnouncement.title,
                title: title,
                message: message,
                date: formattedDate,
                username: username
            }),
        })
        .then(response => response.json())
        .then(responseData => {
     
            if(responseData.message){
                alert("Announcement edited successfully!");
                console.log(responseData);
                location.reload();
            }else{
                console.log(responseData)
                responseData.errorMessage ?  alert(responseData.errorMessage) : alert("Something gone wrong :) ");
            }
        })
        .catch(error => {
            console.error('Error sending data to the backend:', error);
        });
    })
    }
}


async function deleteData(index){
    console.log(index);
    const result = await fetch(`/admin/api/delete?id=${index}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())
    console.log(result);
    if(result.message){
        location.reload();
    }
}