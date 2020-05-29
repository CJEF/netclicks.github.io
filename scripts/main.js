const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '694c1efc28e91a715abfe0f4eecb07b2';
const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      dropdown = document.querySelector('.dropdown'),
      modal = document.querySelector('.modal'),
      tvShowList = document.querySelector('.tv-shows__list'),
      cross = document.querySelector('.cross');

const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url} Oшибка № ${res.status}`)
        }
        
    }
    getTestData = () => {
        return this.getData('test.json')
    }
} 
const renderCard = response => {
    console.log(response);
    response.results.forEach(item => {

        const { backdrop_path: backdrop, name: title, poster_path: poster, vote_average: vote } = item;//deligirovanie
        console.log(item);

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : 'img/no-poster.jpg';
        const voteElem = '';
        
        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" class="tv-card">
                <span class="tv-card__vote">${vote}</span>
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        tvShowList.append(card);//prepend
    });
    
};

new DBService().getTestData().then(renderCard);
      
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
    if (target.closest('.tv-card')) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
})
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