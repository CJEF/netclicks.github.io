const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '694c1efc28e91a715abfe0f4eecb07b2';
const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      dropdown = document.querySelector('.dropdown'),
      modal = document.querySelector('.modal'),
      tvShowList = document.querySelector('.tv-shows__list'),
      cross = document.querySelector('.cross'),
      tvShows = document.querySelector('.tv-shows'),
      tvCardImg = document.querySelector('.tv-card__img'),
      modalTitle = document.querySelector('.modal__title'),
      genresList = document.querySelector('.genres-list'),
      rating = document.querySelector('.rating'),
      description = document.querySelector('.description'),
      modalLink = document.querySelector('.modal__link'),
      searchForm = document.querySelector('.search__form'),
      searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';
/* console.log(loading); */


const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url} Oшибка № ${res.status}`)
        }
    //создание методов
    } 
    getTestData = () => {
        return this.getData('test.json');
    }
    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
    
    getTvShow = id => {
        return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`)
    }
} 
const renderCard = response => {
    console.log(response);
    tvShowList.textContent = '';
    response.results.forEach(item => {

        const { backdrop_path: backdrop, name: title, poster_path: poster, vote_average: vote, id } = item;//deligirovanie
        /* console.log(item); */

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
        
        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" class="tv-card" id="${id}">
                ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        loading.remove();
        tvShowList.append(card);//prepend
    });
};

searchForm.addEventListener('submit', (e) => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});
document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open'); 
    }//закрытие бургера при клике на НЕ меню    
})
leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;//для определения на какой элем кликнуто
    /* console.log(target); */
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});
//open modal
tvShowList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target; 
    const card = target.closest('.tv-card'); 
    console.log(card);
    
    if (card) {
        new DBService().getTvShow(card.id)
        .then(response => {
            console.log(response);
            tvCardImg.src = IMG_URL + response.poster_path;
            tvCardImg.alt = response.name;  
            modalTitle.textContent = response.name;
            //genresList.innerHTML = response.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');
            genresList.textContent = '';
            /* for (const item of response.genres) {
                genresList.innerHTML += `<li>${item.name}</li>`;
            }; */
            response.genres.forEach(item => {
                genresList.innerHTML += `<li>${item.name}</li>`;
            });
            rating.textContent = response.vote_average;
            description.textContent = response.overview
            modalLink.href = response.homepage;
        })
        .then(() => {
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
        })
    }
});
//close modal
modal.addEventListener('click', event => {
    if (event.target.closest('.cross') ||
    event.target.classList.contains('modal')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
}) 
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item')
    /* console.log(target.matches('.tv-card__img')); true/false on focus something */
    if(card) {
        const img = card.querySelector('.tv-card__img')
        /* console.log(img); */
        /* const changeImg = img.dataset.backdrop;
        if(changeImg) {
            img.dataset.backdrop = img.src;
            img.src = changeImg;
        }  */
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];// desrtucturizacia, 2 method
        }
    }
};
tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);