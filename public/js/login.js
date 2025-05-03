// 'use strict';
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
  }
};

//
let formTag;
// sure DOM is lletoaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
  formTag = document.querySelector('.form');
});

if (formTag) {
  document.querySelector('.form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
// EnsureEn
//
