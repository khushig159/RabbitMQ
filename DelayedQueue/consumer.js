const amqp = require("amqplib");

async function processOrderUpdates() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "delayed_order_updates_queue"; // Assuming this is the queue name
    await channel.assertQueue(queue, { durable: true });

    channel.consume(
        queue,
        async (msg) => {
            if (msg !== null) {
                const { batchId } = JSON.parse(msg.content.toString());
                console.log(`Processing order update task for batch: ${batchId}`);

                // Update order statuses for the batch
                await updateOrderStatus(batchId); // Renamed function for clarity

                channel.ack(msg);
            }
        },
        { noAck: false }
    );
}

function updateOrderStatus(batchId) { // Renamed from updateOrderStatuses
    // Simulate order status update
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(
                `Order statuses updated to "Started Shipping" for batch: ${batchId}`
            );
            resolve();
        }, 1000); // Simulate time taken to update order statuses
    });
}

// Call the function to start consuming
processOrderUpdates();