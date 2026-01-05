const client = require('../config/redis')

const BLOCK_TIME = 15 * 60 // 15 minutes
const MAX_ATTEMPTS = 5

/**
 * Log remaining block time for an IP
 * Also fixes blocks without expiration
 */
async function logIpBlockRemainingTime(ip) {
  const key = `login:block:ip:${ip}`
  let ttl = await client.ttl(key)

  // Fix permanent blocks (no expiration)
  if (ttl === -1) {
    await client.expire(key, BLOCK_TIME)
    ttl = await client.ttl(key)

    console.warn(
      `IP ${ip} was blocked with no expiration. Expiration was added.`
    )
  }

  if (ttl > 0) {
    const minutes = Math.floor(ttl / 60)
    const seconds = ttl % 60

    console.log(
      `IP ${ip} is blocked | Remaining time: ${minutes} minutes and ${seconds} seconds`
    )
  }
}

/**
 * Check if IP is blocked
 */
async function checkIpBlock(ip) {
  // Ignore localhost in development
  // if (ip === '::1' || ip === '127.0.0.1') return

  const blocked = await client.get(`login:block:ip:${ip}`)

  if (blocked) {
    await logIpBlockRemainingTime(ip)

    console.log(
      '===============Too many login attempts. Try again later. (IP) 1============='
    )

    throw new Error('Your account has been temporarily locked')
  }
}

/**
 * Record failed login attempt
 */
async function recordIpFailure(ip) {
  // Ignore localhost in development
  // if (ip === '::1' || ip === '127.0.0.1') return

  const key = `login:fail:ip:${ip}`
  const attempts = await client.incr(key)

  if (attempts === 1) {
    await client.expire(key, BLOCK_TIME)
  }

  if (attempts >= MAX_ATTEMPTS) {
    await client.set(
      `login:block:ip:${ip}`,
      '1',
      'EX',
      BLOCK_TIME
    )

    await client.del(key)

    await logIpBlockRemainingTime(ip)

    console.log(
      '===============Too many login attempts. Try again later. (IP) 2============='
    )

    throw new Error('Your account has been temporarily locked')
  }
}

/**
 * Clear failures and block after successful login
 */
async function clearIpFailures(ip) {
  await client.del(`login:fail:ip:${ip}`)
  await client.del(`login:block:ip:${ip}`)
}

module.exports = {
  clearIpFailures,
  checkIpBlock,
  recordIpFailure
}
