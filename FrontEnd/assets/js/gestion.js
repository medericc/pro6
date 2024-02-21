async function fetchProjets() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();

    const projets = Array.isArray(data) ? data : [];

    console.log('Projets récupérés:', projets); 

    return projets;
  } catch (error) {
    console.error('Erreur de récupération des données des travaux:', error);
    throw error; 
  }
}

async function fetchCategories() {
  try {
    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    console.log('Réponse brute de l\'API pour les catégories:', categoriesResponse);

    const categoriesData = await categoriesResponse.json();
    console.log('Réponse de l\'API pour les catégories:', categoriesData);

    const categoryIds = categoriesData.map(category => category.id);
    console.log('Identifiants des catégories:', categoryIds);

    return categoryIds;
  } catch (error) {
    console.error('Erreur de récupération des catégories:', error);
    throw error;
  }
}
async function updateGallery(filter = 'all') {
  try {
    const projets = await fetchProjets();
    const categories = await fetchCategories();

    console.log('Projets récupérés:', projets);
    console.log('Réponse de l\'API pour les catégories:', categories);

    const galerie = document.getElementById('gallery');
    galerie.innerHTML = '';

    if (projets && projets.length > 0) {
      projets
        .filter(projet => (filter === 'all' ? true : projet.categoryId == filter))
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

    const menu = document.querySelector('.filters');
    menu.innerHTML = '';

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const tousLesTravauxOption = document.createElement('button');
      tousLesTravauxOption.classList.add('filter-button');
      tousLesTravauxOption.dataset.filter = 'all';
      tousLesTravauxOption.textContent = 'Tous les travaux';
      menu.appendChild(tousLesTravauxOption);

      tousLesTravauxOption.addEventListener('click', () => {
        updateGallery('all');
      });

      categories.forEach(categorie => {
        const option = document.createElement('button');
        option.classList.add('filter-button');
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


function enableBlackBar() {
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
    blackBar.innerHTML = '<p>Mode Édition <i class="fa-regular fa-pen-to-square"></i></p>';
    document.body.insertBefore(blackBar, document.body.firstChild);

    const filterButtons = document.querySelectorAll('.filter-button');
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
}


function logout() {
  sessionStorage.removeItem('token');
  window.location.reload(); // Recharge la page pour mettre à jour l'état de connexion
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await updateGallery();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la galerie:', error);
  }
});
