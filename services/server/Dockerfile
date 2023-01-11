FROM node:16.17.0
WORKDIR /apps
COPY . . 
ENV PORT=4000
ENV SECRET_KEY="rahasia"
ENV RAJA_ONGKIR="14af9cd2b9019a4b1c9eedf82642b7c1"
ENV API_XENDIT="xnd_development_Pty6063htungzNhy6dVevIoocvaQ6ekaGg3f4QUUii61sCAuHADwwqsi2yjvNa"
ENV EMAIL="gitasellez@gmail.com"
ENV PASSWORD="gdursqiwutbdcbyt"
ENV XENDIT_X="MAK8CELq5HOfMOAGkNi9Ys5VzPhzqmz2dklDwzalG16AOMFk"
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:sellez-server123@db.gvsbpepzyytcscktgmoi.supabase.co:5432/postgres"
RUN npm install --production
EXPOSE 4000
CMD ["node", "app.js"]