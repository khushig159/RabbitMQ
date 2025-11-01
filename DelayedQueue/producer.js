const amqp = require("amqplib");

async function sendToDelayedQueue(batchId, orders, delay) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "delayed_exchange";
    await channel.assertExchange(exchange, "x-delayed-message", {
        durable: true,
        arguments: { "x-delayed-type": "direct" },
    });

    const queue = "delayed_order_updates_queue";
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "");

    const message = JSON.stringify({ batchId, orders });
    channel.publish(exchange, "", Buffer.from(message), {
        headers: { "x-delay": delay },
    });

    console.log(
        `Sent batch ${batchId} update task to delayed queue with ${delay} ms delay`
    );

    await channel.close();
    await connection.close();
}

async function processBatchOrders() {
    // batch processing
    const batchId = generateBatchId();
    const orders = collectOrdersForBatch();

    console.log(
        `Processing batch ${batchId} with orders: ${JSON.stringify(orders)}`
    );

    // Update inventory, generate shipping labels, etc.
    await processOrders(orders);

    // Send delayed message to update order status
    const delay = 10000; // 10 sec
    sendToDelayedQueue(batchId, orders, delay);
}

function generateBatchId() {
    return "batch-" + Date.now();
}

function collectOrdersForBatch() {
    // Collect orders for the current batch
    return [
        { orderId: 1, item: "Laptop", quantity: 1 },
        { orderId: 2, item: "Phone", quantity: 2 },
    ];
}

async function processOrders(orders) {
  console.log("Processing orders:", orders);
  await new Promise((res) => setTimeout(res, 2000));
  console.log("✅ Orders processed successfully");
}


processBatchOrders()