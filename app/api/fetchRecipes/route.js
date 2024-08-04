// import { NextResponse } from 'next/server';
// import LlamaAI from 'llamaai';

// export async function POST(req) {
//   const apiKey = process.env.LLAMA_API_KEY;

//   if (!apiKey) {
//     console.error('API key is missing.');
//     return NextResponse.json({ error: 'API key is missing.' }, { status: 500 });
//   }

//   const llamaAPI = new LlamaAI(apiKey);

//   try {
//     const { inventory } = await req.json();
//     const items = inventory.map(item => `${item.name} (${item.quantity})`).join(', ');

//     // Construct the request payload for Llama API
//     const apiRequestJson = {
//       "messages": [
//         { "role": "user", "content": `Suggest recipes based on these ingredients: ${items}` }
//       ],
//       "functions": [
//         {
//           "name": "get_recipe_suggestions",
//           "description": "Get recipe suggestions based on provided ingredients",
//           "parameters": {
//             "type": "object",
//             "properties": {
//               "ingredients": {
//                 "type": "string",
//                 "description": "Comma-separated list of ingredients"
//               }
//             },
//             "required": ["ingredients"]
//           }
//         }
//       ],
//       "function_call": "get_recipe_suggestions",
//       "stream": false
//     };

//     // Execute the API call
//     const response = await llamaAPI.run(apiRequestJson);

//     console.log('Llama API response:', response);

//     const recipes = response.data; // Adjust based on actual response structure
//     return NextResponse.json({ recipes }, { status: 200 });

//   } catch (error) {
//     console.error('Error in Llama API call:', error.message);
//     console.error('Error stack:', error.stack);
//     return NextResponse.json({ error: 'An error occurred while fetching recipes.' }, { status: 500 });
//   }
// }

// export async function GET() {
//     console.log("GET route hit");
//     return NextResponse.json({ message: "API is working" });
//   }
  
//   export async function POST(req) {
//     console.log("POST route hit");
//     try {
//       const body = await req.json();
//       console.log("Received body:", body);
      
//       const { inventory } = body;
//       console.log("Received inventory:", inventory);
  
//       // Your existing logic here
//       const mockRecipes = "Here are some recipe suggestions based on your inventory: ...";
//       return NextResponse.json({ recipes: mockRecipes }, { status: 200 });
//     } catch (error) {
//       console.error('Error processing request:', error);
//       return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
//     }
//   }

import { NextResponse } from 'next/server';
import LlamaAI from 'llamaai';

const apiToken = process.env.LLAMA_API_KEY;
const llamaAPI = new LlamaAI(apiToken);

export async function GET() {
  console.log("GET route hit");
  return NextResponse.json({ message: "API is working" });
}

export async function POST(req) {
  console.log("POST route hit");
  try {
    const body = await req.json();
    console.log("Received body:", body);
    
    const { inventory } = body;
    console.log("Received inventory:", inventory);

    // Prepare the prompt based on the inventory
    const ingredients = inventory.map(item => `${item.name} (${item.quantity})`).join(', ');
    const prompt = `Generate a recipe based on these ingredients: ${ingredients}`;

    // Build the request JSON for LlamaAI
    const apiRequestJson = {
      "messages": [
        { "role": "user", "content": prompt }
      ],
      "stream": false
    };

    // Execute the request to LlamaAI
    const response = await llamaAPI.run(apiRequestJson);
    const recipes = response.choices[0].message.content.trim();
    console.log("Generated recipes:", recipes);

    return NextResponse.json({ recipes: recipes }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
