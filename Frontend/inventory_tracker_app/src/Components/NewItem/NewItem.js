import {useState} from 'react'
import {
  Card, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  TextField, 
  Button,
  FormControl,
  FilledInput,
  InputAdornment,
  InputLabel} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import styles from './NewItem.module.css'
import axios from 'axios'

export default function NewItem({currWarehouse, setItemCreated, setFailedToCreateItem}) {

  const [clicked, setClicked] = useState(false)

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  return (
    <>
      <Tooltip title="Create Item">
        <Card
        sx={{
          backgroundColor: '#052354', 
          color: 'white', 
          border: '3px dashed white', 
          transition: 'background-color 0.25s ease-in',
          }}
        onClick={() => setClicked(true)}
        className={styles.itemCard}>
            <div className={styles.addIcon}>
                <AddIcon/>
            </div>
        </Card>
      </Tooltip>
      <Dialog PaperProps={{
        style:{
          backgroundColor: '#052354',
          color: 'white',
          width: '552px'
        }
      }} open={clicked} onClose={() => setClicked(false)}>
          <DialogTitle>New Item</DialogTitle>
          <DialogContent>
          <DialogContentText sx={{color: 'white'}}>
              Please type item information:
          </DialogContentText>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Item Name"
              fullWidth
              value={name}
              InputProps={{
                style:{
                  color: 'white'
                }
              }}
              sx={{label: {color: 'white', input: {color: 'white'}}}}
              onChange={e => setName(e.target.value)}
              variant="standard"
          />
          <TextField
              margin="dense"
              id="quantity"
              label="Item Quantity"
              fullWidth
              value={quantity}
              type="number"
              InputProps={{
                style:{
                  color: 'white'
                }
              }}
              sx={{label: {color: 'white', input: {color: 'white'}}, marginBottom: '1em'}}
              onChange={e => setQuantity(e.target.value)}
              variant="standard"
          />

          <fieldset className={styles.description_fieldset}>
            <TextField
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
          </fieldset>

          <FormControl fullWidth variant="filled">
            <InputLabel sx={{color: 'white'}} htmlFor="filled-adornment-amount">Amount</InputLabel>
            <FilledInput
              id="filled-adornment-amount"
              value={price}
              sx={{color: 'white'}}
              onChange={e => setPrice(e.target.value)}
              startAdornment={<InputAdornment sx={{color: 'white'}} position="start"><span sx={{color: 'white'}}>$</span></InputAdornment>}
            />
          </FormControl>
          
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => {
                setClicked(false)
                //Create iteam
                axios.put('https://Shopify-Backend-Challenge-F22.codevat.repl.co/create_item', {
                    name: name,
                    address: currWarehouse,
                    quantity: quantity,
                    date_added: new Date().toISOString(),
                    description: description === ''? 'None' : description,
                    price: price
                }, {
                    headers: { 
                    "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(({data}) => {
                    if(data.itemCreated){
                    //Show success
                    setItemCreated(true)
                    } else {
                    //Show failure
                    setFailedToCreateItem(true)
                    }
                })
                .catch(() => {
                    setFailedToCreateItem(true)
                })
                setName('')
                setQuantity(0)
                setDescription('')
                setPrice(0)
            }}>Create</Button>
          </DialogActions>
      </Dialog>
    </>
  )
}
