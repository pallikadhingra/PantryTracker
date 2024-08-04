// this file is for client side mode
'use client'

import Image from "next/image"
import {useState, useEffect} from 'react'

//firebase configuration
import {firestore} from '@/firebase'

//layouts and texts
import {Box, Modal, Typography, Stack, TextField, Button} from "@mui/material"

//firestore functions
import { collection, deleteDoc, doc, query, getDoc, getDocs, setDoc} from "firebase/firestore"

import { async } from "@firebase/util"
import axios from 'axios';




export default function Home() {
  const [inventory, setInventory] = useState([]) //state to store the list of inventory items
  const [open, setOpen] = useState([]) //state to control the visibility of some UI element
  const [itemName, setItemName] = useState('') //state to stote the name of an item
  const [recipes, setRecipes] = useState('') // State to store recipes

  //fetching and updating inventory 
  //updateInventory fetches the current inventory from firestore
  //snapshot  -> queries the 'inventory' collection in firestore database
  //docs --> retrieves the documents from query snapshot 
  //inventoryList --> stores the inventory items
  // update the inventory list with the fetched data 
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  // adding an item
  // docRef -> reference to document for the item in 'inventory' collection in firebase store
  // docSnap -> snapshot of the document
  // if item exists, increase the quantity
  // if item does not exist, set quantity to 1 
  // update the inventory 
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1})
    }

    else{
      await setDoc(docRef, {quantity: 1})
    }
    console.log("item added")
    await updateInventory()
  }

  //removing an item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      if(quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  // Fetch recipes based on inventory
//   const fetchRecipes = async () => {
//     try {
//       const items = inventory.map(item => `${item.name} (${item.quantity})`).join(', ');
//       console.log('Inventory for recipes:', items); // Log inventory
//       const response = await fetch('/api/fetchRecipes', { // Corrected URL
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ inventory }),
//       });
  
//       const data = await response.json();
//       console.log('Recipes response:', data); // Log response
//       setRecipes(data.recipes);
//     } catch (error) {
//       console.error('Error fetching recipes:', error);
//     }
//   };
// const fetchRecipes = async () => {
//     console.log("fetchhoja")
//     try {
//         console.log(inventory)
//       const response = await fetch('/api/fetchRecipes', {
        
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ inventory }),
//       });
//       console.log(response)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       console.log("3")
//       const data = await response.json();
//       console.log('Recipes response:', data);
//       setRecipes(data.recipes);
//     } catch (error) {
//         console.log("4")
//     //   console.error('Error fetching recipes:', error);
//     }
//   };

const fetchRecipes = async () => {
  console.log("Fetching recipes...");
  try {
    console.log("Inventory to send:", inventory);
    const response = await fetch('/api/fetchRecipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inventory }),
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Recipes response:', data);
    setRecipes(data.recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};


  //to initialize inventory
  useEffect(() => {
    updateInventory()
  }, [])

  //new
  const handleAddNewItem = () => {
    handleOpen();
  };
  //new
  // const handleSuggestRecipes = () => {
  //   fetchRecipes();
  // };
  const handleSuggestRecipes = () => {
    console.log("Suggest Recipes button clicked");
    fetchRecipes();
  };

  //UI AND RENDERING
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            > Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleAddNewItem}
      > Add New Item
      </Button>
      <Button
        variant="contained"
        onClick={handleSuggestRecipes}
      > Suggest Recipes
      </Button>
      <Box border="1px solid #000">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h2"
            color="#333"
          >
            Inventory Items
          </Typography>
        </Box>

        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto"
        >
          {
            inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h4" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h4" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(name);
                    }}
                  >Add</Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(name);
                    }}
                  >Remove</Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
      {recipes && (
        <Box
          border="1px solid #000"
          width="800px"
          height="auto"
          bgcolor="#f8f8f8"
          padding={2}
          mt={4}
        >
          <Typography variant="h4" color="#333">Suggested Recipes</Typography>
          <Typography variant="body1" color="#555" mt={2}>{recipes}</Typography>
        </Box>
      )}
    </Box>
  );
    
}
