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
        if(responseData.message){
           // alert("Successfully Logged In! ");
           document.getElementById("tick").innerText = "";
           document.getElementById("color-change").style.backgroundColor = "#444";
           document.getElementById("verifiedIcon").style.display = "block";
            console.log(responseData);
            sessionStorage.setItem('token', responseData.token);
            sessionStorage.setItem('username', responseData.username);
            setTimeout(() => window.location.href="announcements.html", 2000);
        }else{
            console.log(responseData)
            responseData.msg ? alert(responseData.msg) : alert(responseData.error);
        }
    })
    .catch(error => {
        console.error('Error sending data to the backend:', error);
    });  
}


if((sessionStorage.getItem('token'))){
    //location.href="../index.html";
   window.location.href="announcements.html";
}