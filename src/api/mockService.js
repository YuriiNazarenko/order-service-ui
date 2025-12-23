const initialOrders = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  clientName: `Client ${i + 1}`,
  orderName: `Order #${1000 + i}`,
  amount: (i + 1) * 100,
  description: `Description for order ${i + 1}`,
}));

let orders = [...initialOrders];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  getOrders: async (page = 1, limit = 10, filters = {}) => {
    await delay(600);
    let filtered = [...orders];

    if (filters.name) {
      filtered = filtered.filter((o) =>
        o.orderName.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.client) {
      filtered = filtered.filter((o) =>
        o.clientName.toLowerCase().includes(filters.client.toLowerCase())
      );
    }

    const total = filtered.length;

    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return { data, total, page, limit };
  },

  getOrderById: async (id) => {
    await delay(400);
    const order = orders.find((o) => o.id === Number(id));
    if (!order) throw new Error("Order not found");
    return order;
  },

  deleteOrder: async (id) => {
    await delay(800);
    orders = orders.filter((o) => o.id !== id);
    return id;
  },

  updateOrder: async (id, data) => {
    await delay(800);
    const index = orders.findIndex((o) => o.id === Number(id));
    if (index === -1) throw new Error("Not found");

    orders[index] = { ...orders[index], ...data };
    return orders[index];
  },

  createOrder: async (data) => {
    await delay(800);
    const newOrder = {
      ...data,
      id: Math.max(...orders.map((o) => o.id), 0) + 1,
    };
    orders.unshift(newOrder);
    return newOrder;
  },
};
