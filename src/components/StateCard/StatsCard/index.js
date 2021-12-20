import React from "react";

import styles from "./StatsCard.module.scss";

export const StatsCard = ({ title, count }) => {
  let { confirmed = 0, deceased = 0, recovered = 0 } = count;
  return (
    <div className={styles.stats_detail}>
      <div>
        <b>{title}</b>
      </div>
      <div className={styles.stats_count_wrapper}>
        <div className={styles.stats_count}>
          <span>Confirmed</span>
          <span>:</span>
          <span>{confirmed ?? 0}</span>
        </div>
        <div className={styles.stats_count}>
          <span>Recovered</span>
          <span>:</span>
          <span>{recovered ?? 0}</span>
        </div>
        <div className={styles.stats_count}>
          <span>Deceased</span>
          <span>:</span>
          <span>{deceased ?? 0}</span>
        </div>
      </div>
    </div>
  );
};
