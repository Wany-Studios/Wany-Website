const inputs = [...document.querySelectorAll("#verification")];

inputs.forEach((input, index, arr) => {

    input.addEventListener("input", () =>{
        if(index !== arr.length - 1){
            inputs[index + 1 ].focus();
        }
    });
    
    
    input.addEventListener("keyup", (event) =>{
        input.value = input.value.trim();

        if(event.key === 'Backspace')
        {
            if(input.value.length === 0  && index !== 0)
            {
                inputs[index - 1].value = "";
                inputs[index - 1].focus();
            }
        }
    });


});





