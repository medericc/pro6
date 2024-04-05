// se co
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
          const errorText = await response.text();
          throw new Error(`Erreur de connexion: pseudo ou mot de passe invalide`);
      }

      const data = await response.json();

      // get token and record
      sessionStorage.setItem('token', data.token);

      // ggo home
      window.location.href = 'index.html';
  } catch (error) {
      const errorDiv = document.querySelector('.alredyLogged__error');
      errorDiv.textContent = error.message;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const coSubmit = document.getElementById('login__form');

  coSubmit.addEventListener("submit", (event) => {
      event.preventDefault(); // pas recharger

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const user = {
          email: email,
          password: password
      };

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


// appeller au debut du chargement du DOM
document.addEventListener("DOMContentLoaded", function () {
  toggleLoginLogout();
});

// basculement
document.addEventListener("login", function () {
  toggleLoginLogout();
});
