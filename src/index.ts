import {handleInteract} from './handler'
import {verifyKey} from 'discord-interactions'
import {getClientCredentialToken} from "./helpers";

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
    else if (url.pathname == '/main_install') {
        // not entirely sure about if this needs to be rate limited or behind auth in some fashion; just need an example.
        if (event.request.method != 'GET') {
            return new Response('Invalid method', {status: 400})
        }

        let to_url: string;
        to_url = `https://discord.com/api/v8/applications/${CLIENT_ID}/commands`;
        // uncomment the below and comment the above to quickly register the command on your guild for testing (changing the guild ID in the URL below).
        //to_url = `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/123456789/commands`;

        await fetch(to_url, {
            body: JSON.stringify({
                name: 'echo',
                description: 'repeat after me!',
                options: [
                    {
                        name: 'text',
                        description: 'what should I be puppeted to say?',
                        type: 3,
                        required: true
                    }
                ]
            }),
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${(await getClientCredentialToken())}`
            }
        })
        return new Response('done!');
    }
    return new Response('Not implemented', {status: 501})
}

addEventListener('fetch', (event) => {
    // @ts-ignore
    event.respondWith(handleRequest(event))
})
