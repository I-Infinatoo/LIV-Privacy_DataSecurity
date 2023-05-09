function showSendDecOptions() {
    var sendBlock = document.getElementById('sendOption');
    var decryptBlock = document.getElementById('decryptOption');
    var selectedOption = document.getElementsByName('sendOrDec');

    //.value === 'sendFile'
    if(selectedOption[0].checked) {  
        decryptBlock.style.display="none";
        sendBlock.style.display="block";

        document.getElementById("fileInput").setAttribute("required", true);
        document.getElementById("email").setAttribute("required", true);
        document.getElementById("name").setAttribute("required", true);
        
        // make sure decryption fields are not required
        document.getElementById("keyFileInput").removeAttribute("required");
        document.getElementById("receivedFileInput").removeAttribute("required");
        document.getElementById("keyFilePassphrase").removeAttribute("required");
    
        return;
    }
    
    // .value ==='decryptFile'
    if(selectedOption[1].checked) { 
        sendBlock.style.display="none";
        decryptBlock.style.display="block";
        
        document.getElementById("keyFileInput").setAttribute("required", true);
        document.getElementById("receivedFileInput").setAttribute("required", true);
        document.getElementById("keyFilePassphrase").setAttribute("required", true);
        
        // make sure send fields are not required
        document.getElementById("fileInput").removeAttribute("required");
        document.getElementById("email").removeAttribute("required");
        document.getElementById("name").removeAttribute("required");
    
        return;
    }
}

function redirectTo(page) {
    window.location=page;
}