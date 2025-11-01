const amqp = require('amqplib')

async function pushNotifications() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = 'new_product_launch'
        const exchangeType = "fanout"

        await channel.assertExchange(exchange, exchangeType, { durable: false })
        
        const queue=await channel.assertQueue("", { exclusive: true }) //temporary queue==>queue deletes after connection is closed

        console.log("waiting for message==>", queue)

        await channel.bindQueue(queue.queue,exchange,"")

        channel.consume(queue.queue, (message) => {
            if (message !== null) {
                const product=JSON.parse(message.content.toString)
                console.log("Sending push Notification", product.name)
                channel.ack(message)
            }
        }        )
    }
    catch (err) {
        console.log(err)
    }
}
pushNotifications()