//requete de co
async function login(user) {
  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      // error here
      const errorText = await response.text();
      throw new Error(`Erreur de connexion: ${errorText}`);
    }

    const data = await response.json();

    // token dans sessionstorage
    sessionStorage.setItem('token', data.token);

    // redirection
    window.location.href = 'index.html';
  } catch (error) {
    // error
    const errorDiv = document.querySelector('.alredyLogged__error');
    errorDiv.textContent = error.message;
  }
}

// co
document.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById('submit');

  submit.addEventListener("click", () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
      email: email,
      password: password
    };

    // se co
    login(user);
  });
});

// deco
function logout() {
  if (sessionStorage.getItem("token")) {
    sessionStorage.removeItem("token");

    // plus de login
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    loginLogoutLink.classList.remove('loggedIn');

    // doublesens
    toggleLoginLogout();

    // go co
    window.location.href = 'connexion.html';
  }
}



// mettre a jour text
function toggleLoginLogout() {
  // selectionner
  const loginLogoutLink = document.getElementById('loginLogoutLink');

  // classe la ?
  loginLogoutLink.classList.toggle('loggedIn');

  // classe la ?
  loginLogoutLink.textContent = loginLogoutLink.classList.contains('loggedIn') ? 'logout' : 'login';

  // classe la ?
  loginLogoutLink.href = loginLogoutLink.classList.contains('loggedIn') ? 'index.html' : 'connexion.html';
}


// appeller au debut du charegemtnd ud dom
document.addEventListener("DOMContentLoaded", function () {
  toggleLoginLogout();
});

// basulement
document.addEventListener("login", function () {
  toggleLoginLogout();
});

