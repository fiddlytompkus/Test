//login here
const loginElement = document.getElementById('loginForm');
loginElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('emailOrUsername').value;
  const password = document.getElementById('password').value;
  try {
    const ress = await axios({
      method: 'POST',
      url: '/v1/users/login',
      data: {
        username,
        password,
      },
    });
    if (ress.data.status == 'OK') {
      window.setTimeout(() => {
        location.assign('/newsfeed');
      }, 50);
    }
  } catch (err) {
    console.log('error in login.js page, no response');
  }
});
