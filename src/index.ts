import {handleInteract} from './handler'
import {verifyKey} from 'discord-interactions'

async function handleRequest(event: FetchEvent) {
    let url = new URL(event.request.url)
    if (url.pathname == '/interactions') {
        if (event.request.method != 'POST') {
            return new Response('Invalid method', {status: 400})
        }
        let signature = event.request.headers.get('x-signature-ed25519')
        let timestamp = event.request.headers.get('x-signature-timestamp')

        let isValidRequest = verifyKey(
            await event.request.clone().arrayBuffer(),
            signature,
            timestamp,
            CLIENT_PUB_KEY,
        )
        if (!isValidRequest) {
            return new Response('Bad request signature', {status: 401})
        }
        let body = await event.request.json()
        return await handleInteract(body, event.request)
    }
    return new Response('Not implemented', {status: 501})
}

addEventListener('fetch', (event) => {
    // @ts-ignore
    event.respondWith(handleRequest(event))
})
