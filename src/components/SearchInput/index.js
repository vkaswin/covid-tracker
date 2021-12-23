import React from "react";

import styles from "./SearchInput.module.scss";

export const SearchInput = ({ onChange, value, placeholder }) => {
  return (
    <div className={styles.search_input}>
      <input
        id="search-input"
        placeholder={placeholder}
        defaultValue={value}
        onChange={onChange}
        autoComplete="off"
      />
      <i className="fas fa-search"></i>
    </div>
  );
};
