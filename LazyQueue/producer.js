const amqp=require('amqplib')

async function setup(message){
    const connection=await amqp.connect("amqp://localhost")
    const channel=await connection.createChannel()

    const exchange='notification_exchange'
    const queue="lazy_queue"
    const routingKey="notification.key"

    await channel.assertExchange(exchange, "direct", { durable: true })

    await channel.assertQueue(queue, { durable: true,arguments:{"x-queue-mode":"lazy"} })

    await channel.bindQueue(queue, exchange, routingKey)

    channel.publish(exchange,routingKey,Buffer.from(message),{persistent:true})
    console.log("Message sent")

    await channel.close()
    await connection.close()
}
setup('hello message')