import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/analytics/summary`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Stack justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Stack>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 520,
    totalUsers: 1,
    totalCategories: 20
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${(metrics.totalRevenue || 0).toLocaleString()}`,
      sub: 'All-time gross sales',
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#2e7d32' }} />,
      bg: theme.palette.mode === 'dark' ? '#1b2e1e' : '#e8f5e9'
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders || 0,
      sub: 'Customer checkouts',
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: '#1976d2' }} />,
      bg: theme.palette.mode === 'dark' ? '#152438' : '#e3f2fd'
    },
    {
      title: 'Active Products',
      value: metrics.totalProducts || 520,
      sub: 'Items currently in catalog',
      icon: <CategoryOutlinedIcon sx={{ fontSize: 32, color: '#ed6c02' }} />,
      bg: theme.palette.mode === 'dark' ? '#332314' : '#fff3e0'
    },
    {
      title: 'Registered Users',
      value: metrics.totalUsers || 1,
      sub: 'Customer base',
      icon: <PeopleOutlineIcon sx={{ fontSize: 32, color: '#9c27b0' }} />,
      bg: theme.palette.mode === 'dark' ? '#2d1833' : '#f3e5f5'
    }
  ];

  const maxSale = Math.max(...(data?.monthlySales?.map((m) => m.sales) || [100]), 100);

  return (
    <Stack spacing={4} sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Overview Cards */}
      <Grid container spacing={3}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={1} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.sub}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: '50%', backgroundColor: card.bg }}>
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Sales Trend Bar Visualizer */}
        <Grid item xs={12} md={7}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              📈 Monthly Revenue Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Estimated gross revenue progression (in USD)
            </Typography>

            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ height: 220, pt: 2, px: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              {data?.monthlySales?.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.sales / maxSale) * 180));
                return (
                  <Stack key={idx} alignItems="center" spacing={1} sx={{ width: '14%' }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      ${item.sales}
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 42,
                        height: `${heightPercent}px`,
                        borderRadius: '6px 6px 0 0',
                        background: 'linear-gradient(180deg, #e53935 0%, #ff8a80 100%)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scaleY(1.05)',
                          filter: 'brightness(1.1)'
                        }
                      }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {item.month}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Top Categories Distribution */}
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              🗂️ Category Inventory Split
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Distribution of 520 catalog items
            </Typography>

            <Stack spacing={2}>
              {data?.categoryStats?.map((cat, idx) => {
                const percentage = Math.round((cat.count / 520) * 100);
                return (
                  <Box key={idx}>
                    <Stack flexDirection="row" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" fontWeight={500}>
                        {cat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cat.count} items ({percentage}%)
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#eee',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(100, percentage * 8)}%`,
                          height: '100%',
                          backgroundColor: ['#e53935', '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#0097a7'][idx % 6],
                          borderRadius: 4
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};
