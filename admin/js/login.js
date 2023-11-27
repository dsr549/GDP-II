const loginForm = document.getElementById('loginForm');
const showAdminLogin = document.getElementById('showAdminLoginForm');

showAdminLogin.addEventListener('submit', (e) => {
    console.log("form recieved")
    e.preventDefault();
        // Get form data
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log(formDataObject)
        fetch('/api/showAdminLogin', {
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
                sessionStorage.setItem('isShowAdmin', responseData.isShowAdmin);
                document.getElementById('successpopup').style.display = 'block';
                document.getElementById('response').innerHTML = "Login Success"
                setTimeout(() => {
                    document.getElementById('successpopup').style.display = 'none';
                     
                }, 3000);
                setTimeout(() => window.location.href="announcements.html", 4000);
            }else{
                console.log(responseData)
                // responseData.msg ? alert(responseData.msg) : alert(responseData.error);
                document.getElementById('falseshowpopup').style.display = 'block';
                if(responseData.msg)
                    document.getElementById('falseshowResponse').innerHTML = "Username not found"
                else
                    document.getElementById('falseshowResponse').innerHTML = "Wrong password"
                setTimeout(() => {
                    document.getElementById('falseshowpopup').style.display = 'none';
                }, 3000);
            }
    });
});

loginForm.addEventListener('submit', (e) => {
    console.log("form recieved")
    e.preventDefault();
        // Get form data
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        console.log(formDataObject)
          sendDataToBackend(formDataObject);
    });

