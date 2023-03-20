function validateForm() {

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if(!emailRegex.test(email)) {
        alert("Invalid email format");
        return false;
    }
    if(!passwordRegex.test(password)) {
        alert("Invalid password format");
        return false;
    }
}