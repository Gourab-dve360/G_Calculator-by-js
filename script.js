class Calculator{


    constructor(){
        this.touches= document.querySelectorAll(".touch")
        this.screen_calculator= document.querySelector(".screen")
        this.preview_operation= document.querySelector(".preview_operation")
        this.touches_values_calculator= ["0","1","2","3","4","5","6","7","8","9","/","*","-","+",".","%","Enter","Backspace","Delete"]
        this.operation= []
        this.current_typping= ""


        this.touches.forEach((touch)=>{

            touch.addEventListener("mousedown",(e)=>{

                this.execute(e)

            })

        })

        document.addEventListener("keydown", (e)=>{

            if(e.key === "/"){
                e.preventDefault()
            }

         
            this.execute(e)

        })

    }

    execute(e){

        const touch_value= this.get_touch_value(e)

        if(touch_value !== null){

            this.press_button_effect(touch_value)
            this.dispatch(touch_value)
            this.set_font_size()
        }

    }

    set_font_size(){

        if(this.screen_calculator.textContent.length > 13){
            this.screen_calculator.style.fontSize = "1.5rem"
        }

        else{
            this.screen_calculator.style.fontSize = "2rem"
        }
    }


    get_touch_value(e){

        let new_char= null

        if(e.type == "mousedown"){

            new_char=e.currentTarget.dataset.value
        }  

        else if(e.type == "keydown" && this.touches_values_calculator.includes(e.key) ){

            new_char= e.key
            
        }

        return new_char
    }


    format_number(number){

        const number_split = number.toString().split(".")

        number_split[0]=number_split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

        const number_formated = number_split.join(".")

        return number_formated
   
    }


    dispatch(touch_value){

        

        if(touch_value === "Delete"){
            this.reset_current_operation()
        }

        if(touch_value === "Backspace"){

            this.delete_last_value()
        }

            

        if(touch_value.match(/[0-9.%]/) && this.screen_calculator.textContent.trim().length <= 20){


            this.current_typping= this.sanitize_current_type(this.current_typping + touch_value)


            if(this.current_typping.length >= 1){

                const new_value_screen=this.format_number(this.current_typping)

                this.screen_calculator.textContent= new_value_screen

            }

            


        }


        if(touch_value.match(/[*/\-+/]/)){

            this.set_operator(touch_value)

        }


        if(touch_value === "Enter"){

            this.execute_calcul()

        }

        
    }


    reset_current_operation(){

        this.screen_calculator.textContent= "0"
        this.preview_operation.textContent=""
        this.operation= []
        this.current_typping=""

    }


    delete_last_value(){


        this.current_typping= this.current_typping.slice(0, -1)

   
        this.screen_calculator.textContent= this.format_number(this.current_typping)


        if(this.screen_calculator.textContent.length === 0){

            this.screen_calculator.textContent="0"
        }


    }


    sanitize_current_type(type){

     
        if(this.screen_calculator.textContent.trim() === "0" && type === "0"){
            return "0"
        }

        if(this.screen_calculator.textContent.trim() === "0" && type === "."){
            return "0."
        }

        if(/^([^\.]*\.){2}[^\.]*$/.test(type)){

            return type.slice(0, -1)
        }

        if(this.current_typping.length === 0 && type === "%"){ 
            return ""
        }

        return type

    
    }


    add_new_val_operation(...values){

        for(const value of values){
            this.operation.push(value)

        }
    }


    set_operator(operator){


        if(this.current_typping.length === 0 && this.operation.length === 0 && operator === "-"){

            this.current_typping="-"

            this.screen_calculator.textContent = this.current_typping

            return
        }


       
        if(this.operation.length >= 1 && this.operation[this.operation.length - 1]  !== operator && this.current_typping.length === 0){

            this.operation.pop()
            this.add_new_val_operation(operator)

            this.update_preview_operation()

            
            return
        }

        const new_value= this.screen_calculator.textContent



        this.current_typping=""

        this.screen_calculator.textContent = "0" 
        

        this.add_new_val_operation(new_value,operator)

       
        this.update_preview_operation()

    }


    update_preview_operation(){

        this.preview_operation.textContent="" 

        for(let value_operation of this.operation){

            if(value_operation === "*"){
                value_operation = "×"
            }

            else if(value_operation === "/"){
                value_operation = "÷"
            }

            this.preview_operation.textContent += value_operation+" "

        }

    }


    sanitize_operation_before_calcul(){


        if(["+","-","/","*"].includes(this.operation[this.operation.length -1])){
            this.operation.pop()
        }


        for(let i = 0; i < this.operation.length; i++){

            if(/\d+\.$/.test(this.operation[i])){
                this.operation[i] = this.operation[i].replace(/\.$/, ".0");
            }

            if(this.operation[i].length > 1 && this.operation[i].startsWith("0")){
                this.operation[i] = this.operation[i].replace("0","");
            }

        }

    }


    execute_calcul(){


     
        if(this.operation.length >= 2){


            if(this.current_typping.length >= 1){

                this.add_new_val_operation(this.format_number(this.current_typping))

            }


            this.sanitize_operation_before_calcul()

       
            let expression=""


            for(let value_operation of this.operation){

                if(/[0-9]/.test(value_operation)){
                    value_operation= value_operation.replace(/\s/g, '')
                }
                
                expression += value_operation
            }


              
            let result


            if(/^[0-9+\-*/.%()]+$/.test(expression)){

                if(/%/.test(expression)){

                    expression = expression.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
                        return this.calculate_percentage_value(expression)
                    });
                }

              

                this.add_new_val_operation("=")

                this.update_preview_operation()

                

                result = this.format_number(eval(expression))

         
                this.current_typping= result
                

            }else{
                result= "Error"
            }



            this.operation=[]

            this.screen_calculator.textContent=result

        }
  
    }

    calculate_percentage_value(expression){

        const regex = /\d+(\.\d+)?%/;  
        const match = expression.match(regex);

        
        const position = expression.indexOf(match[0]);
    
        const isolated_expression = eval(expression.substring(0, position).slice(0,-1));

        const percent= parseFloat(match[0])

        

        return eval(isolated_expression * (percent / 100))


    }

    press_button_effect(touch_value){ 

       
        let touch_pressed = document.querySelector(`.touch[data-value="${touch_value}"]`)

        touch_pressed.classList.add("press")



        document.addEventListener("keyup", ()=>{
            
            touch_pressed.classList.remove("press")

        })

        touch_pressed.addEventListener("mouseup", ()=>{
            touch_pressed.classList.remove("press")

        })

    }

}
const calc= new Calculator()