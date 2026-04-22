import { lazy } from 'react';

export const processesRoutes = {
  list: () => '/processes',
  detail: (id: string | number) => `/processes/${id}`,
};

const ProcessList = lazy(() => import('./List'));
const ProcessDetail = lazy(() => import('./Detail'));

export const processesRouteConfig = [
  { path: processesRoutes.list(), element: <ProcessList /> },
  { path: `${processesRoutes.list()}/:id`, element: <ProcessDetail /> },
];
