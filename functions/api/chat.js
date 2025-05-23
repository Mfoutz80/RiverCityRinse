// functions/api/chat.js

// Handle POST requests
export async function onRequestPost({ request, env }) {
    try {
      // Parse the request body
      const data = await request.json();
      const question = data.question || "";
  
      // Your environment variable holding the API token
      const apiToken = env.API_TOKEN;
  
      // Make your external fetch call
      const response = await fetch(
        "https://api.cloudflare.com/client/v4/accounts/fa9672927a5842ac61b86575d9ab976c/autorag/rags/rivercity-rag/ai-search", // Change this to your endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${apiToken}`
          },
          body: JSON.stringify({
            query: `You are a home-washing whiz named Washy, answer questions as Washy would. Never mention documents. Question: ${question}`// Change This
          })
        }
      );
  
      // Process the JSON response from that API
      const result = await response.json();
  
      // Return a JSON response to the caller
      return new Response(
        JSON.stringify({
          response: result.result.response,
          score: result.result.data[0].score
        }),
        {
          headers: {
            "Content-Type": "application/json",
            // CORS header, if needed by your frontend
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    } catch (error) {
      console.error("Function error:", error);
  
      // Return a 500 error if something goes wrong
      return new Response(
        JSON.stringify({
          error: "Failed to process request",
          message: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }
  
  // Handle OPTIONS requests (CORS preflight)
  export async function onRequestOptions() {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  