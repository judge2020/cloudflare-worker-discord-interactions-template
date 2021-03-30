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
    else if (url.pathname == '/install') {
        if (event.request.method != 'GET') {
            return new Response('Invalid method', {status: 400})
        }
        // make sure this isn't a public bot if you want to restrict installs
        return new Response(null, {headers: {location: `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands`}})
    }
    return new Response('Not implemented', {status: 501})
}

addEventListener('fetch', (event) => {
    // @ts-ignore
    event.respondWith(handleRequest(event))
})
