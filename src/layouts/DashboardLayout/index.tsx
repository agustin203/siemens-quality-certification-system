import { type ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  IconCertificate,
  IconChartBar,
  IconChartPie,
  IconClipboardCheck,
  IconClipboardList,
  IconHistory,
  IconHome,
  IconListCheck,
} from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';

import Button from '@material-hu/components/design-system/Buttons/Button';
import HomeHeader from '@material-hu/components/design-system/Header/Home';
import Sidebar from '@material-hu/components/design-system/Sidebar';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
} from '@material-hu/components/design-system/Sidebar/constants';
import { type NavSectionProps } from '@material-hu/components/design-system/Sidebar/types';

import humandLogo from '../../assets/humand.svg';
import { useAuth } from '../../providers/AuthContext';

const SECTIONS: NavSectionProps[] = [
  {
    key: 'main',
    title: 'Main',
    items: [
      { key: 'home', title: 'Home', path: '/', icon: <IconHome /> },
      {
        key: 'processes',
        title: 'Procesos',
        path: '/processes',
        icon: <IconClipboardList />,
      },
      {
        key: 'operator-processes',
        title: 'Mis procesos',
        path: '/operator/processes',
        icon: <IconListCheck />,
      },
      {
        key: 'operator',
        title: 'Mis certificaciones',
        path: '/operator',
        icon: <IconCertificate />,
      },
      {
        key: 'operator-history',
        title: 'Mi historial',
        path: '/operator/history',
        icon: <IconHistory />,
      },
      {
        key: 'oro-bandeja',
        title: 'Bandeja ORO',
        path: '/oro',
        icon: <IconClipboardCheck />,
      },
      {
        key: 'oro-history',
        title: 'Historial ORO',
        path: '/oro/history',
        icon: <IconHistory />,
      },
      {
        key: 'admin-dashboard',
        title: 'Dashboard Admin',
        path: '/admin',
        icon: <IconChartBar />,
      },
      {
        key: 'supervisor-dashboard',
        title: 'Dashboard Supervisor',
        path: '/supervisor',
        icon: <IconChartPie />,
      },
    ],
  },
];

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <HomeHeader
        onOpenMenu={() => setIsCollapsed(prev => !prev)}
        logoSrc={humandLogo}
        logoAlt="Humand"
        hideNotificationsButton
        hideSupportButton
        isAdmin={false}
        avatarProps={{ text: 'U' }}
        avatarPopoverContent={
          <Button
            onClick={() => logout()}
            variant="text"
          >
            Cerrar sesión
          </Button>
        }
        onOpenLanguageMenu={() => {}}
        supportButtonProps={{ href: '#' }}
        sx={{
          position: 'sticky',
        }}
      />
      <Stack sx={{ flexDirection: 'row' }}>
        <Sidebar
          isCollapsed={isCollapsed}
          pathname={pathname}
          sections={SECTIONS}
          openMenu={() => setIsCollapsed(false)}
          sx={{
            position: 'sticky',
            top: '70px',
            bottom: 0,
            left: 0,
            height: 'calc(100vh - 70px)',
          }}
        />
        <Stack
          component="main"
          sx={{
            flex: 1,
            pt: 5,
            pb: 5,
            px: 12,
            maxWidth: `calc(100% - ${sidebarWidth}px)`,
            bgcolor: 'new.background.layout.default',
            minHeight: 'calc(100vh - 70px)',
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};
