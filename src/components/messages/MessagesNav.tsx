'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Container, 
  Badge, 
  Avatar, 
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';

interface MessageNavLink {
  href: string;
  label: string;
  badge?: number;
}

export function MessagesNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const links: MessageNavLink[] = [
    { href: '/messages', label: 'Messages' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/dashboard', label: 'Dashboard' },
    ...(user?.role === 'ADMIN' ? [
      { href: '/admin', label: 'Admin' }
    ] : [])
  ];

  return (
    <AppBar 
      position="static" 
      color="inherit" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        mb: 3
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {links.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  color: pathname === link.href ? 'primary.main' : 'text.secondary',
                  borderBottom: '2px solid',
                  borderColor: pathname === link.href ? 'primary.main' : 'transparent',
                  borderRadius: 0,
                  px: 2,
                  '&:hover': {
                    borderColor: pathname === link.href ? 'primary.main' : 'divider',
                  }
                }}
              >
                {link.badge ? (
                  <Badge badgeContent={link.badge} color="primary">
                    {link.label}
                  </Badge>
                ) : (
                  link.label
                )}
              </Button>
            ))}
          </Box>
          
          {user && (
            <Box sx={{ ml: 'auto' }}>
              <Tooltip title="Open profile menu">
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar 
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.avatar || undefined}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem 
                  onClick={handleCloseUserMenu}
                  component={Link}
                  href="/profile"
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem 
                  onClick={handleCloseUserMenu}
                  component={Link}
                  href="/dashboard"
                >
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
                <MenuItem 
                  onClick={handleCloseUserMenu}
                  component={Link}
                  href="/bookings"
                >
                  <Typography textAlign="center">My Bookings</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}