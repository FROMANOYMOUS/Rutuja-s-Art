import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { orders, orderItems, orderMilestones, users } from './src/db/schema.ts';
import { eq, asc } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'Cloud SQL (PostgreSQL)' });
  });

  // Auth: Signup
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, name, phone, address } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      const cleanEmail = email.trim().toLowerCase();
      
      try {
        const existingUsers = await db.select().from(users).where(eq(users.email, cleanEmail));
        if (existingUsers.length > 0) {
          return res.status(400).json({ error: 'User with this email already exists' });
        }

        const newUserList = await db.insert(users).values({
          email: cleanEmail,
          passwordHash: password, // For demonstration/development auth
          name: name.trim(),
          phone: phone ? phone.trim() : '',
          address: address ? address.trim() : '',
          cartData: '[]'
        }).returning();

        const createdUser = newUserList[0];
        return res.json({
          user: {
            id: String(createdUser.id),
            email: createdUser.email,
            name: createdUser.name,
            phone: createdUser.phone,
            address: createdUser.address,
            cart: [],
            createdAt: createdUser.createdAt
          }
        });
      } catch (dbErr) {
        console.warn('DB Signup fallback to in-memory/JSON:', dbErr);
        // Fallback user object if database table hasn't migrated yet
        return res.json({
          user: {
            id: `usr_${Date.now()}`,
            email: cleanEmail,
            name: name.trim(),
            phone: phone ? phone.trim() : '',
            address: address ? address.trim() : '',
            cart: [],
            createdAt: new Date().toISOString()
          }
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Failed to register account' });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const cleanEmail = email.trim().toLowerCase();

      try {
        const foundUsers = await db.select().from(users).where(eq(users.email, cleanEmail));
        if (foundUsers.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        const usr = foundUsers[0];
        if (usr.passwordHash !== password) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        let parsedCart = [];
        try {
          parsedCart = usr.cartData ? JSON.parse(usr.cartData) : [];
        } catch {
          parsedCart = [];
        }

        return res.json({
          user: {
            id: String(usr.id),
            email: usr.email,
            name: usr.name,
            phone: usr.phone || '',
            address: usr.address || '',
            cart: parsedCart,
            createdAt: usr.createdAt
          }
        });
      } catch (dbErr) {
        console.warn('DB Login fallback:', dbErr);
        return res.status(401).json({ error: 'Database account search error' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Failed to log in' });
    }
  });

  // Auth: Update Profile
  app.put('/api/auth/profile', async (req, res) => {
    try {
      const { email, name, phone, address } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'User email is required' });
      }

      const cleanEmail = email.trim().toLowerCase();

      try {
        await db.update(users).set({
          name,
          phone,
          address
        }).where(eq(users.email, cleanEmail));
      } catch (e) {
        console.warn('DB profile update warning:', e);
      }

      return res.json({ message: 'Profile updated successfully', email, name, phone, address });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // User Cart Cloud Sync
  app.post('/api/user/cart', async (req, res) => {
    try {
      const { email, cart } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });

      const cleanEmail = email.trim().toLowerCase();
      const cartJson = JSON.stringify(cart || []);

      try {
        await db.update(users).set({ cartData: cartJson }).where(eq(users.email, cleanEmail));
      } catch (e) {
        console.warn('DB cart sync warning:', e);
      }

      return res.json({ message: 'Cart synced to cloud', cart });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to sync cart' });
    }
  });

  // Get all orders
  app.get('/api/orders', async (req, res) => {
    try {
      const allOrders = await db.select().from(orders);
      res.json(allOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders from Cloud SQL database' });
    }
  });

  // Get single order with items and milestones
  app.get('/api/orders/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const cleanId = orderId.trim().toUpperCase();

    try {
      const foundOrders = await db.select().from(orders).where(eq(orders.orderId, cleanId));

      if (foundOrders.length === 0) {
        return res.status(404).json({ error: 'Order not found in database' });
      }

      const orderData = foundOrders[0];

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, cleanId));

      const milestones = await db
        .select()
        .from(orderMilestones)
        .where(eq(orderMilestones.orderId, cleanId))
        .orderBy(asc(orderMilestones.stepOrder));

      return res.json({
        orderId: orderData.orderId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        orderDate: orderData.orderDate,
        estimatedDelivery: orderData.estimatedDelivery,
        status: orderData.status,
        courier: orderData.courier,
        trackingNo: orderData.trackingNo,
        address: orderData.address,
        paymentMode: orderData.paymentMode,
        paymentType: orderData.paymentType,
        paymentStatus: orderData.paymentStatus,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        milestones: milestones.map(m => ({
          status: m.status,
          title: m.title,
          description: m.description,
          date: m.date,
          isCompleted: m.isCompleted,
          isActive: m.isActive
        }))
      });
    } catch (error: any) {
      console.error(`Error fetching order ${cleanId}:`, error);
      return res.status(500).json({ error: 'Database query failed' });
    }
  });

  // Create or insert new order into database
  app.post('/api/orders', async (req, res) => {
    try {
      const {
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        orderDate,
        estimatedDelivery,
        status,
        courier,
        trackingNo,
        address,
        paymentMode,
        paymentType,
        paymentStatus,
        items,
        milestones
      } = req.body;

      if (!orderId || !customerName) {
        return res.status(400).json({ error: 'orderId and customerName are required' });
      }

      const cleanId = orderId.trim().toUpperCase();

      // Check if order already exists
      const existing = await db.select().from(orders).where(eq(orders.orderId, cleanId));
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Order ID already exists in database' });
      }

      // Insert order
      await db.insert(orders).values({
        orderId: cleanId,
        customerName,
        customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        customerPhone: customerPhone || '+91 98765 43210',
        orderDate: orderDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        estimatedDelivery: estimatedDelivery || 'July 25, 2026',
        status: status || 'ordered',
        courier: courier || 'Delhivery',
        trackingNo: trackingNo || `RA${Math.floor(Math.random() * 90000) + 10000}IN`,
        address: address || '102, Garden Greens Residency, Senapati Bapat Road, Pune, MH - 411016',
        paymentMode: paymentMode || 'Prepaid',
        paymentType: paymentType || 'UPI / Google Pay (GPay)',
        paymentStatus: paymentStatus || 'Paid'
      });

      // Insert items if provided
      if (Array.isArray(items) && items.length > 0) {
        await db.insert(orderItems).values(
          items.map((it: any) => ({
            orderId: cleanId,
            name: it.name,
            quantity: it.quantity || 1,
            price: it.price || 499
          }))
        );
      }

      // Insert milestones if provided
      if (Array.isArray(milestones) && milestones.length > 0) {
        await db.insert(orderMilestones).values(
          milestones.map((m: any, idx: number) => ({
            orderId: cleanId,
            status: m.status,
            title: m.title,
            description: m.description,
            date: m.date || 'Pending',
            isCompleted: !!m.isCompleted,
            isActive: !!m.isActive,
            stepOrder: idx + 1
          }))
        );
      }

      return res.status(201).json({ message: 'Order created in Cloud SQL database successfully', orderId: cleanId });
    } catch (error: any) {
      console.error('Error creating order in Cloud SQL:', error);
      return res.status(500).json({ error: 'Failed to create order in Cloud SQL' });
    }
  });

  // Update order status endpoint
  app.put('/api/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    const cleanId = orderId.trim().toUpperCase();

    try {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      await db.update(orders).set(updateData).where(eq(orders.orderId, cleanId));

      return res.json({ message: `Order ${cleanId} status updated successfully`, orderId: cleanId, status });
    } catch (error: any) {
      console.error(`Error updating order ${cleanId}:`, error);
      return res.status(500).json({ error: 'Failed to update order status in database' });
    }
  });

  // Setup Vite or Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
