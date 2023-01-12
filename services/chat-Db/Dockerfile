FROM node:16.17.0
WORKDIR /apps
COPY . . 
ENV PORT=10000
ENV NODE_ENV=production
ENV URI="mongodb+srv://chatDb:chatDb123@atlascluster.tqgvhrf.mongodb.net/Socket?retryWrites=true&w=majority"
RUN npm install --production
EXPOSE 10000
CMD ["node", "app.js"]