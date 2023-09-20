document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById('formData').reset();
    const result1 = await fetch('/admin/api/getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    if(result1.list){
        result1.list.forEach((data,index) => {
            var temp =`<tr>
            <td>${data.classname}</td>
            <td>${data.riderid}</td>
            <td>${data.ridername}</td>
            <td>${data.school}</td>
            <td>${data.horsename}</td>
            <td>${data.provider}</td>
          </tr>`;
          document.getElementById('tabletr').innerHTML += temp;
        });
    }
});
document.getElementById('formData').addEventListener('submit',  async(e) => {
    e.preventDefault();
    const classname = document.getElementById("class").value,
          riderid = document.getElementById("riderid").value,
          ridername = document.getElementById("ridername").value,
          school = document.getElementById("school").value,
          horsename = document.getElementById("horsename").value,
          provider = document.getElementById("provider").value;

          console.log(riderid, ridername,school,horsename,provider);

          const result = await fetch('/admin/api/addData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                classname : classname,
                riderid : riderid,
                ridername : ridername,
                school : school,
                horsename : horsename,
                provider :provider
            })
        })
        .then((res) => res.json());
        if(result.message){
            document.getElementById("uploadbtn").innerHTML = "Success";
            document.getElementById("uploadbtn").style.backgroundColor = "#4CBB17";
            setTimeout(() => {
                window.location.reload(true);
            }, 5000);

        // Reset the form
        document.getElementById('formData').reset();
        }
})