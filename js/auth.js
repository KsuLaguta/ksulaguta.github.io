const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const mainBlock = document.querySelector("main");
const port = "http://localhost:3000/";
function goToLogin() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    mainBlock.style.display = "none";
    document.querySelector(".basket").style.display = "none";
}
  
function goToRegister() {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    mainBlock.style.display = "none";
    document.querySelector(".basket").style.display = "none";
}
function goToHome() {
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  mainBlock.style.display = "block";
  document.querySelector(".basket").style.display = "block";
}
function register(e) {
    e.preventDefault();
    const dataRequest = {
        email: registerForm[0].value,
        password: registerForm[1].value
    };
    fetch(port + "auth/signup", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(dataRequest),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            localStorage.setItem("userToken", data.token);
            window.location.href = "index.html";
          } else {
            alert(data.message);
          }
        });
  }
  function login(e) {
    e.preventDefault();
    const dataRequest = {
      email: loginForm[0].value,
      password: loginForm[1].value
    };
  
    fetch(port + "auth/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dataRequest),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          localStorage.setItem("userToken", data.token);
          window.location.href = "index.html";
          document.querySelector("#logout-btn").style.display = "inline-block";
          document.querySelector("#goToLogin-btn").style.display = "none";
          document.querySelector("#goToReg-btn").style.display = "none";
        } else {
          alert(data.message);
        }
      });
  }

  function logout(e) {
    localStorage.removeItem("userToken");
    document.querySelector("#logout-btn").style.display = "none";
    document.querySelector("#goToLogin-btn").style.display = "inline-block";
    document.querySelector("#goToReg-btn").style.display = "inline-block";
  }
  function isTocken(){
    if(localStorage.getItem("userToken")){
      document.querySelector("#logout-btn").style.display = "inline-block";
      document.querySelector("#goToLogin-btn").style.display = "none";
      document.querySelector("#goToReg-btn").style.display = "none";
    } else {
      document.querySelector("#logout-btn").style.display = "none";
      document.querySelector("#goToLogin-btn").style.display = "inline-block";
      document.querySelector("#goToReg-btn").style.display = "inline-block";
    }
  }
  isTocken();
