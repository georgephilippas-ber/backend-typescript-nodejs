type configuration_type = {
    authentication:
        {
            hashLength_bytes: number;
            maximumUsernameLength_characters: number;
        }
}

const configuration_: configuration_type = Object.freeze(
    {
        authentication:
            {
                hashLength_bytes: 0x20,
                maximumUsernameLength_characters: 0x10,
            }
    });

export function configuration()
{
    return configuration_;
}
