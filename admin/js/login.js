const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    console.log("form recieved")
    e.preventDefault();
        // Get form data
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
          sendDataToBackend(formDataObject);
    });

function sendDataToBackend(formDataObject) {
    fetch('/admin/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(responseData => {
       // console.log('Response from the backend:', responseData);
        // Handle the response from the backend here (if needed)
        if(responseData.message){
            alert("Success Fully Logged In! ");
            console.log(responseData);
            sessionStorage.setItem('token', responseData.token);
            sessionStorage.setItem('username', responseData.username);
            window.location.href="announcements.html";
        }else{
            console.log(responseData)
            responseData.msg ? alert(responseData.msg) : alert(responseData.error);
        }
    })
    .catch(error => {
        console.error('Error sending data to the backend:', error);
        // Handle errors here (if needed)
    });  
}