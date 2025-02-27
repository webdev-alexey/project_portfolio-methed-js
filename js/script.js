{
  //! Модальное окно

  const presentOrderBtn = document.querySelector(".present__order-btn");
  const pageOverlayModal = document.querySelector(".page__overlay_modal");
  const modalClose = document.querySelector(".modal__close");

  const handlerModal = (openBtn, modal, openSelector, closeTrigger, sk) => {
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
      const anim = () => {
        opacity -= speed[sk];
        modal.style.opacity = opacity;
        if (opacity > 0) {
          requestAnimationFrame(anim);
        } else {
          modal.classList.remove(openSelector);
          opacity = 0;
          modal.style.opacity = 0;
          enabledScroll();
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
    "slow"
  );
}
