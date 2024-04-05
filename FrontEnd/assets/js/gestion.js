async function fetchProjets() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();

   

    return data;
  } catch (error) {
    console.error('Erreur de récupération des données des travaux:', error);
    throw error; 
  }
}

async function fetchCategories() {
  try {
    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    const categoriesData = await categoriesResponse.json();

  
    const categoryNames = categoriesData.map(category => category.name);

 
    return categoryNames;
  } catch (error) {
    console.error('Erreur de récupération des catégories:', error);
    throw error;
  }
}

async function updateGallery(filter = 'all') {
  try {
    const projets = await fetchProjets();
    const categories = await fetchCategories();

    

    const galerie = document.getElementById('gallery');
    galerie.innerHTML = '';

    if (projets && projets.length > 0) {
      projets
        .filter(projet => (filter === 'all' ? true : projet.category === filter))
        .forEach(projet => {
          const figure = document.createElement('figure');

          const image = document.createElement('img');
          image.src = projet.imageUrl;
          image.alt = projet.title;
          figure.appendChild(image);

          const figcaption = document.createElement('figcaption');
          figcaption.textContent = projet.title;
          figure.appendChild(figcaption);

          galerie.appendChild(figure);
        });
    } else {
      console.warn('Aucun projet trouvé.');
    }

    const menu = document.querySelector('.centre');
    menu.innerHTML = '';

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const tousLesTravauxOption = document.createElement('button');
      tousLesTravauxOption.classList.add('button');
      tousLesTravauxOption.dataset.filter = 'all';
      tousLesTravauxOption.textContent = 'Tous';
      menu.appendChild(tousLesTravauxOption);

      tousLesTravauxOption.addEventListener('click', () => {
        updateGallery('all');
      });

      categories.forEach(categorie => {
        const option = document.createElement('button');
        option.classList.add('button');
        option.dataset.filter = categorie;
        option.textContent = categorie;
        menu.appendChild(option);

        option.addEventListener('click', () => {
          updateGallery(option.dataset.filter);
        });
      });
    } else {
      console.warn('Aucune catégorie trouvée.');
    }

    enableBlackBar();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la galerie:', error);
  }
}




async function enableBlackBar() {
  try {
    const isUserLoggedIn = sessionStorage.getItem('token') !== null;

    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const modifierButton2 = document.getElementById('modifierButton2');

    if (loginLogoutLink) {
      if (isUserLoggedIn) {
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.addEventListener('click', logout);
      } else {
        loginLogoutLink.textContent = 'login';
        loginLogoutLink.removeEventListener('click', logout);
      }
    }

    if (isUserLoggedIn) {
      const blackBar = document.createElement('div');
      blackBar.classList.add('black-bar');
      blackBar.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode Édition </p>';
      document.body.insertBefore(blackBar, document.body.firstChild);

      const filterButtons = document.querySelectorAll('.button');
      filterButtons.forEach(button => {
        button.style.display = 'none';
      });

      if (modifierButton2) {
        modifierButton2.style.display = 'block';
      }
    }

    if (modifierButton2) {
      modifierButton2.style.display = isUserLoggedIn ? 'block' : 'none';
    }
  } catch (error) {
    console.error('Erreur lors de l\'activation de la barre noire:', error);
  }
}

function logout() {
  sessionStorage.removeItem('token');
  window.location.reload(); 
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await updateGallery();
    await enableBlackBar();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la galerie ou de la barre noire:', error);
  }
});
