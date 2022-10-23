import styles from "./Tracker.module.css";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { Button } from "@mui/material";
import Item from "../Item/Item";
import NewItem from "../NewItem/NewItem";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Tracker() {
  const [warehouses, setWarehouses] = useState([]);
  const [currWarehouse, setCurrWarehouse] = useState("");
  const [createWarehouse, setCreateWarehouse] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehouseAddress, setNewWarehouseAddress] = useState("");
  const [createdWarehouse, setCreatedWarehouse] = useState(false);
  const [failedToCreateWarehouse, setFailedToCreateWarehouse] = useState(false);
  const [failedToGetInventory, setFailedToGetInventory] = useState(false);
  const [newItemCreated, setNewItemCreated] = useState(false);
  const [failedToCreateItem, setFailedToCreateItem] = useState(false);
  const [deletedItems, setDeletedItems] = useState(false);
  const [failedToDeleteItems, setFailedToDeleteItems] = useState(false);
  //Address of warehouse that we're reassigning
  const [warehouseToReassign, setWarehouseToReassign] = useState("");
  const [reassignedWarehouse, setReassignedWarehouse] = useState(false);
  const [failedToReassignWarehouse, setFailedToReassignWarehouse] =
    useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [inventory, setInventory] = useState([]);

  //An array of objs containing selected card info
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${window.location.href}get_warehouses`)
      .then(({ data }) => {
        if (data.length > 0) {
          setWarehouses(data);
          setCurrWarehouse(data[0].address);
        }
      })
      .catch((err) => console.err(err));
  }, [createdWarehouse]);

  useEffect(() => {
    //Get the inventory for the current warehouse
    if (currWarehouse) {
      axios
        .get(
          `${window.location.href}get_inventory/${currWarehouse
            .split(" ")
            .join("_")}`
        )
        .then(({ data }) => {
          if (data.error) {
            setFailedToGetInventory(true);
          } else {
            setInventory(data);
          }
        })
        .catch(() => setFailedToGetInventory(true));

      //Set default value for reassignment warehouse
      for (let warehouse of warehouses) {
        if (warehouse.address !== currWarehouse) {
          setWarehouseToReassign(warehouse.address);
          break;
        }
      }
    }
    setCheckedItems([]);
    /*
      I'm including failedToDeleteItems because there's a change that some items got deleted but not all.
      So I need to include it so that page is refreshed if some but not all items were deleted
      */
  }, [
    currWarehouse,
    newItemCreated,
    deletedItems,
    failedToDeleteItems,
    reassignedWarehouse,
  ]);

  const deleteItems = () => {
    //For each item that's selected, make a delete request
    const deleteRequests = [];
    for (let item of checkedItems) {
      const deleteRequest = axios.delete(`${window.location.href}delete_item`, {
        data: item,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      deleteRequests.push(deleteRequest);
    }
    //Use Promise.all so that I'm changing the state only once instead of once for every checked item
    Promise.all(deleteRequests)
      .then(() => setDeletedItems(true))
      .catch(() => setFailedToDeleteItems(true));
    //Set deletedItems to true
    setCheckedItems([]);
  };

  const reassignItems = () => {
    //For each item that's selected, make a change it's address
    const reassignRequests = [];
    for (let item of checkedItems) {
      const reassignRequest = axios.put(
        `${window.location.href}update_item`,
        { ...item, new_address: warehouseToReassign },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      reassignRequests.push(reassignRequest);
    }

    Promise.all(reassignRequests)
      .then(() => {
        setReassignedWarehouse(true);
      })
      .catch(() => {
        setFailedToReassignWarehouse(true);
      });

    //Uncheck those items
    setCheckedItems([]);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <FormControl sx={{ width: "25em" }}>
          <InputLabel sx={{ color: "white" }} id="warehouse-select-label">
            Warehouse
          </InputLabel>
          <Select
            labelId="warehouse-select-label"
            id="warehouse-select"
            value={currWarehouse}
            label="Warehouse"
            sx={{
              backgroundColor: "#052354 !important",
              svg: { color: "white" },
              color: "white",
            }}
            onChange={(e) => setCurrWarehouse(e.target.value)}
          >
            {warehouses.map((warehouse) => (
              <MenuItem value={warehouse.address} key={warehouse.address}>
                {warehouse.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Add New Warehouse">
          <Grid sx={{ margin: "10px 10px" }} item className={styles.iconBtn}>
            <AddIcon
              fontSize="large"
              onClick={() => setCreateWarehouse(true)}
            />
          </Grid>
        </Tooltip>
      </Grid>

      {/* Managerial Buttons Section */}
      {checkedItems.length > 0 && (
        <div className={styles.managerialBtns}>
          <Button
            onClick={deleteItems}
            variant="contained"
            color="error"
            sx={{ marginRight: "1em" }}
          >
            Delete
          </Button>
          <Button
            onClick={() => setShowReassignDialog(true)}
            variant="contained"
          >
            Assign New Warehouse
          </Button>
        </div>
      )}

      {/* Warehouse Creation Dialog Section */}
      <Dialog
        open={createWarehouse}
        onClose={() => setCreateWarehouse(false)}
        PaperProps={{
          style: {
            backgroundColor: "#052354",
            color: "white",
            width: "552px",
          },
        }}
      >
        <DialogTitle>New Warehouse</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white" }}>
            Please type warehouse information:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Warehouse Name"
            fullWidth
            value={newWarehouseName}
            InputProps={{
              style: {
                color: "white",
              },
            }}
            sx={{ label: { color: "white", input: { color: "white" } } }}
            onChange={(e) => setNewWarehouseName(e.target.value)}
            variant="standard"
          />
          <TextField
            margin="dense"
            id="name"
            label="Warehouse Address"
            fullWidth
            value={newWarehouseAddress}
            InputProps={{
              style: {
                color: "white",
              },
            }}
            sx={{ label: { color: "white", input: { color: "white" } } }}
            onChange={(e) => setNewWarehouseAddress(e.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setCreateWarehouse(false);
              //Create warehouse
              axios
                .put(
                  `${window.location.href}create_warehouse`,
                  {
                    name: newWarehouseName,
                    address: newWarehouseAddress,
                  },
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                )
                .then(({ data }) => {
                  if (data.warehouseAdded) {
                    //Show success
                    setCreatedWarehouse(true);
                  } else {
                    //Show failure
                    setFailedToCreateWarehouse(true);
                  }
                })
                .catch(() => {
                  setFailedToCreateWarehouse(true);
                });
              setNewWarehouseName("");
              setNewWarehouseAddress("");
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reassignment Dialog Section */}
      <Dialog
        open={showReassignDialog}
        onClose={() => setShowReassignDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#052354",
            color: "white",
            width: "552px",
          },
        }}
      >
        <DialogTitle>Re-assign Item To New Warehouse</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white" }}>
            Please select a warehouse:
          </DialogContentText>
          {/* SELECT HERE */}
          <FormControl sx={{ marginTop: "1em" }} fullWidth>
            <InputLabel
              sx={{ color: "white" }}
              id="reassign-warehouse-select-label"
            >
              Warehouse
            </InputLabel>
            <Select
              labelId="reassign-warehouse-select-label"
              id="reassign-warehouse-select"
              value={warehouseToReassign}
              label="Warehouse"
              sx={{
                backgroundColor: "#052354 !important",
                svg: { color: "white" },
                color: "white",
              }}
              onChange={(e) => setWarehouseToReassign(e.target.value)}
            >
              {warehouses.map(
                (warehouse) =>
                  warehouse.address !== currWarehouse && (
                    <MenuItem value={warehouse.address} key={warehouse.address}>
                      {warehouse.name}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              reassignItems();
              setShowReassignDialog(false);
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Items Section */}
      <Grid container justifyContent="center">
        {inventory.map((item) => {
          return (
            <Grid key={item.name} item>
              <Item
                itemInfo={{
                  name: item.name,
                  quantity: item.quantity,
                  address: item.address,
                  description: item.description,
                  price: item.price,
                }}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
              />
            </Grid>
          );
        })}
        <Grid item>
          <NewItem
            currWarehouse={currWarehouse}
            setItemCreated={setNewItemCreated}
            setFailedToCreateItem={setFailedToCreateItem}
          />
        </Grid>
      </Grid>

      {/* Alerts Section */}
      {/* Success Alerts */}
      <Snackbar
        open={createdWarehouse}
        autoHideDuration={6000}
        onClose={() => setCreatedWarehouse(false)}
      >
        <Alert severity="success">Successfully Created Warehouse!</Alert>
      </Snackbar>
      <Snackbar
        open={newItemCreated}
        autoHideDuration={6000}
        onClose={() => setNewItemCreated(false)}
      >
        <Alert severity="success">Successfully Created Item!</Alert>
      </Snackbar>
      <Snackbar
        open={reassignedWarehouse}
        autoHideDuration={6000}
        onClose={() => setReassignedWarehouse(false)}
      >
        <Alert severity="success">Successfully Reassigned Item(s)!</Alert>
      </Snackbar>
      <Snackbar
        open={deletedItems}
        autoHideDuration={6000}
        onClose={() => setDeletedItems(false)}
      >
        <Alert severity="success">Successfully Deleted Item(s)!</Alert>
      </Snackbar>
      {/* Fialure Alerts */}
      <Snackbar
        open={failedToCreateWarehouse}
        autoHideDuration={6000}
        onClose={() => setFailedToCreateWarehouse(false)}
      >
        <Alert severity="error">
          An error occured. Could not create warehouse!
        </Alert>
      </Snackbar>
      <Snackbar
        open={failedToGetInventory}
        autoHideDuration={6000}
        onClose={() => setFailedToGetInventory(false)}
      >
        <Alert severity="error">
          An error occured. Could not get inventory!
        </Alert>
      </Snackbar>
      <Snackbar
        open={failedToCreateItem}
        autoHideDuration={6000}
        onClose={() => setFailedToCreateItem(false)}
      >
        <Alert severity="error">An error occured. Could not create item!</Alert>
      </Snackbar>
      <Snackbar
        open={failedToDeleteItems}
        autoHideDuration={6000}
        onClose={() => setFailedToDeleteItems(false)}
      >
        <Alert severity="error">
          An error occured. Could not delete item(s)!
        </Alert>
      </Snackbar>
      <Snackbar
        open={failedToReassignWarehouse}
        autoHideDuration={6000}
        onClose={() => setFailedToReassignWarehouse(false)}
      >
        <Alert severity="error">
          An error occured. Could not reassign item(s) to new warehouse!
        </Alert>
      </Snackbar>
    </>
  );
}
