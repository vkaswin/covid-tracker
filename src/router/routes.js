export const routes = [
  {
    name: "CovidList",
    path: "covid",
    componentPath: "layout/MainLayout",
    children: [
      {
        path: "list",
        componentPath: "pages/CovidList/AllState",
      },
      {
        path: "state/:state",
        componentPath: "pages/CovidList/StateByDate",
      },
    ],
  },
];
