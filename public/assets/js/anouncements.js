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
        </div>
      </div>`;
        announcements.innerHTML += announcement;
       // console.log(announcement);
        });
    }
});
