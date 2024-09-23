import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";


import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? - 1 : 1 
  );                                                     
  const nextCard = () => {
    setTimeout(
      // J'ai ajouté -1 à la longueur de byDateDesc pour éviter que l'index ne dépasse la taille du tableau, 
        // ce qui permet de faire défiler les éléments sans provoquer d'erreur d'index.
      () => setIndex(index < byDateDesc.length -1 ? index + 1 : 0), 
      4000
    );
  };
  useEffect(() => {
    nextCard();
  });
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <>
          <div
            key={`${event.date}-${event.title}`}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  key={`${event.date}-${event.description}`}
                  type="radio"
                  name="radio-button"
                  // J'ai corrigé la comparaison pour m'assurer que l'index actuel est correctement comparé à radioIdx,
                    // cela permet de pouvoir suivre correctement l'avancement des slides.
                  checked={index === radioIdx} 
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;
