import React from "react";


import styles from "./SearchInput.module.scss";

export const SearchInput = ({ onChange, value, placeholder }) => {
  return (
    <div className={styles.search_input}>
      <input
        placeholder={placeholder}
        defaultValue={value}
        onChange={onChange}
      />
      <i className="fas fa-search"></i>
    </div>
  );
};
