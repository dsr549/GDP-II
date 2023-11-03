document.addEventListener('DOMContentLoaded', async function () {

    const announcementsList = await fetch('/api/fetchAnnouncements', {
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
    const currentDate = new Date();
    announcementsList.announcements.reverse()
    console.log(announcementsList)
    announcementsList.announcements.forEach((data, index) => {

      const dateComponents = data.date.split('-');
      const year = parseInt(dateComponents[0]);
      const month = parseInt(dateComponents[1]) - 1; 
      const day = parseInt(dateComponents[2]);
      const dateAdded = new Date(year, month, day);
      const timeDifference = currentDate - dateAdded;
      const newAnnouncementThreshold = 1 * 24 * 60 * 60 * 1000; 
      const isNewAnnouncement = timeDifference <= newAnnouncementThreshold;
      var announcement = `<div class="row announcement-item">
          <div class="col-lg-8">
            <div class="announcement-content">
              <h3>${data.title}${isNewAnnouncement ? '<img style="width: 42px; height: 42px;" src="https://img.icons8.com/doodle/48/new--v1.png" alt="new--v1"/>' : ''}</h3>
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
