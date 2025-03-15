//! Блокировка скролла
const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  if (window.innerWidth >= 992) {
    document.querySelector(".page__header").style.left = `calc(50% - 50vw - ${
      widthScroll / 2
    }px)`;
  }

  if (window.innerWidth >= 1440) {
    document.querySelector(".page__header").style.left = `calc(50% - ${
      720 + widthScroll / 2
    }px)`;
  }

  document.body.scrollPosition = window.scrollY;

  document.documentElement.style.cssText = `
    position: relative;
    height: 100vh;
  `;

  document.body.style.cssText = `
     overflow: hidden;
     position: fixed;
     top: -${document.body.scrollPosition}px;
     left: 0;
     height: 100vh;
     width: 100vw;
     padding-right: ${widthScroll}px;
  `;
};

const enabledScroll = () => {
  // document.documentElement.style.cssText = "";
  document.body.style.cssText = "position: relative";
  document.querySelector(".page__header").style.left = "";
  window.scroll({ top: document.body.scrollPosition });
};

{
  // Модальное окно
  const presentOrderBtn = document.querySelector(".present__order-btn");
  const pageOverlayModal = document.querySelector(".page__overlay_modal");
  const modalClose = document.querySelector(".modal__close");

  const handlerModal = (
    openBtn,
    modal,
    openSelector,
    closeTrigger,
    sk = "medium"
  ) => {
    let opacity = 0;

    const speed = {
      slow: 0.03,
      medium: 0.06,
      fast: 0.1,
    };

    const openModal = () => {
      disableScroll();
      modal.style.opacity = opacity;
      modal.classList.add(openSelector);

      const anim = () => {
        opacity += speed[sk];
        modal.style.opacity = opacity;
        if (opacity < 1) requestAnimationFrame(anim);
        else {
          opacity = 1;
          modal.style.opacity = 1;
        }
      };
      requestAnimationFrame(anim);
    };

    const closeModal = () => {
      enabledScroll();
      const anim = () => {
        opacity -= speed[sk];
        modal.style.opacity = opacity;
        if (opacity > 0) {
          requestAnimationFrame(anim);
        } else {
          modal.classList.remove(openSelector);
          opacity = 0;
          modal.style.opacity = 0;
        }
      };
      requestAnimationFrame(anim);
    };

    openBtn.addEventListener("click", openModal);

    closeTrigger.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  };

  handlerModal(
    presentOrderBtn,
    pageOverlayModal,
    "page__overlay_modal_open",
    modalClose,
    "fast"
  );
}

{
  //! Бургер меню
  const headerContactsBurger = document.querySelector(
    ".header__contacts-burger"
  );
  const headerContacts = document.querySelector(".header__contacts");

  const handlerBurger = (openBtn, menu, openSelector) => {
    openBtn.addEventListener("click", () => {
      if (menu.classList.contains(openSelector)) {
        menu.style.height = "";
        menu.classList.remove(openSelector);
      } else {
        menu.style.height = menu.scrollHeight + "px";
        menu.classList.add(openSelector);
      }
    });
  };

  handlerBurger(headerContactsBurger, headerContacts, "header__contacts_open");
}

{
  //! Галерея

  const portfolioList = document.querySelector(".portfolio__list");
  const pageOverlay = document.createElement("div");
  pageOverlay.classList.add("page__overlay");

  portfolioList.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (card) {
      document.body.append(pageOverlay);
      //! Для улучшенного изображения
      const title = card.querySelector(".card__client");
      const picture = document.createElement("picture");

      picture.style.cssText = `
           position: absolute;
           top: 20px;
           left: 50%;
           transform: translateX(-50%);
           width: 90%;
           max-width: 1440px;
        `;

      picture.innerHTML = `
           <source srcset="${card.dataset.fullImage}.avif" type="image/avif">
           <source srcset="${card.dataset.fullImage}.webp" type="image/webp">
           <img src="${card.dataset.fullImage}.jpg" alt="${title.textContent}">
        `;

      pageOverlay.append(picture);
      disableScroll();
    }
  });

  pageOverlay.addEventListener("click", () => {
    pageOverlay.remove();
    pageOverlay.textContent = "";
    enabledScroll();
  });
}

{
  //! Создание карточек портфолио на основе данных из JSON

  const COUNT_CARD = 2;
  const portfolioList = document.querySelector(".portfolio__list");
  const portfolioAdd = document.querySelector(".portfolio__add");

  const getData = () =>
    fetch("db.json")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw `Что-то пошло не так, попробуйте позже, ошибка: ${response.status}`;
        }
      })
      .catch((error) => console.error(error));

  const createStore = async () => {
    const data = await getData();

    return {
      data,
      counter: 0,
      count: COUNT_CARD,
      get length() {
        return this.data.length;
      },
      get cardData() {
        const renderData = this.data.slice(
          this.counter,
          this.counter + this.count
        );
        this.counter += renderData.length;
        return renderData;
      },
    };
  };

  const renderCard = (data) => {
    const cards = data.map(({ preview, year, type, client, image }) => {
      const li = document.createElement("li");
      li.classList.add("portfolio__item");

      li.innerHTML = `
           <article class="card" tabindex="0" role="button" aria-label="открыть макет"
              data-full-image="${image}">
              <picture class="card__picture">
                 <source srcset="${preview}.avif" type="image/avif">
                 <source srcset="${preview}.webp" type="image/webp">
                 <img src="${preview}.jpg" alt="превью iphone" width="166" height="103">
              </picture>

              <p class="card__data">
                 <span class="card__client">Клиент: ${client}</span>
                 <time class="card__date" datetime="${year}">год: ${year}</time>
              </p>

              <h3 class="card__title">${type}</h3>
           </article>
        `;
      return li;
    });

    portfolioList.append(...cards);
  };

  const initPortfolio = async () => {
    const store = await createStore();

    renderCard(store.cardData);

    portfolioAdd.addEventListener("click", () => {
      renderCard(store.cardData);
      if (store.length === store.counter) {
        portfolioAdd.remove();
      }
    });
  };

  initPortfolio();
}
