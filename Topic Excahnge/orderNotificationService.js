const amqp = require('amqplib')

async function receiveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = 'notification_exchange'
        const exchangeType = "topic"
        const queue = "order_queue"

        await channel.assertExchange(exchange, exchangeType, { durable: false })
        await channel.assertQueue(queue, { durable: false })

        await channel.bindQueue(queue,exchange,"order.*")

        console.log("waiting for message")
        channel.consume(queue, (message) => {
            if (message !== null) {
                console.log("Order Notification", JSON.parse(message.content))
                channel.ack(message)
            }
        },
        {noAck:false}
        )
    }
    catch (err) {
        console.log(err)
    }
}
receiveMail()