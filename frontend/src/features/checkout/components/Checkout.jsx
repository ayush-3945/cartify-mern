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
    <Stack flexDirection={'row'} p={2} rowGap={10} justifyContent={'center'} flexWrap={'wrap'} mb={'5rem'} mt={2} columnGap={4} alignItems={'flex-start'}>

        {/* left box */}
        <Stack rowGap={4}>

            {/* heading */}
            <Stack flexDirection={'row'} columnGap={is480?0.3:1} alignItems={'center'}>
                <motion.div  whileHover={{x:-5}}>
                    <IconButton component={Link} to={"/cart"}><ArrowBackIcon fontSize={is480?"medium":'large'}/></IconButton>
                </motion.div>
                <Typography variant='h4'>Shipping Information</Typography>
            </Stack>

            {/* address form */}
            <Stack component={'form'} noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
                    <Stack>
                        <Typography  gutterBottom>Type</Typography>
                        <TextField placeholder='Eg. Home, Buisness' {...register("type",{required:true})}/>
                    </Stack>


                    <Stack>
                        <Typography gutterBottom>Street</Typography>
                        <TextField {...register("street",{required:true})}/>
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Country</Typography>
                        <TextField {...register("country",{required:true})}/>
                    </Stack>

                    <Stack>
                        <Typography  gutterBottom>Phone Number</Typography>
                        <TextField type='number' {...register("phoneNumber",{required:true})}/>
                    </Stack>

                    <Stack flexDirection={'row'}>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>City</Typography>
                            <TextField  {...register("city",{required:true})}/>
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>State</Typography>
                            <TextField  {...register("state",{required:true})}/>
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Postal Code</Typography>
                            <TextField type='number' {...register("postalCode",{required:true})}/>
                        </Stack>
                    </Stack>

                    <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>
                        <LoadingButton loading={status==='pending'} type='submit' variant='contained'>add</LoadingButton>
                        <Button color='error' variant='outlined' onClick={()=>reset()}>Reset</Button>
                    </Stack>
            </Stack>

            {/* existing address */}
            <Stack rowGap={3}>

                <Stack>
                    <Typography variant='h6'>Address</Typography>
                    <Typography variant='body2' color={'text.secondary'}>Choose from existing Addresses</Typography>
                </Stack>

                <Grid container gap={2} width={is900?"auto":'50rem'} justifyContent={'flex-start'} alignContent={'flex-start'}>
                        {
                            addresses.map((address,index)=>(
                                <FormControl item >
                                    <Stack key={address._id} p={is480?2:2} width={is480?'100%':'20rem'} height={is480?'auto':'15rem'}  rowGap={2} component={is480?Paper:Paper} elevation={1}>

                                        <Stack flexDirection={'row'} alignItems={'center'}>
                                            <Radio checked={selectedAddress===address} name='addressRadioGroup' value={selectedAddress} onChange={(e)=>setSelectedAddress(addresses[index])}/>
                                            <Typography>{address.type}</Typography>
                                        </Stack>

                                        {/* details */}
                                        <Stack>
                                            <Typography>{address.street}</Typography>
                                            <Typography>{address.state}, {address.city}, {address.country}, {address.postalCode}</Typography>
                                            <Typography>{address.phoneNumber}</Typography>
                                        </Stack>
                                    </Stack>
                                </FormControl>
                            ))
                        }
                </Grid>

            </Stack>
            
            {/* payment methods */}
            <Stack rowGap={3}>

                    <Stack>
                        <Typography variant='h6'>Payment Methods</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Please select a payment method</Typography>
                    </Stack>
                    
                    <Stack rowGap={2}>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod==='COD'} onChange={()=>setSelectedPaymentMethod('COD')}/>
                            <Typography>Cash</Typography>
                        </Stack>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio value={selectedPaymentMethod} name='paymentMethod' checked={selectedPaymentMethod==='CARD'} onChange={()=>setSelectedPaymentMethod('CARD')}/>
                            <Typography>Card</Typography>
                        </Stack>

                    </Stack>


            </Stack>
        </Stack>

        {/* right box */}
        <Stack width={is900?'100%':'28rem'} alignItems={is900?'flex-start':''} spacing={2}>
            <Typography variant='h4'>Order summary</Typography>
            <Cart checkout={true}/>

            {/* Promo / Coupon Code Section */}
            <Paper elevation={1} sx={{ p: 2, width: '100%', borderRadius: 2 }}>
                <Typography variant='subtitle1' fontWeight={600} mb={1}>🏷️ Have a Promo Code?</Typography>
                
                {appliedCoupon ? (
                    <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} bgcolor={'#e8f5e9'} p={1.5} borderRadius={1}>
                        <Box>
                            <Typography fontWeight={600} color={'#2e7d32'}>Applied: {appliedCoupon.code}</Typography>
                            <Typography variant='caption' color={'#2e7d32'}>{appliedCoupon.discountPercentage}% OFF (-${discountAmount.toFixed(2)})</Typography>
                        </Box>
                        <Button size='small' color='error' onClick={handleRemoveCoupon}>Remove</Button>
                    </Stack>
                ) : (
                    <Stack spacing={1}>
                        <Stack flexDirection={'row'} columnGap={1}>
                            <TextField
                                size='small'
                                fullWidth
                                placeholder='Enter CARTIFY50, WELCOME20'
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            />
                            <LoadingButton
                                variant='contained'
                                size='small'
                                loading={couponLoading}
                                onClick={handleApplyCoupon}
                                sx={{ minWidth: '80px' }}
                            >
                                Apply
                            </LoadingButton>
                        </Stack>
                        {couponMessage.text && (
                            <Typography variant='caption' color={couponMessage.isError ? 'error' : 'success.main'}>
                                {couponMessage.text}
                            </Typography>
                        )}
                        <Typography variant='caption' color='text.secondary'>
                            Available codes: <b>CARTIFY50</b> (50% off), <b>WELCOME20</b> (20% off), <b>SAVE10</b> (10% off)
                        </Typography>
                    </Stack>
                )}

                {appliedCoupon && (
                    <Box mt={2} pt={1} borderTop={'1px dashed #ccc'}>
                        <Stack flexDirection={'row'} justifyContent={'space-between'}>
                            <Typography color='success.main' fontWeight={500}>Coupon Discount ({appliedCoupon.discountPercentage}%)</Typography>
                            <Typography color='success.main' fontWeight={500}>-${discountAmount.toFixed(2)}</Typography>
                        </Stack>
                        <Stack flexDirection={'row'} justifyContent={'space-between'} mt={1}>
                            <Typography variant='h6' fontWeight={700}>Final Total</Typography>
                            <Typography variant='h6' fontWeight={700} color='primary.main'>${finalOrderTotal.toFixed(2)}</Typography>
                        </Stack>
                    </Box>
                )}
            </Paper>

            <LoadingButton fullWidth loading={orderStatus==='pending'} variant='contained' onClick={handleCreateOrder} size='large'>Pay and order</LoadingButton>
        </Stack>

    </Stack>
  )
}
