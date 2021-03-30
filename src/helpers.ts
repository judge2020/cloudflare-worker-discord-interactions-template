const token_kv_key = "CLIENT_CRED_TOKEN";

export async function getClientCredentialToken() {
    if (typeof CONFIG_KV_NAMESPACE !== 'undefined') {
        let token = await CONFIG_KV_NAMESPACE.get(token_kv_key, 'text');
        if (token) {
            return token;
        }
    }
    let json = await (await fetch('https://discord.com/api/v8/oauth2/token', {
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'applications.commands.update'
        }),
        method: "POST",
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        }
    })).json();
    let token = json.access_token;

    if (typeof CONFIG_KV_NAMESPACE !== 'undefined') {
        let exp = json.expires_in
        // I think Discord itself caches the token, not sure when it resets toa new one.
        if (json.expires_in > 60) {
            // giving the expired token 10 seconds of buffer to ensure CF clears our old token from KV before it expires
            exp = json.expires_in - 10
        }
        await CONFIG_KV_NAMESPACE.put(token_kv_key, token, {expirationTtl: exp})
    }
    return token;
}