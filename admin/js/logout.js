
function logout(){
    console.log('logout');
    const confirmLogout=confirm("Are you sure you want to logout?");
    if(confirmLogout){
        sessionStorage.clear();
        window.location.href="index.html";
}
}