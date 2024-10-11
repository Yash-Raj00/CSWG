import React from "react";
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import styles from "../../page.module.css";

const ScrollButton = () => {
  return (
    <div className={styles.arrowBtns}>
      <FaArrowCircleUp
        className={styles.arrowBtn}
        onClick={() => window.scrollTo({ top: 0, 
          behavior: "smooth"
         })}
      />
      <FaArrowCircleDown
        className={styles.arrowBtn}
        onClick={() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          })
        }
      />
    </div>
  );
};

export default ScrollButton;
