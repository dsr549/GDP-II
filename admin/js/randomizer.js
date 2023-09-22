document.addEventListener("DOMContentLoaded", async function () {
    
    var classList = [];
    var result = await fetch('/admin/api/getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    if(result.list){
       
        result.list.forEach(data => {
            classList.push(data.classname)
        })
        var classes = [...new Set(classList)];
       // console.log(classes)
        classes.forEach(data=> {
            var temp = `<option value="${data}">
            ${data}
          </option>`
          document.getElementById('class').innerHTML += temp
        });
    
    }

});

async function updateRandomizer(){
    const classSelcted = document.getElementById("classSelection").value;
    var horses = [], riders = [];
    console.log(classSelcted);
    const result2 = await fetch('/admin/api/getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((res) => res.json());
    if(result2.list){

        for(let i=0; i<result2.list.length; i++){
            if(result2.list[i].classname == classSelcted){
                horses.push(result2.list[i].horsename);
                riders.push(result2.list[i].ridername)
            }
        }
            console.log(horses,riders);
            const horseList = document.getElementById("horseNames");
            const riderList = document.getElementById("riderNames");
            horseList.innerHTML =""
            riderList.innerHTML = ""
            horses.forEach(data => {
                const tem =`<li>${data}</li>`
                document.getElementById("horseNames").innerHTML += tem
            })
            riders.forEach(data => {
                const tem =`<li>${data}</li>`
                document.getElementById("riderNames").innerHTML += tem
            })
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateRandomCombinations() {
    const horseList = document.getElementById("horseNames");
    const riderList = document.getElementById("riderNames");
    
    // Get the list items as an array
    const horses = Array.from(horseList.children);
    const riders = Array.from(riderList.children);

    // Shuffle the arrays
    shuffleArray(horses);
    shuffleArray(riders);

    // Update the list elements
    horses.forEach((horse, index) => {
        horseList.appendChild(horse);
        riderList.appendChild(riders[index]);
    });
}

async function saveCombinations() {
    var savedCombinations = []
    // Get the shuffled combinations from the lists
    const horseList = document.getElementById("horseNames");
    const riderList = document.getElementById("riderNames");
    const horses = Array.from(horseList.children);
    const riders = Array.from(riderList.children);

    // Store the class name and combinations in the savedCombinations array
    const savedCombination = {
        className: document.getElementById("classSelection").value,
        horses: horses.map((horse) => horse.textContent),
        riders: riders.map((rider) => rider.textContent),

    };

    savedCombinations.push(savedCombination);

    // You can now use the savedCombinations array for further processing (e.g., sending to a server, displaying to the user)
    console.log(savedCombinations);
  //  console.log(horses,riders);

  const post = await fetch('/admin/api/saveRandomizer', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        classname: savedCombinations[0].className,
        riders: savedCombinations[0].riders,
        horses: savedCombinations[0].horses
    })
})
.then((res) => res.json());
if(post.success){
    alert("Combinations Uploaded");

} else{
    alert("Uploaded failed to save combinations")
}
}