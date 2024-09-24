import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Vérification de la présence de data et focus avant de trier
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  const nextCard = () => {
    // J'ai ajouté -1 à la longueur de byDateDesc pour éviter que l'index ne dépasse la taille du tableau
    setIndex(prevIndex => (prevIndex < (byDateDesc.length - 1) ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    const timer = setTimeout(nextCard, 5000); // Mise à jour du slider toutes les 4 secondes
    return () => clearTimeout(timer); // Nettoyage de l'effet pour éviter les fuites de mémoire
  }, [index, byDateDesc]); // Dépendance à index et byDateDesc

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div key={`${event.date}-${event.title}`} className={`SlideCard SlideCard--${index === idx ? 'display' : 'hide'}`}>
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((_, radioIdx) => (
            <input
              // eslint-disable-next-line react/no-array-index-key
              key={`radio-${radioIdx}`} // Clé unique pour chaque radio
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)} // Ajout d'un changement d'index lorsque le radio est sélectionné
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
