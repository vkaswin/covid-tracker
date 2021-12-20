import React, { useEffect, useState } from "react";

import styles from "./Pagination.module.scss";

export const Pagination = ({ activePage, totalPages, onPageChange }) => {
  const [pageList, setPageList] = useState([]);

  useEffect(() => {
    if (activePage < 4 || activePage > totalPages - 3) {
      setPageList([
        1,
        2,
        3,
        4,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]);
    } else if (activePage > 2 && totalPages > 7) {
      setPageList([
        1,
        2,
        "...",
        parseInt(activePage) - 1,
        parseInt(activePage),
        parseInt(activePage) + 1,
        "...",
        totalPages - 1,
        totalPages,
      ]);
    }
  }, [activePage, totalPages]);

  const handleNext = () => {
    if (parseInt(activePage) < totalPages) {
      onPageChange(parseInt(activePage) + 1);
    }
  };

  const handlePrevious = () => {
    if (parseInt(activePage) > 1) {
      onPageChange(parseInt(activePage) - 1);
    }
  };

  const handlePageChange = (page) => {
    if (parseInt(activePage) !== page && typeof page === "number") {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.pagination_container}>
      <button
        className={styles.pagination_prev}
        onClick={() => handlePrevious()}
        disabled={parseInt(activePage) === 1 ? true : false}
      >
        <i className="fas fa-chevron-left"></i>
        <label>Prev</label>
      </button>
      {pageList.map((list, index) => {
        return (
          <button
            key={index}
            className={styles.page_btn}
            aria-current={parseInt(activePage) === list ? true : false}
            onClick={() => handlePageChange(list)}
          >
            {list}
          </button>
        );
      })}
      <button
        className={styles.pagination_next}
        onClick={() => handleNext()}
        disabled={parseInt(activePage) === totalPages ? true : false}
      >
        <label>Next</label>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};
