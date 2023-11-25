document.addEventListener("DOMContentLoaded", async function () {
    const addFolderForm = document.getElementById('addFolderForm');

    addFolderForm.addEventListener('submit', (e) => {
        console.log("form recieved")
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log(formDataObject)
    });
})