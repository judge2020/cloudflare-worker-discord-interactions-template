import {InteractionResponseType, InteractionType} from 'discord-interactions'

export async function handleInteract(json: any, request: Request): Promise<Response> {
    if (json.type == InteractionType.PING) {
        // This is required for Discord to validate your bot - don't remove it.
        return new Response(JSON.stringify({type: InteractionResponseType.PONG}))
    } else if (json.type == InteractionType.APPLICATION_COMMAND) {
        switch (json.data.name) {
            case 'echo':
                return new Response(
                    JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            tts: false,
                            content: json.data.options[0].value, // we should be pulling based on the `name` property, actually
                            embeds: [],
                            allow_mentions: {parse: []},
                        },
                    }),
                )
            default:
                return new Response(
                    JSON.stringify({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            tts: false,
                            content: 'Sorry, we experienced a problem and a command was sent that doesn\'t exist!',
                            embeds: [],
                            allow_mentions: {parse: []},
                        },
                    }),
                )
        }
    }
    return new Response(`request method: ${request.method}`)
}
