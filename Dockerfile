FROM node:9.6.1

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /app
# Copy all local files into the image.
COPY . /app

# Install server
RUN npm install -g webpack

# Install server
RUN npm install -g serve

# Install packages etc
RUN npm install

# Build the application.
RUN npm run build

RUN ["chmod", "+x", "/app/scripts/entrypoint.sh"];

EXPOSE 3000

ENTRYPOINT ["/app/scripts/entrypoint.sh"];