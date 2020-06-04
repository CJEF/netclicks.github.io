const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '694c1efc28e91a715abfe0f4eecb07b2';
const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      dropdown = document.querySelectorAll('.dropdown'),
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
      searchFormInput = document.querySelector('.search__form-input'),
      preloader = document.querySelector('.preloader'),
      tvShowsHead = document.querySelector('.tv-shows__head'),
      posterWrapper = document.querySelector('.poster__wrapper'),
      modalContent = document.querySelector('.modal__content');

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
    
    getTvShow = id => this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`)

    getPopular = () => this.getData(`${SERVER}/tv/popular?api_key=${API_KEY}&language=ru-RU&page=1`)

    getTopRated = () => this.getData(`${SERVER}/tv/top_rated?api_key=${API_KEY}&language=ru-RU&page=1`)

    getToday = () => this.getData(`${SERVER}/tv/airing_today?api_key=${API_KEY}&language=ru-RU&page=1`)

    getWeek = () => this.getData(`${SERVER}/tv/on_the_air?api_key=${API_KEY}&language=ru-RU&page=1`)
} 
const dbservice = new DBService();
const renderCard = (response, target) => {
    console.log(response);
    if (!response.total_results) {// 0 = false, !0 = true
        tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено!';
        tvShowsHead.style.cssText = 'color: red; ';
        loading.remove();
        return;
    }
    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
    tvShowsHead.style.cssText = '';

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
        dbservice.getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    })
}

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});
document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open'); 
        closeDropdown();
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
    if (target.closest('#top-rated')) {
        dbservice.getTopRated().then((response) => renderCard(response, target));

        tvShows.append(loading);
    }
    if (target.closest('#popular')) {
        console.log('popular');
        dbservice.getPopular().then((response) => renderCard(response, target));
        tvShows.append(loading);
    }
    if (target.closest('#week')) {
        console.log('week');
        dbservice.getWeek().then((response) => renderCard(response, target));
        tvShows.append(loading);
    }
    if (target.closest('#today')) {
        console.log('today');
        dbservice.getToday().then((response) => renderCard(response, target));
        tvShows.append(loading);
    }

    if (target.closest('#search')) {
        tvShowList.textContent = '';
        tvShowsHead.textContent = '';
    }
});

//open modal
tvShowList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target; 
    const card = target.closest('.tv-card'); 
    console.log(card);
    
    if (card) {
        preloader.style.display = 'block';

        dbservice.getTvShow(card.id)
        .then(response => {
            console.log(response);
            if(response.poster_path) {
                tvCardImg.src = IMG_URL + response.poster_path;
                tvCardImg.alt = response.name;  
                posterWrapper.style.display = '';
                modalContent.style.paddingLeft = '';
            } else {
                posterWrapper.style.display = 'none';
                modalContent.style.paddingLeft = '35px';
            }
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
        .finally(() => {
            preloader.style.display = '';
        });
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