# Step 1: Use an official Node.js runtime as the base image
FROM node:14 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the source code to the container
COPY . .

# Step 6: Build the React application
RUN npm run build

# Step 7: Use an Nginx image to serve the build
FROM nginx:stable-alpine

# Step 8: Copy the built React files to the Nginx server
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 to be accessible on the host machine
EXPOSE 80

# Step 10: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
