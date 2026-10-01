import { Box, Button, IconButton, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch } from 'react-redux';
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from '../CartSlice';
import { Link } from 'react-router-dom';

export const CartItem = ({id,thumbnail,title,category,brand,price,quantity,stockQuantity,productId,checkout=false}) => {

    const dispatch=useDispatch()
    const theme=useTheme()
    const is900=useMediaQuery(theme.breakpoints.down(900))
    const is480=useMediaQuery(theme.breakpoints.down(480))
    const is552=useMediaQuery(theme.breakpoints.down(552))

    const handleAddQty=()=>{
        const update={_id:id,quantity:quantity+1}
        dispatch(updateCartItemByIdAsync(update))
    }
    const handleRemoveQty=()=>{
        if(quantity===1){
            dispatch(deleteCartItemByIdAsync(id))
        }
        else{
            const update={_id:id,quantity:quantity-1}
            dispatch(updateCartItemByIdAsync(update))
        }
    }

    const handleProductRemove=()=>{
        dispatch(deleteCartItemByIdAsync(id))
    }

    if (checkout) {
        return (
            <Paper elevation={0} sx={{ p: 1.5, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: 'background.paper', width: '100%' }}>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} columnGap={2}>
                    <Box component={Link} to={`/product-details/${productId}`} sx={{ width: 64, height: 64, minWidth: 64, borderRadius: 1.5, overflow: 'hidden', bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={thumbnail} alt={title} />
                    </Box>

                    <Stack sx={{ flex: 1, minWidth: 0 }}>
                        <Typography component={Link} to={`/product-details/${productId}`} sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                            {brand}
                        </Typography>
                        <Stack flexDirection={'row'} alignItems={'center'} columnGap={1} mt={0.5}>
                            <Typography variant='caption' color='text.secondary'>Qty: {quantity}</Typography>
                            <Typography variant='caption' color='text.secondary'>•</Typography>
                            <Typography variant='caption' fontWeight={600}>${price} each</Typography>
                        </Stack>
                    </Stack>

                    <Stack alignItems={'flex-end'} spacing={0.5}>
                        <Typography variant='subtitle2' fontWeight={700}>
                            ${(price * quantity).toFixed(2)}
                        </Typography>
                        <IconButton size='small' color='error' onClick={handleProductRemove} sx={{ p: 0.5 }}>
                            <DeleteOutlineIcon fontSize='small' />
                        </IconButton>
                    </Stack>
                </Stack>
            </Paper>
        );
    }

  return (
    <Stack bgcolor={'background.paper'} component={Paper} p={2} elevation={1} borderRadius={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
        
        {/* image and details */}
        <Stack flexDirection={'row'} rowGap={'1rem'} alignItems={'center'} columnGap={2} flexWrap={'wrap'}>

            <Stack width={is552?"auto":'140px'} height={is552?"auto":'140px'} component={Link} to={`/product-details/${productId}`} sx={{ bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9', borderRadius: 2, p: 1 }}>
                <img style={{width:"100%",height:is552?"auto":"100%",aspectRatio:is552?1/1:'',objectFit:'contain'}} src={thumbnail} alt={`${title} image unavailabe`} />
            </Stack>

            <Stack>
                <Typography component={Link} to={`/product-details/${productId}`} sx={{textDecoration:"none",color:theme.palette.primary.main}} variant='h6' fontWeight={500}>{title}</Typography>
                <Typography variant='body2' color={'text.secondary'}>{brand}</Typography>
                <Typography mt={1} variant='body2'>Quantity</Typography>
                <Stack flexDirection={'row'} alignItems={'center'} columnGap={0.5}>
                    <IconButton size='small' onClick={handleRemoveQty}><RemoveIcon fontSize='small'/></IconButton>
                    <Typography sx={{ px: 1, fontWeight: 600 }}>{quantity}</Typography>
                    <IconButton size='small' onClick={handleAddQty}><AddIcon fontSize='small'/></IconButton>
                </Stack>
            </Stack>
        </Stack>

        {/* price and remove button */}
        <Stack justifyContent={'space-evenly'} alignSelf={is552?'flex-end':''} height={'100%'} rowGap={'1rem'} alignItems={'flex-end'}>
            <Typography variant='h6' fontWeight={600}>${(price * quantity).toFixed(2)}</Typography>
            <Button size={is480?"small":"medium"} onClick={handleProductRemove} variant='outlined' color='error'>Remove</Button>
        </Stack>
    </Stack>
  )
}
