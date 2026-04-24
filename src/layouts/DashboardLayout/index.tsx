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
import { type UserRole, useAuth } from '../../providers/AuthContext';

type NavItem = NonNullable<NavSectionProps['items']>[number] & {
  roles?: UserRole[];
};

const ALL_ITEMS: NavItem[] = [
  {
    key: 'home',
    title: 'Home',
    path: '/',
    icon: <IconHome />,
  },
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
    roles: ['operator'],
  },
  {
    key: 'operator',
    title: 'Mis certificaciones',
    path: '/operator',
    icon: <IconCertificate />,
    roles: ['operator'],
  },
  {
    key: 'operator-history',
    title: 'Mi historial',
    path: '/operator/history',
    icon: <IconHistory />,
    roles: ['operator'],
  },
  {
    key: 'oro-bandeja',
    title: 'Bandeja ORO',
    path: '/oro',
    icon: <IconClipboardCheck />,
    roles: ['oro'],
  },
  {
    key: 'oro-history',
    title: 'Historial ORO',
    path: '/oro/history',
    icon: <IconHistory />,
    roles: ['oro'],
  },
  {
    key: 'admin-dashboard',
    title: 'Dashboard Admin',
    path: '/admin',
    icon: <IconChartBar />,
    roles: ['admin'],
  },
  {
    key: 'supervisor-dashboard',
    title: 'Dashboard Supervisor',
    path: '/supervisor',
    icon: <IconChartPie />,
    roles: ['supervisor'],
  },
];

function buildSections(role: UserRole): NavSectionProps[] {
  const filtered = ALL_ITEMS.filter(
    item => !item.roles || item.roles.includes(role),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items = filtered.map(({ roles: _roles, ...rest }) => rest);
  return [{ key: 'main', title: 'Main', items }];
}

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  const role: UserRole = user?.role ?? 'operator';
  const sections = buildSections(role);
  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const avatarText = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'U';

  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <HomeHeader
        onOpenMenu={() => setIsCollapsed(prev => !prev)}
        logoSrc={humandLogo}
        logoAlt="Humand"
        hideNotificationsButton
        hideSupportButton
        isAdmin={false}
        avatarProps={{ text: avatarText }}
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
          sections={sections}
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
