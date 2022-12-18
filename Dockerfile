# Use most recent LTS version of Node.js
FROM node:18

# Create a directory to hold the application code inside the image
WORKDIR /usr/src/app

# Image comes with Node.js and NPM already installed
# Install app dependencies
COPY package*.json ./
RUN npm i
# PRODUCTION CODE ONLY # RUN npm ci --only=production

# Bundle app source code
COPY . .

# Expose React port (3000) and Express port (5000)
EXPOSE 3000 5000

# Run server
CMD ["npm", "run", "dev"]