import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').default('customer@example.com'),
  customerPhone: text('customer_phone').default('+91 98765 43210'),
  orderDate: text('order_date').notNull(),
  estimatedDelivery: text('estimated_delivery').notNull(),
  status: text('status').notNull(), // 'ordered' | 'crafting' | 'packed' | 'shipped' | 'delivered'
  courier: text('courier').notNull(),
  trackingNo: text('tracking_no').notNull(),
  address: text('address').notNull(),
  paymentMode: text('payment_mode').default('Prepaid').notNull(), // 'Prepaid' | 'Cash on Delivery'
  paymentType: text('payment_type').default('UPI / Google Pay').notNull(), // 'UPI / Google Pay' | 'Credit Card' | 'Net Banking'
  paymentStatus: text('payment_status').default('Paid').notNull(), // 'Paid' | 'Pending' | 'Refunded'
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.orderId, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});

export const orderMilestones = pgTable('order_milestones', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.orderId, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  stepOrder: integer('step_order').notNull(),
});
