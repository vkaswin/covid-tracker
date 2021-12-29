import React, { lazy, Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "router/routes";
const PageNotFound = lazy(() => import("../pages/404"));

export const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HashRouter>
        <Routes>
          {routes.map(({ path, componentPath, children = [] }) => {
            if (children.length === 0) {
              const PageComponent = lazy(() =>
                import(
                  /* webpackChunkName: "[request]" */ `../${componentPath}`
                )
              );
              return (
                <Route key={path} path={path} element={<PageComponent />} />
              );
            } else {
              const LayoutComponent = lazy(() =>
                import(
                  /* webpackChunkName: "[request]" */ `../${componentPath}`
                )
              );
              return (
                <Route key={path} path={path} element={<LayoutComponent />}>
                  {children.map(
                    ({
                      path: childPath,
                      componentPath: childComponentPath,
                    }) => {
                      const ChildComponent = lazy(() =>
                        import(
                          /* webpackChunkName: "[request]" */ `../${childComponentPath}`
                        )
                      );
                      return (
                        <Route
                          key={childPath}
                          path={childPath}
                          element={<ChildComponent />}
                        />
                      );
                    }
                  )}
                </Route>
              );
            }
          })}
          <Route path="/" element={<Navigate replace to="/covid/list" />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </HashRouter>
    </Suspense>
  );
};
