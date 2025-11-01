const amqp = require('amqplib')

async function sendNotification(headers, message) {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()

        const exchange = 'header_exchange'
        const exchangetype = 'headers';

        await channel.assertExchange(exchange, exchangetype, { durable: false })

        channel.publish(exchange, "", Buffer.from(message), { persistent: true, headers })
        console.log("Sent notification with headers")

        setTimeout(() => {
            connection.close()
        }, 500)
    }
    catch (err) {
        console.log(err)
    }
}

sendNotification({ "x-match": "all", "notification-type": "new_video", "content-type": "video" }, "New music video uploaded");
sendNotification({ "x-match": "all", "notification-type": "live_stream", "content-type": "gaming" }, "Gaming live stream started");
sendNotification({ "x-match": "any", "notification-type": "comment", "content-type": "vlog" }, "New comment on your vlog");
sendNotification({ "x-match": "any", "notification-type": "like", "content-type": "vlog" }, "New comment on your vlog");