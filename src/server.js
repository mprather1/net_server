import net from 'net'
import logger from 'winston-color'
import DuplexEmitter from 'duplex-emitter'
import chalk from 'chalk'
import json_data from './data.json'
import pkg from '../package.json'

const options = {
  server: net.createServer(),
  port: process.env.PORT || 55445,
  hostname: process.env.HOSTNAME,
  packageName: pkg.name
}

const {server, packageName, hostname, port} = options

server.on('listening', () => {
  logger.info(`${chalk.bgBlack.cyan(packageName)} listening on port ${port}...`)
})

server.on('connection', (data) => {
  handleConnection(data)
})

server.listen(port, hostname)

function handleConnection (socket) {
  const emitter = DuplexEmitter(socket)
  
  socket.on('error', handleError)

  emitter.once('connected', (data) => {
    emitter.emit('connected', packageName)
    logger.info(chalk.bgBlack.green(data), 'connected...')
    
    socket.on('close', (event) => {
      handleClose(event, data)
    })
  })
  
  emitter.on('create', (name) => {
    logger.info(`model created on ${chalk.bgBlack.green(name)}`)
  })
  
  emitter.emit('json-data', json_data)
  
  emitter.on('complete', (data) => {
    emitter.emit('confirmaiton', 'confirmed received...')
    logger.info(chalk.magenta(data))
  })
  
  function handleError (err) {
    logger.info("error:", err.message)
  }
  
  function handleClose (event, name) {
    logger.warn(`${chalk.bgBlack.green(name)} disconnected...`)
  }
}
