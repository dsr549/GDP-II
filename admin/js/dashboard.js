document.addEventListener("DOMContentLoaded", async function () {
    const getData = await fetch('/api/getAdmins', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    console.log(getData)
    var x , y = '';
    getData.list.forEach( async(data) => {
        if(data.isShowAdmin === 1){
            x = `<tr>
            <td class="username">${data.username}</td>
            <td class="email">${data.email}</td>
            <td class="id" style="display: none">${data.user_id}</td>
            <td>
              <button class="edit-button">Edit</button>
              <button class="delete-button">Delete</button>
            </td>
          </tr>`

          document.getElementById('showAdmin-table').innerHTML += x;
        } else {
            console.log(sessionStorage.getItem('isShowAdmin') == 1)
            if(sessionStorage.getItem('isShowAdmin') == 1){
                console.log("true --> ")
                y = `<tr>
            <td class="username">${data.username}</td>
            <td class="email">${data.email}</td>
            <td class="id" style="display: none">${data.user_id}</td>
             <td>
              <button class="edit-button disabled" disabled>Edit</button>
              <button class="delete-button disabled" disabled>Delete</button>
            </td>
          </tr>` 
            } else {

            y = `<tr>
            <td class="username">${data.username}</td>
            <td class="email">${data.email}</td>
            <td class="id" style="display: none">${data.user_id}</td>
             <td>
              <button class="edit-button">Edit</button>
              <button class="delete-button">Delete</button>
            </td>
          </tr>` 
        }
          document.getElementById('admin-table').innerHTML += y;
        }
    });

    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(editButton => {
    editButton.addEventListener('click', async() => {
        const row = editButton.closest('tr');
        const usernameCell = row.querySelector('.username');
        const emailCell = row.querySelector('.email');
        const id = row.querySelector('.id')

        usernameCell.contentEditable = !usernameCell.isContentEditable;
        emailCell.contentEditable = !emailCell.isContentEditable;

        editButton.textContent = usernameCell.isContentEditable ? 'Save' : 'Edit';
        
        if (!usernameCell.isContentEditable) {
        const updatedData = {
            username: usernameCell.textContent,
            email: emailCell.textContent,
            id: id.textContent
        };
        console.log('Updated Data:', updatedData);
        const editData = await fetch('/api/editShowAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then((res) => res.json());
        console.log(editData);
        if(editData.success){
            document.getElementById('successpopup').style.display = "block";
            document.getElementById('successResponse').innerHTML = "Edited successfully";
            setTimeout(() => {
                document.getElementById('successpopup').style.display = "none";
                window.location.reload(true);
              }, 5000);
        } else {
            document.getElementById('falsepopup').style.display = "block";
            document.getElementById('falseResponse').innerHTML = "Failed to edit details!";
            setTimeout(() => {
                document.getElementById('falsepopup').style.display = "none";
              }, 5000);
        }
        }
    });
    });

    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', async () => {
        const row = deleteButton.closest('tr');
        const usernameCell = row.querySelector('.username');
        const id = row.querySelector('.id')

        console.log('Deleting username : ', usernameCell.textContent);
        const deleteAdmin = await fetch(`/api/deleteShowAdmin?id=${id.textContent}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then((res) => res.json());
        console.log(deleteAdmin)
        if(deleteAdmin.success){
            document.getElementById('successpopup').style.display = "block";
            document.getElementById('successResponse').innerHTML = "Data deleted successfully"
            setTimeout(() => {
                document.getElementById('successpopup').style.display = "none";
              }, 5000);
              window.location.reload(true);
        } else {
            document.getElementById('falsepopup').style.display = "block";
            document.getElementById('falseResponse').innerHTML = "Failed to delete data!"
            setTimeout(() => {
                document.getElementById('falsepopup').style.display = "none";
              }, 5000);
        }
    });
    });

    const addShowAdminsForm = document.getElementById('addShowAdminForm')
    addShowAdminsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log(formDataObject)
        const addData = await fetch('/api/addShowAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        })
        .then((res) => res.json());
        console.log(addData);
        if(addData.message){
            document.getElementById('addShowAdminPopup').style.display = "none";
            document.getElementById('successpopup').style.display = "block";
            setTimeout(() => {
                document.getElementById('successpopup').style.display = "none";
              }, 5000);
            window.location.reload(true);
        } else {
            document.getElementById('addShowAdminPopup').style.display = "none";
            document.getElementById('falsepopup').style.display = "block";
            setTimeout(() => {
                document.getElementById('falsepopup').style.display = "none";
              }, 5000);
        }
    })

})