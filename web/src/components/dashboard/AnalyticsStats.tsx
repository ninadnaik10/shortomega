'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';

interface AnalyticsStatsProps {
    totalUrls: number;
    totalClicks: number;
    totalUniqueVisits: number;
    loading?: boolean;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition:
                    'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                },
            }}
        >
            <CardContent sx={{ flex: 1, p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: color,
                            color: 'white',
                        }}
                    >
                        {icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                            component="div"
                            fontWeight="bold"
                        >
                            {typeof value === 'number'
                                ? value.toLocaleString()
                                : value}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function AnalyticsStats({
    totalUrls,
    totalClicks,
    totalUniqueVisits,
    loading = false,
}: AnalyticsStatsProps) {
    const theme = useTheme();

    const stats = [
        {
            title: 'Total URLs',
            value: loading ? '-' : totalUrls,
            icon: <LinkIcon />,
            color: theme.palette.primary.main,
        },
        {
            title: 'Total Clicks',
            value: loading ? '-' : totalClicks,
            icon: <VisibilityIcon />,
            color: theme.palette.success.main,
        },
        {
            title: 'Unique Visitors',
            value: loading ? '-' : totalUniqueVisits,
            icon: <PeopleIcon />,
            color: theme.palette.info.main,
        },
        {
            title: 'Avg. Clicks per URL',
            value: loading
                ? '-'
                : totalUrls > 0
                  ? Math.round(totalClicks / totalUrls)
                  : 0,
            icon: <TrendingUpIcon />,
            color: theme.palette.warning.main,
        },
    ];

    return (
        <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
                Analytics Overview
            </Typography>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: 'repeat(4, 1fr)',
                    },
                    gap: 2,
                }}
            >
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </Stack>
        </Stack>
    );
}
