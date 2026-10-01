import { Stack, TextField, Typography ,Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants'
import {motion} from 'framer-motion'


export const Checkout = () => {

    const status=''
    const addresses=useSelector(selectAddresses)
    const [selectedAddress,setSelectedAddress]=useState(addresses[0])
    const [selectedPaymentMethod,setSelectedPaymentMethod]=useState('cash')
    const { register, handleSubmit, watch, reset,formState: { errors }} = useForm()
    const dispatch=useDispatch()
    const loggedInUser=useSelector(selectLoggedInUser)
    const addressStatus=useSelector(selectAddressStatus)
    const navigate=useNavigate()
    const cartItems=useSelector(selectCartItems)
    const orderStatus=useSelector(selectOrderStatus)
    const currentOrder=useSelector(selectCurrentOrder)
    const orderTotal=cartItems.reduce((acc,item)=>(item.product.price*item.quantity)+acc,0)
    const theme=useTheme()
    const is900=useMediaQuery(theme.breakpoints.down(900))
    const is480=useMediaQuery(theme.breakpoints.down(480))

    // Coupon code state
    const [couponInput, setCouponInput] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [couponLoading, setCouponLoading] = useState(false)
    const [couponMessage, setCouponMessage] = useState({ text: '', isError: false })

    const discountAmount = appliedCoupon ? (orderTotal * appliedCoupon.discountPercentage) / 100 : 0
    const finalOrderTotal = Math.max(0, orderTotal - discountAmount) + SHIPPING + TAXES
    
    useEffect(()=>{
        if(addressStatus==='fulfilled'){
            reset()
        }
        else if(addressStatus==='rejected'){
            alert('Error adding your address')
        }
    },[addressStatus])

    useEffect(()=>{
        if(currentOrder && currentOrder?._id){
            dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            navigate(`/order-success/${currentOrder?._id}`)
        }
    },[currentOrder])
    
    const handleAddAddress=(data)=>{
        const address={...data,user:loggedInUser._id}
        dispatch(addAddressAsync(address))
    }

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return
        setCouponLoading(true)
        setCouponMessage({ text: '', isError: false })
        try {
            const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'
            const res = await fetch(`${baseUrl}/coupons/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponInput.trim() })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setAppliedCoupon(data)
                setCouponMessage({ text: data.message, isError: false })
            } else {
                setAppliedCoupon(null)
                setCouponMessage({ text: data.message || 'Invalid coupon code', isError: true })
            }
        } catch (err) {
            setCouponMessage({ text: 'Error applying coupon, please try again', isError: true })
        } finally {
            setCouponLoading(false)
        }
    }

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null)
        setCouponInput('')
        setCouponMessage({ text: '', isError: false })
    }

    const handleCreateOrder=()=>{
        const order={
            user:loggedInUser._id,
            item:cartItems,
            address:selectedAddress,
            paymentMode:selectedPaymentMethod,
            total: Math.round(finalOrderTotal * 100) / 100,
            coupon: appliedCoupon ? appliedCoupon.code : null,
            discount: Math.round(discountAmount * 100) / 100
        }
        dispatch(createOrderAsync(order))
    }

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', p: { xs: 2, md: 3 }, mb: 8, mt: 1 }}>
        <Grid container spacing={4} alignItems="flex-start">

            {/* Left Column: Shipping & Payment Information */}
            <Grid item xs={12} md={7} lg={7.5}>
                <Stack spacing={3}>

                    {/* Page Heading */}
                    <Stack flexDirection={'row'} alignItems={'center'} columnGap={1}>
                        <motion.div whileHover={{ x: -4 }}>
                            <IconButton component={Link} to={"/cart"} sx={{ p: 1 }}>
                                <ArrowBackIcon fontSize={is480 ? "medium" : 'large'} />
                            </IconButton>
                        </motion.div>
                        <Typography variant={is480 ? 'h5' : 'h4'} fontWeight={700}>
                            Shipping Information
                        </Typography>
                    </Stack>

                    {/* Address Form Card */}
                    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: 'background.paper' }}>
                        <Typography variant='h6' fontWeight={600} mb={0.5}>
                            Add New Address
                        </Typography>
                        <Typography variant='body2' color='text.secondary' mb={2.5}>
                            Enter your delivery address details below
                        </Typography>

                        <Box component={'form'} noValidate onSubmit={handleSubmit(handleAddAddress)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant='caption' fontWeight={600} color='text.secondary' gutterBottom display="block">
                                        ADDRESS TYPE
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        placeholder='e.g. Home, Office, Business'
                                        {...register("type", { required: "Address type is required" })}
                                        error={Boolean(errors.type)}
                                        helperText={errors.type?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant='caption' fontWeight={600} color='text.secondary' gutterBottom display="block">
                                        STREET ADDRESS
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        placeholder='Street name, flat, house no.'
                                        {...register("street", { required: "Street is required" })}
                                        error={Boolean(errors.street)}
                                        helperText={errors.street?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant='caption' fontWeight={600} color='text.secondary' gutterBottom display="block">
                                        COUNTRY
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        placeholder='e.g. India, United States'
                                        {...register("country", { required: "Country is required" })}
                                        error={Boolean(errors.country)}
                                        helperText={errors.country?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant='caption' fontWeight={600} color='text.secondary' gutterBottom display="block">
                                        PHONE NUMBER
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        type='tel'
                                        placeholder='10-digit mobile number'
                                        {...register("phoneNumber", { required: "Phone number is required" })}
                                        error={Boolean(errors.phoneNumber)}
                                        helperText={errors.phoneNumber?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography variant='caption' fontWeight={600} color='text.secondary' gutterBottom display="block">
                                        CITY
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        placeholder='City'
                                        {...register("city", { required: "City is required" })}
                                        error={Boolean(errors.city)}
                                        helperText={errors.city?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography variant='caption' fontWeight={600} color='text.secondary' gutterBottom display="block">
                                        STATE
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        placeholder='State'
                                        {...register("state", { required: "State is required" })}
                                        error={Boolean(errors.state)}
                                        helperText={errors.state?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography variant='caption' fontWeight={600} color='text.secondary' gutterBottom display="block">
                                        POSTAL CODE
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        type='number'
                                        placeholder='Postal Code / PIN'
                                        {...register("postalCode", { required: "Postal code is required" })}
                                        error={Boolean(errors.postalCode)}
                                        helperText={errors.postalCode?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack flexDirection={'row'} justifyContent={'flex-end'} columnGap={1.5} mt={1}>
                                        <Button color='inherit' variant='outlined' onClick={() => reset()} sx={{ textTransform: 'none' }}>
                                            Reset Form
                                        </Button>
                                        <LoadingButton loading={addressStatus === 'pending'} type='submit' variant='contained' sx={{ textTransform: 'none', px: 3 }}>
                                            Save Address
                                        </LoadingButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Existing Addresses Section */}
                    {addresses.length > 0 && (
                        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: 'background.paper' }}>
                            <Typography variant='h6' fontWeight={600} mb={0.5}>
                                Choose from Saved Addresses
                            </Typography>
                            <Typography variant='body2' color='text.secondary' mb={2}>
                                Select where you would like this order to be delivered
                            </Typography>

                            <Grid container spacing={2}>
                                {addresses.map((address, index) => {
                                    const isSelected = selectedAddress?._id === address._id;
                                    return (
                                        <Grid item xs={12} sm={6} key={address._id}>
                                            <Paper
                                                elevation={0}
                                                onClick={() => setSelectedAddress(addresses[index])}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2.5,
                                                    cursor: 'pointer',
                                                    border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                                                    bgcolor: isSelected 
                                                        ? (theme.palette.mode === 'dark' ? '#2a1a1a' : '#fff5f5') 
                                                        : 'background.paper',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main
                                                    }
                                                }}
                                            >
                                                <Stack flexDirection={'row'} alignItems={'center'} columnGap={1} mb={0.5}>
                                                    <Radio
                                                        checked={isSelected}
                                                        name='addressRadioGroup'
                                                        value={address._id}
                                                        onChange={() => setSelectedAddress(addresses[index])}
                                                        size='small'
                                                        sx={{ p: 0.5 }}
                                                    />
                                                    <Typography fontWeight={700} fontSize={'0.95rem'}>
                                                        {address.type}
                                                    </Typography>
                                                </Stack>

                                                <Box sx={{ pl: 3.5 }}>
                                                    <Typography variant='body2' color='text.primary' fontWeight={500}>
                                                        {address.street}
                                                    </Typography>
                                                    <Typography variant='caption' color='text.secondary' display='block'>
                                                        {address.city}, {address.state} {address.postalCode}
                                                    </Typography>
                                                    <Typography variant='caption' color='text.secondary' display='block'>
                                                        {address.country} • Phone: {address.phoneNumber}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Paper>
                    )}

                    {/* Payment Methods Card */}
                    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: 'background.paper' }}>
                        <Typography variant='h6' fontWeight={600} mb={0.5}>
                            Payment Method
                        </Typography>
                        <Typography variant='body2' color='text.secondary' mb={2}>
                            Select your preferred payment mode
                        </Typography>

                        <Stack spacing={1.5}>
                            <Paper
                                elevation={0}
                                onClick={() => setSelectedPaymentMethod('COD')}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    border: `1.5px solid ${selectedPaymentMethod === 'COD' ? theme.palette.primary.main : theme.palette.divider}`,
                                    bgcolor: selectedPaymentMethod === 'COD' 
                                        ? (theme.palette.mode === 'dark' ? '#2a1a1a' : '#fff5f5') 
                                        : 'background.paper',
                                    display: 'flex',
                                    alignItems: 'center',
                                    columnGap: 1.5
                                }}
                            >
                                <Radio
                                    checked={selectedPaymentMethod === 'COD'}
                                    name='paymentMethod'
                                    value='COD'
                                    onChange={() => setSelectedPaymentMethod('COD')}
                                    size='small'
                                    sx={{ p: 0.5 }}
                                />
                                <Box>
                                    <Typography fontWeight={600}>💵 Cash on Delivery (COD)</Typography>
                                    <Typography variant='caption' color='text.secondary'>Pay with cash upon receipt of order</Typography>
                                </Box>
                            </Paper>

                            <Paper
                                elevation={0}
                                onClick={() => setSelectedPaymentMethod('CARD')}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    border: `1.5px solid ${selectedPaymentMethod === 'CARD' ? theme.palette.primary.main : theme.palette.divider}`,
                                    bgcolor: selectedPaymentMethod === 'CARD' 
                                        ? (theme.palette.mode === 'dark' ? '#2a1a1a' : '#fff5f5') 
                                        : 'background.paper',
                                    display: 'flex',
                                    alignItems: 'center',
                                    columnGap: 1.5
                                }}
                            >
                                <Radio
                                    checked={selectedPaymentMethod === 'CARD'}
                                    name='paymentMethod'
                                    value='CARD'
                                    onChange={() => setSelectedPaymentMethod('CARD')}
                                    size='small'
                                    sx={{ p: 0.5 }}
                                />
                                <Box>
                                    <Typography fontWeight={600}>💳 Credit / Debit Card</Typography>
                                    <Typography variant='caption' color='text.secondary'>Instant payment simulation (Test Card)</Typography>
                                </Box>
                            </Paper>
                        </Stack>
                    </Paper>

                </Stack>
            </Grid>

            {/* Right Column: Order Summary & Promo Code */}
            <Grid item xs={12} md={5} lg={4.5}>
                <Box sx={{ position: { md: 'sticky' }, top: '90px' }}>
                    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: 'background.paper' }}>
                        <Typography variant='h5' fontWeight={700} mb={2}>
                            Order Summary
                        </Typography>

                        {/* Cart items list */}
                        <Cart checkout={true} />

                        {/* Promo / Coupon Code Section */}
                        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant='subtitle2' fontWeight={700} mb={1}>
                                🏷️ Have a Promo Code?
                            </Typography>

                            {appliedCoupon ? (
                                <Stack
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    sx={{
                                        bgcolor: theme.palette.mode === 'dark' ? '#1b2e1e' : '#e8f5e9',
                                        p: 1.5,
                                        borderRadius: 2,
                                        border: '1px solid #81c784'
                                    }}
                                >
                                    <Box>
                                        <Typography fontWeight={700} color={'#2e7d32'}>
                                            Applied: {appliedCoupon.code}
                                        </Typography>
                                        <Typography variant='caption' color={'#2e7d32'} fontWeight={600}>
                                            {appliedCoupon.discountPercentage}% OFF (-${discountAmount.toFixed(2)})
                                        </Typography>
                                    </Box>
                                    <Button size='small' color='error' onClick={handleRemoveCoupon} sx={{ textTransform: 'none', fontWeight: 600 }}>
                                        Remove
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack spacing={1}>
                                    <Stack flexDirection={'row'} columnGap={1}>
                                        <TextField
                                            size='small'
                                            fullWidth
                                            placeholder='e.g. CARTIFY50'
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                        />
                                        <LoadingButton
                                            variant='contained'
                                            size='small'
                                            loading={couponLoading}
                                            onClick={handleApplyCoupon}
                                            sx={{ minWidth: '80px', textTransform: 'none' }}
                                        >
                                            Apply
                                        </LoadingButton>
                                    </Stack>

                                    {couponMessage.text && (
                                        <Typography variant='caption' color={couponMessage.isError ? 'error' : 'success.main'} fontWeight={500}>
                                            {couponMessage.text}
                                        </Typography>
                                    )}

                                    <Typography variant='caption' color='text.secondary'>
                                        Available: <b>CARTIFY50</b> (50%), <b>WELCOME20</b> (20%), <b>SAVE10</b> (10%)
                                    </Typography>
                                </Stack>
                            )}

                            {appliedCoupon && (
                                <Box mt={2} pt={1.5} borderTop={`1px dashed ${theme.palette.divider}`}>
                                    <Stack flexDirection={'row'} justifyContent={'space-between'} color='success.main'>
                                        <Typography variant='body2' fontWeight={600}>Coupon Discount ({appliedCoupon.discountPercentage}%)</Typography>
                                        <Typography variant='body2' fontWeight={700}>-${discountAmount.toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack flexDirection={'row'} justifyContent={'space-between'} mt={1}>
                                        <Typography variant='h6' fontWeight={700}>Grand Total</Typography>
                                        <Typography variant='h6' fontWeight={800} color='primary.main'>${finalOrderTotal.toFixed(2)}</Typography>
                                    </Stack>
                                </Box>
                            )}
                        </Box>

                        {/* Pay and Order Button */}
                        <Box mt={3}>
                            <LoadingButton
                                fullWidth
                                loading={orderStatus === 'pending'}
                                variant='contained'
                                onClick={handleCreateOrder}
                                size='large'
                                sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
                            >
                                Pay & Place Order (${finalOrderTotal.toFixed(2)})
                            </LoadingButton>
                        </Box>
                    </Paper>
                </Box>
            </Grid>

        </Grid>
    </Box>
  )
}
