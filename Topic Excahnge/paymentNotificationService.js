const amqp = require('amqplib')

async function receiveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = 'notification_exchange'
        const exchangeType = "topic"
        const queue = "payment_queue"

        await channel.assertExchange(exchange, exchangeType, { durable: false })
        await channel.assertQueue(queue, { durable: false })

        await channel.bindQueue(queue,exchange,"payment.*")

        console.log("waiting for message")
        channel.consume(queue, (message) => {
            if (message !== null) {
                console.log("Payment Notification", JSON.parse(message.content))
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