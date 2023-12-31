declare const PaystackPop: any;
declare const Swal: any;
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
const key = 'pk_live_23807c5dfa089b1bd6864a69559dab4254becfdf' // to be replaced

window.onload = ()=>{ 

    //query selectors
    const numberOfStudentsInput: HTMLInputElement = document.querySelector("#numberofstudents");
    const amountInput: HTMLInputElement = document.querySelector("#amount");
    const emailInput: HTMLInputElement = document.querySelector("#email");
    const sponsorButton: HTMLButtonElement = document.querySelector(".bcreal #herosponsor");

    console.log(sponsorButton);
    // listeners
    numberOfStudentsInput.addEventListener("input", (e: InputEvent)=> numberOfStudentsUpdate(e))
    sponsorButton.addEventListener("click", sponsorHandler)

    function sponsorHandler (e: Event){

      let number: string =   amountInput.value.replace(/[ \,NG]/g, "");
      if(isNaN(parseInt(number))){
        return  Swal.fire({
            title: "Oopsie!",
            text: "Please enter a valid amount",
            icon: "error"
          });
    }

    const email: string  = emailInput.value;
     if(!isValidEmail(email)){
        return  Swal.fire({
            title: "Oopsie!",
            text: "Please enter a valid email",
            icon: "error"
          });
     }
    //   console.log(number)

     let finalNumberForPaystack: number = parseFloat(number);

     console.log(finalNumberForPaystack)

     payWithPaystack(email, finalNumberForPaystack);
    }


    function isValidEmail(email: string) : boolean{
        // Regular expression for a basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return emailRegex.test(email);
    }

    function numberOfStudentsUpdate(e: InputEvent ){
        let value: string = (e.target as HTMLInputElement).value;
        if(isNaN(parseInt(value))){
            return
        }
        let numval: number = parseInt(value);

        if(numval <= 0 || isNaN(numval)) return;

        amountInput.value = formatter.format(numval * 15_000);
    }



    function payWithPaystack(email: string, amount: number) {
        console.log(amount,key)
        var handler = PaystackPop.setup({
            key,  // Replace with your actual public key
            email,
            // email: 'customer@email.com',  // Customer's email
            amount: amount * 100,  // Amount in kobo
            currency: 'NGN',  // Currency code
            // ref: 'your_unique_transaction_reference',  // Unique transaction reference
            callback: function(response) {
                // console.log(response);
                Swal.fire({
                    title: "Successfully Donated "+ formatter.format(amount),
                    text: "You have just helped out a kid in need",
                    icon: "success"
                  });
                // Handle the response, e.g., send to server for verification
                // console.log(response);
            },
            onClose: function() {
                alert('Payment canceled');
            }
        });
        handler.openIframe();
    }
}



