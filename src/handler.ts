import {InteractionResponseType, InteractionType} from 'discord-interactions'

export async function handleInteract(json: any, request: Request): Promise<Response> {
    if (json.type == InteractionType.PING) {
        // This is required for Discord to validate your bot - don't remove it.
        return new Response(JSON.stringify({type: InteractionResponseType.PONG}))
    } else if (json.type == InteractionType.APPLICATION_COMMAND) {
        return new Response(
            JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    tts: false,
                    content: 'congrats, you used a command!',
                    embeds: [],
                    allow_mentions: {parse: []},
                },
            }),
        )
    }
    return new Response(`request method: ${request.method}`)
}
