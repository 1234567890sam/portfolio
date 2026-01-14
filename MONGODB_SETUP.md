# MongoDB Atlas Setup Guide

Follow these steps to set up MongoDB Atlas (free tier) for your portfolio:

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Complete the registration process

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (completely free, no credit card required)
3. Select a cloud provider and region (choose one closest to you)
4. Cluster Name: Leave as default or name it `portfolio-cluster`
5. Click **"Create"**
6. Wait 1-3 minutes for cluster creation

## Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `portfolioAdmin` (or your choice)
5. Password: Click **"Autogenerate Secure Password"** and **COPY IT**
6. User Privileges: Select **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Configure Network Access

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to the IP whitelist
4. Click **"Confirm"**

> **Note**: For production, you should restrict this to your server's IP address.

## Step 5: Get Connection String

1. Go back to **"Database"** (click "Database" in left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **4.1 or later**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://portfolioAdmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open your `.env` file in the portfolio project
2. Replace `<password>` with the password you copied in Step 3
3. Add database name after `.net/`:
   ```
   mongodb+srv://portfolioAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

Example `.env` file:
```env
MONGODB_URI=mongodb+srv://portfolioAdmin:MySecurePass123@cluster0.abc123.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

## Step 7: Test Connection

1. Open terminal in your project directory
2. Run:
   ```bash
   npm install
   npm run seed
   ```
3. If successful, you'll see:
   ```
   ✅ MongoDB Connected Successfully
   ✅ Default admin created successfully!
   📧 Username: admin
   🔑 Password: admin123
   ```

## Troubleshooting

### Error: "MongoServerError: bad auth"
- Double-check your username and password in the connection string
- Make sure you replaced `<password>` with your actual password

### Error: "MongooseServerSelectionError"
- Check if your IP is whitelisted in Network Access
- Verify your internet connection
- Make sure the connection string is correct

### Error: "ENOTFOUND"
- Check if the cluster name in the connection string is correct
- Verify the connection string format

## Security Best Practices

1. **Change Default Admin Password**: After first login, change the default password
2. **Use Strong JWT Secret**: Generate a random string for `JWT_SECRET`
3. **Restrict IP Access**: In production, whitelist only your server's IP
4. **Environment Variables**: Never commit `.env` file to Git
5. **Regular Backups**: MongoDB Atlas provides automatic backups on paid tiers

## Next Steps

Once MongoDB is connected:
1. Start the server: `npm start`
2. Visit: `http://localhost:5000`
3. Admin panel: `http://localhost:5000/admin`
4. Login with: `admin` / `admin123`
5. Start adding your projects and skills!

---

Need help? Check the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
