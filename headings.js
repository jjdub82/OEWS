fetch('/owes_definitions.json')
    .then(respons => Response.json())
    .then(data =>{
        console.log(data);
    })