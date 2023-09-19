document.getElementById('formData').addEventListener('submit',  async(e) => {
    e.preventDefault();
    const classname = document.getElementById("riderid").value,
          riderid = document.getElementById("riderid").value,
          ridername = document.getElementById("ridername").value,
          school = document.getElementById("school").value,
          horsename = document.getElementById("horsename").value,
          provider = document.getElementById("provider").value;

          console.log(riderid, ridername,school,horsename,provider);

          const result = await fetch('/addData', {
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
})