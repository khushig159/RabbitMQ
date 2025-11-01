const amqp = require('amqplib')

async function LiveStreamNotifications() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = 'header_exchange'
        const exchangeType = "headers"

        await channel.assertExchange(exchange, exchangeType, { durable: false })
        
        const queue=await channel.assertQueue("", { exclusive: true }) //temporary queue==>queue deletes after connection is closed

        console.log("waiting for Live stream notification==>", queue)

        await channel.bindQueue(queue.queue,exchange,"",{
            "x-match":"all",
            "notification-type":"live_stream",
            "content-type":"gaming"
        })

        channel.consume(queue.queue, (message) => {
            if (message !== null) {
                const message=message.content.toString()
                console.log("Received Live stream Notification", message) //notification code
                channel.ack(message)
            }
        }        )
    }
    catch (err) {
        console.log(err)
    }
}
LiveStreamNotifications()