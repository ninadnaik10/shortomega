'use client';

import * as React from 'react';
import {
    Avatar,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Button,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import userAtom from '@/atoms/userAtom';
import { useAtom } from 'jotai';
import useLogOut from '@/hooks/useLogOut';

export default function ProfileMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [user] = useAtom(userAtom);
    const { logout } = useLogOut();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Avatar
                alt="Profile"
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                onClick={handleClick}
            />

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 4,
                    sx: { borderRadius: 3, overflow: 'visible' },
                }}
            >
                <Card sx={{ width: 280, boxShadow: 'none' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                            alt="Profile Picture"
                            sx={{ width: 70, height: 70, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h6">{user.name}</Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            {user.email}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack direction="row" justifyContent="center">
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<LogoutIcon />}
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Menu>
        </>
    );
}
