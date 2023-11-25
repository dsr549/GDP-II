/*
function logout(){
    console.log('logout');
    
    const confirmLogout=confirm("Are you sure you want to logout?");
    if(confirmLogout){
        sessionStorage.clear();
        window.location.href="/";
}
} */


function logout() {
    console.log('logout');

    // Create the div element for the popup
    let popup = document.createElement('div');
    popup.id = 'logout';
    popup.className = 'popup';
    popup.style.display = 'block'; // Initially display the popup

    // Set the inner HTML of the popup
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close" id="closePopup"></span>
            <h4 style="color: #000; text-align: center;" id="successresponse">Are you sure ?</h4>
            <div class="button-container" style="text-align: center; margin-top: 10px;">
                <button id="yesButton" style="background-color: blue; color: white; margin-right: 10px; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">Yes</button>
                <button id="noButton" style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">No</button>
            </div>
        </div>`;

    // Append the popup to the body of the document
    document.body.appendChild(popup);

    // Add event listeners
    document.getElementById('closePopup').onclick = function() {
        popup.style.display = 'none';
    };

    document.getElementById('yesButton').onclick = function() {
        sessionStorage.clear();
        window.location.href = "/";
    };

    document.getElementById('noButton').onclick = function() {
        popup.style.display = 'none';
    };
}
