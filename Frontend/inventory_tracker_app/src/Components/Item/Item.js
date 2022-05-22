import {useState, useEffect, useRef} from 'react'
import styles from './Item.module.css'
import {Button, Card, CardActions, CardContent, 
        Typography, Grid, TextField,
        FormControl, InputLabel, FilledInput,
        InputAdornment} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios'

export default function Item({itemInfo, checkedItems, setCheckedItems}) {

  //Item Values States
  const nameRef = useRef()
  const descriptionRef = useRef()
  const priceRef = useRef()
  const isChecked = useRef(false)

  //Card control states
  const [viewDetails, setViewDetails] = useState(false)
  const [nameClicked, setNameClicked] = useState(false)
  const [descriptionClicked, setDescriptionClicked] = useState(false)
  const [priceClicked, setPriceClicked] = useState(false)

  //Card values states
  const [name, setName] = useState(itemInfo.name)
  const address = itemInfo.address
  const [quantity, setQuantity] = useState(itemInfo.quantity)
  const [description, setDescription] = useState(itemInfo.description)
  const [price, setPrice] = useState(itemInfo.price)

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (nameClicked && nameRef.current && !nameRef.current.contains(event.target)) {
        setNameClicked(false)
      }
      if (descriptionClicked && descriptionRef.current && !descriptionRef.current.contains(event.target)) {
        setDescriptionClicked(false)
      }
      if (priceClicked && priceRef.current && !priceRef.current.contains(event.target)) {
        setPriceClicked(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [nameClicked, descriptionClicked, priceClicked]);

  const addToCheckedItems = () => {
    const data = {
      name: name,
      address: address,
      quantity: quantity,
      description: description,
      price: price
    }
    const updatedCheckedItems = [...checkedItems, data]
    setCheckedItems(updatedCheckedItems)
  }

  const removeFromCheckedItems = () => {
    const data = {
      name: name,
      address: address,
      quantity: quantity,
      description: description,
      price: price
    }
    const updatedCheckedItems = checkedItems.filter(item => item.name !== data.name)
    setCheckedItems(updatedCheckedItems)
  }

  const updateItem = () => {
    const data = {
      name: itemInfo.name,
      address: itemInfo.address,
      new_name: name,
      new_quantity: quantity,
      new_description: description,
      new_price: price
    }

    axios.put('https://Shopify-Backend-Challenge-F22.codevat.repl.co/update_item', data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).catch(error => {
      console.error(error)
    })
  }

  return (
    <Card sx={{backgroundColor: '#052354', color: 'white'}} className={styles.itemCard}>
        <CardContent>
          <Checkbox onClick={() => {
            isChecked.current = !isChecked.current
            if(isChecked.current){ //If it is selected, addToCheckedList
              addToCheckedItems()
            } else { //Go through selected list and remove it's info from it
              removeFromCheckedItems()
            }
            
          }} sx={{position: 'absolute', left: '5px', top:'5px'}}/>
          <Typography ref={nameRef} onClick={() => viewDetails && setNameClicked(true)} sx={{fontFamily: "'Oswald', sans-serif"}} align='center' variant='h5'>
              {nameClicked?
                <TextField
                id="standard-name-input"
                label="Item Name"
                variant="standard"
                value={name}
                InputLabelProps={{
                  style: { color: 'white'},
                }}
                sx={{input: {color: 'white'}}}
                onInput={e => {setName(e.target.value)}}
                />
                :
                name
              }
          </Typography>

          {viewDetails? 
            <div className={styles.infoDiv}>
              {/* Address Section */}
              <span>Stored At: </span> 
              {address}

              {/* Quantity Section */}
              <Grid container>
                <Grid item>
                  <span>Quantity:</span> 
                </Grid>
                <Grid sx={{margin: '6px 5px'}} item className={styles.iconBtn}>
                  <RemoveIcon onClick={() => quantity > 0 && setQuantity(prev => prev-1)} sx={{color: 'white', "&:hover": {color: 'black'}}}/>
                </Grid>
                <Grid sx={{margin: '7px 5px'}} item>
                  {quantity}
                </Grid>
                <Grid sx={{margin: '6px 5px'}} item className={styles.iconBtn}>
                  <AddIcon onClick={() => setQuantity(prev => prev+1)} sx={{color: 'white', "&:hover": {color: 'black'}}}/>
                </Grid>
              </Grid>

              {/* Description Section */}
              <span>Item Description:</span>
              <fieldset className={styles.description_fieldset}>
                {descriptionClicked?
                  <TextField
                    ref={descriptionRef}
                    multiline
                    id="standard-description-input"
                    label="Description"
                    variant="standard"
                    value={description}
                    rows={9}
                    fullWidth
                    InputLabelProps={{
                      style: { color: 'white'},
                    }}
                    InputProps={{
                      style: {color: 'white'}
                    }}
                    sx={{display: 'block'}}
                    onInput={e => {setDescription(e.target.value)}}
                  />
                  :
                  <p onClick={() => setDescriptionClicked(true)} ref={descriptionRef} className={styles.description}>{description}</p>
                }
              </fieldset>

              {/* Price Section */}
              <span>Price:</span>
              {priceClicked?
                <FormControl ref={priceRef} fullWidth variant="filled">
                  <InputLabel sx={{color: 'white'}} htmlFor="filled-adornment-amount">Amount</InputLabel>
                  <FilledInput
                    id="filled-adornment-amount"
                    value={price}
                    sx={{color: 'white'}}
                    
                    onChange={e => setPrice(e.target.value)}
                    startAdornment={<InputAdornment sx={{color: 'white'}} position="start"><span sx={{color: 'white'}}>$</span></InputAdornment>}
                  />
                </FormControl>
                :
                <p style={{display: 'inline', marginLeft: '5px'}} onClick={() => setPriceClicked(true)}>${price}</p>
              }

              <br/>
              {/* Date Section (doesn't make sense to allow the user to change the date of when an item was added) */}
              <span>Date Added:</span> {new Date().toDateString()}
              <Grid spacing={1} sx={{marginTop: '1em'}} container justifyContent="center">
                <Grid item>
                  <Button variant="contained" color='primary' onClick={() => {
                    //Reset other states
                    setNameClicked(false)
                    setDescriptionClicked(false)
                    setPriceClicked(false)
                    setViewDetails(prev => !prev)
                  }} size="small">Collapse</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color='success' onClick={() => {
                    //Submit function/ request code
                    updateItem()
                    //Reset states
                    setNameClicked(false)
                    setDescriptionClicked(false)
                    setPriceClicked(false)
                    setViewDetails(prev => !prev)
                  }} size="small">Update</Button>
                </Grid>
              </Grid>
            </div>
            :
            <Grid justifyContent='center' container>
              <Grid xs={12} md={12} lg={12} item>
                <Typography align='center' sx={{fontWeight: 'bold', paddingTop: '0.25em'}} variant="h6">
                  Quantity
                </Typography>
              </Grid>
              <Grid xs={12} md={12} lg={12} item>
                <Typography align='center' variant="h6">
                  {quantity}
                </Typography>
              </Grid>
            </Grid>
          }
        </CardContent>
        <CardActions>
          {!viewDetails && 
            <Grid sx={{paddingBottom: '5px'}} container justifyContent="center">
              <Button variant="contained" color='primary' onClick={() => setViewDetails(prev => !prev)} size="small">View Details</Button>
            </Grid>
          }
        </CardActions>
    </Card>
  )
}
