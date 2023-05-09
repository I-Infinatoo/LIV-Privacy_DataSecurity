function validateForm() {

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#cpassword").value;
    var bgVideo = document.getElementById("bg-video");

bgVideo.addEventListener("ended", function() {
    bgVideo.currentTime = 0;
    bgVideo.play();
});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if(!emailRegex.test(email)) {
        alert("Invalid email format");
        return false;
    }
    if(password && !passwordRegex.test(password)) {
        alert("Invalid password format");
        return false;
    }

    // during signup page, reconfirm the password
    if(confirmPassword && confirmPassword !== password) {
        alert("Password and confirm Password is not same.");
        return false;
    }
    return true;
    
}