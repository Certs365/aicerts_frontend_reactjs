const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from the .env file
const envConfig = dotenv.config().parsed;

// Create a JavaScript file that sets these as global variables
const configData = `
   window.CONFIG = {
      NEXT_PUBLIC_BASE_URL_USER: "${envConfig.NEXT_PUBLIC_BASE_URL_USER}",
      NEXT_PUBLIC_BASE_URL: "${envConfig.NEXT_PUBLIC_BASE_URL}"
   };
`;

// Write this to the public/config.js file
fs.writeFileSync('./public/config.js', configData);
console.log('config.js generated successfully in /public');
