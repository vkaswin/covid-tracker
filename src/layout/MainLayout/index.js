import React from "react";
import { Outlet } from "react-router-dom";

import styles from "./MainLayout.module.scss";

const MainLayout = () => {
  return (
    <div className={styles.main_container}>
      <h1 className={styles.page_title}>Covid Tracker - India</h1>
      <Outlet />
    </div>
  );
};

export default MainLayout;