function sendDataToBackend(formDataObject) {
    fetch('/api/login', {
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
            sessionStorage.setItem('isShowAdmin', responseData.isShowAdmin);
           // document.getElementById('successpopup').style.display = 'block';
          //  document.getElementById('response').innerHTML = "Login Success"
           // setTimeout(() => {
           //     document.getElementById('successpopup').style.display = 'none';
                 
          //  }, 3000);
            setTimeout(() => window.location.href="announcements.html", 4000);
        }else{
            console.log(responseData)
            // responseData.msg ? alert(responseData.msg) : alert(responseData.error);
            document.getElementById('falsepopup').style.display = 'block';
            if(responseData.msg)
                document.getElementById('falseResponse').innerHTML = "Username not found"
            else
                document.getElementById('falseResponse').innerHTML = "Wrong password"
            setTimeout(() => {
                document.getElementById('falsepopup').style.display = 'none';
            }, 3000);
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


const forgotPasswordBtn = document.getElementById('forgotpasswordbtn');
const showforgotPasswordBtn = document.getElementById('showforgotpasswordbtn');
const popup = document.getElementById('popup');
const showpopup = document.getElementById('showpopup');
const closePopupBtn = document.getElementById('closePopup');
const forgotForm = document.getElementById('otpForm');
const showForgotform = document.getElementById('otpShowForm')
const checkOtpForm = document.getElementById('CheckOtp');
const newPasswordForm = document.getElementById('newPasswordForm');
const checkShowOtpForm = document.getElementById('CheckShowOtp');
const newShowPasswordForm = document.getElementById('newShowPasswordPopup');
const newpassclosePopupBtn = document.getElementById('newpassclosePopup');
const successclosePopupBtn = document.getElementById('successclosePopup');
const closeButtons = document.querySelectorAll(".close");
const popupElements = document.querySelectorAll(".popup");

forgotPasswordBtn.addEventListener('click', function () {
    popup.style.display = 'block';
});

showforgotPasswordBtn.addEventListener('click', function () {
    showpopup.style.display = 'block';
});

successclosePopupBtn.addEventListener('click', function () {
    document.getElementById('successpopup').style.display = "block";
    window.location.reload(true);
});

closeButtons.forEach((closeButton, index) => {
    closeButton.addEventListener("click", () => {
      popupElements[index].style.display = "none";
    });
  });

forgotForm.addEventListener('submit', async(e) => {
    console.log("form recieved")
    e.preventDefault();
    const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
    console.log(formDataObject)
    const sendOtp = await fetch(`/api/sendOTP?mail=${formDataObject.email}&isShowAdmin=false`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    console.log(sendOtp)
    if(sendOtp.message){
        forgotForm.setAttribute('hidden', 'true')
        checkOtpForm.removeAttribute('hidden')
        sessionStorage.setItem('otp-email', formDataObject.email)
    } else {
        popup.style.display = 'none';
        document.getElementById('falsepopup').style.display = "block";
        setTimeout(() => document.getElementById('falsepopup').style.display = "none",5000);
    }
});

showForgotform.addEventListener('submit', async(e) => {
    console.log("form recieved")
    e.preventDefault();
    const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
    console.log(formDataObject)
    const sendOtp = await fetch(`/api/sendOTP?mail=${formDataObject.email}&isShowAdmin=true`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    console.log(sendOtp)
    if(sendOtp.message){
        showForgotform.setAttribute('hidden', 'true')
        checkShowOtpForm.removeAttribute('hidden')
        sessionStorage.setItem('otp-email', formDataObject.email)
    } else {
        showpopup.style.display = 'none';
        document.getElementById('falseshowpopup').style.display = "block";
        setTimeout(() => document.getElementById('falseshowpopup').style.display = "none",5000);
    }
});

newPasswordForm.addEventListener('submit', async(e) => {
    console.log("form recieved")
    e.preventDefault();
    const formData = new FormData(e.target);
        const formDataObject = {};
        formData.append("email", sessionStorage.getItem('otp-email'))
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
    console.log(formDataObject)
    if(verifyPassword(formDataObject.password,formDataObject.password2)){
        const change = await fetch(`/api/changePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        })
        .then((res) => res.json());
        console.log(change)
        if(change.message){
            document.getElementById('newPasswordPopup').style.display = 'none';
            document.getElementById('successpopup').style.display = "block";
            setTimeout(() => document.getElementById('successpopup').style.display = "none",5000);
            sessionStorage.removeItem('otp-email')
        } else {
            //newPasswordForm.style.display = 'none';
            document.getElementById('falsepopup').style.display = "block";
            document.getElementById('response').innerHTML = "Password reset failed!";
            sessionStorage.removeItem('otp-email')
            setTimeout(() => document.getElementById('falsepopup').style.display = "none",5000);
        }
    } else {
        console.log("Password not matched")
        //newpassclosePopupBtn.click();
        sessionStorage.removeItem('otp-email');
       // document.getElementById('falsepopup').style.display = "block";
       // document.getElementById('response').innerHTML = "Password not matched!"
        setTimeout(() => { document.getElementById('message').innerHTML = ''},3000)
    }
    
})

newShowPasswordForm.addEventListener('submit', async(e) => {
    console.log("form recieved")
    e.preventDefault();
    const formData = new FormData(e.target);
        const formDataObject = {};
        formData.append("email", sessionStorage.getItem('otp-email'))
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
    console.log(formDataObject)
    if(verifyShowPassword(formDataObject.password,formDataObject.password2)){
        const change = await fetch(`/api/changePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        })
        .then((res) => res.json());
        console.log(change)
        if(change.message){
            document.getElementById('newShowPasswordPopup').style.display = 'none';
            document.getElementById('successShowpopup').style.display = "block";
            setTimeout(() => { document.getElementById('successShowpopup').style.display = "none";},5000)
            sessionStorage.removeItem('otp-email')
        } else {
            //newPasswordForm.style.display = 'none';
            document.getElementById('falseshowpopup').style.display = "block";
            document.getElementById('falseshowResponse').innerHTML = "Password reset failed!"
            setTimeout(() => document.getElementById('falseshowpopup').style.display = "none",5000)
            sessionStorage.removeItem('otp-email')
        }
    } else {
        console.log("Password not matched")
        //newpassclosePopupBtn.click();
        sessionStorage.removeItem('otp-email');
       // document.getElementById('falsepopup').style.display = "block";
       // document.getElementById('response').innerHTML = "Password not matched!"
       setTimeout(() => { document.getElementById('showmessage').innerHTML = ''},3000)
    }
    
})

async function checkotp(value){
    console.log(value)
    const checkOtp = await fetch(`/api/checkOTP?mail=${sessionStorage.getItem('otp-email')}&OTP=${value}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    console.log(checkOtp)
    if(checkOtp.message){
      //  sessionStorage.removeItem('otp-email')
        popup.style.display = 'none';
        document.getElementById("newPasswordPopup").style.display = "block";
    } else {
        popup.style.display = 'none';
        checkOtpForm.setAttribute('hidden', 'true')
        document.getElementById('falsepopup').style.display = "block";
    }
}

async function checkShowotp(value){
    console.log(value)
    const checkOtp = await fetch(`/api/checkOTP?mail=${sessionStorage.getItem('otp-email')}&OTP=${value}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    console.log(checkOtp)
    if(checkOtp.message){
      //  sessionStorage.removeItem('otp-email')
        showpopup.style.display = 'none';
        document.getElementById("newShowPasswordPopup").style.display = "block";
    } else {
        showpopup.style.display = 'none';
        checkShowOtpForm.setAttribute('hidden', 'true')
        document.getElementById('falseshowpopup').style.display = "block";
    }
}

function verifyPassword(password1,password2) {  
    if(password1!==password2){
        document.getElementById("message").innerHTML = "Password and confirm password should be same";
        return false
    }
    if(password1.length < 6){
        document.getElementById("message").innerHTML = "password length should be longer than or equal to 8 characters";
        return false
    }
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(password1)) {
        document.getElementById("message").innerHTML ="Password must not contain Whitespaces.";
      return false
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(password1)) {
        document.getElementById("message").innerHTML = "Password must have at least one Lowercase Character.";
        return false
    }
  
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(password1)) {
        document.getElementById("message").innerHTML = "Password must contain at least one Digit.";
        return false
    }
  
  
    const isValidLength = /^.{6,16}$/;
    if (!isValidLength.test(password1)) {
        document.getElementById("message").innerHTML = "Password must be 6-16 Characters Long.";
        return false
    }
    return true
   
} 

function verifyShowPassword(password1,password2) {  
    if(password1!==password2){
        document.getElementById("showmessage").innerHTML = "Password and confirm password should be same";
        return false
    }
    if(password1.length < 6){
        document.getElementById("showmessage").innerHTML = "password length should be longer than or equal to 8 characters";
        return false
    }
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(password1)) {
        document.getElementById("showmessage").innerHTML ="Password must not contain Whitespaces.";
      return false
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(password1)) {
        document.getElementById("showmessage").innerHTML = "Password must have at least one Lowercase Character.";
        return false
    }
  
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(password1)) {
        document.getElementById("showmessage").innerHTML = "Password must contain at least one Digit.";
        return false
    }
  
  
    const isValidLength = /^.{6,16}$/;
    if (!isValidLength.test(password1)) {
        document.getElementById("showmessage").innerHTML = "Password must be 6-16 Characters Long.";
        return false
    }
    return true
   
  }  