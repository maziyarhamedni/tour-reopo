

import axios from "axios";
const login = async (email, password) => {  
  console.log('login');  
  console.log(email, password);  

  try {  
    const result = await axios({  
      method: 'POST',  
      url: 'http://127.0.0.1:3000/api/v1/users/login',  
      data: {  
        email,  
        password,  
      },  
    });  
    console.log(result);  
  } catch (err) {  
    console.error('Error during Axios request:', err);  
    if (err.response) {  
      console.error('Response data:', err.response.data);  
      console.error('Response status:', err.response.status);  
    } else {  
      console.error('Request error:', err.message);  
    }  
  }  
};  

// Ensure DOM is loaded before attaching event listeners  
document.addEventListener('DOMContentLoaded', function () {  
  document.querySelector('.form').addEventListener('submit', function (event) {  
    event.preventDefault(); // Prevent default form submission  

    const email = document.getElementById('email').value;  
    const password = document.getElementById('password').value;  

    login(email, password);  
  });  
});  