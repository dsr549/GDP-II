const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', (e) => {
    console.log("form recieved")
    e.preventDefault();
        // Get form data
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
      console.log(formDataObject);
      if(verifyPassword(formDataObject.password,formDataObject.password2)){
          sendDataToBackend(formDataObject);
      } else {
        setTimeout(() => { document.getElementById('message').innerHTML = ''},5000)
      }
    });

function sendDataToBackend(formDataObject) {
    console.log(formDataObject);
    fetch('/admin/api/signup', {
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
            alert("Success Fully Registered! ");
            console.log(responseData.msg)
        } else{
            responseData.errorMessage ? alert(responseData.errorMessage) : alert("Error while Signup");
            window.location.href="index.html";
        }
    })
    .catch(error => {
        console.error('Error sending data to the backend:', error);
        // Handle errors here (if needed)
    });  
}


function verifyPassword(password1,password2) {  
    value = password1
    if(password1!==password2){
        document.getElementById("message").innerHTML = "password and confirm password should be same";
        return false
    }
    if(password1.length < 6){
        document.getElementById("message").innerHTML = "password length should be longer than or equal to 8 characters";
        return false
    }
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
        document.getElementById("message").innerHTML ="Password must not contain Whitespaces.";
      return false
    }
  
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
        document.getElementById("message").innerHTML ="Password must have at least one Uppercase Character.";
        return false
    }
  
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
        document.getElementById("message").innerHTML = "Password must have at least one Lowercase Character.";
        return false
    }
  
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
        document.getElementById("message").innerHTML = "Password must contain at least one Digit.";
        return false
    }
  
  
    const isValidLength = /^.{6,16}$/;
    if (!isValidLength.test(value)) {
        document.getElementById("message").innerHTML = "Password must be 6-16 Characters Long.";
        return false
    }
    return true
   
  }  